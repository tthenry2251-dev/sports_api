const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();
setGlobalOptions({ region: "asia-northeast3" });

const db = admin.firestore();
const providers = ["fonbet", "xbet", "pinnacle"];
const fonbetListUrl = process.env.FONBET_LIST_URL || "https://line-lb51.bk6bba-resources.com/events/listBase?scopeMarket=1600&lang=en";
const oddsUpdateSchedule = process.env.ODDS_UPDATE_SCHEDULE || "every 1 minutes";
const oddsDefaultIntervalSeconds = Number(process.env.ODDS_DEFAULT_INTERVAL_SECONDS || 30);
const oddsMinIntervalSeconds = Number(process.env.ODDS_MIN_INTERVAL_SECONDS || 5);
const fonbetStandardHandicapPairs = [
  { home: 927, away: 928, primary: true },
  { home: 910, away: 912 },
  { home: 989, away: 991 },
  { home: 1569, away: 1572 },
  { home: 1672, away: 1675 },
  { home: 1677, away: 1678 },
  { home: 1680, away: 1681 },
  { home: 1683, away: 1684 },
  { home: 1686, away: 1687 },
  { home: 1689, away: 1690 },
];
const fonbetStandardTotalPairs = [
  { home: 930, away: 931, primary: true },
  { home: 1696, away: 1697 },
  { home: 1727, away: 1728 },
  { home: 1730, away: 1731 },
  { home: 1733, away: 1734 },
  { home: 1736, away: 1737 },
  { home: 1739, away: 1791 },
  { home: 1793, away: 1794 },
  { home: 1796, away: 1797 },
];
const fonbetFactorIds = {
  result: {
    home: 921,
    draw: 922,
    away: 923,
    homeOrDraw: 924,
    awayOrDraw: 925,
  },
  standard: {
    handicapPairs: fonbetStandardHandicapPairs,
    totalPairs: fonbetStandardTotalPairs,
  },
  volleyball: {
    handicapPairs: [
      { home: 1845, away: 1846, primary: true },
      ...fonbetStandardHandicapPairs.filter((pair) => !pair.primary),
    ],
    totalPairs: [
      { home: 1848, away: 1849, primary: true },
      ...fonbetStandardTotalPairs.filter((pair) => !pair.primary),
      { home: 4952, away: 4953 },
      { home: 4958, away: 4959 },
    ],
  },
};

exports.loginAdmin = onRequest(
  {
    timeoutSeconds: 30,
    memory: "256MiB",
    invoker: "public",
  },
  async (request, response) => {
    applyCors(request, response);

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "POST") {
      response.status(405).json({ ok: false, message: "POST 방식으로 호출해주세요." });
      return;
    }

    const body = parseRequestBody(request.body);
    const loginId = normalizeLoginId(body.loginId);
    const password = String(body.password || "");
    const throttleRef = getLoginThrottleRef(request, loginId);

    try {
      const retryAfterSeconds = await getLoginRetryAfterSeconds(throttleRef);

      if (retryAfterSeconds > 0) {
        response.set("Retry-After", String(retryAfterSeconds));
        response.status(429).json({
          ok: false,
          message: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
        });
        return;
      }

      if (!loginId || !password) {
        await recordLoginFailure(throttleRef);
        response.status(401).json({ ok: false, message: "아이디 또는 비밀번호를 다시 확인해주세요." });
        return;
      }

      const profile = await authenticateAdmin(loginId, password);

      if (!profile) {
        await recordLoginFailure(throttleRef);
        response.status(401).json({ ok: false, message: "아이디 또는 비밀번호를 다시 확인해주세요." });
        return;
      }

      await clearLoginFailures(throttleRef);
      const uid = createAdminUid(loginId);
      await ensureFirebaseAdminUser(uid, profile);
      const token = await admin.auth().createCustomToken(uid, {
        admin: true,
        loginId,
      });

      response.json({
        ok: true,
        token,
        profile: {
          id: loginId,
          loginId,
          nickname: String(profile.nickname || loginId),
          status: "active",
        },
      });
    } catch (error) {
      console.error("Admin login failed", error);
      response.status(500).json({ ok: false, message: "로그인 처리 중 오류가 발생했습니다." });
    }
  },
);

exports.importGames = onRequest(
  {
    timeoutSeconds: 300,
    memory: "512MiB",
    invoker: "public",
  },
  async (request, response) => {
    applyCors(request, response);

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "POST") {
      response.status(405).json({
        ok: false,
        message: "POST 방식으로 호출해주세요.",
      });
      return;
    }

    try {
      const administrator = await verifyAdminRequest(request);

      if (!administrator) {
        response.status(401).json({ ok: false, message: "관리자 로그인이 필요합니다." });
        return;
      }

      const body = parseRequestBody(request.body);
      const result = await importEnabledLeagueGames({
        leagueId: String(body.leagueId || "").trim(),
      });
      const savedTeams = await backfillExistingGameTeams();

      response.json({
        ok: true,
        checkedLeagues: result.checkedLeagues,
        parsedGames: result.parsedGames,
        savedGames: result.savedGames,
        savedTeams,
        failedLeagues: result.failedLeagues,
        skippedLeagues: result.skippedLeagues,
      });
    } catch (error) {
      response.status(500).json({
        ok: false,
        message: error.message || "경기 가져오기에 실패했습니다.",
      });
    }
  },
);

exports.updateSettings = onRequest(
  {
    timeoutSeconds: 60,
    memory: "256MiB",
    invoker: "public",
  },
  async (request, response) => {
    applyCors(request, response);

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "POST") {
      response.status(405).json({
        ok: false,
        message: "POST 방식으로 호출해주세요.",
      });
      return;
    }

    try {
      const administrator = await verifyAdminRequest(request);

      if (!administrator) {
        response.status(401).json({ ok: false, message: "관리자 로그인이 필요합니다." });
        return;
      }

      const body = parseRequestBody(request.body);
      const loginId = administrator.loginId;
      const password = String(body.password || "");
      const requestedSettings = body.settings || {};

      if (!loginId || !password) {
        response.status(401).json({
          ok: false,
          message: "비밀번호를 입력해주세요.",
        });
        return;
      }

      const verified = await verifyUserPassword(loginId, password);

      if (!verified) {
        response.status(403).json({
          ok: false,
          message: "비밀번호를 다시 확인해주세요.",
        });
        return;
      }

      const payload = {};

      if (hasOwn(requestedSettings, "oddsUpdaterEnabled")) {
        payload.oddsUpdaterEnabled = normalizeEnabled(requestedSettings.oddsUpdaterEnabled);
      }

      if (Object.keys(payload).length === 0) {
        response.status(400).json({
          ok: false,
          message: "변경할 설정이 없습니다.",
        });
        return;
      }

      const settingsRef = db.collection("settings").doc("app");
      const snapshot = await settingsRef.get();
      const now = admin.firestore.FieldValue.serverTimestamp();

      if (!snapshot.exists) {
        payload.createdAt = now;
      }

      payload.updatedAt = now;

      await settingsRef.set(payload, { merge: true });

      response.json({
        ok: true,
        settings: {
          oddsUpdaterEnabled: payload.oddsUpdaterEnabled,
        },
      });
    } catch (error) {
      response.status(500).json({
        ok: false,
        message: error.message || "설정 저장에 실패했습니다.",
      });
    }
  },
);

exports.updateOdds = onSchedule(
  {
    schedule: oddsUpdateSchedule,
    timeZone: "Asia/Seoul",
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async () => {
    const statusResult = await synchronizeGameStatuses();
    const updaterEnabled = await isOddsUpdaterEnabled();

    if (!updaterEnabled) {
      console.log("Odds updater skipped: disabled in settings.", statusResult);
      return;
    }

    const lock = await acquireOddsUpdateLock();

    if (!lock.acquired) {
      console.log("Odds updater skipped: another run is active.");
      return;
    }

    try {
      const importResult = await importEnabledLeagueGames();
      const result = await runScheduledOddsUpdater(importResult.fonbetPayload);

      console.log("Sports data updater complete", {
        checkedLeagues: importResult.checkedLeagues,
        parsedGames: importResult.parsedGames,
        savedGames: importResult.savedGames,
        failedLeagues: importResult.failedLeagues.length,
        skippedLeagues: importResult.skippedLeagues.length,
        ...result,
        ...statusResult,
      });
    } finally {
      await releaseOddsUpdateLock(lock.owner);
    }
  },
);

async function importEnabledLeagueGames({ leagueId = "" } = {}) {
  let leagueDocs;

  if (leagueId) {
    const leagueSnapshot = await db.collection("league").doc(leagueId).get();

    if (!leagueSnapshot.exists) {
      throw new Error("가져올 리그를 찾지 못했습니다.");
    }

    leagueDocs = [leagueSnapshot];
  } else {
    const leagueSnapshot = await db.collection("league").where("enabled", "==", true).limit(500).get();
    leagueDocs = leagueSnapshot.docs;
  }

  const leagues = leagueDocs.map((doc) => normalizeLeague({ id: doc.id, ...doc.data() }));
  const importedGames = [];
  const failedLeagues = [];
  const skippedLeagues = [];
  let fonbetPayload = null;

  for (const league of leagues) {
    if (!league.enabled) {
      skippedLeagues.push(toLeagueResult(league, "리그 선택이 OFF입니다."));
      continue;
    }

    const sourceUrl = getLeagueImportUrl(league);

    if (!sourceUrl) {
      skippedLeagues.push(toLeagueResult(league, "현재 API사 URL이 없습니다."));
      continue;
    }

    try {
      if (league.provider === "fonbet") {
        fonbetPayload = fonbetPayload || await fetchFonbetJson();
        importedGames.push(...parseFonbetGames(fonbetPayload, league, sourceUrl));
      } else {
        const html = await fetchLeagueHtml(sourceUrl);
        importedGames.push(...parseGamesFromHtml(html, league, sourceUrl));
      }
    } catch (error) {
      failedLeagues.push(toLeagueResult(league, error.message || "가져오기 실패"));
    }
  }

  const savedGames = await saveGameRecords(importedGames);

  return {
    checkedLeagues: leagues.length,
    parsedGames: importedGames.length,
    savedGames,
    failedLeagues,
    skippedLeagues,
    fonbetPayload,
  };
}

async function runScheduledOddsUpdater(fonbetPayload = null) {
  const tick = await updateDueOddsOnce(fonbetPayload);

  return {
    ticks: 1,
    dueGames: tick.dueGames,
    savedOdds: tick.savedOdds,
    createdAlerts: tick.createdAlerts,
    skippedGames: tick.skippedGames,
  };
}

function parseRequestBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
}

async function verifyUserPassword(loginId, password) {
  return Boolean(await authenticateAdmin(loginId, password));
}

async function authenticateAdmin(loginId, password) {
  const userSnapshot = await db.collection("user").doc(loginId).get();

  if (!userSnapshot.exists) {
    return null;
  }

  const user = userSnapshot.data() || {};

  if (normalizeUserStatus(user.status) !== "active") {
    return null;
  }

  if (!user.passwordHash || !user.passwordSalt) {
    return null;
  }

  return hashPassword(password, user.passwordSalt) === user.passwordHash
    ? { id: userSnapshot.id, ...user }
    : null;
}

async function verifyAdminRequest(request) {
  const authorization = String(request.get("authorization") || "");
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return null;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(match[1]);
    const loginId = normalizeLoginId(decodedToken.loginId);

    if (decodedToken.admin !== true || !loginId) {
      return null;
    }

    const userSnapshot = await db.collection("user").doc(loginId).get();
    const user = userSnapshot.data() || {};

    if (!userSnapshot.exists || normalizeUserStatus(user.status) !== "active") {
      return null;
    }

    return { uid: decodedToken.uid, loginId };
  } catch {
    return null;
  }
}

function createAdminUid(loginId) {
  return `admin-${crypto.createHash("sha256").update(loginId).digest("hex").slice(0, 32)}`;
}

async function ensureFirebaseAdminUser(uid, profile) {
  const displayName = String(profile.nickname || profile.loginId || uid).slice(0, 128);

  try {
    await admin.auth().updateUser(uid, { disabled: false, displayName });
  } catch (error) {
    if (error?.code !== "auth/user-not-found") {
      throw error;
    }

    await admin.auth().createUser({ uid, disabled: false, displayName });
  }

  await admin.auth().setCustomUserClaims(uid, {
    admin: true,
    loginId: normalizeLoginId(profile.loginId || profile.id),
  });
}

function getLoginThrottleRef(request, loginId) {
  const clientAddress = String(request.ip || request.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const key = crypto
    .createHash("sha256")
    .update(`${clientAddress}|${normalizeLoginId(loginId)}`)
    .digest("hex");
  return db.collection("loginThrottle").doc(key);
}

async function getLoginRetryAfterSeconds(throttleRef) {
  const snapshot = await throttleRef.get();
  const blockedUntil = snapshot.data()?.blockedUntil;
  const blockedUntilMs = typeof blockedUntil?.toMillis === "function" ? blockedUntil.toMillis() : 0;
  return blockedUntilMs > Date.now() ? Math.ceil((blockedUntilMs - Date.now()) / 1000) : 0;
}

async function recordLoginFailure(throttleRef) {
  const nowMs = Date.now();
  const windowMs = 15 * 60 * 1000;

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(throttleRef);
    const data = snapshot.data() || {};
    const windowStartedAtMs = typeof data.windowStartedAt?.toMillis === "function"
      ? data.windowStartedAt.toMillis()
      : 0;
    const withinWindow = nowMs - windowStartedAtMs < windowMs;
    const attempts = withinWindow ? Number(data.attempts || 0) + 1 : 1;
    const windowStartedAt = withinWindow && windowStartedAtMs > 0
      ? data.windowStartedAt
      : admin.firestore.Timestamp.fromMillis(nowMs);
    const blockedUntil = attempts >= 5
      ? admin.firestore.Timestamp.fromMillis(nowMs + windowMs)
      : admin.firestore.Timestamp.fromMillis(0);

    transaction.set(throttleRef, {
      attempts,
      windowStartedAt,
      blockedUntil,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
}

async function clearLoginFailures(throttleRef) {
  await throttleRef.delete();
}

function hashPassword(password, salt) {
  return crypto
    .createHash("sha256")
    .update(`${salt}:${password}`)
    .digest("hex");
}

function normalizeLoginId(loginId) {
  return String(loginId || "").trim().toLowerCase();
}

function normalizeUserStatus(status) {
  const value = String(status || "active").trim();
  const statusMap = {
    active: "active",
    inactive: "inactive",
    disabled: "inactive",
    blocked: "inactive",
    "사용": "active",
    "미사용": "inactive",
    "차단": "inactive",
  };

  return statusMap[value] || "active";
}

function hasOwn(source, key) {
  return Object.prototype.hasOwnProperty.call(source || {}, key);
}

async function isOddsUpdaterEnabled() {
  const snapshot = await db.collection("settings").doc("app").get();

  if (!snapshot.exists) {
    return true;
  }

  return normalizeEnabled(snapshot.data()?.oddsUpdaterEnabled);
}

async function synchronizeGameStatuses() {
  const snapshot = await db.collection("game").limit(500).get();
  const now = new Date();
  const batch = db.batch();
  let updatedGames = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data() || {};
    const gameTime = normalizeGameTime(data.gameTime || data.startTime || data.startDate);
    const status = normalizeGameStatus(data.status, gameTime, now);

    if (data.status === status) {
      return;
    }

    batch.set(doc.ref, {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    updatedGames += 1;
  });

  if (updatedGames > 0) {
    await batch.commit();
  }

  return {
    checkedGames: snapshot.size,
    updatedGames,
  };
}

async function updateDueOddsOnce(fonbetPayload = null) {
  const now = new Date();
  const gameSnapshot = await db.collection("game").where("enabled", "==", true).limit(500).get();
  const games = gameSnapshot.docs.map((doc) => normalizeGame({ id: doc.id, ...doc.data() }));
  const fonbetGames = games.filter((game) => (
    normalizeOddsProvider(game.provider) === "fonbet" && game.status === "scheduled"
  ));

  if (fonbetGames.length === 0) {
    return {
      dueGames: 0,
      savedOdds: 0,
      createdAlerts: 0,
      skippedGames: games.length,
    };
  }

  const leaguesById = await loadLeaguesById();
  const stateRefs = fonbetGames.map((game) => db.collection("oddsUpdateState").doc(game.id));
  const stateSnapshots = stateRefs.length > 0 ? await db.getAll(...stateRefs) : [];
  const dueItems = [];

  fonbetGames.forEach((game, index) => {
    const intervalSeconds = getGameUpdateIntervalSeconds(game, leaguesById);
    const checkedAt = stateSnapshots[index]?.data()?.checkedAt;
    const lastCheckedAt = typeof checkedAt?.toMillis === "function" ? checkedAt.toMillis() : 0;

    if (now.getTime() - lastCheckedAt >= intervalSeconds * 1000) {
      dueItems.push({
        game,
        intervalSeconds,
        stateRef: stateRefs[index],
      });
    }
  });

  if (dueItems.length === 0) {
    return {
      dueGames: 0,
      savedOdds: 0,
      createdAlerts: 0,
      skippedGames: 0,
    };
  }

  const payload = fonbetPayload || await fetchFonbetJson();
  const records = createFonbetOddRecords(payload, dueItems.map((item) => item.game), now);
  const saveResult = await saveOddRecords(records, leaguesById);
  await saveOddsUpdateStates(dueItems, now);

  return {
    dueGames: dueItems.length,
    savedOdds: saveResult.savedOdds,
    createdAlerts: saveResult.createdAlerts,
    skippedGames: fonbetGames.length - dueItems.length,
  };
}

async function loadLeaguesById() {
  const snapshot = await db.collection("league").limit(500).get();
  const leaguesById = new Map();

  snapshot.docs.forEach((doc) => {
    leaguesById.set(doc.id, normalizeLeague({ id: doc.id, ...doc.data() }));
  });

  return leaguesById;
}

async function saveOddsUpdateStates(items, checkedAt) {
  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();

  items.forEach((item) => {
    batch.set(
      item.stateRef,
      {
        gameId: item.game.id,
        checkedAt: admin.firestore.Timestamp.fromDate(checkedAt),
        intervalSeconds: item.intervalSeconds,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  await batch.commit();
}

async function acquireOddsUpdateLock() {
  const lockRef = db.collection("system").doc("oddsUpdaterLock");
  const owner = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const leaseUntil = admin.firestore.Timestamp.fromMillis(Date.now() + 300000);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(lockRef);
    const currentLeaseUntil = snapshot.exists && typeof snapshot.data()?.leaseUntil?.toMillis === "function"
      ? snapshot.data().leaseUntil.toMillis()
      : 0;

    if (currentLeaseUntil > Date.now()) {
      return {
        acquired: false,
        owner: "",
      };
    }

    transaction.set(
      lockRef,
      {
        owner,
        leaseUntil,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return {
      acquired: true,
      owner,
    };
  });
}

async function releaseOddsUpdateLock(owner) {
  if (!owner) {
    return;
  }

  const lockRef = db.collection("system").doc("oddsUpdaterLock");

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(lockRef);

    if (!snapshot.exists || snapshot.data()?.owner !== owner) {
      return;
    }

    transaction.set(
      lockRef,
      {
        owner: "",
        leaseUntil: admin.firestore.Timestamp.fromMillis(0),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
}

function applyCors(request, response) {
  const projectId = process.env.GCLOUD_PROJECT || admin.app().options.projectId || "sports-api-e68c9";
  const defaultOrigins = [
    `https://${projectId}.web.app`,
    `https://${projectId}.firebaseapp.com`,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];
  const allowedOrigins = String(process.env.ALLOWED_ORIGINS || defaultOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = request.get("origin") || "";
  const isProjectPreview = requestOrigin.startsWith(`https://${projectId}--`) && requestOrigin.endsWith(".web.app");
  const isLocalDevelopment = /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/.test(requestOrigin);
  const allowOrigin = allowedOrigins.includes(requestOrigin) || isProjectPreview || isLocalDevelopment
    ? requestOrigin
    : allowedOrigins[0];

  response.set("Access-Control-Allow-Origin", allowOrigin);
  response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.set("Vary", "Origin");
}

async function fetchFonbetJson() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(fonbetListUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Fonbet JSON 응답 오류 ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function createFonbetOddRecords(data, games, changedAt = new Date()) {
  const factorsByEvent = new Map(
    (data.customFactors || []).map((item) => [item.e, Array.isArray(item.factors) ? item.factors : []]),
  );

  return games.flatMap((game) => {
    const event = findFonbetEventForGame(data, game);

    if (!event) {
      return [];
    }

    const factors = factorsByEvent.get(event.id) || [];
    const records = [];
    const resultHome = getFonbetFactorValue(factors, fonbetFactorIds.result.home);
    const resultDraw = getFonbetFactorValue(factors, fonbetFactorIds.result.draw);
    const resultAway = getFonbetFactorValue(factors, fonbetFactorIds.result.away);

    if (resultHome !== null || resultDraw !== null || resultAway !== null) {
      records.push(createFonbetOddRecord(game, {
        marketType: "result",
        marketName: resultDraw !== null ? "승무패" : "승패",
        marketKeySuffix: "win",
        betHome: resultHome ?? 0,
        betDraw: resultDraw ?? 0,
        betAway: resultAway ?? 0,
        changedAt,
      }));
    }

    const profile = getFonbetSportFactorProfile(game.sport);

    if (profile) {
      getFonbetMarketLines(factors, profile.totalPairs, "total").forEach((line) => {
        records.push(createFonbetOddRecord(game, {
          marketType: "total",
          marketName: "오버언더",
          marketKeySuffix: `total:${formatFonbetLineKey(line.lineValue)}`,
          betHome: line.betHome,
          betDraw: line.lineValue,
          betAway: line.betAway,
          lineValue: line.lineValue,
          changedAt,
        }));
      });

      const handicapLines = getFonbetMarketLines(factors, profile.handicapPairs, "handicap");
      const supplementalHandicapLines = getFonbetBaselineHandicapLines(factors);

      supplementalHandicapLines.forEach((line) => {
        const lineKey = formatFonbetLineKey(line.lineValue);

        if (!handicapLines.some((item) => formatFonbetLineKey(item.lineValue) === lineKey)) {
          handicapLines.push(line);
        }
      });

      handicapLines
        .sort((left, right) => left.lineValue - right.lineValue)
        .forEach((line) => {
          const favoriteSide = getFonbetFavoriteSide(line, resultHome, resultAway);

          records.push(createFonbetOddRecord(game, {
            marketType: "handicap",
            marketName: "핸디캡",
            marketKeySuffix: `handicap:${formatFonbetLineKey(line.lineValue)}`,
            betHome: line.betHome,
            betDraw: line.lineValue,
            betAway: line.betAway,
            lineValue: line.lineValue,
            isPrimaryLine: line.primary,
            favoriteSide,
            favoriteLineValue: getFavoriteHandicapLineValue(line.lineValue, favoriteSide),
            changedAt,
          }));
        });
    }

    return records.filter(isSavableOddRecord);
  });
}

function createFonbetOddRecord(game, market) {
  return normalizeOddRecord({
      gameId: game.id,
      gameTime: game.gameTime,
      sport: game.sport,
      country: game.country,
      leagueId: game.leagueId,
      leagueName: game.leagueName,
      provider: "fonbet",
      marketType: market.marketType,
      marketName: market.marketName,
      marketKey: `${game.id}:fonbet-${market.marketKeySuffix}`,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      betHome: market.betHome,
      betDraw: market.betDraw,
      betAway: market.betAway,
      lineValue: market.lineValue ?? null,
      isPrimaryLine: Boolean(market.isPrimaryLine),
      favoriteSide: market.favoriteSide || "",
      favoriteLineValue: market.favoriteLineValue ?? null,
      baseOdds: normalizeOddsThreshold(game.oddsThreshold),
      sourceKey: `odd|${game.id}|fonbet-${market.marketKeySuffix}`,
      changedAt: market.changedAt,
  });
}

function getFonbetSportFactorProfile(sport) {
  const normalizedSport = normalizeText(sport);

  if (isVolleyballSport(normalizedSport)) {
    return fonbetFactorIds.volleyball;
  }

  if (normalizedSport) {
    return fonbetFactorIds.standard;
  }

  return null;
}

function isVolleyballSport(sport) {
  return ["배구", "volleyball"].includes(normalizeText(sport));
}

function getFonbetFavoriteSide(line, resultHome, resultAway) {
  const lineValue = normalizeOddValue(line?.lineValue);

  if (lineValue !== null && Math.abs(lineValue) > 0.001) {
    return lineValue < 0 ? "home" : "away";
  }

  const homeOdds = normalizeOddValue(resultHome);
  const awayOdds = normalizeOddValue(resultAway);

  if (homeOdds !== null && awayOdds !== null && Math.abs(homeOdds - awayOdds) > 0.001) {
    return homeOdds < awayOdds ? "home" : "away";
  }

  const handicapHome = normalizeOddValue(line?.betHome);
  const handicapAway = normalizeOddValue(line?.betAway);

  if (handicapHome !== null && handicapAway !== null && Math.abs(handicapHome - handicapAway) > 0.001) {
    return handicapHome < handicapAway ? "home" : "away";
  }

  return "";
}

function getFavoriteHandicapLineValue(homeLineValue, favoriteSide) {
  const lineValue = normalizeOddValue(homeLineValue);

  if (lineValue === null || !["home", "away"].includes(favoriteSide)) {
    return null;
  }

  return favoriteSide === "away" ? normalizeOddValue(-lineValue) : lineValue;
}

function getFonbetMarketLines(factors, pairs, marketType) {
  const lines = [];

  pairs.forEach((pair) => {
    const homeFactor = getFonbetFactor(factors, pair.home);
    const awayFactor = getFonbetFactor(factors, pair.away);
    const homeLine = getFonbetFactorLine(homeFactor);
    const awayLine = getFonbetFactorLine(awayFactor);
    const betHome = normalizeOddValue(homeFactor?.v);
    const betAway = normalizeOddValue(awayFactor?.v);

    if (!homeFactor || !awayFactor || homeLine === null || betHome === null || betAway === null) {
      return;
    }

    if (marketType === "total" && awayLine !== null && awayLine !== homeLine) {
      return;
    }

    if (marketType === "handicap" && awayLine !== null && Math.abs(homeLine + awayLine) > 0.001) {
      return;
    }

    lines.push({
      betHome,
      betAway,
      lineValue: homeLine,
      primary: Boolean(pair.primary),
    });
  });

  const primaryLine = lines.find((line) => line.primary)?.lineValue;
  const maxDistance = primaryLine === undefined ? Infinity : Math.max(3, Math.abs(primaryLine) * 0.06);
  const uniqueLines = new Map();

  lines
    .filter((line) => marketType !== "total" || primaryLine === undefined || Math.abs(line.lineValue - primaryLine) <= maxDistance)
    .forEach((line) => {
      const key = formatFonbetLineKey(line.lineValue);

      if (!uniqueLines.has(key) || line.primary) {
        uniqueLines.set(key, line);
      }
    });

  return [...uniqueLines.values()].sort((left, right) => left.lineValue - right.lineValue);
}

function getFonbetBaselineHandicapLines(factors) {
  const resultHome = getFonbetFactorValue(factors, fonbetFactorIds.result.home);
  const resultDraw = getFonbetFactorValue(factors, fonbetFactorIds.result.draw);
  const resultAway = getFonbetFactorValue(factors, fonbetFactorIds.result.away);
  const homeOrDraw = getFonbetFactorValue(factors, fonbetFactorIds.result.homeOrDraw);
  const awayOrDraw = getFonbetFactorValue(factors, fonbetFactorIds.result.awayOrDraw);

  if (resultHome === null || resultAway === null) {
    return [];
  }

  if (resultDraw === null) {
    return [-0.5, 0, 0.5].map((lineValue) => ({
      betHome: resultHome,
      betAway: resultAway,
      lineValue,
      primary: false,
    }));
  }

  const lines = [];

  if (awayOrDraw !== null) {
    lines.push({
      betHome: resultHome,
      betAway: awayOrDraw,
      lineValue: -0.5,
      primary: false,
    });
  }

  if (homeOrDraw !== null) {
    lines.push({
      betHome: homeOrDraw,
      betAway: resultAway,
      lineValue: 0.5,
      primary: false,
    });
  }

  return lines;
}

function formatFonbetLineKey(value) {
  return Number(value).toFixed(2);
}

function findFonbetEventForGame(data, game) {
  const gameTimeValue = getDateValue(game.gameTime);
  const homeTeam = normalizeText(game.homeTeam);
  const awayTeam = normalizeText(game.awayTeam);

  return (data.events || []).find((event) => {
    if (!event || event.level !== 1 || event.kind !== 1 || !event.team1 || !event.team2) {
      return false;
    }

    const eventTimeValue = Number(event.startTime)
      ? Number(event.startTime) * 1000
      : getDateValue(normalizeGameTime(event.startTime));
    const sameTime = gameTimeValue > 0 && eventTimeValue > 0
      ? Math.abs(gameTimeValue - eventTimeValue) <= 60000
      : true;

    return sameTime
      && normalizeText(event.team1) === homeTeam
      && normalizeText(event.team2) === awayTeam;
  }) || null;
}

function getFonbetFactorValue(factors, factorId) {
  const item = getFonbetFactor(factors, factorId);
  return normalizeOddValue(item?.v);
}

function getFonbetFactor(factors, factorId) {
  return factors.find((factor) => factor && factor.f === factorId) || null;
}

function getFonbetFactorLine(factor) {
  if (!factor) {
    return null;
  }

  const textLine = normalizeOddValue(factor.pt);

  if (textLine !== null) {
    return textLine;
  }

  const rawLine = Number(factor.p);
  return Number.isFinite(rawLine) ? normalizeOddValue(rawLine / 100) : null;
}

async function saveOddRecords(records, leaguesById = new Map()) {
  let savedCount = 0;
  let createdAlertCount = 0;
  const primaryLineUpdates = await loadPrimaryHandicapLineUpdates(records);

  primaryLineUpdates.forEach((update) => {
    update.alert = update.changed
      ? createPrimaryHandicapLineAlert(update, leaguesById.get(update.record.leagueId))
      : null;
  });
  const primaryLineAlertKeys = new Set(primaryLineUpdates.filter((update) => update.alert).map((update) => update.record.marketKey));

  for (const record of records) {
    if (!isSavableOddRecord(record)) {
      continue;
    }

    const latest = await getLatestOddRecord(record.sourceKey);

    if (latest && hasSameOddValues(latest, record)) {
      continue;
    }

    const changedAt = normalizeGameTime(record.changedAt) || new Date();
    const docId = `odd-${createHash(`${record.sourceKey}|${changedAt.toISOString()}|${record.betHome}|${record.betDraw}|${record.betAway}`)}`;
    const now = admin.firestore.FieldValue.serverTimestamp();
    const oddRef = db.collection("odd").doc(docId);
    const batch = db.batch();

    batch.set(oddRef, {
      gameId: record.gameId,
      gameTime: admin.firestore.Timestamp.fromDate(record.gameTime),
      sport: record.sport,
      country: record.country,
      leagueId: record.leagueId,
      leagueName: record.leagueName,
      provider: record.provider,
      marketType: record.marketType,
      marketName: record.marketName,
      marketKey: record.marketKey,
      homeTeam: record.homeTeam,
      awayTeam: record.awayTeam,
      betHome: record.betHome,
      betDraw: record.betDraw,
      betAway: record.betAway,
      ...(record.lineValue === null ? {} : { lineValue: record.lineValue }),
      baseOdds: record.baseOdds,
      sourceKey: record.sourceKey,
      changedAt: admin.firestore.Timestamp.fromDate(changedAt),
      createdAt: now,
      updatedAt: now,
    });

    const alert = primaryLineAlertKeys.has(record.marketKey)
      ? null
      : createOddsChangeAlert(record, latest, leaguesById.get(record.leagueId), changedAt);

    if (alert) {
      batch.set(db.collection("alert").doc(`alert-${docId}`), {
        ...alert,
        acknowledged: false,
        changedAt: admin.firestore.Timestamp.fromDate(changedAt),
        createdAt: now,
        updatedAt: now,
      });
      createdAlertCount += 1;
    }

    await batch.commit();
    savedCount += 1;
  }

  const primaryLineResult = await savePrimaryHandicapLineUpdates(primaryLineUpdates);
  createdAlertCount += primaryLineResult.createdAlerts;

  return {
    savedOdds: savedCount,
    createdAlerts: createdAlertCount,
  };
}

async function loadPrimaryHandicapLineUpdates(records) {
  const candidates = new Map();

  records.forEach((record) => {
    const marketType = normalizeOddMarketType(record.marketType, record.marketName);
    const favoriteLineValue = normalizeOddValue(record.favoriteLineValue);

    if (
      !record.isPrimaryLine
      || marketType !== "handicap"
      || !record.gameId
      || !["home", "away"].includes(record.favoriteSide)
      || favoriteLineValue === null
    ) {
      return;
    }

    const stateId = `primary-line-${createHash(`${record.gameId}|${record.provider}|handicap`)}`;
    candidates.set(stateId, {
      stateId,
      stateRef: db.collection("oddsPrimaryLineState").doc(stateId),
      record,
    });
  });

  const pendingUpdates = [...candidates.values()];

  if (pendingUpdates.length === 0) {
    return [];
  }

  const snapshots = await db.getAll(...pendingUpdates.map((update) => update.stateRef));

  return pendingUpdates.map((update, index) => {
    const previous = snapshots[index]?.exists ? snapshots[index].data() : null;
    return {
      ...update,
      previous,
      changed: hasPrimaryHandicapLineChanged(previous, update.record),
      alert: null,
    };
  });
}

function hasPrimaryHandicapLineChanged(previous, record) {
  if (!previous) {
    return false;
  }

  const previousFavoriteLine = normalizeOddValue(previous.favoriteLineValue);
  const currentFavoriteLine = normalizeOddValue(record.favoriteLineValue);
  const previousFavoriteSide = String(previous.favoriteSide || "");

  if (previousFavoriteLine === null || currentFavoriteLine === null || !["home", "away"].includes(previousFavoriteSide)) {
    return false;
  }

  return previousFavoriteSide !== record.favoriteSide
    || Math.abs(previousFavoriteLine - currentFavoriteLine) > 0.001;
}

function createPrimaryHandicapLineAlert(update, league) {
  if (!update.previous || !league?.alertEnabled) {
    return null;
  }

  const { previous, record } = update;
  const previousBetHome = normalizeOddValue(previous.betHome);
  const previousLineValue = normalizeOddValue(previous.lineValue);
  const previousBetAway = normalizeOddValue(previous.betAway);
  const currentLineValue = normalizeOddValue(record.lineValue);
  const previousFavoriteLine = normalizeOddValue(previous.favoriteLineValue);
  const currentFavoriteLine = normalizeOddValue(record.favoriteLineValue);

  if (
    previousBetHome === null
    || previousLineValue === null
    || previousBetAway === null
    || currentLineValue === null
    || previousFavoriteLine === null
    || currentFavoriteLine === null
  ) {
    return null;
  }

  const changedAt = normalizeGameTime(record.changedAt) || new Date();
  const favoriteSideChanged = String(previous.favoriteSide || "") !== record.favoriteSide;
  const alertPreviousLine = favoriteSideChanged ? previousLineValue : previousFavoriteLine;
  const alertCurrentLine = favoriteSideChanged ? currentLineValue : currentFavoriteLine;

  return {
    type: "odds-change",
    gameId: record.gameId,
    gameTime: admin.firestore.Timestamp.fromDate(record.gameTime),
    sport: record.sport,
    country: record.country,
    leagueId: record.leagueId,
    leagueName: record.leagueName || league.leagueName,
    provider: record.provider,
    marketType: "handicap",
    marketName: record.marketName,
    marketKey: record.marketKey,
    homeTeam: record.homeTeam,
    awayTeam: record.awayTeam,
    previousBetHome,
    previousBetDraw: alertPreviousLine,
    previousBetAway,
    currentBetHome: record.betHome,
    currentBetDraw: alertCurrentLine,
    currentBetAway: record.betAway,
    lineValue: currentLineValue,
    changedFields: ["betDraw"],
    maxDifference: Math.round(Math.abs(alertCurrentLine - alertPreviousLine) * 100) / 100,
    threshold: normalizeOddsThreshold(league.oddsThreshold),
    intervalSeconds: normalizeIntervalSeconds(league.intervalSeconds),
    changedAt: admin.firestore.Timestamp.fromDate(changedAt),
  };
}

async function savePrimaryHandicapLineUpdates(updates) {
  let createdAlertCount = 0;

  for (let offset = 0; offset < updates.length; offset += 200) {
    const chunk = updates.slice(offset, offset + 200);
    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();

    chunk.forEach((update) => {
      const { record } = update;
      const changedAt = normalizeGameTime(record.changedAt) || new Date();

      batch.set(update.stateRef, {
        gameId: record.gameId,
        leagueId: record.leagueId,
        provider: record.provider,
        marketType: "handicap",
        marketName: record.marketName,
        marketKey: record.marketKey,
        homeTeam: record.homeTeam,
        awayTeam: record.awayTeam,
        favoriteSide: record.favoriteSide,
        favoriteLineValue: record.favoriteLineValue,
        lineValue: record.lineValue,
        betHome: record.betHome,
        betAway: record.betAway,
        changedAt: admin.firestore.Timestamp.fromDate(changedAt),
        updatedAt: now,
      }, { merge: true });

      if (!update.alert) {
        return;
      }

      const alertId = `alert-primary-line-${createHash([
        record.gameId,
        record.provider,
        update.previous?.favoriteSide,
        update.previous?.favoriteLineValue,
        record.favoriteSide,
        record.favoriteLineValue,
        changedAt.toISOString(),
      ].join("|"))}`;

      batch.set(db.collection("alert").doc(alertId), {
        ...update.alert,
        acknowledged: false,
        createdAt: now,
        updatedAt: now,
      });
      createdAlertCount += 1;
    });

    if (chunk.length > 0) {
      await batch.commit();
    }
  }

  return { createdAlerts: createdAlertCount };
}

function createOddsChangeAlert(record, previousRecord, league, changedAt) {
  if (!previousRecord || !league?.alertEnabled) {
    return null;
  }

  const threshold = normalizeOddsThreshold(league.oddsThreshold);

  if (threshold <= 0) {
    return null;
  }

  const marketType = normalizeOddMarketType(record.marketType, record.marketName);
  const fields = marketType === "result" ? ["betHome", "betDraw", "betAway"] : ["betHome", "betAway"];
  const changes = fields
    .map((field) => {
      const previous = normalizeOddValue(previousRecord[field]);
      const current = normalizeOddValue(record[field]);

      if (previous === null || current === null) {
        return null;
      }

      return {
        field,
        difference: Math.round(Math.abs(current - previous) * 100) / 100,
      };
    })
    .filter((change) => change && change.difference + Number.EPSILON >= threshold);

  if (changes.length === 0) {
    return null;
  }

  return {
    type: "odds-change",
    gameId: record.gameId,
    gameTime: admin.firestore.Timestamp.fromDate(record.gameTime),
    sport: record.sport,
    country: record.country,
    leagueId: record.leagueId,
    leagueName: record.leagueName || league.leagueName,
    provider: record.provider,
    marketType,
    marketName: record.marketName,
    marketKey: record.marketKey,
    homeTeam: record.homeTeam,
    awayTeam: record.awayTeam,
    previousBetHome: previousRecord.betHome,
    previousBetDraw: previousRecord.betDraw,
    previousBetAway: previousRecord.betAway,
    currentBetHome: record.betHome,
    currentBetDraw: record.betDraw,
    currentBetAway: record.betAway,
    ...(record.lineValue === null ? {} : { lineValue: record.lineValue }),
    changedFields: changes.map((change) => change.field),
    maxDifference: Math.max(...changes.map((change) => change.difference)),
    threshold,
    intervalSeconds: normalizeIntervalSeconds(league.intervalSeconds),
    changedAt: admin.firestore.Timestamp.fromDate(changedAt),
  };
}

async function getLatestOddRecord(sourceKey) {
  if (!sourceKey) {
    return null;
  }

  try {
    const snapshot = await db.collection("odd")
      .where("sourceKey", "==", sourceKey)
      .orderBy("changedAt", "desc")
      .limit(1)
      .get();
    const latestDoc = snapshot.docs[0];

    return latestDoc
      ? normalizeOddRecord({ id: latestDoc.id, ...latestDoc.data() })
      : null;
  } catch (error) {
    const errorCode = String(error?.code || "").toLowerCase();
    const errorMessage = String(error?.message || "").toLowerCase();
    const indexUnavailable = errorCode === "9"
      || errorCode.includes("failed-precondition")
      || errorMessage.includes("index");

    if (!indexUnavailable) {
      throw error;
    }

    console.warn("Latest odds index is not ready. Falling back to a full source-key lookup.", { sourceKey });
    const fallbackSnapshot = await db.collection("odd").where("sourceKey", "==", sourceKey).get();
    const records = fallbackSnapshot.docs
      .map((doc) => normalizeOddRecord({ id: doc.id, ...doc.data() }))
      .sort(compareOddRecords);

    return records[0] || null;
  }
}

function isSavableOddRecord(record) {
  return Boolean(
    record.gameTime
    && record.sport
    && record.marketName
    && record.homeTeam
    && record.awayTeam
    && Number.isFinite(record.betHome)
    && Number.isFinite(record.betDraw)
    && Number.isFinite(record.betAway)
    && Number.isFinite(record.baseOdds),
  );
}

function hasSameOddValues(left, right) {
  return normalizeOddValue(left.betHome) === normalizeOddValue(right.betHome)
    && normalizeOddValue(left.betDraw) === normalizeOddValue(right.betDraw)
    && normalizeOddValue(left.betAway) === normalizeOddValue(right.betAway);
}

async function fetchLeagueHtml(sourceUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`외부 페이지 응답 오류 ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function saveGameRecords(records) {
  const uniqueRecords = new Map();

  records.forEach((record) => {
    const normalizedGame = normalizeGame(record);

    if (normalizedGame.id && normalizedGame.gameTime && normalizedGame.homeTeam && normalizedGame.awayTeam) {
      uniqueRecords.set(normalizedGame.id, normalizedGame);
    }
  });

  const normalizedRecords = [...uniqueRecords.values()];
  await saveTeamRecords(normalizedRecords);
  let savedCount = 0;

  for (let offset = 0; offset < normalizedRecords.length; offset += 400) {
    const chunk = normalizedRecords.slice(offset, offset + 400);
    const refs = chunk.map((record) => db.collection("game").doc(record.id));
    const snapshots = await db.getAll(...refs);
    const batch = db.batch();
    let chunkSavedCount = 0;

    chunk.forEach((record, index) => {
      if (snapshots[index].exists) {
        return;
      }

      const now = admin.firestore.FieldValue.serverTimestamp();
      batch.set(refs[index], {
        gameTime: record.gameTime,
        sport: record.sport,
        countryId: record.countryId,
        country: record.country,
        leagueId: record.leagueId,
        leagueName: record.leagueName,
        provider: record.provider,
        homeTeam: record.homeTeam,
        awayTeam: record.awayTeam,
        status: normalizeGameStatus(record.status, record.gameTime),
        oddsThreshold: normalizeOddsThreshold(record.oddsThreshold),
        intervalSeconds: normalizeIntervalSeconds(record.intervalSeconds),
        enabled: true,
        sourceUrl: record.sourceUrl,
        sourceKey: record.sourceKey,
        seenAt: now,
        createdAt: now,
        updatedAt: now,
      });
      chunkSavedCount += 1;
    });

    if (chunkSavedCount > 0) {
      await batch.commit();
      savedCount += chunkSavedCount;
    }
  }

  return savedCount;
}

async function saveTeamRecords(gameRecords) {
  const uniqueTeams = new Map();

  gameRecords.forEach((game) => {
    [game.homeTeam, game.awayTeam].forEach((sourceName) => {
      const normalizedSourceName = String(sourceName || "").trim();

      if (!normalizedSourceName || !game.leagueId) {
        return;
      }

      const id = createTeamId(game.leagueId, game.provider, normalizedSourceName);
      uniqueTeams.set(id, {
        id,
        sport: game.sport,
        countryId: game.countryId,
        country: game.country,
        leagueId: game.leagueId,
        leagueName: game.leagueName,
        provider: game.provider,
        sourceName: normalizedSourceName,
      });
    });
  });

  const teams = [...uniqueTeams.values()];
  let savedCount = 0;

  for (let offset = 0; offset < teams.length; offset += 400) {
    const chunk = teams.slice(offset, offset + 400);
    const refs = chunk.map((team) => db.collection("team").doc(team.id));
    const snapshots = await db.getAll(...refs);
    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();
    let chunkSavedCount = 0;

    chunk.forEach((team, index) => {
      if (snapshots[index].exists) {
        return;
      }

      batch.set(refs[index], {
        sport: team.sport,
        countryId: team.countryId,
        country: team.country,
        leagueId: team.leagueId,
        leagueName: team.leagueName,
        provider: team.provider,
        sourceName: team.sourceName,
        displayName: team.sourceName,
        createdAt: now,
        updatedAt: now,
      });
      chunkSavedCount += 1;
    });

    if (chunkSavedCount > 0) {
      await batch.commit();
      savedCount += chunkSavedCount;
    }
  }

  return savedCount;
}

async function backfillExistingGameTeams() {
  const snapshot = await db.collection("game").limit(2000).get();
  const games = snapshot.docs.map((doc) => normalizeGame({ id: doc.id, ...doc.data() }));
  return saveTeamRecords(games);
}

function parseGamesFromHtml(html, league, sourceUrl) {
  const records = [
    ...parseGamesFromJsonLd(html, league, sourceUrl),
    ...parseGamesFromVisibleText(html, league, sourceUrl),
  ];
  const uniqueRecords = new Map();

  records.forEach((record) => {
    const normalizedGame = normalizeGame(record);

    if (normalizedGame.id && normalizedGame.gameTime && normalizedGame.homeTeam && normalizedGame.awayTeam) {
      uniqueRecords.set(normalizedGame.id, normalizedGame);
    }
  });

  return [...uniqueRecords.values()];
}

function parseFonbetGames(data, league, sourceUrl) {
  const leagueSportId = resolveFonbetSportId(data, league);
  const leagueNameTarget = normalizeText(league.fonbetLeagueName || league.leagueName);

  return (data.events || [])
    .filter((event) => {
      if (!event || event.level !== 1 || event.kind !== 1 || !event.team1 || !event.team2) {
        return false;
      }

      if (Number.isFinite(leagueSportId) && leagueSportId > 0) {
        return Number(event.sportId) === leagueSportId;
      }

      return normalizeText(event.place).includes(leagueNameTarget)
        || normalizeText(event.name).includes(leagueNameTarget);
    })
    .map((event) => {
      const gameTime = Number(event.startTime)
        ? new Date(Number(event.startTime) * 1000)
        : normalizeGameTime(event.startTime);

      if (!gameTime) {
        return null;
      }

      return createGameRecord(league, sourceUrl, {
        gameTime,
        homeTeam: event.team1,
        awayTeam: event.team2,
      });
    })
    .filter(Boolean)
    .sort((left, right) => Number(left.gameTime) - Number(right.gameTime));
}

function resolveFonbetSportId(data, league) {
  const directId = Number(league.tournament || league.fonbetLeagueId);
  const events = data.events || [];

  if (Number.isFinite(directId) && directId > 0) {
    const hasDirectEvents = events.some((event) => Number(event?.sportId) === directId);

    if (hasDirectEvents) {
      return directId;
    }

    const tournamentInfo = (data.tournamentInfos || []).find((item) => Number(item?.id) === directId);
    const basicSportId = Number(tournamentInfo?.basicSportId);

    if (Number.isFinite(basicSportId) && basicSportId > 0) {
      return basicSportId;
    }

    const linkedSports = (data.sports || []).filter((item) => Number(item?.tournamentInfoId) === directId);
    const leagueNameTarget = normalizeText(league.leagueName);
    const linkedSport = linkedSports.find((item) => (
      normalizeText(item?.name) === leagueNameTarget && !item?.specialTableId
    )) || linkedSports.find((item) => (
      events.some((event) => Number(event?.sportId) === Number(item?.id))
    )) || linkedSports.find((item) => !item?.specialTableId);
    const linkedSportId = Number(linkedSport?.id);

    if (Number.isFinite(linkedSportId) && linkedSportId > 0) {
      return linkedSportId;
    }
  }

  return directId;
}

function parseGamesFromJsonLd(html, league, sourceUrl) {
  const scripts = [...String(html || "").matchAll(/<script\b[^>]*type=["'][^"']*application\/ld\+json[^"']*["'][^>]*>([\s\S]*?)<\/script>/gi)];

  return scripts
    .flatMap((match) => parseJsonLdScript(match[1]))
    .filter(isSportsEventLike)
    .map((event) => {
      const teams = getEventTeams(event);
      const gameTime = normalizeGameTime(event.startDate || event.startTime || event.endDate);

      if (!teams || !gameTime) {
        return null;
      }

      return createGameRecord(league, sourceUrl, {
        gameTime,
        homeTeam: teams.homeTeam,
        awayTeam: teams.awayTeam,
      });
    })
    .filter(Boolean);
}

function parseJsonLdScript(text) {
  try {
    return flattenJsonLdItems(JSON.parse(String(text || "").trim()));
  } catch {
    return [];
  }
}

function flattenJsonLdItems(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenJsonLdItems);
  }

  if (typeof value !== "object") {
    return [];
  }

  return [
    value,
    ...flattenJsonLdItems(value["@graph"]),
    ...flattenJsonLdItems(value.itemListElement),
    ...flattenJsonLdItems(value.item),
  ];
}

function isSportsEventLike(item) {
  const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
  return types.some((type) => ["sportsevent", "event"].includes(String(type || "").toLowerCase()));
}

function getEventTeams(event) {
  const homeTeam = getTeamName(event.homeTeam || event.homeCompetitor || event.performer?.[0]);
  const awayTeam = getTeamName(event.awayTeam || event.awayCompetitor || event.performer?.[1]);

  if (homeTeam && awayTeam) {
    return { homeTeam, awayTeam };
  }

  return splitMatchupName(event.name || event.description);
}

function getTeamName(team) {
  if (Array.isArray(team)) {
    return getTeamName(team[0]);
  }

  if (typeof team === "string") {
    return team.trim();
  }

  if (team && typeof team === "object") {
    return String(team.name || team.alternateName || "").trim();
  }

  return "";
}

function parseGamesFromVisibleText(html, league, sourceUrl) {
  const text = decodeHtmlEntities(String(html || "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|p|li|tr|td|th|section|article|span|time|a|button)>/gi, "\n")
    .replace(/<[^>]+>/g, " "));
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 3);
  const games = [];

  lines.forEach((line, index) => {
    const teams = splitMatchupName(line);

    if (!teams) {
      return;
    }

    const gameTime = findNearbyGameTime(lines, index);

    if (!gameTime) {
      return;
    }

    games.push(createGameRecord(league, sourceUrl, {
      gameTime,
      homeTeam: teams.homeTeam,
      awayTeam: teams.awayTeam,
    }));
  });

  return games;
}

function splitMatchupName(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();

  if (!text) {
    return null;
  }

  const separators = [
    /\s+(?:vs\.?|v\.?)\s+/i,
    /\s+대\s+/,
    /\s[-–]\s/,
  ];

  for (const separator of separators) {
    const parts = text.split(separator).map((part) => part.trim()).filter(Boolean);

    if (parts.length >= 2 && isTeamNameLike(parts[0]) && isTeamNameLike(parts[1])) {
      return {
        homeTeam: parts[0],
        awayTeam: parts[1],
      };
    }
  }

  return null;
}

function isTeamNameLike(value) {
  const text = String(value || "").trim();
  return text.length >= 2 && !/^\d+([.:]\d+)?$/.test(text);
}

function findNearbyGameTime(lines, index) {
  const offsets = [0, -1, 1, -2, 2, -3, 3];

  for (const offset of offsets) {
    const gameTime = parseGameDateTimeText(lines[index + offset]);

    if (gameTime) {
      return gameTime;
    }
  }

  return null;
}

function parseGameDateTimeText(value) {
  const text = String(value || "");
  const isoMatch = text.match(/\b(20\d{2})[-./](\d{1,2})[-./](\d{1,2})[T\s]+(\d{1,2}):(\d{2})\b/);

  if (isoMatch) {
    return createLocalDate(isoMatch[1], isoMatch[2], isoMatch[3], isoMatch[4], isoMatch[5]);
  }

  const monthDayMatch = text.match(/\b(\d{1,2})[-./](\d{1,2})\s+(\d{1,2}):(\d{2})\b/);

  if (monthDayMatch) {
    return createLocalDate(new Date().getFullYear(), monthDayMatch[1], monthDayMatch[2], monthDayMatch[3], monthDayMatch[4]);
  }

  const koreanDateMatch = text.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일.*?(\d{1,2}):(\d{2})/);

  if (koreanDateMatch) {
    return createLocalDate(new Date().getFullYear(), koreanDateMatch[1], koreanDateMatch[2], koreanDateMatch[3], koreanDateMatch[4]);
  }

  const timeMatch = text.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);

  if (timeMatch) {
    const today = new Date();
    return createLocalDate(today.getFullYear(), today.getMonth() + 1, today.getDate(), timeMatch[1], timeMatch[2]);
  }

  return null;
}

function createLocalDate(year, month, day, hour, minute) {
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  return Number.isNaN(date.getTime()) ? null : date;
}

function createGameRecord(league, sourceUrl, data) {
  const gameTime = normalizeGameTime(data.gameTime);
  const homeTeam = String(data.homeTeam || "").trim();
  const awayTeam = String(data.awayTeam || "").trim();
  const sourceKey = createGameSourceKey({
    leagueId: league.id,
    leagueName: league.leagueName,
    gameTime,
    homeTeam,
    awayTeam,
    sourceUrl,
  });

  return normalizeGame({
    gameTime,
    sport: league.sport,
    countryId: league.countryId,
    country: league.country,
    leagueId: league.id,
    leagueName: league.leagueName,
    provider: league.provider,
    homeTeam,
    awayTeam,
    oddsThreshold: league.oddsThreshold,
    intervalSeconds: league.intervalSeconds,
    enabled: true,
    sourceUrl,
    sourceKey,
  });
}

function normalizeLeague(raw) {
  const fonbetLeagueUrl = normalizeProviderUrl(raw.fonbetLeagueUrl || "");

  return {
    ...raw,
    id: String(raw.id || ""),
    sport: String(raw.sport || "").trim(),
    countryId: normalizeCountryId(raw.countryId || ""),
    country: String(raw.country || raw.countryName || "").trim(),
    leagueName: String(raw.leagueName || "").trim(),
    provider: normalizeOddsProvider(raw.provider),
    tournament: String(raw.tournament || "").trim(),
    oddsThreshold: normalizeOddsThreshold(raw.oddsThreshold ?? raw.odds),
    intervalSeconds: normalizeIntervalSeconds(raw.intervalSeconds ?? raw.intervalSecond ?? raw.interval),
    enabled: normalizeEnabled(raw.enabled),
    alertEnabled: normalizeEnabled(raw.alertEnabled),
    fonbetLeagueName: String(raw.fonbetLeagueName || raw.fombetLeagueName || raw.pombetLeagueName || "").trim(),
    fonbetLeagueId: String(raw.fonbetLeagueId || raw.fombetLeagueId || raw.pombetLeagueId || parseFonbetLeagueIdFromUrl(fonbetLeagueUrl)).trim(),
    fonbetLeagueUrl,
    xbetLeagueName: String(raw.xbetLeagueName || "").trim(),
    xbetLeagueId: String(raw.xbetLeagueId || "").trim(),
    xbetLeagueUrl: normalizeProviderUrl(raw.xbetLeagueUrl || ""),
    pinnacleLeagueName: String(raw.pinnacleLeagueName || "").trim(),
    pinnacleLeagueId: String(raw.pinnacleLeagueId || "").trim(),
    pinnacleLeagueUrl: normalizeProviderUrl(raw.pinnacleLeagueUrl || ""),
  };
}

function parseFonbetLeagueIdFromUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    const tournamentIndex = segments.findIndex((segment) => segment === "tournament");
    return tournamentIndex >= 0 ? segments[tournamentIndex + 1] || "" : "";
  } catch {
    return "";
  }
}

function normalizeGame(raw) {
  const leagueId = String(raw.leagueId || "").trim();
  const leagueName = String(raw.leagueName || "").trim();
  const homeTeam = String(raw.homeTeam || "").trim();
  const awayTeam = String(raw.awayTeam || "").trim();
  const gameTime = normalizeGameTime(raw.gameTime || raw.startTime || raw.startDate);
  const sourceUrl = normalizeProviderUrl(raw.sourceUrl || "");
  const sourceKey = String(raw.sourceKey || "").trim() || createGameSourceKey({
    ...raw,
    leagueId,
    leagueName,
    gameTime,
    homeTeam,
    awayTeam,
    sourceUrl,
  });

  return {
    ...raw,
    id: String(raw.id || createGameId({ sourceKey, leagueId, leagueName, gameTime, homeTeam, awayTeam, sourceUrl })),
    gameTime,
    sport: String(raw.sport || "").trim(),
    countryId: normalizeCountryId(raw.countryId || ""),
    country: String(raw.country || raw.countryName || "").trim(),
    leagueId,
    leagueName,
    provider: normalizeOddsProvider(raw.provider),
    homeTeam,
    awayTeam,
    status: normalizeGameStatus(raw.status, gameTime),
    oddsThreshold: normalizeOddsThreshold(raw.oddsThreshold ?? raw.odds),
    intervalSeconds: normalizeIntervalSeconds(raw.intervalSeconds ?? raw.intervalSecond ?? raw.interval),
    enabled: raw.enabled === undefined || raw.enabled === null ? true : normalizeEnabled(raw.enabled),
    sourceUrl,
    sourceKey,
  };
}

function normalizeGameStatus(value, gameTime, referenceTime = new Date()) {
  const gameTimeValue = getDateValue(gameTime);
  const referenceTimeValue = getDateValue(referenceTime);

  if (gameTimeValue > 0 && referenceTimeValue > 0) {
    return gameTimeValue <= referenceTimeValue ? "finished" : "scheduled";
  }

  const normalized = normalizeText(value);
  return ["finished", "ended", "closed", "경기종료", "종료"].includes(normalized)
    ? "finished"
    : "scheduled";
}

function normalizeOddRecord(raw) {
  const gameTime = normalizeGameTime(raw.gameTime || raw.startTime || raw.startDate);
  const changedAt = normalizeGameTime(raw.changedAt || raw.changedTime || raw.time || raw.updatedAt || raw.createdAt);
  const betHome = normalizeOddValue(raw.betHome ?? raw.homeOdds ?? raw.oddsHome ?? raw.winOdds);
  const betDraw = normalizeOddValue(raw.betDraw ?? raw.drawOdds ?? raw.oddsDraw ?? raw.line ?? raw.point ?? raw.baseLine);
  const betAway = normalizeOddValue(raw.betAway ?? raw.awayOdds ?? raw.oddsAway ?? raw.loseOdds);
  const baseOdds = normalizeOddValue(raw.baseOdds ?? raw.standardOdds ?? raw.thresholdOdds);

  const marketName = String(raw.marketName || raw.market || raw.marketLabel || "승무패").trim();
  const marketType = normalizeOddMarketType(raw.marketType, marketName);
  const lineValue = marketType === "result"
    ? null
    : normalizeOddValue(raw.lineValue ?? raw.betDraw ?? raw.line ?? raw.point ?? raw.baseLine);

  return {
    ...raw,
    id: String(raw.id || ""),
    gameId: String(raw.gameId || "").trim(),
    leagueId: String(raw.leagueId || "").trim(),
    leagueName: String(raw.leagueName || "").trim(),
    country: String(raw.country || raw.countryName || "").trim(),
    provider: normalizeOddsProvider(raw.provider),
    gameTime,
    sport: String(raw.sport || "").trim(),
    marketType,
    marketName,
    marketKey: String(raw.marketKey || raw.sourceKey || "").trim(),
    homeTeam: String(raw.homeTeam || raw.home || "").trim(),
    awayTeam: String(raw.awayTeam || raw.away || "").trim(),
    betHome,
    betDraw,
    betAway,
    lineValue,
    baseOdds,
    sourceKey: String(raw.sourceKey || "").trim(),
    changedAt,
  };
}

function normalizeOddMarketType(value, marketName) {
  const normalizedValue = normalizeText(value);

  if (["result", "total", "handicap"].includes(normalizedValue)) {
    return normalizedValue;
  }

  const normalizedName = normalizeText(marketName);

  if (normalizedName.includes("오버") || normalizedName.includes("언더") || normalizedName.includes("total")) {
    return "total";
  }

  if (normalizedName.includes("핸디") || normalizedName.includes("handicap")) {
    return "handicap";
  }

  return "result";
}

function compareOddRecords(left, right) {
  const changedDiff = getDateValue(right.changedAt) - getDateValue(left.changedAt);

  if (changedDiff !== 0) {
    return changedDiff;
  }

  return String(right.id || "").localeCompare(String(left.id || ""));
}

function getGameUpdateIntervalSeconds(game, leaguesById) {
  const gameIntervalSeconds = normalizeIntervalSeconds(game.intervalSeconds);
  const leagueIntervalSeconds = normalizeIntervalSeconds(leaguesById.get(game.leagueId)?.intervalSeconds);
  const intervalSeconds = gameIntervalSeconds > 0 ? gameIntervalSeconds : leagueIntervalSeconds;

  if (intervalSeconds <= 0) {
    return oddsDefaultIntervalSeconds;
  }

  return Math.max(oddsMinIntervalSeconds, intervalSeconds);
}

function getLeagueProviderUrl(league) {
  const provider = normalizeOddsProvider(league.provider);
  return normalizeProviderUrl(league[`${provider}LeagueUrl`]);
}

function getLeagueImportUrl(league) {
  const provider = normalizeOddsProvider(league.provider);
  const providerUrl = getLeagueProviderUrl(league);

  if (provider === "fonbet" && (providerUrl || league.tournament || league.fonbetLeagueId)) {
    return providerUrl || fonbetListUrl;
  }

  return providerUrl;
}

function normalizeOddsProvider(provider) {
  const value = String(provider || "xbet").trim().toLowerCase();
  const providerMap = {
    fombet: "fonbet",
    pombet: "fonbet",
    pom: "fonbet",
    fonbet: "fonbet",
    "1xbet": "xbet",
    xbet: "xbet",
    pinnacle: "pinnacle",
  };

  return providers.includes(providerMap[value]) ? providerMap[value] : "xbet";
}

function normalizeProviderUrl(url) {
  const value = String(url || "").trim();

  if (!value) {
    return "";
  }

  try {
    const parsedUrl = new URL(value);
    return ["http:", "https:"].includes(parsedUrl.protocol) ? parsedUrl.toString() : "";
  } catch {
    try {
      const parsedUrl = new URL(`https://${value}`);
      return parsedUrl.toString();
    } catch {
      return "";
    }
  }
}

function normalizeCountryId(countryId) {
  return String(countryId || "").trim().toLowerCase();
}

function normalizeOddsThreshold(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return 0;
  }

  return Math.round(numberValue * 100) / 100;
}

function normalizeIntervalSeconds(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return 0;
  }

  return Math.floor(numberValue);
}

function normalizeOddValue(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numberValue = Number(String(value).replace(",", "."));

  if (!Number.isFinite(numberValue)) {
    return null;
  }

  return Math.round(numberValue * 100) / 100;
}

function normalizeEnabled(value) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value ?? "true").trim().toLowerCase();
  return !["false", "0", "off", "disabled", "중지", "미사용", "사용안함"].includes(normalized);
}

function normalizeGameTime(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value.toDate === "function") {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getDateValue(value) {
  if (!value) {
    return 0;
  }

  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function createGameId(data) {
  const key = data.sourceKey || createGameSourceKey(data);
  return `game-${createHash(key)}`;
}

function createTeamId(leagueId, provider, sourceName) {
  return `team-${createHash([leagueId, normalizeOddsProvider(provider), sourceName].map(normalizeText).join("|"))}`;
}

function createGameSourceKey(data) {
  const gameTime = normalizeGameTime(data.gameTime);

  return [
    data.leagueId || data.leagueName,
    gameTime ? gameTime.toISOString() : "",
    data.homeTeam,
    data.awayTeam,
    data.sourceUrl,
  ].map(normalizeText).join("|");
}

function createHash(value) {
  let hash = 0;
  const text = String(value || "");

  for (let index = 0; index < text.length; index += 1) {
    hash = (Math.imul(hash, 31) + text.charCodeAt(index)) | 0;
  }

  return (hash >>> 0).toString(36);
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function toLeagueResult(league, reason) {
  return {
    id: league.id,
    leagueName: league.leagueName,
    provider: league.provider,
    reason,
  };
}
