import "./src/style.css";
import heroImage from "./src/assets/hero.png";

const env = import.meta.env ?? {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"];
const sessionKey = "sportsApiAdminSession";
const sidebarOrderKey = "sportsApiSidebarOrderV2";
const alertSoundEnabledKey = "sportsApiAlertSoundEnabled";

const sidebarItems = [
  { hash: "#/alerts", icon: "bell", label: "알림" },
  { hash: "#/games", icon: "calendar", label: "경기" },
  { hash: "#/odds", icon: "price", label: "배당" },
  { hash: "#/leagues", icon: "league", label: "리그" },
  { hash: "#/teams", icon: "team", label: "팀명" },
  { hash: "#/countries", icon: "country", label: "국가" },
  { hash: "#/sports", icon: "sport", label: "종목" },
  { hash: "#/members", icon: "member", label: "회원" },
  { hash: "#/settings", icon: "setting", label: "설정" },
];

const sportOptions = ["축구", "농구", "야구", "배구", "아이스하키", "테니스", "e스포츠"];

const marketDefinitions = [
  { type: "result", label: "승패" },
  { type: "handicap", label: "핸디캡" },
  { type: "total", label: "오버언더" },
];

const oddsProviders = [
  { value: "xbet", label: "1xBet" },
  { value: "fonbet", label: "Pombet" },
  { value: "pinnacle", label: "Pinnacle" },
];

const fonbetListUrl = env.VITE_FONBET_LIST_URL || "https://line-lb51.bk6bba-resources.com/events/listBase?scopeMarket=1600&lang=en";

const kLeagueSampleSport = {
  sportName: "축구",
  sortOrder: 1,
  enabled: true,
};

const kLeagueSampleCountry = {
  countryName: "대한민국",
  sortOrder: 1,
  enabled: true,
};

const kLeagueSampleLeague = {
  id: "kr-football-k-league",
  sport: "축구",
  countryId: "kr",
  country: "대한민국",
  leagueName: "K리그",
  provider: "xbet",
  oddsThreshold: 0,
  enabled: true,
  alertEnabled: false,
  xbetLeagueName: "south-korea-k-league-1",
  xbetLeagueId: "30467",
  xbetLeagueUrl: "https://1xlite-80748.pro/ko/line/football/30467-south-korea-k-league-1",
  fonbetLeagueName: "southkorea",
  fonbetLeagueId: "637",
  fonbetLeagueUrl: "https://fonbet.com.cy/sports/football/country/southkorea/tournament/637",
  tournament: "637",
  pinnacleLeagueName: "korea-republic-k-league-1",
  pinnacleLeagueId: "korea-republic-k-league-1",
  pinnacleLeagueUrl: "https://www.pinnacle.com/ko/soccer/korea-republic-k-league-1/matchups/#all",
};

const statusOptions = [
  { value: "active", label: "사용" },
  { value: "inactive", label: "미사용" },
];

const defaultGameDateRange = getDefaultGameDateRange();

const state = {
  loading: false,
  saving: false,
  memberLoading: false,
  sportLoading: false,
  sportLoaded: false,
  countryLoading: false,
  countryLoaded: false,
  leagueLoading: false,
  leagueLoaded: false,
  teamLoading: false,
  teamLoaded: false,
  teamBulkSaving: false,
  teamDrafts: {},
  teamError: "",
  marketLoading: false,
  marketLoaded: false,
  marketSaving: false,
  marketError: "",
  gameLoading: false,
  gameLoaded: false,
  gameImporting: false,
  oddLoading: false,
  oddLoaded: false,
  alertLoading: false,
  alertLoaded: false,
  alertSaving: false,
  alertError: "",
  settingLoading: false,
  settingLoaded: false,
  canListMembers: false,
  navCollapsed: false,
  navOpen: false,
  sidebarOrder: loadSidebarOrder(),
  message: "",
  error: "",
  toasts: [],
  user: null,
  profile: null,
  members: [],
  sports: [],
  countries: [],
  leagues: [],
  markets: [],
  teams: [],
  games: [],
  odds: [],
  alerts: [],
  alertSoundEnabled: loadAlertSoundEnabled(),
  settings: {
    oddsUpdaterEnabled: true,
  },
  filters: {
    status: "all",
    query: "",
    pageSize: 30,
    page: 1,
  },
  sportFilters: {
    enabled: "all",
    query: "",
    pageSize: 30,
    page: 1,
  },
  countryFilters: {
    enabled: "all",
    query: "",
    pageSize: 30,
    page: 1,
  },
  leagueFilters: {
    sport: "all",
    provider: "all",
    enabled: "all",
    query: "",
    pageSize: 30,
    page: 1,
  },
  teamFilters: {
    sport: "all",
    league: "all",
    query: "",
    pageSize: 30,
    page: 1,
  },
  gameFilters: {
    dateFrom: defaultGameDateRange.dateFrom,
    dateTo: defaultGameDateRange.dateTo,
    sport: "all",
    country: "all",
    status: "scheduled",
    enabled: "all",
    query: "",
    pageSize: 30,
    page: 1,
  },
  oddFilters: {
    sport: "all",
    league: "all",
    market: "all",
    query: "",
    sortField: "",
    sortDirection: "asc",
    pageSize: 30,
    page: 1,
  },
  alertFilters: {
    sport: "all",
    league: "all",
    market: "all",
    status: "all",
    query: "",
    pageSize: 30,
    page: 1,
  },
  modal: null,
  selectedOddGroupId: "",
  selectedAlertId: "",
  selectedGameId: "",
  selectedGameOdds: [],
  selectedGameOddsLoading: false,
  selectedGameOddsError: "",
  editingMember: null,
  editingSport: null,
  editingCountry: null,
  editingLeague: null,
  pendingSettings: null,
};

const toastDurationMs = 3000;
let toastId = 0;
const toastTimers = new Map();
let alertUnsubscribe = null;
let teamUnsubscribe = null;
let alertAudioContext = null;
let alertSoundTimer = null;

const app = document.querySelector("#app");
const missingConfig = requiredConfigKeys.filter((key) => !firebaseConfig[key]);
const firebaseScriptReady = Boolean(window.firebase);
const firebaseReady = firebaseScriptReady && missingConfig.length === 0;

let db = null;
let auth = null;
if (firebaseReady) {
  window.firebase.initializeApp(firebaseConfig);
  auth = window.firebase.auth();
  db = window.firebase.firestore();

  restoreSession();

  window.addEventListener("hashchange", () => {
    if (state.user) {
      ensureRoute();
      markActivePageForReload();
    }

    state.navOpen = false;
    render();
    hydrateActivePage();
  });
}

document.addEventListener("pointerdown", unlockAlertAudio, { passive: true });
document.addEventListener("keydown", unlockAlertAudio);

render();

function render() {
  if (!app) {
    return;
  }

  syncToasts();

  if (!firebaseReady) {
    app.innerHTML = renderFirebaseNotice();
    return;
  }

  if (!state.user) {
    app.innerHTML = renderLoginPage();
    bindLoginEvents();
    return;
  }

  app.innerHTML = renderAdminShell();
  bindAdminEvents();
}

function renderFirebaseNotice() {
  if (!firebaseScriptReady) {
    return `
      <main class="login-page">
        <section class="login-visual">
          <div class="brand-block">
            <span class="brand-mark">SA</span>
            <strong>Sports API</strong>
          </div>
          <img class="login-asset" src="${heroImage}" alt="" />
        </section>
        <section class="login-panel">
          <div class="login-card">
            <p class="eyebrow">연결 확인</p>
            <h1>Firebase SDK를 불러오지 못했습니다</h1>
            <p>네트워크 연결 또는 Firebase 스크립트 주소를 확인해주세요.</p>
          </div>
        </section>
      </main>
    `;
  }

  return `
    <main class="login-page">
      <section class="login-visual">
        <div class="brand-block">
          <span class="brand-mark">SA</span>
          <strong>Sports API</strong>
        </div>
        <img class="login-asset" src="${heroImage}" alt="" />
      </section>
      <section class="login-panel">
        <div class="login-card">
          <p class="eyebrow">설정 필요</p>
          <h1>Firebase 연결값을 확인해주세요</h1>
          <p>아래 값이 로컬 환경 파일에 있어야 관리자 화면이 서버와 연결됩니다.</p>
          <ul class="missing-list">
            ${missingConfig.map((key) => `<li>${toEnvName(key)}</li>`).join("")}
          </ul>
        </div>
      </section>
    </main>
  `;
}

function renderLoginPage() {
  return `
    <main class="login-page">
      <section class="login-visual">
        <div class="brand-block">
          <span class="brand-mark">SA</span>
          <strong>Sports API</strong>
        </div>
        <img class="login-asset" src="${heroImage}" alt="" />
        <div class="login-note">
          <strong>관리자 콘솔</strong>
          <span>회원 상태와 접근 권한을 한 화면에서 관리합니다.</span>
        </div>
      </section>

      <section class="login-panel">
        <form class="login-card" data-auth-form>
          <p class="eyebrow">Admin Login</p>
          <h1>Login</h1>
          <p>계정으로 로그인하세요.</p>

          <div class="login-grid">
            <label>
              <span>아이디</span>
              <input name="loginId" autocomplete="username" placeholder="admin" required />
            </label>
            <label>
              <span>비밀번호</span>
              <input name="password" type="password" autocomplete="current-password" minlength="6" placeholder="6자 이상" required />
            </label>
          </div>

          <button class="primary-action" type="submit" ${state.loading ? "disabled" : ""}>
            ${state.loading ? "처리 중" : "Login"}
          </button>
        </form>
      </section>

      ${renderToastStack()}
    </main>
  `;
}

function renderAdminShell() {
  const activeHash = getActiveHash();
  const unreadAlertCount = getUnreadAlertCount();

  return `
    <div class="admin-shell ${state.navCollapsed ? "is-collapsed" : ""} ${state.navOpen ? "is-open" : ""}">
      <aside class="sidebar">
        <a class="sidebar-logo" href="#/sports" aria-label="종목 관리">
          <span>SA</span>
        </a>
        <nav class="sidebar-nav" aria-label="관리자 메뉴">
          ${getOrderedSidebarItems().map((item) => renderSidebarItem(item, activeHash)).join("")}
        </nav>
        <button class="sidebar-exit" data-sign-out type="button" title="로그아웃">
          <span class="nav-icon icon-exit"></span>
          <span>로그아웃</span>
        </button>
      </aside>

      <div class="content-shell">
        <header class="topbar">
          <button class="icon-button" data-sidebar-toggle type="button" title="메뉴">
            <span class="hamburger"></span>
          </button>
          <div class="topbar-spacer"></div>
          <label class="switch-control topbar-alert-toggle" title="알림음 ${state.alertSoundEnabled ? "끄기" : "켜기"}">
            <strong>알림</strong>
            <input data-alert-sound-toggle type="checkbox" ${state.alertSoundEnabled ? "checked" : ""} aria-label="알림음 사용" />
            <span aria-hidden="true"></span>
            <em>${state.alertSoundEnabled ? "ON" : "OFF"}</em>
          </label>
          <button
            class="icon-button topbar-alert-button ${unreadAlertCount > 0 ? "has-alerts" : ""}"
            data-open-alerts
            type="button"
            title="알림 리스트"
            aria-label="알림 리스트${unreadAlertCount > 0 ? `, 미확인 ${unreadAlertCount}건` : ""}"
          >
            <span class="nav-icon icon-bell"></span>
            <span class="alert-count-badge ${unreadAlertCount > 0 ? "" : "is-hidden"}" data-alert-count>${formatAlertBadgeCount(unreadAlertCount)}</span>
          </button>
          <span class="topbar-divider"></span>
          <button class="admin-chip" data-sign-out type="button" title="로그아웃">
            <span>${escapeHtml(getDisplayName(state.profile))}</span>
          </button>
        </header>

        <main class="admin-main">
          ${renderPage(activeHash)}
        </main>

        <footer class="admin-footer">
          <span>Sports API Admin</span>
          <span>Powered by Firebase</span>
        </footer>
      </div>

      ${renderModal()}
      ${renderToastStack()}
    </div>
  `;
}

function renderSidebarItem(item, activeHash) {
  const active = item.hash === activeHash ? "active" : "";

  return `
    <a class="nav-item ${active}" href="${item.hash}" data-sidebar-item="${item.hash}" draggable="true" title="${item.label}">
      <span class="nav-icon icon-${item.icon}"></span>
      <span class="nav-label">${item.label}</span>
      <span class="nav-drag-handle" title="드래그하여 순서 변경" aria-hidden="true"></span>
    </a>
  `;
}

function renderPage(activeHash) {
  if (activeHash === "#/sports") {
    return renderSportsPage();
  }

  if (activeHash === "#/countries") {
    return renderCountriesPage();
  }

  if (activeHash === "#/leagues") {
    return renderLeaguesPage();
  }

  if (activeHash === "#/teams") {
    return renderTeamsPage();
  }

  if (activeHash === "#/games") {
    return renderGamesPage();
  }

  if (activeHash === "#/odds") {
    return renderOddsPage();
  }

  if (activeHash === "#/alerts") {
    return renderAlertsPage();
  }

  if (activeHash === "#/settings") {
    return renderSettingsPage();
  }

  return renderMembersPage();
}

function renderSportsPage() {
  const stats = getSportStats(state.sports);
  const result = getFilteredSports();

  return `
    <section class="summary-grid">
      ${renderMetricCard("전체 종목", stats.total)}
      ${renderMetricCard("사용 종목", stats.enabled)}
      ${renderMetricCard("중지 종목", stats.disabled)}
    </section>

    <section class="page-card sport-list-card">
      ${state.marketError ? `<p class="inline-notice">${escapeHtml(state.marketError)}</p>` : ""}

      <div class="filter-bar sport-filter-bar">
        <select data-sport-enabled-filter aria-label="사용 여부">
          <option value="all" ${selected(state.sportFilters.enabled, "all")}>사용 전체</option>
          <option value="enabled" ${selected(state.sportFilters.enabled, "enabled")}>사용</option>
          <option value="disabled" ${selected(state.sportFilters.enabled, "disabled")}>중지</option>
        </select>

        <label class="search-box">
          <span class="search-icon"></span>
          <input data-sport-search-input value="${escapeHtml(state.sportFilters.query)}" placeholder="종목명 검색" />
        </label>
      </div>

      <div class="list-toolbar">
        <span data-sport-result-text>${getSportResultText(result)}</span>
        <div class="toolbar-actions">
          <button class="add-button" data-add-sport type="button" title="종목추가">
            <span>+</span>
            종목추가
          </button>
          <select data-sport-page-size aria-label="표시 갯수">
            ${[30, 50, 100].map((size) => `<option value="${size}" ${selected(state.sportFilters.pageSize, size)}>${size}건</option>`).join("")}
          </select>
          <button class="pager-button" data-sport-page-prev type="button" ${result.page <= 1 ? "disabled" : ""}>이전</button>
          <span class="page-indicator" data-sport-page-indicator>${result.page} / ${result.totalPages}</span>
          <button class="pager-button" data-sport-page-next type="button" ${result.page >= result.totalPages ? "disabled" : ""}>다음</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table sport-table">
          <thead>
            <tr>
              <th>순서</th>
              <th>종목명</th>
              <th>마켓명</th>
              <th>사용</th>
              <th>알림</th>
              <th>수정 및 삭제</th>
            </tr>
          </thead>
          <tbody data-sport-body>
            ${renderSportRows(result.rows)}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderCountriesPage() {
  const stats = getCountryStats(state.countries);
  const result = getFilteredCountries();

  return `
    <section class="summary-grid">
      ${renderMetricCard("전체 국가", stats.total)}
      ${renderMetricCard("사용 국가", stats.enabled)}
      ${renderMetricCard("중지 국가", stats.disabled)}
    </section>

    <section class="page-card country-list-card">
      <div class="filter-bar country-filter-bar">
        <select data-country-enabled-filter aria-label="사용 여부">
          <option value="all" ${selected(state.countryFilters.enabled, "all")}>사용 전체</option>
          <option value="enabled" ${selected(state.countryFilters.enabled, "enabled")}>사용</option>
          <option value="disabled" ${selected(state.countryFilters.enabled, "disabled")}>중지</option>
        </select>

        <label class="search-box">
          <span class="search-icon"></span>
          <input data-country-search-input value="${escapeHtml(state.countryFilters.query)}" placeholder="국가명 검색" />
        </label>
      </div>

      <div class="list-toolbar">
        <span data-country-result-text>${getCountryResultText(result)}</span>
        <div class="toolbar-actions">
          <button class="add-button" data-add-country type="button" title="국가추가">
            <span>+</span>
            국가추가
          </button>
          <select data-country-page-size aria-label="표시 갯수">
            ${[30, 50, 100].map((size) => `<option value="${size}" ${selected(state.countryFilters.pageSize, size)}>${size}건</option>`).join("")}
          </select>
          <button class="pager-button" data-country-page-prev type="button" ${result.page <= 1 ? "disabled" : ""}>이전</button>
          <span class="page-indicator" data-country-page-indicator>${result.page} / ${result.totalPages}</span>
          <button class="pager-button" data-country-page-next type="button" ${result.page >= result.totalPages ? "disabled" : ""}>다음</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table country-table">
          <thead>
            <tr>
              <th>순서</th>
              <th>국가명</th>
              <th>사용여부</th>
              <th>수정 및 삭제</th>
            </tr>
          </thead>
          <tbody data-country-body>
            ${renderCountryRows(result.rows)}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderLeaguesPage() {
  const stats = getLeagueStats(state.leagues);
  const result = getFilteredLeagues();
  const sports = getLeagueSportOptions();

  return `
    <section class="summary-grid">
      ${renderMetricCard("전체 리그", stats.total)}
      ${renderMetricCard("선택 리그", stats.enabled)}
      ${renderMetricCard("알림 리그", stats.alerts)}
    </section>

    <section class="page-card league-list-card">
      <div class="filter-bar league-filter-bar">
        <select data-league-sport-filter aria-label="종목">
          <option value="all" ${selected(state.leagueFilters.sport, "all")}>종목 전체</option>
          ${sports.map((sport) => `<option value="${escapeHtml(sport)}" ${selected(state.leagueFilters.sport, sport)}>${escapeHtml(sport)}</option>`).join("")}
        </select>

        <select data-league-provider-filter aria-label="사용 사이트">
          <option value="all" ${selected(state.leagueFilters.provider, "all")}>API사 전체</option>
          ${oddsProviders.map((provider) => `<option value="${provider.value}" ${selected(state.leagueFilters.provider, provider.value)}>${provider.label}</option>`).join("")}
        </select>

        <select data-league-enabled-filter aria-label="사용 여부">
          <option value="all" ${selected(state.leagueFilters.enabled, "all")}>선택 전체</option>
          <option value="enabled" ${selected(state.leagueFilters.enabled, "enabled")}>선택</option>
          <option value="disabled" ${selected(state.leagueFilters.enabled, "disabled")}>미선택</option>
        </select>

        <label class="search-box">
          <span class="search-icon"></span>
          <input data-league-search-input value="${escapeHtml(state.leagueFilters.query)}" placeholder="종목, 국가, 리그명, URL 검색" />
        </label>
      </div>

      <div class="list-toolbar">
        <span data-league-result-text>${getLeagueResultText(result)}</span>
        <div class="toolbar-actions">
          <button class="add-button" data-add-league type="button" title="리그추가">
            <span>+</span>
            리그추가
          </button>
          <button class="pager-button" data-add-kleague-sample type="button" title="K리그 샘플등록">
            K리그 샘플
          </button>
          <select data-league-page-size aria-label="표시 갯수">
            ${[30, 50, 100].map((size) => `<option value="${size}" ${selected(state.leagueFilters.pageSize, size)}>${size}건</option>`).join("")}
          </select>
          <button class="pager-button" data-league-page-prev type="button" ${result.page <= 1 ? "disabled" : ""}>이전</button>
          <span class="page-indicator" data-league-page-indicator>${result.page} / ${result.totalPages}</span>
          <button class="pager-button" data-league-page-next type="button" ${result.page >= result.totalPages ? "disabled" : ""}>다음</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table league-table">
          <thead>
            <tr>
              <th>종목</th>
              <th>국가</th>
              <th>리그명</th>
              <th>배당(소수점입력)</th>
              <th>간격 초</th>
              <th>API사</th>
              <th>선택</th>
              <th>알림</th>
              <th>수정</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody data-league-body>
            ${renderLeagueRows(result.rows)}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderTeamsPage() {
  const stats = getTeamStats(state.teams);
  const sports = getTeamSportOptions();
  const leagues = getTeamLeagueOptions(state.teamFilters.sport);
  const draftCount = Object.keys(state.teamDrafts).length;

  if (state.teamFilters.league !== "all" && !leagues.some((league) => league.id === state.teamFilters.league)) {
    state.teamFilters.league = "all";
  }

  const result = getFilteredTeams();

  return `
    <section class="summary-grid">
      ${renderMetricCard("전체 팀", stats.total)}
      ${renderMetricCard("표기명 설정", stats.customized)}
      ${renderMetricCard("원본명 사용", stats.original)}
    </section>

    <section class="page-card team-list-card">
      ${state.teamError ? `<p class="inline-notice">${escapeHtml(state.teamError)}</p>` : ""}

      <div class="filter-bar team-filter-bar">
        <select data-team-sport-filter aria-label="종목">
          <option value="all" ${selected(state.teamFilters.sport, "all")}>종목 전체</option>
          ${sports.map((sport) => `<option value="${escapeHtml(sport)}" ${selected(state.teamFilters.sport, sport)}>${escapeHtml(sport)}</option>`).join("")}
        </select>

        <select data-team-league-filter aria-label="리그">
          <option value="all" ${selected(state.teamFilters.league, "all")}>리그 전체</option>
          ${leagues.map((league) => `<option value="${escapeHtml(league.id)}" ${selected(state.teamFilters.league, league.id)}>${escapeHtml(league.name)}</option>`).join("")}
        </select>

        <label class="search-box">
          <span class="search-icon"></span>
          <input data-team-search-input value="${escapeHtml(state.teamFilters.query)}" placeholder="종목, 국가, 리그, 팀명 검색" />
        </label>
      </div>

      <div class="list-toolbar">
        <span data-team-result-text>${getTeamResultText(result)}</span>
        <div class="toolbar-actions">
          <button
            class="add-button"
            data-save-all-teams
            type="button"
            ${state.teamBulkSaving || draftCount === 0 ? "disabled" : ""}
            title="변경한 표기명 일괄 저장"
          >
            ${state.teamBulkSaving ? "저장 중" : `일괄수정${draftCount > 0 ? ` (${draftCount})` : ""}`}
          </button>
          <select data-team-page-size aria-label="표시 갯수">
            ${[30, 50, 100].map((size) => `<option value="${size}" ${selected(state.teamFilters.pageSize, size)}>${size}건</option>`).join("")}
          </select>
          <button class="pager-button" data-team-page-prev type="button" ${result.page <= 1 ? "disabled" : ""}>이전</button>
          <span class="page-indicator" data-team-page-indicator>${result.page} / ${result.totalPages}</span>
          <button class="pager-button" data-team-page-next type="button" ${result.page >= result.totalPages ? "disabled" : ""}>다음</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table team-table">
          <thead>
            <tr>
              <th>종목</th>
              <th>국가</th>
              <th>리그</th>
              <th>팀명(Fombet)</th>
              <th>표기명</th>
            </tr>
          </thead>
          <tbody data-team-body>
            ${renderTeamRows(result.rows)}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderMembersPage() {
  const stats = getMemberStats(state.members);
  const result = getFilteredMembers();

  return `
    <section class="summary-grid">
      ${renderMetricCard("전체 회원", stats.total)}
      ${renderMetricCard("사용 회원", stats.active)}
      ${renderMetricCard("미사용 회원", stats.inactive)}
    </section>

    <section class="page-card member-list-card">
      <div class="filter-bar member-filter-bar">
        <select data-status-filter aria-label="상태">
          <option value="all" ${selected(state.filters.status, "all")}>상태 전체</option>
          ${statusOptions.map((status) => `<option value="${status.value}" ${selected(state.filters.status, status.value)}>${status.label}</option>`).join("")}
        </select>

        <label class="search-box">
          <span class="search-icon"></span>
          <input data-search-input value="${escapeHtml(state.filters.query)}" placeholder="아이디, 닉네임 검색" />
        </label>
      </div>

      <div class="list-toolbar">
        <span data-result-text>${getResultText(result)}</span>
        <div class="toolbar-actions">
          <button class="add-button" data-add-member type="button" title="회원추가">
            <span>+</span>
            회원추가
          </button>
          <select data-page-size aria-label="표시 갯수">
            ${[30, 50, 100].map((size) => `<option value="${size}" ${selected(state.filters.pageSize, size)}>${size}건</option>`).join("")}
          </select>
          <button class="pager-button" data-page-prev type="button" ${result.page <= 1 ? "disabled" : ""}>이전</button>
          <span class="page-indicator" data-page-indicator>${result.page} / ${result.totalPages}</span>
          <button class="pager-button" data-page-next type="button" ${result.page >= result.totalPages ? "disabled" : ""}>다음</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table member-table">
          <thead>
            <tr>
              <th>아이디</th>
              <th>닉네임</th>
              <th>사용여부</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody data-member-body>
            ${renderMemberRows(result.rows)}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderGamesPage() {
  const stats = getGameStats(state.games);
  const sports = getGameSportOptions();
  const countries = getGameCountryOptions(state.gameFilters.sport);

  if (state.gameFilters.country !== "all" && !countries.includes(state.gameFilters.country)) {
    state.gameFilters.country = "all";
  }

  const result = getFilteredGames();

  return `
    <section class="summary-grid">
      ${renderMetricCard("전체 경기", stats.total)}
      ${renderMetricCard("ON 경기", stats.enabled)}
      ${renderMetricCard("OFF 경기", stats.disabled)}
    </section>

    <section class="page-card game-list-card">
      <div class="filter-bar game-filter-bar">
        <div class="game-date-range" aria-label="경기 날짜 범위">
          <input
            data-game-date-from-filter
            type="date"
            value="${escapeHtml(state.gameFilters.dateFrom)}"
            max="${escapeHtml(state.gameFilters.dateTo)}"
            aria-label="경기 시작 날짜"
            title="시작 날짜"
          />
          <span aria-hidden="true">~</span>
          <input
            data-game-date-to-filter
            type="date"
            value="${escapeHtml(state.gameFilters.dateTo)}"
            min="${escapeHtml(state.gameFilters.dateFrom)}"
            aria-label="경기 종료 날짜"
            title="종료 날짜"
          />
        </div>

        <select data-game-sport-filter aria-label="종목">
          <option value="all">종목 전체</option>
          ${sports.map((sport) => `
            <option value="${escapeHtml(sport)}" ${selected(state.gameFilters.sport, sport)}>${escapeHtml(sport)}</option>
          `).join("")}
        </select>

        <select data-game-country-filter aria-label="국가">
          <option value="all">국가 전체</option>
          ${countries.map((country) => `
            <option value="${escapeHtml(country)}" ${selected(state.gameFilters.country, country)}>${escapeHtml(country)}</option>
          `).join("")}
        </select>

        <select data-game-status-filter aria-label="경기 상태">
          <option value="scheduled" ${selected(state.gameFilters.status, "scheduled")}>시작전</option>
          <option value="finished" ${selected(state.gameFilters.status, "finished")}>경기종료</option>
          <option value="all" ${selected(state.gameFilters.status, "all")}>상태 전체</option>
        </select>

        <select data-game-enabled-filter aria-label="온오프">
          <option value="all" ${selected(state.gameFilters.enabled, "all")}>전체</option>
          <option value="enabled" ${selected(state.gameFilters.enabled, "enabled")}>ON</option>
          <option value="disabled" ${selected(state.gameFilters.enabled, "disabled")}>OFF</option>
        </select>

        <label class="search-box">
          <span class="search-icon"></span>
          <input data-game-search-input value="${escapeHtml(state.gameFilters.query)}" placeholder="리그명, 팀명 검색" />
        </label>
      </div>

      <div class="list-toolbar">
        <span data-game-result-text>${getGameResultText(result)}</span>
        <div class="toolbar-actions">
          <button class="add-button" data-import-games type="button" ${state.gameImporting ? "disabled" : ""} title="선택 리그 경기 가져오기">
            ${state.gameImporting ? "가져오는 중" : "경기가져오기"}
          </button>
          <select data-game-page-size aria-label="표시 갯수">
            ${[30, 50, 100].map((size) => `<option value="${size}" ${selected(state.gameFilters.pageSize, size)}>${size}건</option>`).join("")}
          </select>
          <button class="pager-button" data-game-page-prev type="button" ${result.page <= 1 ? "disabled" : ""}>이전</button>
          <span class="page-indicator" data-game-page-indicator>${result.page} / ${result.totalPages}</span>
          <button class="pager-button" data-game-page-next type="button" ${result.page >= result.totalPages ? "disabled" : ""}>다음</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table game-table">
          <thead>
            <tr>
              <th>경기시간</th>
              <th>종목</th>
              <th>국가</th>
              <th>리그명</th>
              <th>홈팀</th>
              <th>어웨이팀</th>
              <th>상태</th>
              <th>온오프</th>
            </tr>
          </thead>
          <tbody data-game-body>
            ${renderGameRows(result.rows)}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderOddsPage() {
  const stats = getOddStats(getOddGroups());
  const sports = getOddSportOptions();
  const leagues = getOddLeagueOptions(state.oddFilters.sport);

  if (state.oddFilters.league !== "all" && !leagues.includes(state.oddFilters.league)) {
    state.oddFilters.league = "all";
  }

  const result = getFilteredOdds();

  return `
    <section class="summary-grid">
      ${renderMetricCard("전체 마켓", stats.markets)}
      ${renderMetricCard("경기 수", stats.games)}
      ${renderMetricCard("배당 히스토리", stats.records)}
    </section>

    <section class="page-card odds-list-card">
      <div class="filter-bar odds-filter-bar">
        <select data-odd-sport-filter aria-label="종목">
          <option value="all" ${selected(state.oddFilters.sport, "all")}>종목 전체</option>
          ${sports.map((sport) => `<option value="${escapeHtml(sport)}" ${selected(state.oddFilters.sport, sport)}>${escapeHtml(sport)}</option>`).join("")}
        </select>

        <select data-odd-league-filter aria-label="리그">
          <option value="all" ${selected(state.oddFilters.league, "all")}>리그 전체</option>
          ${leagues.map((league) => `<option value="${escapeHtml(league)}" ${selected(state.oddFilters.league, league)}>${escapeHtml(league)}</option>`).join("")}
        </select>

        <select data-odd-market-filter aria-label="마켓">
          <option value="all" ${selected(state.oddFilters.market, "all")}>마켓 전체</option>
          <option value="result" ${selected(state.oddFilters.market, "result")}>승패 / 승무패</option>
          <option value="handicap" ${selected(state.oddFilters.market, "handicap")}>핸디캡</option>
          <option value="total" ${selected(state.oddFilters.market, "total")}>오버언더</option>
        </select>

        <label class="search-box">
          <span class="search-icon"></span>
          <input data-odd-search-input value="${escapeHtml(state.oddFilters.query)}" placeholder="종목, 리그, 마켓, 팀명 검색" />
        </label>
      </div>

      <div class="list-toolbar">
        <span data-odd-result-text>${getOddResultText(result)}</span>
        <div class="toolbar-actions">
          <select data-odd-page-size aria-label="표시 갯수">
            ${[30, 50, 100].map((size) => `<option value="${size}" ${selected(state.oddFilters.pageSize, size)}>${size}건</option>`).join("")}
          </select>
          <button class="pager-button" data-odd-page-prev type="button" ${result.page <= 1 ? "disabled" : ""}>이전</button>
          <span class="page-indicator" data-odd-page-indicator>${result.page} / ${result.totalPages}</span>
          <button class="pager-button" data-odd-page-next type="button" ${result.page >= result.totalPages ? "disabled" : ""}>다음</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table odds-table">
          <thead>
            <tr>
              ${renderOddSortHeader("경기시간", "gameTime")}
              <th>종목</th>
              <th>마켓이름</th>
              ${renderOddSortHeader("홈팀명", "homeTeam")}
              <th>승·오버·홈</th>
              <th>무·기준점</th>
              <th>패·언더·원정</th>
              ${renderOddSortHeader("어웨이팀명", "awayTeam")}
            </tr>
          </thead>
          <tbody data-odd-body>
            ${renderOddRows(result.rows)}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderOddSortHeader(label, field) {
  const isActive = state.oddFilters.sortField === field;
  const direction = state.oddFilters.sortDirection === "desc" ? "desc" : "asc";
  const symbol = isActive ? (direction === "asc" ? "↑" : "↓") : "↕";
  const ariaSort = isActive ? (direction === "asc" ? "ascending" : "descending") : "none";
  const directionLabel = isActive ? (direction === "asc" ? "오름차순" : "내림차순") : "정렬 안 함";

  return `
    <th aria-sort="${ariaSort}">
      <button
        class="table-sort-button ${isActive ? "is-active" : ""}"
        data-odd-sort="${field}"
        type="button"
        title="${escapeHtml(label)} ${isActive && direction === "asc" ? "내림차순" : "오름차순"} 정렬"
        aria-label="${escapeHtml(label)}, 현재 ${directionLabel}"
      >
        <span>${escapeHtml(label)}</span>
        <span class="table-sort-indicator" aria-hidden="true">${symbol}</span>
      </button>
    </th>
  `;
}

function renderAlertsPage() {
  const stats = getAlertStats(state.alerts);
  const sports = getAlertSportOptions();
  const leagues = getAlertLeagueOptions(state.alertFilters.sport);

  if (state.alertFilters.league !== "all" && !leagues.includes(state.alertFilters.league)) {
    state.alertFilters.league = "all";
  }

  const result = getFilteredAlerts();

  return `
    <section class="summary-grid">
      ${renderMetricCard("전체 알림", stats.total)}
      ${renderMetricCard("미확인 알림", stats.unread)}
      ${renderMetricCard("확인 완료", stats.acknowledged)}
    </section>

    <section class="page-card alert-list-card">
      ${state.alertError ? `<p class="inline-notice alert-error-notice">${escapeHtml(state.alertError)}</p>` : ""}

      <div class="filter-bar alert-filter-bar">
        <select data-alert-sport-filter aria-label="종목">
          <option value="all" ${selected(state.alertFilters.sport, "all")}>종목 전체</option>
          ${sports.map((sport) => `<option value="${escapeHtml(sport)}" ${selected(state.alertFilters.sport, sport)}>${escapeHtml(sport)}</option>`).join("")}
        </select>

        <select data-alert-league-filter aria-label="리그">
          <option value="all" ${selected(state.alertFilters.league, "all")}>리그 전체</option>
          ${leagues.map((league) => `<option value="${escapeHtml(league)}" ${selected(state.alertFilters.league, league)}>${escapeHtml(league)}</option>`).join("")}
        </select>

        <select data-alert-market-filter aria-label="마켓">
          <option value="all" ${selected(state.alertFilters.market, "all")}>마켓 전체</option>
          <option value="result" ${selected(state.alertFilters.market, "result")}>승무패 / 승패</option>
          <option value="handicap" ${selected(state.alertFilters.market, "handicap")}>핸디캡</option>
          <option value="total" ${selected(state.alertFilters.market, "total")}>오버언더</option>
        </select>

        <select data-alert-status-filter aria-label="알림 상태">
          <option value="all" ${selected(state.alertFilters.status, "all")}>상태 전체</option>
          <option value="unread" ${selected(state.alertFilters.status, "unread")}>미확인</option>
          <option value="acknowledged" ${selected(state.alertFilters.status, "acknowledged")}>확인 완료</option>
        </select>

        <label class="search-box">
          <span class="search-icon"></span>
          <input data-alert-search-input value="${escapeHtml(state.alertFilters.query)}" placeholder="리그명 또는 팀명 검색" />
        </label>
      </div>

      <div class="list-toolbar">
        <span data-alert-result-text>${getAlertResultText(result)}</span>
        <div class="toolbar-actions">
          <button class="acknowledge-all-button" data-acknowledge-all-alerts type="button" ${stats.unread === 0 || state.alertSaving ? "disabled" : ""}>
            전체 확인
          </button>
          <select data-alert-page-size aria-label="표시 갯수">
            ${[30, 50, 100].map((size) => `<option value="${size}" ${selected(state.alertFilters.pageSize, size)}>${size}건</option>`).join("")}
          </select>
          <button class="pager-button" data-alert-page-prev type="button" ${result.page <= 1 ? "disabled" : ""}>이전</button>
          <span class="page-indicator" data-alert-page-indicator>${result.page} / ${result.totalPages}</span>
          <button class="pager-button" data-alert-page-next type="button" ${result.page >= result.totalPages ? "disabled" : ""}>다음</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="data-table alert-table">
          <thead>
            <tr>
              <th>알림시간</th>
              <th>경기시간</th>
              <th>종목 / 리그</th>
              <th>경기</th>
              <th>마켓</th>
              <th>변경배당</th>
              <th>변동</th>
              <th>확인</th>
            </tr>
          </thead>
          <tbody data-alert-body>
            ${renderAlertRows(result.rows)}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderSettingsPage() {
  const settings = normalizeAppSettings(state.settings);

  return `
    <section class="summary-grid">
      ${renderMetricCard("서버 자동 수집", settings.oddsUpdaterEnabled ? "ON" : "OFF")}
      ${renderMetricCard("스케줄", "10분")}
      ${renderMetricCard("호출 방식", "1회")}
    </section>

    <section class="page-card settings-card">
      <div class="table-scroll">
        <table class="data-table settings-table">
          <thead>
            <tr>
              <th>설정명</th>
              <th>상태</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            ${state.settingLoading ? renderEmptyRow(3, "설정을 불러오는 중입니다.") : `
              <tr>
                <td><strong>서버 자동 수집</strong></td>
                <td>${settings.oddsUpdaterEnabled ? "ON" : "OFF"}</td>
                <td>${renderToggleSwitch("서버 자동 수집", settings.oddsUpdaterEnabled, "data-settings-odds-updater-toggle", "app")}</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderMetricCard(label, value) {
  return `
    <article class="metric-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `;
}

function renderSportRows(rows = getFilteredSports().rows) {
  if (state.sportLoading || (state.marketLoading && !state.marketLoaded)) {
    return renderEmptyRow(6, "종목 목록을 불러오는 중입니다.");
  }

  if (rows.length === 0) {
    return renderEmptyRow(6, "표시할 종목이 없습니다.");
  }

  const orderedSports = getOrderedSports();

  return rows
    .map((sport) => {
      const sportIndex = orderedSports.findIndex((item) => item.id === sport.id);
      const displayOrder = sportIndex >= 0 ? sportIndex + 1 : sport.sortOrder || "-";
      const disableUp = !canManageMasterData() || state.saving || sportIndex <= 0;
      const disableDown = !canManageMasterData() || state.saving || sportIndex < 0 || sportIndex >= orderedSports.length - 1;
      const markets = getMarketsForSport(sport);

      return markets.map((market, marketIndex) => `
        <tr class="sport-market-row ${marketIndex === 0 ? "is-group-start" : ""}">
          ${marketIndex === 0 ? `
            <td rowspan="${markets.length}" class="sport-group-cell">
              <div class="order-controls">
                <strong>${escapeHtml(displayOrder)}</strong>
                <button class="order-button" data-move-sport-up="${escapeHtml(sport.id)}" type="button" ${disableUp ? "disabled" : ""} title="위로">위</button>
                <button class="order-button" data-move-sport-down="${escapeHtml(sport.id)}" type="button" ${disableDown ? "disabled" : ""} title="아래로">아래</button>
              </div>
            </td>
            <td rowspan="${markets.length}" class="sport-group-cell"><strong>${escapeHtml(sport.sportName)}</strong></td>
          ` : ""}
          <td><strong>${escapeHtml(market.marketName)}</strong></td>
          <td>${renderToggleSwitch("사용", market.enabled, "data-market-enabled-toggle", market.id, { disabled: state.marketSaving })}</td>
          <td>${renderToggleSwitch("알림", market.alertEnabled, "data-market-alert-toggle", market.id, { disabled: state.marketSaving })}</td>
          ${marketIndex === 0 ? `
            <td rowspan="${markets.length}" class="sport-group-cell">
              <div class="row-actions">
                <button class="edit-button" data-edit-sport="${escapeHtml(sport.id)}" type="button" ${canManageMasterData() ? "" : "disabled"} title="수정">
                  <span class="edit-icon"></span>
                  수정
                </button>
                <button class="delete-button" data-delete-sport="${escapeHtml(sport.id)}" type="button" ${canManageMasterData() ? "" : "disabled"} title="삭제">
                  삭제
                </button>
              </div>
            </td>
          ` : ""}
        </tr>
      `).join("");
    })
    .join("");
}

function renderCountryRows(rows = getFilteredCountries().rows) {
  if (state.countryLoading) {
    return renderEmptyRow(4, "국가 목록을 불러오는 중입니다.");
  }

  if (rows.length === 0) {
    return renderEmptyRow(4, "표시할 국가가 없습니다.");
  }

  const orderedCountries = getOrderedCountries();

  return rows
    .map((country) => {
      const countryIndex = orderedCountries.findIndex((item) => item.id === country.id);
      const displayOrder = countryIndex >= 0 ? countryIndex + 1 : country.sortOrder || "-";
      const disableUp = !canManageMasterData() || state.saving || countryIndex <= 0;
      const disableDown = !canManageMasterData() || state.saving || countryIndex < 0 || countryIndex >= orderedCountries.length - 1;

      return `
        <tr>
          <td>
            <div class="order-controls">
              <strong>${escapeHtml(displayOrder)}</strong>
              <button class="order-button" data-move-country-up="${escapeHtml(country.id)}" type="button" ${disableUp ? "disabled" : ""} title="위로">위</button>
              <button class="order-button" data-move-country-down="${escapeHtml(country.id)}" type="button" ${disableDown ? "disabled" : ""} title="아래로">아래</button>
            </div>
          </td>
          <td><strong>${escapeHtml(country.countryName)}</strong></td>
          <td>${renderToggleSwitch("사용여부", country.enabled, "data-country-enabled-toggle", country.id)}</td>
          <td>
            <div class="row-actions">
              <button class="edit-button" data-edit-country="${escapeHtml(country.id)}" type="button" ${canManageMasterData() ? "" : "disabled"} title="수정">
                <span class="edit-icon"></span>
                수정
              </button>
              <button class="delete-button" data-delete-country="${escapeHtml(country.id)}" type="button" ${canManageMasterData() ? "" : "disabled"} title="삭제">
                삭제
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderLeagueRows(rows = getFilteredLeagues().rows) {
  if (state.leagueLoading) {
    return renderEmptyRow(10, "리그 목록을 불러오는 중입니다.");
  }

  if (rows.length === 0) {
    return renderEmptyRow(10, "표시할 리그가 없습니다.");
  }

  return rows
    .map((league) => `
      <tr>
        <td>${escapeHtml(league.sport)}</td>
        <td><strong>${escapeHtml(league.country)}</strong></td>
        <td><strong>${escapeHtml(league.leagueName)}</strong></td>
        <td>
          <input
            class="inline-number-input"
            data-league-odds-input="${escapeHtml(league.id)}"
            type="number"
            min="0"
            step="0.01"
            value="${escapeHtml(formatOddsInput(league.oddsThreshold))}"
            aria-label="배당"
            ${canManageMasterData() && !state.saving ? "" : "disabled"}
          />
        </td>
        <td>
          <input
            class="inline-number-input"
            data-league-interval-input="${escapeHtml(league.id)}"
            type="number"
            min="0"
            step="1"
            value="${escapeHtml(formatIntervalInput(league.intervalSeconds))}"
            aria-label="간격 초"
            ${canManageMasterData() && !state.saving ? "" : "disabled"}
          />
        </td>
        <td>
          <select class="inline-select" data-league-provider-select="${escapeHtml(league.id)}" aria-label="API사" ${canManageMasterData() && !state.saving ? "" : "disabled"}>
            ${oddsProviders.map((provider) => `<option value="${provider.value}" ${selected(league.provider, provider.value)}>${provider.label}</option>`).join("")}
          </select>
        </td>
        <td>${renderToggleSwitch("선택", league.enabled, "data-league-enabled-toggle", league.id)}</td>
        <td>${renderToggleSwitch("알림", league.alertEnabled, "data-league-alert-toggle", league.id)}</td>
        <td>
          <button class="edit-button" data-edit-league="${escapeHtml(league.id)}" type="button" ${canManageMasterData() ? "" : "disabled"} title="수정">
            <span class="edit-icon"></span>
            수정
          </button>
        </td>
        <td>
          <button class="delete-button" data-delete-league="${escapeHtml(league.id)}" type="button" ${canManageMasterData() ? "" : "disabled"} title="삭제">
            삭제
          </button>
        </td>
      </tr>
    `)
    .join("");
}

function renderTeamRows(rows = getFilteredTeams().rows) {
  if (state.teamLoading && !state.teamLoaded) {
    return renderEmptyRow(5, "팀명 목록을 불러오는 중입니다.");
  }

  if (rows.length === 0) {
    return renderEmptyRow(5, "등록된 팀명이 없습니다. 경기를 가져오면 자동으로 등록됩니다.");
  }

  return rows.map((team) => {
    const displayName = state.teamDrafts[team.id] ?? team.displayName;

    return `
      <tr>
        <td>${escapeHtml(team.sport)}</td>
        <td>${escapeHtml(team.country)}</td>
        <td><strong>${escapeHtml(team.leagueName)}</strong></td>
        <td>${escapeHtml(team.sourceName)}</td>
        <td>
          <input
            class="team-display-input"
            data-team-display-input="${escapeHtml(team.id)}"
            value="${escapeHtml(displayName)}"
            maxlength="100"
            aria-label="${escapeHtml(team.sourceName)} 표기명"
            ${state.teamBulkSaving ? "disabled" : ""}
          />
        </td>
      </tr>
    `;
  }).join("");
}

function renderGameRows(rows = getFilteredGames().rows) {
  if (state.gameLoading) {
    return renderEmptyRow(8, "경기 목록을 불러오는 중입니다.");
  }

  if (rows.length === 0) {
    return renderEmptyRow(8, "표시할 경기가 없습니다. 리그 선택 ON, API사 URL, Firestore 규칙을 확인해주세요.");
  }

  return rows
    .map((game) => {
      const homeTeam = getTeamDisplayName(game.homeTeam, game.leagueId, game.leagueName);
      const awayTeam = getTeamDisplayName(game.awayTeam, game.leagueId, game.leagueName);

      return `
      <tr
        class="clickable-game-row"
        data-game-history="${escapeHtml(game.id)}"
        tabindex="0"
        title="클릭하여 배당 이력 보기"
        aria-label="${escapeHtml(`${homeTeam} 대 ${awayTeam} 배당 이력 보기`)}"
      >
        <td>${escapeHtml(formatGameTime(game.gameTime))}</td>
        <td>${escapeHtml(game.sport)}</td>
        <td>${escapeHtml(game.country)}</td>
        <td><strong>${escapeHtml(game.leagueName)}</strong></td>
        <td>${escapeHtml(homeTeam)}</td>
        <td>${escapeHtml(awayTeam)}</td>
        <td>${renderGameStatusBadge(game)}</td>
        <td>${renderToggleSwitch("온오프", game.enabled, "data-game-enabled-toggle", game.id)}</td>
      </tr>
    `;
    })
    .join("");
}

function renderGameStatusBadge(game) {
  const status = normalizeGameStatus(game.status, game.gameTime);
  const label = getGameStatusLabel(status);
  return `<span class="status-badge game-status-${status}">${label}</span>`;
}

function renderOddRows(rows = getFilteredOdds().rows) {
  if (state.oddLoading) {
    return renderEmptyRow(8, "배당 목록을 불러오는 중입니다.");
  }

  if (rows.length === 0) {
    return renderEmptyRow(8, "표시할 배당이 없습니다.");
  }

  return rows
    .map((group) => renderOddRecordRow(group))
    .join("");
}

function renderAlertRows(rows = getFilteredAlerts().rows) {
  if (state.alertLoading && !state.alertLoaded) {
    return renderEmptyRow(8, "알림 목록을 불러오는 중입니다.");
  }

  if (rows.length === 0) {
    return renderEmptyRow(8, "표시할 알림이 없습니다.");
  }

  return rows.map((alert) => {
    const homeTeam = getTeamDisplayName(alert.homeTeam, alert.leagueId, alert.leagueName);
    const awayTeam = getTeamDisplayName(alert.awayTeam, alert.leagueId, alert.leagueName);

    return `
    <tr
      class="alert-row clickable-alert-row ${alert.acknowledged ? "is-acknowledged" : "is-unread"}"
      data-alert-game-history="${escapeHtml(alert.gameId)}"
      data-alert-id="${escapeHtml(alert.id)}"
      tabindex="0"
      title="클릭하여 경기 배당 보기"
      aria-label="${escapeHtml(`${homeTeam} 대 ${awayTeam} 경기 배당 보기`)}"
    >
      <td>${escapeHtml(formatDate(alert.changedAt))}</td>
      <td>${escapeHtml(formatGameTime(alert.gameTime))}</td>
      <td>
        <div class="alert-context-cell">
          <span>${escapeHtml(alert.sport)}</span>
          <strong>${escapeHtml(alert.leagueName)}</strong>
        </div>
      </td>
      <td>
        <div class="alert-game-cell">
          <strong>${escapeHtml(homeTeam)}</strong>
          <span>${escapeHtml(awayTeam)}</span>
        </div>
      </td>
      <td><strong class="market-name-badge market-${escapeHtml(alert.marketType)}">${escapeHtml(getOddMarketTitle(alert))}</strong></td>
      <td>
        <div class="alert-odds-comparison">
          ${renderAlertOdds(alert, "current")}
          ${renderAlertOdds(alert, "previous")}
        </div>
      </td>
      <td>
        <div class="alert-change-cell">
          <strong>${escapeHtml(formatAlertChangeDetails(alert))}</strong>
        </div>
      </td>
      <td>
        ${alert.acknowledged
          ? `<span class="status-badge alert-status-acknowledged">확인 완료</span>`
          : `<button class="alert-acknowledge-button" data-acknowledge-alert="${escapeHtml(alert.id)}" type="button" ${state.alertSaving ? "disabled" : ""}>확인</button>`}
      </td>
    </tr>
  `;
  }).join("");
}

function renderAlertOdds(alert, prefix) {
  const sectionLabel = prefix === "previous" ? "이전배당" : "변경배당";
  const fields = ["betHome", "betDraw", "betAway"];

  return `
    <button
      class="alert-odds-button ${prefix === "current" ? "is-current" : "is-previous"}"
      data-alert-market-history="${escapeHtml(alert.id)}"
      type="button"
      title="${sectionLabel} 상세 보기"
      aria-label="${escapeHtml(`${getOddMarketTitle(alert)} ${sectionLabel} 상세 보기`)}"
    >
      <span class="alert-odds-row-label">${prefix === "current" ? "변경" : "이전"}</span>
      <span class="alert-odds-values">
      ${fields.map((field) => {
        const value = getAlertOddValue(alert, prefix, field);
        const changed = prefix === "current" && alert.changedFields.includes(field);
        const isLine = field === "betDraw" && alert.marketType !== "result";

        return `
          <span class="alert-odd-value ${changed ? "is-changed" : ""} ${isLine ? "is-line-value" : ""}">
            <strong>${escapeHtml(formatAlertOddValue(alert, value, field))}</strong>
          </span>
        `;
      }).join("")}
      </span>
    </button>
  `;
}

function getAlertOddValue(alert, prefix, field) {
  const suffixes = {
    betHome: "BetHome",
    betDraw: "BetDraw",
    betAway: "BetAway",
  };
  return alert[`${prefix}${suffixes[field]}`];
}

function formatAlertOddValue(alert, value, field) {
  return formatOddDisplayValue(value, {
    marketType: alert.marketType,
    marketName: alert.marketName,
    betDraw: getAlertOddValue(alert, "current", "betDraw"),
  }, field);
}

function formatAlertChangeDetails(alert) {
  const labels = getOddMarketColumnLabels(alert);
  const fieldLabels = {
    betHome: labels.home,
    betDraw: labels.middle,
    betAway: labels.away,
  };
  const changes = alert.changedFields.map((field) => {
    const previous = getAlertOddValue(alert, "previous", field);
    const current = getAlertOddValue(alert, "current", field);
    const difference = normalizeOddValue(current) - normalizeOddValue(previous);
    const sign = difference > 0 ? "+" : "";
    return `${fieldLabels[field] || field} ${sign}${difference.toFixed(2)}`;
  });

  return changes.join(" · ") || `최대 ${formatOddValue(alert.maxDifference)}`;
}

function renderOddRecordRow(group) {
  const latest = group.records[0];
  const marketType = normalizeOddMarketType(latest.marketType, latest.marketName);
  const homeTeam = getTeamDisplayName(latest.homeTeam, latest.leagueId, latest.leagueName);
  const awayTeam = getTeamDisplayName(latest.awayTeam, latest.leagueId, latest.leagueName);

  return `
    <tr class="odds-latest-row market-${marketType}">
      <td>${escapeHtml(formatGameTime(latest.gameTime))}</td>
      <td>${escapeHtml(latest.sport)}</td>
      <td><strong class="market-name-badge market-${marketType}">${escapeHtml(latest.marketName)}</strong></td>
      <td>${escapeHtml(homeTeam)}</td>
      <td>${renderOddValueStack(group.id, group.records, "betHome")}</td>
      <td>${renderOddValueStack(group.id, group.records, "betDraw")}</td>
      <td>${renderOddValueStack(group.id, group.records, "betAway")}</td>
      <td>${escapeHtml(awayTeam)}</td>
    </tr>
  `;
}

function renderOddValueStack(groupId, records, field) {
  return `
    <div class="odd-value-stack">
      ${records.slice(0, 3).map((record, index) => (
        renderOddValueButton(groupId, record, field, records[index + 1])
      )).join("")}
    </div>
  `;
}

function renderOddValueButton(groupId, record, field, previousRecord) {
  const value = record[field];
  const previousValue = previousRecord?.[field];
  const isLineValue = isOddLineValue(record, field);
  const movement = getOddMovement(value, previousValue);
  const movementLabel = movement === "up" ? "이전 배당보다 상승" : movement === "down" ? "이전 배당보다 하락" : "";
  const formattedValue = formatOddDisplayValue(value, record, field);

  return `
    <button
      class="odd-value-button ${isLineValue ? "is-line-value" : ""}"
      data-odd-history="${escapeHtml(groupId)}"
      type="button"
      title="배당 히스토리${movementLabel ? ` · ${movementLabel}` : ""}"
      aria-label="배당 ${escapeHtml(formattedValue)}${movementLabel ? `, ${movementLabel}` : ""}"
    >
      <span class="odd-value-number">${escapeHtml(formattedValue)}</span>
      ${renderOddMovement(movement)}
    </button>
  `;
}

function renderOddHistoryValue(record, field, previousRecord) {
  const value = record[field];
  const previousValue = previousRecord?.[field];
  const isLineValue = isOddLineValue(record, field);
  const movement = getOddMovement(value, previousValue);

  return `
    <span class="odd-history-value ${isLineValue ? "is-line-value" : ""}">
      <span class="odd-value-number">${escapeHtml(formatOddDisplayValue(value, record, field))}</span>
      ${renderOddMovement(movement)}
    </span>
  `;
}

function renderOddMovement(movement) {
  const symbol = movement === "up" ? "↑" : movement === "down" ? "↓" : "";
  return `<span class="odd-movement ${movement ? `is-${movement}` : ""}" aria-hidden="true">${symbol}</span>`;
}

function getOddMovement(value, previousValue) {
  const current = normalizeOddValue(value);
  const previous = normalizeOddValue(previousValue);

  if (current === null || previous === null || current === previous) {
    return "";
  }

  return current > previous ? "up" : "down";
}

function isOddLineValue(record, field) {
  return field === "betDraw" && normalizeOddMarketType(record.marketType, record.marketName) !== "result";
}

function formatOddDisplayValue(value, record, field) {
  const marketType = normalizeOddMarketType(record.marketType, record.marketName);
  const numberValue = normalizeOddValue(value);

  if (marketType === "result" && field === "betDraw" && numberValue === 0) {
    return "-";
  }

  const formattedValue = formatOddValue(numberValue);

  if (marketType === "handicap" && field === "betDraw" && numberValue > 0) {
    return `+${formattedValue}`;
  }

  return formattedValue;
}

function renderLeagueMappingSummary(league) {
  return `
    <div class="mapping-stack">
      ${renderMappingLine("Fonbet", league.fonbetLeagueName, league.fonbetLeagueId, league.fonbetLeagueUrl)}
      ${renderMappingLine("1xBet", league.xbetLeagueName, league.xbetLeagueId, league.xbetLeagueUrl)}
      ${renderMappingLine("Pinnacle", league.pinnacleLeagueName, league.pinnacleLeagueId, league.pinnacleLeagueUrl)}
    </div>
  `;
}

function renderMappingLine(providerLabel, leagueName, leagueId, leagueUrl) {
  const name = leagueName || "-";
  const id = leagueId || "-";
  const url = normalizeProviderUrl(leagueUrl);

  return `
    <span>
      <b>${providerLabel}</b>
      <small>${escapeHtml(name)}</small>
      <em>${escapeHtml(id)}</em>
      ${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">URL</a>` : "<i>-</i>"}
    </span>
  `;
}

function renderMemberRows(rows = getFilteredMembers().rows) {
  if (rows.length === 0) {
    return renderEmptyRow(4, "표시할 회원이 없습니다.");
  }

  return rows
    .map((member) => `
      <tr>
        <td>${escapeHtml(member.loginId)}</td>
        <td><strong>${escapeHtml(member.nickname)}</strong></td>
        <td>${renderToggleSwitch("사용여부", normalizeStatus(member.status) === "active", "data-member-status-toggle", member.id, { canManage: canManageMembers() })}</td>
        <td>
          <button class="edit-button" data-edit-member="${escapeHtml(member.id)}" type="button" ${canManageMembers() ? "" : "disabled"} title="수정">
            <span class="edit-icon"></span>
            수정
          </button>
        </td>
      </tr>
    `)
    .join("");
}

function renderToggleSwitch(label, checked, dataAttribute, id, options = {}) {
  const canManage = options.canManage ?? canManageMasterData();
  const disabled = options.disabled ?? state.saving;

  return `
    <label class="switch-control" title="${label}">
      <input ${dataAttribute}="${escapeHtml(id)}" type="checkbox" ${checked ? "checked" : ""} ${canManage && !disabled ? "" : "disabled"} />
      <span></span>
      <em>${checked ? "ON" : "OFF"}</em>
    </label>
  `;
}

function renderEmptyRow(colspan, text) {
  return `
    <tr>
      <td class="empty-cell" colspan="${colspan}">${text}</td>
    </tr>
  `;
}

function renderModal() {
  if (state.modal === "addSport") {
    return renderSportFormModal({
      title: "종목추가",
      submitLabel: "저장",
      mode: "add",
      sport: createEmptySport(),
    });
  }

  if (state.modal === "editSport" && state.editingSport) {
    return renderSportFormModal({
      title: "종목수정",
      submitLabel: "수정",
      mode: "edit",
      sport: state.editingSport,
    });
  }

  if (state.modal === "addCountry") {
    return renderCountryFormModal({
      title: "국가추가",
      submitLabel: "저장",
      mode: "add",
      country: createEmptyCountry(),
    });
  }

  if (state.modal === "editCountry" && state.editingCountry) {
    return renderCountryFormModal({
      title: "국가수정",
      submitLabel: "수정",
      mode: "edit",
      country: state.editingCountry,
    });
  }

  if (state.modal === "addLeague") {
    return renderLeagueFormModal({
      title: "리그추가",
      submitLabel: "저장",
      mode: "add",
      league: createEmptyLeague(),
    });
  }

  if (state.modal === "editLeague" && state.editingLeague) {
    return renderLeagueFormModal({
      title: "리그수정",
      submitLabel: "수정",
      mode: "edit",
      league: state.editingLeague,
    });
  }

  if (state.modal === "gameOddsHistory") {
    const game = state.games.find((item) => item.id === state.selectedGameId);

    if (game) {
      return renderGameOddsHistoryModal(game);
    }
  }

  if (state.modal === "gameOddHistoryDetail") {
    const game = state.games.find((item) => item.id === state.selectedGameId);
    const group = getSelectedGameOddGroupById(state.selectedOddGroupId);

    if (game && group) {
      return `${renderGameOddsHistoryModal(game)}${renderOddHistoryModal(group, { nested: true })}`;
    }
  }

  if (state.modal === "alertOddHistory") {
    const alert = state.alerts.find((item) => item.id === state.selectedAlertId);

    if (alert) {
      return renderAlertOddHistoryModal(alert);
    }
  }

  if (state.modal === "oddHistory") {
    const group = getOddGroupById(state.selectedOddGroupId);

    if (group) {
      return renderOddHistoryModal(group);
    }
  }

  if (state.modal === "confirmSettingsPassword" && state.pendingSettings) {
    return renderSettingsPasswordModal();
  }

  if (state.modal === "add") {
    return renderMemberFormModal({
      title: "회원추가",
      submitLabel: "저장",
      mode: "add",
      member: {
        loginId: "",
        nickname: "",
        status: "active",
      },
    });
  }

  if (state.modal === "edit" && state.editingMember) {
    return renderMemberFormModal({
      title: "회원수정",
      submitLabel: "수정",
      mode: "edit",
      member: state.editingMember,
    });
  }

  return "";
}

function renderOddHistoryModal(group, options = {}) {
  const latest = group.records[0];
  const homeTeam = getTeamDisplayName(latest.homeTeam, latest.leagueId, latest.leagueName);
  const awayTeam = getTeamDisplayName(latest.awayTeam, latest.leagueId, latest.leagueName);
  const nested = options.nested === true;
  const backdropAttribute = nested ? "data-game-odd-history-backdrop" : "data-modal-backdrop";
  const closeAttribute = nested ? "data-close-game-odd-history" : "data-close-modal";

  return `
    <div class="modal-backdrop ${nested ? "nested-modal-backdrop" : ""}" ${backdropAttribute}>
      <div class="modal-card odds-history-modal" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="history-title">
            <strong>배당 히스토리</strong>
            <span>${escapeHtml(homeTeam)} vs ${escapeHtml(awayTeam)} · ${escapeHtml(getOddMarketTitle(latest))}</span>
          </div>
          <button class="icon-button" ${closeAttribute} type="button" title="닫기">×</button>
        </div>

        <div class="history-table-wrap">${renderOddHistoryTable(group.records)}</div>
      </div>
    </div>
  `;
}

function renderAlertOddHistoryModal(alert) {
  const group = getSelectedGameOddGroupById(state.selectedOddGroupId);

  if (group) {
    return renderOddHistoryModal(group);
  }

  const homeTeam = getTeamDisplayName(alert.homeTeam, alert.leagueId, alert.leagueName);
  const awayTeam = getTeamDisplayName(alert.awayTeam, alert.leagueId, alert.leagueName);
  let message = "해당 마켓의 저장된 배당 이력이 없습니다.";

  if (state.selectedGameOddsLoading) {
    message = "해당 마켓의 배당 이력을 불러오는 중입니다.";
  } else if (state.selectedGameOddsError) {
    message = state.selectedGameOddsError;
  }

  return `
    <div class="modal-backdrop" data-modal-backdrop>
      <div class="modal-card odds-history-modal" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="history-title">
            <strong>배당 히스토리</strong>
            <span>${escapeHtml(homeTeam)} vs ${escapeHtml(awayTeam)} · ${escapeHtml(getOddMarketTitle(alert))}</span>
          </div>
          <button class="icon-button" data-close-modal type="button" title="닫기">×</button>
        </div>
        <div class="game-history-empty ${state.selectedGameOddsError ? "is-error" : ""}">${escapeHtml(message)}</div>
      </div>
    </div>
  `;
}

function renderGameOddsHistoryModal(game) {
  const groups = groupOddRecords(state.selectedGameOdds).sort(compareGameOddGroups);
  const homeTeam = getTeamDisplayName(game.homeTeam, game.leagueId, game.leagueName);
  const awayTeam = getTeamDisplayName(game.awayTeam, game.leagueId, game.leagueName);
  let content = '<div class="game-history-empty">저장된 배당 이력이 없습니다.</div>';

  if (state.selectedGameOddsLoading) {
    content = '<div class="game-history-empty">배당 이력을 불러오는 중입니다.</div>';
  } else if (state.selectedGameOddsError) {
    content = `<div class="game-history-empty is-error">${escapeHtml(state.selectedGameOddsError)}</div>`;
  } else if (groups.length > 0) {
    content = ["result", "handicap", "total"]
      .map((marketType) => renderGameLatestOddsSection(game, marketType, groups.filter((group) => (
        normalizeOddMarketType(group.records[0]?.marketType, group.records[0]?.marketName) === marketType
      ))))
      .join("");
  }

  return `
    <div class="modal-backdrop" data-modal-backdrop>
      <div class="modal-card game-odds-history-modal" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="history-title">
            <strong>경기 최종 배당</strong>
            <span>${escapeHtml(homeTeam)} vs ${escapeHtml(awayTeam)} · ${escapeHtml(game.leagueName)} · ${getGameStatusLabel(normalizeGameStatus(game.status, game.gameTime))}</span>
          </div>
          <button class="icon-button" data-close-modal type="button" title="닫기">×</button>
        </div>
        <div class="game-history-content">${content}</div>
      </div>
    </div>
  `;
}

function renderGameLatestOddsSection(game, marketType, groups) {
  const sectionLabel = getGameMarketSectionLabel(game, marketType, groups);

  if (groups.length === 0) {
    return `
      <section class="game-history-market">
        <div class="game-history-market-title">
          <strong>${escapeHtml(sectionLabel)}</strong>
        </div>
        <div class="game-market-empty">저장된 최종 배당이 없습니다.</div>
      </section>
    `;
  }

  const labels = getOddMarketColumnLabels(groups[0].records[0]);

  return `
    <section class="game-history-market">
      <div class="game-history-market-title">
        <strong>${escapeHtml(sectionLabel)}</strong>
        <span>${groups.length}개 마켓</span>
      </div>
      <div class="history-table-wrap">
        <table class="data-table game-latest-odds-table">
          <thead>
            <tr>
              <th>마켓</th>
              <th>${escapeHtml(labels.home)}</th>
              <th>${escapeHtml(labels.middle)}</th>
              <th>${escapeHtml(labels.away)}</th>
              <th>최종 변경</th>
            </tr>
          </thead>
          <tbody>
            ${groups.map((group) => {
              const latest = group.records[0];
              const previous = group.records[1];
              return `
                <tr
                  class="game-latest-odd-row"
                  data-game-odd-history="${escapeHtml(group.id)}"
                  tabindex="0"
                  title="배당 히스토리"
                >
                  <td><strong class="market-name-badge market-${marketType}">${escapeHtml(getOddMarketTitle(latest))}</strong></td>
                  <td>${renderOddHistoryValue(latest, "betHome", previous)}</td>
                  <td>${renderOddHistoryValue(latest, "betDraw", previous)}</td>
                  <td>${renderOddHistoryValue(latest, "betAway", previous)}</td>
                  <td>${escapeHtml(formatDate(latest.changedAt))}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function getGameMarketSectionLabel(game, marketType, groups) {
  if (marketType === "handicap") {
    return "핸디캡";
  }

  if (marketType === "total") {
    return "오버언더";
  }

  const hasDrawOdds = groups.some((group) => normalizeOddValue(group.records[0]?.betDraw) > 0);
  return hasDrawOdds || normalizeText(game.sport).includes("축구") ? "승무패" : "승패";
}

function renderOddHistoryTable(records) {
  const labels = getOddMarketColumnLabels(records[0]);

  return `
    <table class="data-table history-table">
      <colgroup>
        <col class="history-time-column" />
        <col class="history-odd-column" />
        <col class="history-odd-column" />
        <col class="history-odd-column" />
      </colgroup>
      <thead>
        <tr>
          <th>변경시간</th>
          <th>${escapeHtml(labels.home)}</th>
          <th>${escapeHtml(labels.middle)}</th>
          <th>${escapeHtml(labels.away)}</th>
        </tr>
      </thead>
      <tbody>
        ${records.map((record, index) => `
          <tr>
            <td>${escapeHtml(formatDate(record.changedAt))}</td>
            <td>${renderOddHistoryValue(record, "betHome", records[index + 1])}</td>
            <td>${renderOddHistoryValue(record, "betDraw", records[index + 1])}</td>
            <td>${renderOddHistoryValue(record, "betAway", records[index + 1])}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function getOddMarketColumnLabels(record = {}) {
  const marketType = normalizeOddMarketType(record.marketType, record.marketName);

  if (marketType === "total") {
    return { home: "오버", middle: "기준점", away: "언더" };
  }

  if (marketType === "handicap") {
    return { home: "홈", middle: "기준점", away: "원정" };
  }

  return { home: "승", middle: "무", away: "패" };
}

function getOddMarketTitle(record = {}) {
  const marketType = normalizeOddMarketType(record.marketType, record.marketName);

  if (marketType === "result") {
    return record.marketName || "승패";
  }

  const lineValue = normalizeOddValue(record.lineValue ?? record.betDraw);
  const formattedLine = marketType === "handicap" && lineValue > 0
    ? `+${formatOddValue(lineValue)}`
    : formatOddValue(lineValue);

  return `${record.marketName} · 기준 ${formattedLine}`;
}

function compareGameOddGroups(left, right) {
  const leftRecord = left.records[0] || {};
  const rightRecord = right.records[0] || {};
  const marketOrder = { result: 0, handicap: 1, total: 2 };
  const leftType = normalizeOddMarketType(leftRecord.marketType, leftRecord.marketName);
  const rightType = normalizeOddMarketType(rightRecord.marketType, rightRecord.marketName);
  const typeDiff = (marketOrder[leftType] ?? 9) - (marketOrder[rightType] ?? 9);

  if (typeDiff !== 0) {
    return typeDiff;
  }

  const leftLine = normalizeOddValue(leftRecord.lineValue ?? leftRecord.betDraw);
  const rightLine = normalizeOddValue(rightRecord.lineValue ?? rightRecord.betDraw);
  const lineDiff = leftLine - rightLine;

  if (Number.isFinite(lineDiff) && lineDiff !== 0) {
    return leftType === "total" ? -lineDiff : lineDiff;
  }

  return getDateValue(rightRecord.changedAt) - getDateValue(leftRecord.changedAt);
}

function renderSettingsPasswordModal() {
  const enabled = normalizeAppSettings(state.pendingSettings).oddsUpdaterEnabled;

  return `
    <div class="modal-backdrop" data-modal-backdrop>
      <form class="modal-card settings-password-modal" data-settings-password-form>
        <div class="modal-header">
          <strong>설정 변경 확인</strong>
          <button class="icon-button" data-close-modal type="button" title="닫기">×</button>
        </div>

        <div class="modal-grid settings-password-grid">
          <label>
            <span>변경값</span>
            <input value="서버 자동 수집 ${enabled ? "ON" : "OFF"}" readonly />
          </label>
          <label>
            <span>현재 비밀번호</span>
            <input name="password" type="password" autocomplete="current-password" required />
          </label>
        </div>

        <div class="modal-actions">
          <button class="ghost-action" data-close-modal type="button">취소</button>
          <button class="primary-action" type="submit" ${state.saving ? "disabled" : ""}>
            ${state.saving ? "처리 중" : "변경"}
          </button>
        </div>
      </form>
    </div>
  `;
}

function renderSportFormModal({ title, submitLabel, mode, sport }) {
  return `
    <div class="modal-backdrop" data-modal-backdrop>
      <form class="modal-card sport-modal" data-sport-form="${mode}">
        <div class="modal-header">
          <strong>${title}</strong>
          <button class="icon-button" data-close-modal type="button" title="닫기">×</button>
        </div>

        <div class="modal-grid sport-modal-grid">
          <label>
            <span>종목명</span>
            <input name="sportName" value="${escapeHtml(sport.sportName)}" placeholder="축구" required />
          </label>
          <label>
            <span>순서</span>
            <input name="sortOrder" type="number" min="1" step="1" value="${escapeHtml(getSportDisplayOrder(sport))}" required />
          </label>
          <label>
            <span>사용여부</span>
            <select name="enabled">
              <option value="true" ${selected(String(sport.enabled), "true")}>사용</option>
              <option value="false" ${selected(String(sport.enabled), "false")}>중지</option>
            </select>
          </label>
        </div>

        <div class="modal-actions">
          <button class="ghost-action" data-close-modal type="button">취소</button>
          <button class="primary-action" type="submit" ${state.saving ? "disabled" : ""}>
            ${state.saving ? "처리 중" : submitLabel}
          </button>
        </div>
      </form>
    </div>
  `;
}

function renderCountryFormModal({ title, submitLabel, mode, country }) {
  return `
    <div class="modal-backdrop" data-modal-backdrop>
      <form class="modal-card country-modal" data-country-form="${mode}">
        <div class="modal-header">
          <strong>${title}</strong>
          <button class="icon-button" data-close-modal type="button" title="닫기">×</button>
        </div>

        <div class="modal-grid country-modal-grid">
          <label>
            <span>국가명</span>
            <input name="countryName" value="${escapeHtml(country.countryName)}" placeholder="대한민국" required />
          </label>
          <label>
            <span>순서</span>
            <input name="sortOrder" type="number" min="1" step="1" value="${escapeHtml(getCountryDisplayOrder(country))}" required />
          </label>
          <label>
            <span>사용여부</span>
            <select name="enabled">
              <option value="true" ${selected(String(country.enabled), "true")}>사용</option>
              <option value="false" ${selected(String(country.enabled), "false")}>중지</option>
            </select>
          </label>
        </div>

        <div class="modal-actions">
          <button class="ghost-action" data-close-modal type="button">취소</button>
          <button class="primary-action" type="submit" ${state.saving ? "disabled" : ""}>
            ${state.saving ? "처리 중" : submitLabel}
          </button>
        </div>
      </form>
    </div>
  `;
}

function renderLeagueFormModal({ title, submitLabel, mode, league }) {
  return `
    <div class="modal-backdrop" data-modal-backdrop>
      <form class="modal-card league-modal" data-league-form="${mode}">
        <div class="modal-header">
          <strong>${title}</strong>
          <button class="icon-button" data-close-modal type="button" title="닫기">×</button>
        </div>

        <div class="modal-grid league-modal-grid">
          ${renderLeagueSportField(league)}
          ${renderLeagueCountryField(league)}
          <label>
            <span>리그명</span>
            <input name="leagueName" value="${escapeHtml(league.leagueName)}" placeholder="K League 1" required />
          </label>
          <label>
            <span>tournament</span>
            <input name="tournament" value="${escapeHtml(league.tournament)}" placeholder="Pombet URL 입력 시 자동" />
          </label>

          <div class="provider-fields">
            ${renderProviderUrlField("1xBet URL", "xbet", league)}
            ${renderProviderUrlField("Pombet URL", "fonbet", league)}
            ${renderProviderUrlField("Pinnacle URL", "pinnacle", league)}
          </div>
        </div>

        <div class="modal-actions">
          <button class="ghost-action" data-close-modal type="button">취소</button>
          <button class="primary-action" type="submit" ${state.saving ? "disabled" : ""}>
            ${state.saving ? "처리 중" : submitLabel}
          </button>
        </div>
      </form>
    </div>
  `;
}

function renderLeagueSportField(league) {
  const enabledSports = getEnabledSports();
  const currentSport = String(league.sport ?? "").trim();

  if (enabledSports.length === 0) {
    return `
      <label>
        <span>종목</span>
        <input name="sport" value="${escapeHtml(currentSport)}" list="sport-options" placeholder="축구" required />
      </label>
      <datalist id="sport-options">
        ${sportOptions.map((sport) => `<option value="${escapeHtml(sport)}"></option>`).join("")}
      </datalist>
    `;
  }

  const sports = currentSport && !enabledSports.includes(currentSport)
    ? [...enabledSports, currentSport]
    : enabledSports;

  return `
    <label>
      <span>종목</span>
      <select name="sport" required>
        <option value="">종목 선택</option>
        ${sports.map((sport) => `<option value="${escapeHtml(sport)}" ${selected(currentSport, sport)}>${escapeHtml(sport)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderLeagueCountryField(league) {
  const enabledCountries = getEnabledCountries();
  const currentCountry = String(league.country ?? "").trim();

  if (enabledCountries.length === 0) {
    return `
      <label>
        <span>국가</span>
        <input name="country" value="${escapeHtml(currentCountry)}" list="country-options" placeholder="대한민국" required />
      </label>
      <datalist id="country-options">
        ${getLeagueCountryOptions().map((country) => `<option value="${escapeHtml(country)}"></option>`).join("")}
      </datalist>
    `;
  }

  const countries = currentCountry && !enabledCountries.some((country) => country.countryName === currentCountry)
    ? [...enabledCountries, { id: normalizeCountryId(currentCountry), countryName: currentCountry, enabled: true }]
    : enabledCountries;

  return `
    <label>
      <span>국가</span>
      <select name="country" required>
        <option value="">국가 선택</option>
        ${countries.map((country) => `<option value="${escapeHtml(country.countryName)}" ${selected(currentCountry, country.countryName)}>${escapeHtml(country.countryName)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderProviderUrlField(label, key, league) {
  return `
    <div class="provider-field-group">
      <label>
        <span>${label}</span>
        <input name="${key}LeagueUrl" value="${escapeHtml(league[`${key}LeagueUrl`])}" placeholder="${label} 리그 URL" />
      </label>
    </div>
  `;
}

function renderMemberFormModal({ title, submitLabel, mode, member }) {
  const isAdd = mode === "add";

  return `
    <div class="modal-backdrop" data-modal-backdrop>
      <form class="modal-card" data-member-form="${mode}">
        <div class="modal-header">
          <strong>${title}</strong>
          <button class="icon-button" data-close-modal type="button" title="닫기">×</button>
        </div>

        <div class="modal-grid">
          <label>
            <span>아이디</span>
            <input name="loginId" value="${escapeHtml(member.loginId)}" ${isAdd ? "" : "readonly"} required />
          </label>
          ${isAdd ? `
            <label>
              <span>비밀번호</span>
              <input name="password" type="password" minlength="6" autocomplete="new-password" required />
            </label>
          ` : `
            <label>
              <span>새 비밀번호</span>
              <input name="password" type="password" minlength="6" autocomplete="new-password" placeholder="변경할 때만 입력" />
            </label>
            <label>
              <span>비밀번호 확인</span>
              <input name="passwordConfirm" type="password" minlength="6" autocomplete="new-password" placeholder="새 비밀번호 다시 입력" />
            </label>
          `}
          <label>
            <span>닉네임</span>
            <input name="nickname" value="${escapeHtml(member.nickname)}" />
          </label>
          <label>
            <span>상태</span>
            <select name="status">
              ${statusOptions.map((status) => `<option value="${status.value}" ${selected(normalizeStatus(member.status), status.value)}>${status.label}</option>`).join("")}
            </select>
          </label>
        </div>

        <div class="modal-actions">
          <button class="ghost-action" data-close-modal type="button">취소</button>
          <button class="primary-action" type="submit" ${state.saving ? "disabled" : ""}>
            ${state.saving ? "처리 중" : submitLabel}
          </button>
        </div>
      </form>
    </div>
  `;
}

function syncToasts() {
  if (state.error) {
    pushToast("error", state.error);
    state.error = "";
  }

  if (state.message) {
    pushToast("success", state.message);
    state.message = "";
  }
}

function pushToast(type, message) {
  const text = String(message ?? "").trim();

  if (!text) {
    return;
  }

  const id = `toast-${++toastId}`;
  const nextToasts = [...state.toasts, { id, type, message: text }].slice(-4);
  const nextToastIds = new Set(nextToasts.map((toast) => toast.id));

  state.toasts
    .filter((toast) => !nextToastIds.has(toast.id))
    .forEach((toast) => {
      window.clearTimeout(toastTimers.get(toast.id));
      toastTimers.delete(toast.id);
    });

  state.toasts = nextToasts;
  toastTimers.set(id, window.setTimeout(() => removeToast(id), toastDurationMs));
}

function removeToast(id) {
  const nextToasts = state.toasts.filter((toast) => toast.id !== id);

  if (nextToasts.length === state.toasts.length) {
    toastTimers.delete(id);
    return;
  }

  state.toasts = nextToasts;
  window.clearTimeout(toastTimers.get(id));
  toastTimers.delete(id);
  render();
}

function renderToastStack() {
  if (state.toasts.length === 0) {
    return "";
  }

  return `
    <div class="toast-stack" aria-live="polite" aria-atomic="true">
      ${state.toasts.map((toast) => `
        <p class="toast ${toast.type}" role="${toast.type === "error" ? "alert" : "status"}">
          ${escapeHtml(toast.message)}
        </p>
      `).join("")}
    </div>
  `;
}

function bindLoginEvents() {
  document.querySelector("[data-auth-form]")?.addEventListener("submit", handleAuthSubmit);
}

function bindAdminEvents() {
  bindSidebarOrderEvents();

  document.querySelector("[data-alert-sound-toggle]")?.addEventListener("change", (event) => {
    handleAlertSoundToggle(event.currentTarget.checked);
  });

  document.querySelector("[data-open-alerts]")?.addEventListener("click", () => {
    unlockAlertAudio();
    window.location.hash = "#/alerts";
  });

  document.querySelector("[data-sidebar-toggle]")?.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 900px)").matches) {
      state.navOpen = !state.navOpen;
    } else {
      state.navCollapsed = !state.navCollapsed;
    }

    render();
  });

  document.querySelectorAll("[data-sign-out]").forEach((button) => {
    button.addEventListener("click", handleSignOut);
  });

  document.querySelector("[data-status-filter]")?.addEventListener("change", (event) => {
    state.filters.status = event.currentTarget.value;
    state.filters.page = 1;
    updateMembersView();
  });

  document.querySelector("[data-search-input]")?.addEventListener("input", (event) => {
    state.filters.query = event.currentTarget.value;
    state.filters.page = 1;
    updateMembersView();
  });

  document.querySelector("[data-page-size]")?.addEventListener("change", (event) => {
    state.filters.pageSize = Number(event.currentTarget.value);
    state.filters.page = 1;
    updateMembersView();
  });

  document.querySelector("[data-page-prev]")?.addEventListener("click", () => {
    state.filters.page = Math.max(1, state.filters.page - 1);
    updateMembersView();
  });

  document.querySelector("[data-page-next]")?.addEventListener("click", () => {
    const result = getFilteredMembers();
    state.filters.page = Math.min(result.totalPages, state.filters.page + 1);
    updateMembersView();
  });

  document.querySelector("[data-add-member]")?.addEventListener("click", () => {
    state.modal = "add";
    state.error = "";
    render();
  });

  document.querySelector("[data-sport-enabled-filter]")?.addEventListener("change", (event) => {
    state.sportFilters.enabled = event.currentTarget.value;
    state.sportFilters.page = 1;
    updateSportsView();
  });

  document.querySelector("[data-sport-search-input]")?.addEventListener("input", (event) => {
    state.sportFilters.query = event.currentTarget.value;
    state.sportFilters.page = 1;
    updateSportsView();
  });

  document.querySelector("[data-sport-page-size]")?.addEventListener("change", (event) => {
    state.sportFilters.pageSize = Number(event.currentTarget.value);
    state.sportFilters.page = 1;
    updateSportsView();
  });

  document.querySelector("[data-sport-page-prev]")?.addEventListener("click", () => {
    state.sportFilters.page = Math.max(1, state.sportFilters.page - 1);
    updateSportsView();
  });

  document.querySelector("[data-sport-page-next]")?.addEventListener("click", () => {
    const result = getFilteredSports();
    state.sportFilters.page = Math.min(result.totalPages, state.sportFilters.page + 1);
    updateSportsView();
  });

  document.querySelector("[data-add-sport]")?.addEventListener("click", () => {
    state.modal = "addSport";
    state.editingSport = null;
    state.error = "";
    render();
  });

  document.querySelector("[data-country-enabled-filter]")?.addEventListener("change", (event) => {
    state.countryFilters.enabled = event.currentTarget.value;
    state.countryFilters.page = 1;
    updateCountriesView();
  });

  document.querySelector("[data-country-search-input]")?.addEventListener("input", (event) => {
    state.countryFilters.query = event.currentTarget.value;
    state.countryFilters.page = 1;
    updateCountriesView();
  });

  document.querySelector("[data-country-page-size]")?.addEventListener("change", (event) => {
    state.countryFilters.pageSize = Number(event.currentTarget.value);
    state.countryFilters.page = 1;
    updateCountriesView();
  });

  document.querySelector("[data-country-page-prev]")?.addEventListener("click", () => {
    state.countryFilters.page = Math.max(1, state.countryFilters.page - 1);
    updateCountriesView();
  });

  document.querySelector("[data-country-page-next]")?.addEventListener("click", () => {
    const result = getFilteredCountries();
    state.countryFilters.page = Math.min(result.totalPages, state.countryFilters.page + 1);
    updateCountriesView();
  });

  document.querySelector("[data-add-country]")?.addEventListener("click", () => {
    state.modal = "addCountry";
    state.editingCountry = null;
    state.error = "";
    render();
  });

  document.querySelector("[data-league-sport-filter]")?.addEventListener("change", (event) => {
    state.leagueFilters.sport = event.currentTarget.value;
    state.leagueFilters.page = 1;
    updateLeaguesView();
  });

  document.querySelector("[data-league-provider-filter]")?.addEventListener("change", (event) => {
    state.leagueFilters.provider = event.currentTarget.value;
    state.leagueFilters.page = 1;
    updateLeaguesView();
  });

  document.querySelector("[data-league-enabled-filter]")?.addEventListener("change", (event) => {
    state.leagueFilters.enabled = event.currentTarget.value;
    state.leagueFilters.page = 1;
    updateLeaguesView();
  });

  document.querySelector("[data-league-search-input]")?.addEventListener("input", (event) => {
    state.leagueFilters.query = event.currentTarget.value;
    state.leagueFilters.page = 1;
    updateLeaguesView();
  });

  document.querySelector("[data-league-page-size]")?.addEventListener("change", (event) => {
    state.leagueFilters.pageSize = Number(event.currentTarget.value);
    state.leagueFilters.page = 1;
    updateLeaguesView();
  });

  document.querySelector("[data-league-page-prev]")?.addEventListener("click", () => {
    state.leagueFilters.page = Math.max(1, state.leagueFilters.page - 1);
    updateLeaguesView();
  });

  document.querySelector("[data-league-page-next]")?.addEventListener("click", () => {
    const result = getFilteredLeagues();
    state.leagueFilters.page = Math.min(result.totalPages, state.leagueFilters.page + 1);
    updateLeaguesView();
  });

  document.querySelector("[data-add-league]")?.addEventListener("click", () => {
    state.modal = "addLeague";
    state.editingLeague = null;
    state.error = "";
    render();
  });

  document.querySelector("[data-add-kleague-sample]")?.addEventListener("click", handleAddKLeagueSample);

  document.querySelector("[data-team-sport-filter]")?.addEventListener("change", (event) => {
    state.teamFilters.sport = event.currentTarget.value;
    const leagues = getTeamLeagueOptions(state.teamFilters.sport);

    if (!leagues.some((league) => league.id === state.teamFilters.league)) {
      state.teamFilters.league = "all";
    }

    state.teamFilters.page = 1;
    render();
  });

  document.querySelector("[data-team-league-filter]")?.addEventListener("change", (event) => {
    state.teamFilters.league = event.currentTarget.value;
    state.teamFilters.page = 1;
    updateTeamsView();
  });

  document.querySelector("[data-team-search-input]")?.addEventListener("input", (event) => {
    state.teamFilters.query = event.currentTarget.value;
    state.teamFilters.page = 1;
    updateTeamsView();
  });

  document.querySelector("[data-team-page-size]")?.addEventListener("change", (event) => {
    state.teamFilters.pageSize = Number(event.currentTarget.value);
    state.teamFilters.page = 1;
    updateTeamsView();
  });

  document.querySelector("[data-team-page-prev]")?.addEventListener("click", () => {
    state.teamFilters.page = Math.max(1, state.teamFilters.page - 1);
    updateTeamsView();
  });

  document.querySelector("[data-team-page-next]")?.addEventListener("click", () => {
    const result = getFilteredTeams();
    state.teamFilters.page = Math.min(result.totalPages, state.teamFilters.page + 1);
    updateTeamsView();
  });

  document.querySelector("[data-save-all-teams]")?.addEventListener("click", handleSaveAllTeamDisplayNames);

  document.querySelector("[data-game-date-from-filter]")?.addEventListener("change", (event) => {
    state.gameFilters.dateFrom = event.currentTarget.value;

    if (state.gameFilters.dateTo && state.gameFilters.dateFrom > state.gameFilters.dateTo) {
      state.gameFilters.dateTo = state.gameFilters.dateFrom;
    }

    state.gameFilters.page = 1;
    render();
  });

  document.querySelector("[data-game-date-to-filter]")?.addEventListener("change", (event) => {
    state.gameFilters.dateTo = event.currentTarget.value;

    if (state.gameFilters.dateFrom && state.gameFilters.dateTo && state.gameFilters.dateTo < state.gameFilters.dateFrom) {
      state.gameFilters.dateFrom = state.gameFilters.dateTo;
    }

    state.gameFilters.page = 1;
    render();
  });

  document.querySelector("[data-game-sport-filter]")?.addEventListener("change", (event) => {
    state.gameFilters.sport = event.currentTarget.value;
    const countries = getGameCountryOptions(state.gameFilters.sport);

    if (!countries.includes(state.gameFilters.country)) {
      state.gameFilters.country = "all";
    }

    state.gameFilters.page = 1;
    render();
  });

  document.querySelector("[data-game-country-filter]")?.addEventListener("change", (event) => {
    state.gameFilters.country = event.currentTarget.value;
    state.gameFilters.page = 1;
    updateGamesView();
  });

  document.querySelector("[data-game-status-filter]")?.addEventListener("change", (event) => {
    state.gameFilters.status = event.currentTarget.value;
    state.gameFilters.page = 1;
    updateGamesView();
  });

  document.querySelector("[data-game-enabled-filter]")?.addEventListener("change", (event) => {
    state.gameFilters.enabled = event.currentTarget.value;
    state.gameFilters.page = 1;
    updateGamesView();
  });

  document.querySelector("[data-game-search-input]")?.addEventListener("input", (event) => {
    state.gameFilters.query = event.currentTarget.value;
    state.gameFilters.page = 1;
    updateGamesView();
  });

  document.querySelector("[data-game-page-size]")?.addEventListener("change", (event) => {
    state.gameFilters.pageSize = Number(event.currentTarget.value);
    state.gameFilters.page = 1;
    updateGamesView();
  });

  document.querySelector("[data-game-page-prev]")?.addEventListener("click", () => {
    state.gameFilters.page = Math.max(1, state.gameFilters.page - 1);
    updateGamesView();
  });

  document.querySelector("[data-game-page-next]")?.addEventListener("click", () => {
    const result = getFilteredGames();
    state.gameFilters.page = Math.min(result.totalPages, state.gameFilters.page + 1);
    updateGamesView();
  });

  document.querySelector("[data-import-games]")?.addEventListener("click", () => {
    handleImportGames();
  });

  document.querySelector("[data-odd-sport-filter]")?.addEventListener("change", (event) => {
    state.oddFilters.sport = event.currentTarget.value;
    const leagues = getOddLeagueOptions(state.oddFilters.sport);

    if (!leagues.includes(state.oddFilters.league)) {
      state.oddFilters.league = "all";
    }

    state.oddFilters.page = 1;
    render();
  });

  document.querySelector("[data-odd-league-filter]")?.addEventListener("change", (event) => {
    state.oddFilters.league = event.currentTarget.value;
    state.oddFilters.page = 1;
    updateOddsView();
  });

  document.querySelector("[data-odd-market-filter]")?.addEventListener("change", (event) => {
    state.oddFilters.market = event.currentTarget.value;
    state.oddFilters.page = 1;
    updateOddsView();
  });

  document.querySelector("[data-odd-search-input]")?.addEventListener("input", (event) => {
    state.oddFilters.query = event.currentTarget.value;
    state.oddFilters.page = 1;
    updateOddsView();
  });

  document.querySelector("[data-odd-page-size]")?.addEventListener("change", (event) => {
    state.oddFilters.pageSize = Number(event.currentTarget.value);
    state.oddFilters.page = 1;
    updateOddsView();
  });

  document.querySelector("[data-odd-page-prev]")?.addEventListener("click", () => {
    state.oddFilters.page = Math.max(1, state.oddFilters.page - 1);
    updateOddsView();
  });

  document.querySelector("[data-odd-page-next]")?.addEventListener("click", () => {
    const result = getFilteredOdds();
    state.oddFilters.page = Math.min(result.totalPages, state.oddFilters.page + 1);
    updateOddsView();
  });

  document.querySelectorAll("[data-odd-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const field = button.dataset.oddSort;

      if (state.oddFilters.sortField === field) {
        state.oddFilters.sortDirection = state.oddFilters.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.oddFilters.sortField = field;
        state.oddFilters.sortDirection = "asc";
      }

      state.oddFilters.page = 1;
      render();
    });
  });

  document.querySelector("[data-alert-sport-filter]")?.addEventListener("change", (event) => {
    state.alertFilters.sport = event.currentTarget.value;
    const leagues = getAlertLeagueOptions(state.alertFilters.sport);

    if (state.alertFilters.league !== "all" && !leagues.includes(state.alertFilters.league)) {
      state.alertFilters.league = "all";
    }

    state.alertFilters.page = 1;
    render();
  });

  document.querySelector("[data-alert-league-filter]")?.addEventListener("change", (event) => {
    state.alertFilters.league = event.currentTarget.value;
    state.alertFilters.page = 1;
    updateAlertsView();
  });

  document.querySelector("[data-alert-market-filter]")?.addEventListener("change", (event) => {
    state.alertFilters.market = event.currentTarget.value;
    state.alertFilters.page = 1;
    updateAlertsView();
  });

  document.querySelector("[data-alert-status-filter]")?.addEventListener("change", (event) => {
    state.alertFilters.status = event.currentTarget.value;
    state.alertFilters.page = 1;
    updateAlertsView();
  });

  document.querySelector("[data-alert-search-input]")?.addEventListener("input", (event) => {
    state.alertFilters.query = event.currentTarget.value;
    state.alertFilters.page = 1;
    updateAlertsView();
  });

  document.querySelector("[data-alert-page-size]")?.addEventListener("change", (event) => {
    state.alertFilters.pageSize = Number(event.currentTarget.value);
    state.alertFilters.page = 1;
    updateAlertsView();
  });

  document.querySelector("[data-alert-page-prev]")?.addEventListener("click", () => {
    state.alertFilters.page = Math.max(1, state.alertFilters.page - 1);
    updateAlertsView();
  });

  document.querySelector("[data-alert-page-next]")?.addEventListener("click", () => {
    const result = getFilteredAlerts();
    state.alertFilters.page = Math.min(result.totalPages, state.alertFilters.page + 1);
    updateAlertsView();
  });

  document.querySelector("[data-acknowledge-all-alerts]")?.addEventListener("click", handleAcknowledgeAllAlerts);

  document.querySelector("[data-settings-odds-updater-toggle]")?.addEventListener("change", (event) => {
    openSettingsPasswordConfirm({
      oddsUpdaterEnabled: event.currentTarget.checked,
    });
  });

  bindMemberRowEvents();
  bindSportRowEvents();
  bindCountryRowEvents();
  bindMarketRowEvents();
  bindLeagueRowEvents();
  bindTeamRowEvents();
  bindGameRowEvents();
  bindOddRowEvents();
  bindAlertRowEvents();

  document.querySelectorAll("[data-close-modal], [data-modal-backdrop]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target !== element && element.hasAttribute("data-modal-backdrop")) {
        return;
      }

      state.modal = null;
      state.editingMember = null;
      state.editingSport = null;
      state.editingCountry = null;
      state.editingLeague = null;
      state.selectedOddGroupId = "";
      state.selectedAlertId = "";
      state.selectedGameId = "";
      state.selectedGameOdds = [];
      state.selectedGameOddsLoading = false;
      state.selectedGameOddsError = "";
      state.pendingSettings = null;
      render();
    });
  });

  document.querySelectorAll("[data-close-game-odd-history], [data-game-odd-history-backdrop]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target !== element && element.hasAttribute("data-game-odd-history-backdrop")) {
        return;
      }

      state.modal = "gameOddsHistory";
      state.selectedOddGroupId = "";
      render();
    });
  });

  document.querySelector("[data-member-form='add']")?.addEventListener("submit", handleAddMember);
  document.querySelector("[data-member-form='edit']")?.addEventListener("submit", handleEditMember);
  document.querySelector("[data-sport-form='add']")?.addEventListener("submit", handleAddSport);
  document.querySelector("[data-sport-form='edit']")?.addEventListener("submit", handleEditSport);
  document.querySelector("[data-country-form='add']")?.addEventListener("submit", handleAddCountry);
  document.querySelector("[data-country-form='edit']")?.addEventListener("submit", handleEditCountry);
  document.querySelector("[data-league-form='add']")?.addEventListener("submit", handleAddLeague);
  document.querySelector("[data-league-form='edit']")?.addEventListener("submit", handleEditLeague);
  document.querySelector("[data-settings-password-form]")?.addEventListener("submit", handleConfirmSettingsPassword);
}

function bindMemberRowEvents() {
  document.querySelectorAll("[data-member-status-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      handleUpdateMemberInline(input.dataset.memberStatusToggle, {
        status: input.checked ? "active" : "inactive",
      });
    });
  });

  document.querySelectorAll("[data-edit-member]").forEach((button) => {
    button.addEventListener("click", () => {
      const member = state.members.find((item) => item.id === button.dataset.editMember);

      if (!member) {
        return;
      }

      state.editingMember = member;
      state.modal = "edit";
      state.error = "";
      render();
    });
  });
}

function bindSidebarOrderEvents() {
  const items = [...document.querySelectorAll("[data-sidebar-item]")];
  let draggedHash = "";

  const clearDragState = () => {
    items.forEach((item) => item.classList.remove("is-dragging", "drag-before", "drag-after"));
  };

  items.forEach((item) => {
    item.addEventListener("dragstart", (event) => {
      draggedHash = item.dataset.sidebarItem || "";
      item.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedHash);
    });

    item.addEventListener("dragover", (event) => {
      if (!draggedHash || draggedHash === item.dataset.sidebarItem) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      items.forEach((candidate) => candidate.classList.remove("drag-before", "drag-after"));

      const bounds = item.getBoundingClientRect();
      const position = event.clientY < bounds.top + (bounds.height / 2) ? "drag-before" : "drag-after";
      item.classList.add(position);
    });

    item.addEventListener("drop", (event) => {
      event.preventDefault();
      const targetHash = item.dataset.sidebarItem || "";
      const placeAfter = item.classList.contains("drag-after");

      if (draggedHash && targetHash && draggedHash !== targetHash) {
        moveSidebarItem(draggedHash, targetHash, placeAfter);
      }

      clearDragState();
    });

    item.addEventListener("dragend", clearDragState);
  });
}

function moveSidebarItem(draggedHash, targetHash, placeAfter) {
  const order = getOrderedSidebarItems().map((item) => item.hash);
  const draggedIndex = order.indexOf(draggedHash);

  if (draggedIndex < 0) {
    return;
  }

  order.splice(draggedIndex, 1);
  const targetIndex = order.indexOf(targetHash);

  if (targetIndex < 0) {
    return;
  }

  order.splice(targetIndex + (placeAfter ? 1 : 0), 0, draggedHash);
  state.sidebarOrder = order;
  saveSidebarOrder(order);
  render();
}

function bindSportRowEvents() {
  document.querySelectorAll("[data-sport-enabled-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      handleUpdateSportInline(input.dataset.sportEnabledToggle, {
        enabled: input.checked,
      });
    });
  });

  document.querySelectorAll("[data-move-sport-up]").forEach((button) => {
    button.addEventListener("click", () => {
      const sport = state.sports.find((item) => item.id === button.dataset.moveSportUp);

      if (!sport) {
        return;
      }

      handleMoveSport(sport, -1);
    });
  });

  document.querySelectorAll("[data-move-sport-down]").forEach((button) => {
    button.addEventListener("click", () => {
      const sport = state.sports.find((item) => item.id === button.dataset.moveSportDown);

      if (!sport) {
        return;
      }

      handleMoveSport(sport, 1);
    });
  });

  document.querySelectorAll("[data-edit-sport]").forEach((button) => {
    button.addEventListener("click", () => {
      const sport = state.sports.find((item) => item.id === button.dataset.editSport);

      if (!sport) {
        return;
      }

      state.editingSport = sport;
      state.modal = "editSport";
      state.error = "";
      render();
    });
  });

  document.querySelectorAll("[data-delete-sport]").forEach((button) => {
    button.addEventListener("click", () => {
      const sport = state.sports.find((item) => item.id === button.dataset.deleteSport);

      if (!sport) {
        return;
      }

      handleDeleteSport(sport);
    });
  });
}

function bindCountryRowEvents() {
  document.querySelectorAll("[data-country-enabled-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      handleUpdateCountryInline(input.dataset.countryEnabledToggle, {
        enabled: input.checked,
      });
    });
  });

  document.querySelectorAll("[data-move-country-up]").forEach((button) => {
    button.addEventListener("click", () => {
      const country = state.countries.find((item) => item.id === button.dataset.moveCountryUp);

      if (!country) {
        return;
      }

      handleMoveCountry(country, -1);
    });
  });

  document.querySelectorAll("[data-move-country-down]").forEach((button) => {
    button.addEventListener("click", () => {
      const country = state.countries.find((item) => item.id === button.dataset.moveCountryDown);

      if (!country) {
        return;
      }

      handleMoveCountry(country, 1);
    });
  });

  document.querySelectorAll("[data-edit-country]").forEach((button) => {
    button.addEventListener("click", () => {
      const country = state.countries.find((item) => item.id === button.dataset.editCountry);

      if (!country) {
        return;
      }

      state.editingCountry = country;
      state.modal = "editCountry";
      state.error = "";
      render();
    });
  });

  document.querySelectorAll("[data-delete-country]").forEach((button) => {
    button.addEventListener("click", () => {
      const country = state.countries.find((item) => item.id === button.dataset.deleteCountry);

      if (!country) {
        return;
      }

      handleDeleteCountry(country);
    });
  });
}

function bindMarketRowEvents() {
  document.querySelectorAll("[data-market-enabled-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      handleUpdateMarketInline(input.dataset.marketEnabledToggle, {
        enabled: input.checked,
      });
    });
  });

  document.querySelectorAll("[data-market-alert-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      handleUpdateMarketInline(input.dataset.marketAlertToggle, {
        alertEnabled: input.checked,
      });
    });
  });
}

function bindLeagueRowEvents() {
  document.querySelectorAll("[data-league-odds-input]").forEach((input) => {
    input.addEventListener("change", () => {
      handleUpdateLeagueInline(input.dataset.leagueOddsInput, {
        oddsThreshold: input.value,
      });
    });
  });

  document.querySelectorAll("[data-league-interval-input]").forEach((input) => {
    input.addEventListener("change", () => {
      handleUpdateLeagueInline(input.dataset.leagueIntervalInput, {
        intervalSeconds: input.value,
      });
    });
  });

  document.querySelectorAll("[data-league-provider-select]").forEach((selectElement) => {
    selectElement.addEventListener("change", () => {
      handleUpdateLeagueInline(selectElement.dataset.leagueProviderSelect, {
        provider: selectElement.value,
      });
    });
  });

  document.querySelectorAll("[data-league-enabled-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      handleUpdateLeagueInline(input.dataset.leagueEnabledToggle, {
        enabled: input.checked,
      });
    });
  });

  document.querySelectorAll("[data-league-alert-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      handleUpdateLeagueInline(input.dataset.leagueAlertToggle, {
        alertEnabled: input.checked,
      });
    });
  });

  document.querySelectorAll("[data-edit-league]").forEach((button) => {
    button.addEventListener("click", () => {
      const league = state.leagues.find((item) => item.id === button.dataset.editLeague);

      if (!league) {
        return;
      }

      state.editingLeague = league;
      state.modal = "editLeague";
      state.error = "";
      render();
    });
  });

  document.querySelectorAll("[data-delete-league]").forEach((button) => {
    button.addEventListener("click", () => {
      const league = state.leagues.find((item) => item.id === button.dataset.deleteLeague);

      if (!league) {
        return;
      }

      handleDeleteLeague(league);
    });
  });
}

function bindTeamRowEvents() {
  document.querySelectorAll("[data-team-display-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const teamId = input.dataset.teamDisplayInput;
      const team = state.teams.find((item) => item.id === teamId);

      if (!team) {
        return;
      }

      const displayName = String(input.value || "").trim() || team.sourceName;

      if (displayName === team.displayName) {
        delete state.teamDrafts[teamId];
      } else {
        state.teamDrafts[teamId] = displayName;
      }

      syncTeamBulkSaveButton();
    });

    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      input.blur();
    });
  });
}

function syncTeamBulkSaveButton() {
  const button = document.querySelector("[data-save-all-teams]");

  if (!button) {
    return;
  }

  const draftCount = Object.keys(state.teamDrafts).length;
  button.disabled = state.teamBulkSaving || draftCount === 0;
  button.textContent = state.teamBulkSaving
    ? "저장 중"
    : `일괄수정${draftCount > 0 ? ` (${draftCount})` : ""}`;
}

async function handleSaveAllTeamDisplayNames() {
  const entries = Object.entries(state.teamDrafts);

  if (!db || state.teamBulkSaving || entries.length === 0) {
    return;
  }

  state.teamBulkSaving = true;
  state.teamError = "";
  render();

  let savedCount = 0;

  try {
    for (let start = 0; start < entries.length; start += 450) {
      const chunk = entries.slice(start, start + 450);
      const batch = db.batch();

      chunk.forEach(([teamId, displayName]) => {
        batch.set(db.collection("team").doc(teamId), {
          displayName,
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      });

      await batch.commit();

      chunk.forEach(([teamId, displayName]) => {
        const team = state.teams.find((item) => item.id === teamId);

        if (team) {
          team.displayName = displayName;
        }

        delete state.teamDrafts[teamId];
        savedCount += 1;
      });
    }

    state.message = `팀 표기명 ${savedCount}건을 일괄 수정했습니다.`;
  } catch (error) {
    state.teamError = error?.code?.includes("permission-denied")
      ? "팀 표기명 수정 권한이 없습니다. Firestore 규칙을 배포해주세요."
      : toFriendlyError(error);
  } finally {
    state.teamBulkSaving = false;
    render();
  }
}

async function handleOpenGameOddsHistory(gameId, fallbackGame = null) {
  let game = state.games.find((item) => item.id === gameId);

  if (!game && fallbackGame) {
    game = normalizeGame({
      ...fallbackGame,
      id: gameId,
      enabled: true,
    });
    state.games = [...state.games, game];
  }

  if (!game || !db) {
    return;
  }

  state.selectedGameId = gameId;
  state.selectedGameOdds = [];
  state.selectedGameOddsLoading = true;
  state.selectedGameOddsError = "";
  state.modal = "gameOddsHistory";
  render();

  try {
    const records = await loadGameOddRecords(gameId);

    if (state.selectedGameId !== gameId) {
      return;
    }

    state.selectedGameOdds = records;
  } catch (error) {
    if (state.selectedGameId === gameId) {
      state.selectedGameOddsError = toFriendlyError(error);
    }
  } finally {
    if (state.selectedGameId === gameId) {
      state.selectedGameOddsLoading = false;
      render();
    }
  }
}

async function loadGameOddRecords(gameId) {
  const snapshot = await db.collection("odd").where("gameId", "==", gameId).limit(2000).get();

  return snapshot.docs
    .map((doc) => normalizeOddRecord({ id: doc.id, ...doc.data() }))
    .filter((record) => record.changedAt && record.marketName)
    .sort(compareOddRecords);
}

async function handleOpenAlertOddHistory(alertId) {
  const alert = state.alerts.find((item) => item.id === alertId);

  if (!alert || !db) {
    return;
  }

  state.selectedAlertId = alert.id;
  state.selectedGameId = alert.gameId;
  state.selectedOddGroupId = "";
  state.selectedGameOdds = [];
  state.selectedGameOddsLoading = true;
  state.selectedGameOddsError = "";
  state.modal = "alertOddHistory";
  render();

  try {
    const records = await loadGameOddRecords(alert.gameId);

    if (state.selectedAlertId !== alert.id || state.modal !== "alertOddHistory") {
      return;
    }

    state.selectedGameOdds = records;
    const group = findAlertOddGroup(alert, records);
    state.selectedOddGroupId = group?.id ?? "";

    if (!group) {
      state.selectedGameOddsError = "해당 마켓과 기준점의 배당 이력을 찾지 못했습니다.";
    }
  } catch (error) {
    if (state.selectedAlertId === alert.id && state.modal === "alertOddHistory") {
      state.selectedGameOddsError = toFriendlyError(error);
    }
  } finally {
    if (state.selectedAlertId === alert.id && state.modal === "alertOddHistory") {
      state.selectedGameOddsLoading = false;
      render();
    }
  }
}

function findAlertOddGroup(alert, records) {
  const groups = groupOddRecords(records);
  const exactGroupId = getOddGroupId(alert);
  const exactGroup = groups.find((group) => group.id === exactGroupId);

  if (exactGroup) {
    return exactGroup;
  }

  const targetMarketType = normalizeOddMarketType(alert.marketType, alert.marketName);
  const targetProvider = normalizeText(alert.provider);
  const targetMarketName = normalizeText(alert.marketName);
  const targetLine = normalizeOddValue(alert.lineValue ?? alert.currentBetDraw);

  return groups.find((group) => {
    const latest = group.records[0];

    if (!latest || normalizeOddMarketType(latest.marketType, latest.marketName) !== targetMarketType) {
      return false;
    }

    if (targetProvider && normalizeText(latest.provider) !== targetProvider) {
      return false;
    }

    if (targetMarketType !== "result") {
      return normalizeOddValue(latest.lineValue ?? latest.betDraw) === targetLine;
    }

    return normalizeText(latest.marketName) === targetMarketName;
  }) ?? null;
}

function bindGameRowEvents() {
  document.querySelectorAll("[data-game-history]").forEach((row) => {
    const openHistory = () => handleOpenGameOddsHistory(row.dataset.gameHistory);

    row.addEventListener("click", (event) => {
      if (event.target.closest("button, input, select, label, a")) {
        return;
      }

      openHistory();
    });

    row.addEventListener("keydown", (event) => {
      if (event.target !== row || !["Enter", " "].includes(event.key)) {
        return;
      }

      event.preventDefault();
      openHistory();
    });
  });

  document.querySelectorAll("[data-game-enabled-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      handleUpdateGameInline(input.dataset.gameEnabledToggle, {
        enabled: input.checked,
      });
    });
  });

  document.querySelectorAll("[data-game-odd-history]").forEach((row) => {
    const openHistory = () => {
      state.selectedOddGroupId = row.dataset.gameOddHistory;
      state.modal = "gameOddHistoryDetail";
      render();
    };

    row.addEventListener("click", openHistory);
    row.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) {
        return;
      }

      event.preventDefault();
      openHistory();
    });
  });
}

function bindOddRowEvents() {
  document.querySelectorAll("[data-odd-history]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedOddGroupId = button.dataset.oddHistory;
      state.modal = "oddHistory";
      state.error = "";
      render();
    });
  });
}

function bindAlertRowEvents() {
  document.querySelectorAll("[data-alert-market-history]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      handleOpenAlertOddHistory(button.dataset.alertMarketHistory);
    });
  });

  document.querySelectorAll("[data-alert-game-history]").forEach((row) => {
    const openHistory = () => {
      const alert = state.alerts.find((item) => item.id === row.dataset.alertId);

      if (!alert) {
        return;
      }

      handleOpenGameOddsHistory(row.dataset.alertGameHistory, {
        gameTime: alert.gameTime,
        sport: alert.sport,
        country: alert.country,
        leagueId: alert.leagueId,
        leagueName: alert.leagueName,
        provider: alert.provider,
        homeTeam: alert.homeTeam,
        awayTeam: alert.awayTeam,
      });
    };

    row.addEventListener("click", (event) => {
      if (event.target.closest("button, input, select, label, a")) {
        return;
      }

      openHistory();
    });

    row.addEventListener("keydown", (event) => {
      if (event.target !== row || !["Enter", " "].includes(event.key)) {
        return;
      }

      event.preventDefault();
      openHistory();
    });
  });

  document.querySelectorAll("[data-acknowledge-alert]").forEach((button) => {
    button.addEventListener("click", () => handleAcknowledgeAlert(button.dataset.acknowledgeAlert));
  });
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  unlockAlertAudio();

  const formData = new FormData(event.currentTarget);
  const loginId = String(formData.get("loginId") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  state.loading = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await handleLogin(loginId, password);
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.loading = false;
    render();
  }
}

async function handleLogin(loginId, password) {
  const normalizedLoginId = normalizeLoginId(loginId);

  if (!normalizedLoginId || !password || !auth) {
    throw new Error("아이디와 비밀번호를 입력해주세요.");
  }

  const result = await requestAdminLogin(normalizedLoginId, password);
  await auth.signInWithCustomToken(result.token);
  const profile = normalizeMember(result.profile);

  startSession(profile);
  ensureRoute();
  await hydrateActivePage();
}

async function handleAddMember(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const loginId = normalizeLoginId(formData.get("loginId"));
  const password = String(formData.get("password") ?? "");

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await createMemberRecord({
      loginId,
      password,
      nickname: String(formData.get("nickname") ?? "").trim(),
      status: normalizeStatus(formData.get("status")),
    });

    state.modal = null;
    state.message = "회원이 추가되었습니다.";
    await loadMembers();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleEditMember(event) {
  event.preventDefault();

  if (!canManageMembers() || !state.editingMember) {
    state.error = "회원을 수정하려면 로그인이 필요합니다.";
    render();
    return;
  }

  const formData = new FormData(event.currentTarget);
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if ((password || passwordConfirm) && password.length < 6) {
    state.error = "새 비밀번호는 6자 이상으로 입력해주세요.";
    render();
    return;
  }

  if (password !== passwordConfirm) {
    state.error = "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.";
    render();
    return;
  }

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await updateMemberProfile(state.editingMember.id, {
      nickname: String(formData.get("nickname") ?? "").trim(),
      status: normalizeStatus(formData.get("status")),
      password,
    });

    state.modal = null;
    state.editingMember = null;
    state.message = password
      ? "회원 정보와 비밀번호가 수정되었습니다."
      : "회원 정보가 수정되었습니다.";
    await loadMembers();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleUpdateMemberInline(memberId, data) {
  if (!canManageMembers()) {
    state.error = "회원 사용 여부를 변경하려면 로그인이 필요합니다.";
    render();
    return;
  }

  try {
    await updateMemberInlineFields(memberId, data);
    updateMembersView();
  } catch (error) {
    state.error = toFriendlyError(error);
    render();
  }
}

async function handleAddSport(event) {
  event.preventDefault();

  if (!canManageMasterData()) {
    state.error = "종목을 추가하려면 로그인이 필요합니다.";
    render();
    return;
  }

  const formData = new FormData(event.currentTarget);

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await createSportRecord(getSportFormData(formData));
    state.modal = null;
    state.message = "종목이 추가되었습니다.";
    await loadSports();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleEditSport(event) {
  event.preventDefault();

  if (!canManageMasterData() || !state.editingSport) {
    state.error = "종목을 수정하려면 로그인이 필요합니다.";
    render();
    return;
  }

  const formData = new FormData(event.currentTarget);

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await updateSportRecord(state.editingSport.id, getSportFormData(formData));
    state.modal = null;
    state.editingSport = null;
    state.message = "종목 정보가 수정되었습니다.";
    await loadSports();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleDeleteSport(sport) {
  if (!canManageMasterData()) {
    state.error = "종목을 삭제하려면 로그인이 필요합니다.";
    render();
    return;
  }

  if (!window.confirm(`${sport.sportName} 종목을 삭제할까요?`)) {
    return;
  }

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await deleteSportRecord(sport.id);
    state.message = "종목이 삭제되었습니다.";
    await loadSports();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleMoveSport(sport, direction) {
  if (!canManageMasterData()) {
    state.error = "종목 순서를 변경하려면 로그인이 필요합니다.";
    render();
    return;
  }

  const orderedSports = getOrderedSports();
  const currentIndex = orderedSports.findIndex((item) => item.id === sport.id);
  const targetIndex = currentIndex + direction;

  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedSports.length) {
    return;
  }

  const nextSports = [...orderedSports];
  [nextSports[currentIndex], nextSports[targetIndex]] = [nextSports[targetIndex], nextSports[currentIndex]];

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await saveSportOrder(nextSports);
    state.message = "종목 순서가 변경되었습니다.";
    await loadSports();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleUpdateSportInline(sportId, data) {
  if (!canManageMasterData()) {
    state.error = "종목 사용 여부를 변경하려면 로그인이 필요합니다.";
    render();
    return;
  }

  try {
    await updateSportInlineFields(sportId, data);
    updateSportsView();
  } catch (error) {
    state.error = toFriendlyError(error);
    render();
  }
}

async function handleAddCountry(event) {
  event.preventDefault();

  if (!canManageMasterData()) {
    state.error = "국가를 추가하려면 로그인이 필요합니다.";
    render();
    return;
  }

  const formData = new FormData(event.currentTarget);

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await createCountryRecord(getCountryFormData(formData));
    state.modal = null;
    state.message = "국가가 추가되었습니다.";
    await loadCountries();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleEditCountry(event) {
  event.preventDefault();

  if (!canManageMasterData() || !state.editingCountry) {
    state.error = "국가를 수정하려면 로그인이 필요합니다.";
    render();
    return;
  }

  const formData = new FormData(event.currentTarget);

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await updateCountryRecord(state.editingCountry.id, getCountryFormData(formData));
    state.modal = null;
    state.editingCountry = null;
    state.message = "국가 정보가 수정되었습니다.";
    await loadCountries();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleDeleteCountry(country) {
  if (!canManageMasterData()) {
    state.error = "국가를 삭제하려면 로그인이 필요합니다.";
    render();
    return;
  }

  if (!window.confirm(`${country.countryName} 국가를 삭제할까요?`)) {
    return;
  }

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await deleteCountryRecord(country.id);
    state.message = "국가가 삭제되었습니다.";
    await loadCountries();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleMoveCountry(country, direction) {
  if (!canManageMasterData()) {
    state.error = "국가 순서를 변경하려면 로그인이 필요합니다.";
    render();
    return;
  }

  const orderedCountries = getOrderedCountries();
  const currentIndex = orderedCountries.findIndex((item) => item.id === country.id);
  const targetIndex = currentIndex + direction;

  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedCountries.length) {
    return;
  }

  const nextCountries = [...orderedCountries];
  [nextCountries[currentIndex], nextCountries[targetIndex]] = [nextCountries[targetIndex], nextCountries[currentIndex]];

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await saveCountryOrder(nextCountries);
    state.message = "국가 순서가 변경되었습니다.";
    await loadCountries();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleUpdateCountryInline(countryId, data) {
  if (!canManageMasterData()) {
    state.error = "국가 사용 여부를 변경하려면 로그인이 필요합니다.";
    render();
    return;
  }

  try {
    await updateCountryInlineFields(countryId, data);
    updateCountriesView();
  } catch (error) {
    state.error = toFriendlyError(error);
    render();
  }
}

async function handleAddKLeagueSample() {
  if (!canManageMasterData()) {
    state.error = "K리그 샘플을 등록하려면 로그인이 필요합니다.";
    render();
    return;
  }

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await upsertKLeagueSampleRecord();
    state.message = "K리그 샘플이 등록되었습니다.";
    await loadSports();
    await loadLeagues();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleAddLeague(event) {
  event.preventDefault();

  if (!canManageMasterData()) {
    state.error = "리그를 추가하려면 로그인이 필요합니다.";
    render();
    return;
  }

  const formData = new FormData(event.currentTarget);

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    const leagueId = await createLeagueRecord(getLeagueFormData(formData));
    state.modal = null;
    await loadLeagues();
    const importStatus = await importLeagueAfterSave(leagueId);
    state.message = importStatus.message
      ? `리그가 추가되었습니다. ${importStatus.message}`
      : "리그가 추가되었습니다.";
    state.error = importStatus.error;
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleEditLeague(event) {
  event.preventDefault();

  if (!canManageMasterData() || !state.editingLeague) {
    state.error = "리그를 수정하려면 로그인이 필요합니다.";
    render();
    return;
  }

  const formData = new FormData(event.currentTarget);

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    const leagueId = await updateLeagueRecord(state.editingLeague.id, {
      ...state.editingLeague,
      ...getLeagueFormData(formData),
    });
    state.modal = null;
    state.editingLeague = null;
    await loadLeagues();
    const importStatus = await importLeagueAfterSave(leagueId);
    state.message = importStatus.message
      ? `리그 정보가 수정되었습니다. ${importStatus.message}`
      : "리그 정보가 수정되었습니다.";
    state.error = importStatus.error;
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleDeleteLeague(league) {
  if (!canManageMasterData()) {
    state.error = "리그를 삭제하려면 로그인이 필요합니다.";
    render();
    return;
  }

  if (!window.confirm(`${league.leagueName} 리그를 삭제할까요?`)) {
    return;
  }

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await deleteLeagueRecord(league.id);
    state.message = "리그가 삭제되었습니다.";
    await loadLeagues();
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function handleUpdateMarketInline(marketId, data) {
  if (!canManageMasterData()) {
    state.marketError = "마켓 설정을 변경하려면 로그인이 필요합니다.";
    render();
    return;
  }

  const market = state.markets.find((item) => item.id === marketId);

  if (!market) {
    return;
  }

  state.marketSaving = true;
  state.marketError = "";
  updateSportsView();

  try {
    await updateMarketInlineFields(marketId, data);
    state.message = "마켓 설정이 변경되었습니다.";
  } catch (error) {
    state.marketError = toFriendlyError(error);
  } finally {
    state.marketSaving = false;
    render();
  }
}

async function handleUpdateLeagueInline(leagueId, data) {
  if (!canManageMasterData()) {
    state.error = "리그 설정을 변경하려면 로그인이 필요합니다.";
    render();
    return;
  }

  try {
    await updateLeagueInlineFields(leagueId, data);
    updateLeaguesView();
  } catch (error) {
    state.error = toFriendlyError(error);
    render();
  }
}

async function handleImportGames() {
  if (!canManageMasterData()) {
    state.error = "경기를 가져오려면 로그인이 필요합니다.";
    render();
    return;
  }

  await importGamesFromEnabledLeagues();
}

async function handleUpdateGameInline(gameId, data) {
  if (!canManageMasterData()) {
    state.error = "경기 정보를 변경하려면 로그인이 필요합니다.";
    render();
    return;
  }

  try {
    await updateGameInlineFields(gameId, data);
    updateGamesView();
  } catch (error) {
    state.error = toFriendlyError(error);
    render();
  }
}

function openSettingsPasswordConfirm(data) {
  if (!canManageMasterData()) {
    state.error = "설정을 변경하려면 로그인이 필요합니다.";
    render();
    return;
  }

  state.pendingSettings = normalizeAppSettings({
    ...state.settings,
    ...data,
  });
  state.modal = "confirmSettingsPassword";
  state.error = "";
  render();
}

async function handleConfirmSettingsPassword(event) {
  event.preventDefault();

  if (!state.pendingSettings) {
    state.modal = null;
    render();
    return;
  }

  const formData = new FormData(event.currentTarget);
  const password = String(formData.get("password") ?? "");

  state.saving = true;
  state.error = "";
  state.message = "";
  render();

  try {
    await updateSettingsInlineFields(state.pendingSettings, password);
    state.modal = null;
    state.pendingSettings = null;
    state.message = "설정이 변경되었습니다.";
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.saving = false;
    render();
  }
}

async function restoreSession() {
  if (!auth || !db) {
    return;
  }

  state.loading = true;
  render();

  try {
    const authUser = await waitForAuthState();

    if (!authUser) {
      clearSession();
      return;
    }

    const tokenResult = await authUser.getIdTokenResult();

    if (tokenResult.claims.admin !== true) {
      await auth.signOut();
      clearSession();
      return;
    }

    const session = readSession();
    const loginId = normalizeLoginId(tokenResult.claims.loginId || session?.loginId);
    const profile = await getMemberByLoginId(loginId);

    if (!profile) {
      await auth.signOut();
      clearSession();
      return;
    }

    if (normalizeStatus(profile.status) !== "active") {
      await auth.signOut();
      clearSession();
      state.error = "사용 중지된 계정입니다. 관리자에게 문의해주세요.";
      return;
    }

    startSession(profile, { persist: false });
    ensureRoute();
    await hydrateActivePage();
  } catch (error) {
    clearSession();
    state.error = toFriendlyError(error);
  } finally {
    state.loading = false;
    render();
  }
}

function waitForAuthState() {
  return new Promise((resolve, reject) => {
    let unsubscribe = null;
    unsubscribe = auth.onAuthStateChanged(
      (user) => {
        unsubscribe?.();
        resolve(user);
      },
      (error) => {
        unsubscribe?.();
        reject(error);
      },
    );
  });
}

async function hydrateActivePage() {
  if (!state.user) {
    return;
  }

  if (
    getActiveHash() === "#/sports"
    && !state.sportLoading
    && !state.marketLoading
    && (!state.sportLoaded || !state.marketLoaded)
  ) {
    if (!state.sportLoaded) {
      await loadSports();
    }

    if (state.sportLoaded && !state.marketLoaded) {
      await loadMarkets();
    }

    render();
    return;
  }

  if (getActiveHash() === "#/countries" && !state.countryLoading && !state.countryLoaded) {
    await loadCountries();
    render();
    return;
  }

  if (
    getActiveHash() === "#/leagues"
    && !state.leagueLoading
    && (!state.sportLoaded || !state.countryLoaded || !state.leagueLoaded)
  ) {
    const preloadErrors = [];

    if (!state.sportLoading && !state.sportLoaded) {
      await loadSports();

      if (state.error) {
        preloadErrors.push(state.error);
      }
    }

    if (!state.countryLoading && !state.countryLoaded) {
      await loadCountries();

      if (state.error) {
        preloadErrors.push(state.error);
      }
    }

    await loadLeagues();

    if (!state.error && preloadErrors.length > 0) {
      state.error = preloadErrors.at(-1);
    }

    render();
    return;
  }

  if (getActiveHash() === "#/games" && !state.gameLoading && !state.gameLoaded) {
    const preloadErrors = [];

    if (!state.leagueLoading && !state.leagueLoaded) {
      await loadLeagues();

      if (state.error) {
        preloadErrors.push(state.error);
      }
    }

    await loadGames();

    if (!state.error && preloadErrors.length > 0) {
      state.error = preloadErrors.at(-1);
    }

    render();

    return;
  }

  if (getActiveHash() === "#/odds" && !state.oddLoading && !state.oddLoaded) {
    await loadOdds();
    render();
    return;
  }

  if (getActiveHash() === "#/settings" && !state.settingLoading && !state.settingLoaded) {
    await loadSettings();
    render();
    return;
  }

  if (getActiveHash() === "#/members" && !state.memberLoading) {
    await loadMembers();
    render();
  }
}

function readSession() {
  try {
    return JSON.parse(window.localStorage.getItem(sessionKey) ?? "null");
  } catch {
    return null;
  }
}

function startSession(profile, options = {}) {
  const persist = options.persist !== false;
  const normalizedProfile = normalizeMember(profile);

  state.user = { loginId: normalizedProfile.loginId };
  state.profile = normalizedProfile;

  if (persist) {
    window.localStorage.setItem(sessionKey, JSON.stringify({ loginId: normalizedProfile.loginId }));
  }

  startAlertListener();
  startTeamListener();
}

function clearSession() {
  stopAlertListener();
  stopTeamListener();
  stopAlertSound();
  state.user = null;
  state.profile = null;
  state.members = [];
  state.sports = [];
  state.countries = [];
  state.leagues = [];
  state.markets = [];
  state.teams = [];
  state.games = [];
  state.odds = [];
  state.alerts = [];
  state.alertLoading = false;
  state.alertLoaded = false;
  state.alertSaving = false;
  state.alertError = "";
  state.teamLoading = false;
  state.teamLoaded = false;
  state.teamBulkSaving = false;
  state.teamDrafts = {};
  state.teamError = "";
  state.marketLoading = false;
  state.marketLoaded = false;
  state.marketSaving = false;
  state.marketError = "";
  state.selectedOddGroupId = "";
  state.selectedAlertId = "";
  state.selectedGameId = "";
  state.selectedGameOdds = [];
  state.selectedGameOddsLoading = false;
  state.selectedGameOddsError = "";
  state.settings = {
    oddsUpdaterEnabled: true,
  };
  state.sportLoaded = false;
  state.countryLoaded = false;
  state.leagueLoaded = false;
  state.gameLoaded = false;
  state.oddLoaded = false;
  state.settingLoaded = false;
  state.canListMembers = false;
  window.localStorage.removeItem(sessionKey);
}

function startAlertListener() {
  stopAlertListener();

  if (!state.user || !db) {
    return;
  }

  state.alertLoading = true;
  state.alertError = "";

  alertUnsubscribe = db.collection("alert")
    .orderBy("createdAt", "desc")
    .limit(500)
    .onSnapshot(
      (snapshot) => {
        state.alerts = snapshot.docs
          .map((doc) => normalizeAlert({ id: doc.id, ...doc.data() }))
          .sort(compareAlerts);
        state.alertLoading = false;
        state.alertLoaded = true;
        state.alertError = "";
        syncAlertSound();

        if (getActiveHash() === "#/alerts") {
          render();
        } else {
          updateAlertIndicators();
        }
      },
      (error) => {
        state.alertLoading = false;
        state.alertLoaded = false;
        state.alertError = error?.code?.includes("permission-denied")
          ? "Firestore 알림 읽기 권한이 없습니다. 보안 규칙을 배포해주세요."
          : toFriendlyError(error);

        if (getActiveHash() === "#/alerts") {
          render();
        }
      },
    );
}

function stopAlertListener() {
  if (typeof alertUnsubscribe === "function") {
    alertUnsubscribe();
  }

  alertUnsubscribe = null;
}

function startTeamListener() {
  stopTeamListener();

  if (!state.user || !db) {
    return;
  }

  state.teamLoading = true;
  state.teamError = "";

  teamUnsubscribe = db.collection("team")
    .limit(2000)
    .onSnapshot(
      (snapshot) => {
        state.teams = snapshot.docs
          .map((doc) => normalizeTeam({ id: doc.id, ...doc.data() }))
          .sort(compareTeams);
        state.teamLoading = false;
        state.teamLoaded = true;
        state.teamError = "";

        if (["#/teams", "#/games", "#/odds", "#/alerts"].includes(getActiveHash()) || state.modal) {
          render();
        }
      },
      (error) => {
        state.teamLoading = false;
        state.teamLoaded = false;
        state.teamError = error?.code?.includes("permission-denied")
          ? "Firestore 팀명 읽기 권한이 없습니다. 보안 규칙을 배포해주세요."
          : toFriendlyError(error);

        if (getActiveHash() === "#/teams") {
          render();
        }
      },
    );
}

function stopTeamListener() {
  if (typeof teamUnsubscribe === "function") {
    teamUnsubscribe();
  }

  teamUnsubscribe = null;
}

function handleAlertSoundToggle(enabled) {
  state.alertSoundEnabled = Boolean(enabled);
  saveAlertSoundEnabled(state.alertSoundEnabled);

  if (state.alertSoundEnabled) {
    unlockAlertAudio();
  } else {
    stopAlertSound();
  }

  pushToast("success", `알림음을 ${state.alertSoundEnabled ? "켰습니다" : "껐습니다"}.`);
  render();
}

function loadAlertSoundEnabled() {
  try {
    return window.localStorage.getItem(alertSoundEnabledKey) !== "false";
  } catch {
    return true;
  }
}

function saveAlertSoundEnabled(enabled) {
  try {
    window.localStorage.setItem(alertSoundEnabledKey, enabled ? "true" : "false");
  } catch {
    // Keep the current-page setting when browser storage is unavailable.
  }
}

function unlockAlertAudio() {
  if (!state.alertSoundEnabled) {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  if (!alertAudioContext) {
    alertAudioContext = new AudioContextClass();
  }

  if (alertAudioContext.state === "suspended") {
    alertAudioContext.resume().then(syncAlertSound).catch(() => {});
  } else {
    syncAlertSound();
  }
}

function syncAlertSound() {
  if (!state.alertSoundEnabled || !state.user || getUnreadAlertCount() === 0) {
    stopAlertSound();
    return;
  }

  if (alertSoundTimer !== null) {
    return;
  }

  playAlertTone();
  alertSoundTimer = window.setInterval(playAlertTone, 1800);
}

function stopAlertSound() {
  if (alertSoundTimer !== null) {
    window.clearInterval(alertSoundTimer);
    alertSoundTimer = null;
  }
}

function playAlertTone() {
  if (
    !state.alertSoundEnabled
    || !alertAudioContext
    || alertAudioContext.state !== "running"
    || getUnreadAlertCount() === 0
  ) {
    return;
  }

  const playPulse = (delay, frequency) => {
    const oscillator = alertAudioContext.createOscillator();
    const gain = alertAudioContext.createGain();
    const startAt = alertAudioContext.currentTime + delay;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.13, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.16);
    oscillator.connect(gain);
    gain.connect(alertAudioContext.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.18);
  };

  playPulse(0, 880);
  playPulse(0.23, 1040);
}

function updateAlertIndicators() {
  const unreadCount = getUnreadAlertCount();
  const button = document.querySelector("[data-open-alerts]");
  const badge = document.querySelector("[data-alert-count]");

  if (button) {
    button.classList.toggle("has-alerts", unreadCount > 0);
    button.title = "알림 리스트";
    button.setAttribute("aria-label", `알림 리스트${unreadCount > 0 ? `, 미확인 ${unreadCount}건` : ""}`);
  }

  if (badge) {
    badge.textContent = formatAlertBadgeCount(unreadCount);
    badge.classList.toggle("is-hidden", unreadCount === 0);
  }
}

async function handleAcknowledgeAlert(alertId) {
  const alert = state.alerts.find((item) => item.id === alertId);

  if (!alert || alert.acknowledged || !db || state.alertSaving) {
    return;
  }

  state.alertFilters.status = "all";
  state.alertSaving = true;
  render();

  try {
    await db.collection("alert").doc(alertId).set({
      acknowledged: true,
      acknowledgedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      acknowledgedBy: state.user?.loginId || "admin",
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    alert.acknowledged = true;
    alert.acknowledgedAt = new Date();
    state.alertFilters.status = "all";
    syncAlertSound();
    state.message = "알림을 확인했습니다.";
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.alertSaving = false;
    render();
  }
}

async function handleAcknowledgeAllAlerts() {
  const unreadAlerts = state.alerts.filter((alert) => !alert.acknowledged);

  if (unreadAlerts.length === 0 || !db || state.alertSaving) {
    return;
  }

  state.alertFilters.status = "all";
  state.alertSaving = true;
  render();

  try {
    for (let start = 0; start < unreadAlerts.length; start += 400) {
      const batch = db.batch();
      const chunk = unreadAlerts.slice(start, start + 400);

      chunk.forEach((alert) => {
        batch.set(db.collection("alert").doc(alert.id), {
          acknowledged: true,
          acknowledgedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
          acknowledgedBy: state.user?.loginId || "admin",
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      });

      await batch.commit();
    }

    const acknowledgedAt = new Date();
    unreadAlerts.forEach((alert) => {
      alert.acknowledged = true;
      alert.acknowledgedAt = acknowledgedAt;
    });
    state.alertFilters.status = "all";
    syncAlertSound();
    state.message = `${unreadAlerts.length}개 알림을 모두 확인했습니다.`;
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.alertSaving = false;
    render();
  }
}

async function getMemberByLoginId(loginId) {
  const normalizedLoginId = normalizeLoginId(loginId);

  if (!normalizedLoginId || !db) {
    return null;
  }

  const snapshot = await db.collection("user").doc(normalizedLoginId).get();

  if (!snapshot.exists) {
    return null;
  }

  return normalizeMember({
    id: snapshot.id,
    ...snapshot.data(),
  });
}

async function createMemberRecord(data) {
  if (!db) {
    throw new Error("Firebase 연결이 필요합니다.");
  }

  const loginId = normalizeLoginId(data.loginId);

  if (!loginId) {
    throw new Error("아이디를 입력해주세요.");
  }

  if (String(data.password ?? "").length < 6) {
    throw new Error("비밀번호는 6자 이상으로 입력해주세요.");
  }

  const userRef = db.collection("user").doc(loginId);
  const snapshot = await userRef.get();

  if (snapshot.exists) {
    throw new Error("이미 등록된 아이디입니다.");
  }

  const now = window.firebase.firestore.FieldValue.serverTimestamp();
  const passwordRecord = await createPasswordRecord(data.password);

  const payload = {
    loginId,
    nickname: normalizeNickname(data.nickname, loginId),
    status: normalizeStatus(data.status),
    ...passwordRecord,
    createdAt: now,
    updatedAt: now,
  };

  await userRef.set(payload);

  return normalizeMember({
    id: loginId,
    ...payload,
    createdAt: new Date(),
  });
}

async function updateMemberProfile(memberId, data) {
  if (!memberId || !db) {
    throw new Error("수정할 회원을 찾지 못했습니다.");
  }

  const payload = {
    nickname: normalizeNickname(data.nickname, memberId),
    status: normalizeStatus(data.status),
    level: window.firebase.firestore.FieldValue.delete(),
    role: window.firebase.firestore.FieldValue.delete(),
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  };
  const password = String(data.password ?? "");

  if (password) {
    if (password.length < 6) {
      throw new Error("새 비밀번호는 6자 이상으로 입력해주세요.");
    }

    Object.assign(payload, await createPasswordRecord(password));
  }

  await db.collection("user").doc(memberId).set(payload, { merge: true });
}

async function updateMemberInlineFields(memberId, data) {
  if (!memberId || !db) {
    throw new Error("수정할 회원을 찾지 못했습니다.");
  }

  const member = state.members.find((item) => item.id === memberId);
  const payload = {};

  if (hasOwn(data, "status")) {
    payload.status = normalizeStatus(data.status);
  }

  if (Object.keys(payload).length === 0) {
    return;
  }

  payload.updatedAt = window.firebase.firestore.FieldValue.serverTimestamp();

  await db.collection("user").doc(memberId).set(payload, { merge: true });

  if (member) {
    Object.assign(member, payload);
  }
}

async function loadMembers() {
  if (!state.user || !db) {
    state.members = [];
    return;
  }

  state.memberLoading = true;
  state.error = "";

  try {
    const snapshot = await db.collection("user").limit(300).get();
    state.members = snapshot.docs
      .map((doc) => normalizeMember({ id: doc.id, ...doc.data() }))
      .sort((left, right) => getDateValue(right.createdAt) - getDateValue(left.createdAt));
    state.canListMembers = true;
  } catch (error) {
    state.members = state.profile ? [state.profile] : [];
    state.canListMembers = false;

    if (error?.code?.includes("permission-denied")) {
      state.error = "Firestore 보안 규칙 때문에 회원 목록을 읽지 못했습니다. firestore.rules를 배포해주세요.";
    } else {
      state.error = toFriendlyError(error);
    }
  } finally {
    state.memberLoading = false;
  }
}

async function loadSports() {
  if (!state.user || !db) {
    state.sports = [];
    state.sportLoaded = false;
    return;
  }

  state.sportLoading = true;
  state.error = "";

  try {
    const snapshot = await db.collection("sport").limit(300).get();
    state.sports = snapshot.docs
      .map((doc) => normalizeSport({ id: doc.id, ...doc.data() }))
      .sort(compareSports);
    state.sportLoaded = true;
  } catch (error) {
    state.sports = [];
    state.sportLoaded = false;

    if (error?.code?.includes("permission-denied")) {
      state.error = "Firestore 접근 권한이 없습니다. sport 테이블 읽기/쓰기 규칙을 확인해주세요.";
    } else {
      state.error = toFriendlyError(error);
    }
  } finally {
    state.sportLoading = false;
  }
}

async function loadCountries() {
  if (!state.user || !db) {
    state.countries = [];
    state.countryLoaded = false;
    return;
  }

  state.countryLoading = true;
  state.error = "";

  try {
    const snapshot = await db.collection("country").limit(300).get();
    state.countries = snapshot.docs
      .map((doc) => normalizeCountry({ id: doc.id, ...doc.data() }))
      .sort(compareCountries);
    state.countryLoaded = true;
  } catch (error) {
    state.countries = [];
    state.countryLoaded = false;

    if (error?.code?.includes("permission-denied")) {
      state.error = "Firestore 접근 권한이 없습니다. country 테이블 읽기/쓰기 규칙을 확인해주세요.";
    } else {
      state.error = toFriendlyError(error);
    }
  } finally {
    state.countryLoading = false;
  }
}

async function loadMarkets() {
  if (!state.user || !db) {
    state.markets = [];
    state.marketLoaded = false;
    return;
  }

  state.marketLoading = true;
  state.marketError = "";

  try {
    const snapshot = await db.collection("market").limit(500).get();
    const storedMarkets = snapshot.docs.map((doc) => normalizeMarket({
      id: doc.id,
      persisted: true,
      ...doc.data(),
    }));

    state.markets = buildSportMarkets(state.sports, storedMarkets);
    state.marketLoaded = true;
  } catch (error) {
    state.markets = buildSportMarkets(state.sports, []);
    state.marketLoaded = true;

    if (error?.code?.includes("permission-denied")) {
      state.marketError = "Firestore 접근 권한이 없습니다. market 테이블 규칙을 배포해주세요.";
    } else {
      state.marketError = toFriendlyError(error);
    }
  } finally {
    state.marketLoading = false;
  }
}

async function loadLeagues() {
  if (!state.user || !db) {
    state.leagues = [];
    state.leagueLoaded = false;
    return;
  }

  state.leagueLoading = true;
  state.error = "";

  try {
    const snapshot = await db.collection("league").limit(500).get();
    state.leagues = snapshot.docs
      .map((doc) => normalizeLeague({ id: doc.id, ...doc.data() }))
      .sort((left, right) => getDateValue(right.createdAt) - getDateValue(left.createdAt));
    state.leagueLoaded = true;
  } catch (error) {
    state.leagues = [];
    state.leagueLoaded = false;

    if (error?.code?.includes("permission-denied")) {
      state.error = "Firestore 접근 권한이 없습니다. league 테이블 읽기/쓰기 규칙을 확인해주세요.";
    } else {
      state.error = toFriendlyError(error);
    }
  } finally {
    state.leagueLoading = false;
  }
}

async function loadGames() {
  if (!state.user || !db) {
    state.games = [];
    state.gameLoaded = false;
    return;
  }

  state.gameLoading = true;
  state.error = "";

  try {
    const snapshot = await db.collection("game").limit(500).get();
    state.games = snapshot.docs
      .map((doc) => normalizeGame({ id: doc.id, ...doc.data() }))
      .sort(compareGames);
    state.gameLoaded = true;
  } catch (error) {
    state.games = [];
    state.gameLoaded = false;

    if (error?.code?.includes("permission-denied")) {
      state.error = "Firestore 접근 권한이 없습니다. game 테이블 읽기/쓰기 규칙을 확인해주세요.";
    } else {
      state.error = toFriendlyError(error);
    }
  } finally {
    state.gameLoading = false;
  }
}

async function loadOdds() {
  if (!state.user || !db) {
    state.odds = [];
    state.oddLoaded = false;
    return;
  }

  state.oddLoading = true;
  state.error = "";

  try {
    const snapshot = await db.collection("odd").orderBy("changedAt", "desc").limit(2000).get();
    state.odds = snapshot.docs
      .map((doc) => normalizeOddRecord({ id: doc.id, ...doc.data() }))
      .filter((odd) => odd.gameTime && odd.marketName && odd.homeTeam && odd.awayTeam)
      .sort(compareOddRecords);
    state.oddLoaded = true;
  } catch (error) {
    state.odds = [];
    state.oddLoaded = false;

    if (error?.code?.includes("permission-denied")) {
      state.error = "Firestore 접근 권한이 없습니다. odd 테이블 읽기/쓰기 규칙을 확인해주세요.";
    } else {
      state.error = toFriendlyError(error);
    }
  } finally {
    state.oddLoading = false;
  }
}

async function loadSettings() {
  if (!state.user || !db) {
    state.settings = normalizeAppSettings({});
    state.settingLoaded = false;
    return;
  }

  state.settingLoading = true;
  state.error = "";

  try {
    const snapshot = await db.collection("settings").doc("app").get();
    state.settings = normalizeAppSettings(snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : {});
    state.settingLoaded = true;
  } catch (error) {
    state.settings = normalizeAppSettings({});
    state.settingLoaded = false;

    if (error?.code?.includes("permission-denied")) {
      state.error = "Firestore 접근 권한이 없습니다. settings 테이블 읽기/쓰기 규칙을 확인해주세요.";
    } else {
      state.error = toFriendlyError(error);
    }
  } finally {
    state.settingLoading = false;
  }
}

async function updateSettingsInlineFields(data, password) {
  const payload = {};

  if (hasOwn(data, "oddsUpdaterEnabled")) {
    payload.oddsUpdaterEnabled = normalizeEnabled(data.oddsUpdaterEnabled);
  }

  if (Object.keys(payload).length === 0) {
    return;
  }

  const result = await requestSettingsUpdate(payload, password);
  state.settings = normalizeAppSettings({
    ...state.settings,
    ...(result.settings ?? payload),
  });
  state.settingLoaded = true;
}

async function createSportRecord(data) {
  if (!db) {
    throw new Error("Firebase 연결이 필요합니다.");
  }

  const payload = createSportPayload(data, {
    createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  });
  const sportRef = db.collection("sport").doc(normalizeSportId(payload.sportName));
  const snapshot = await sportRef.get();

  if (snapshot.exists || hasDuplicateSportName(payload.sportName)) {
    throw new Error("이미 등록된 종목명입니다.");
  }

  await sportRef.set(payload);
}

async function updateSportRecord(sportId, data) {
  const normalizedSportId = normalizeSportId(sportId);
  const currentSport = state.sports.find((sport) => sport.id === normalizedSportId);

  if (!normalizedSportId || !currentSport) {
    throw new Error("수정할 종목을 찾지 못했습니다.");
  }

  const payload = createSportPayload(data);

  if (payload.sportName !== currentSport.sportName) {
    const newSportId = normalizeSportId(payload.sportName);
    const duplicateRef = db.collection("sport").doc(newSportId);
    const duplicateSnapshot = newSportId === normalizedSportId ? null : await duplicateRef.get();
    const duplicateName = hasDuplicateSportName(payload.sportName, normalizedSportId);

    if (duplicateSnapshot?.exists || duplicateName) {
      throw new Error("이미 등록된 종목명입니다.");
    }

    const linkedLeagues = await db.collection("league").where("sport", "==", currentSport.sportName).limit(1).get();

    if (!linkedLeagues.empty) {
      throw new Error("이 종목명을 사용하는 리그가 있습니다. 리그를 먼저 다른 종목으로 변경해주세요.");
    }

    if (newSportId !== normalizedSportId) {
      const batch = db.batch();
      const renamedPayload = {
        ...payload,
        createdAt: currentSport.createdAt ?? window.firebase.firestore.FieldValue.serverTimestamp(),
      };

      batch.set(duplicateRef, renamedPayload);
      batch.delete(db.collection("sport").doc(normalizedSportId));
      await batch.commit();
      return;
    }
  }

  await db.collection("sport").doc(normalizedSportId).set(payload, { merge: true });
}

async function updateSportInlineFields(sportId, data) {
  const normalizedSportId = normalizeSportId(sportId);
  const sport = state.sports.find((item) => item.id === normalizedSportId);
  const payload = {};

  if (!normalizedSportId || !db) {
    throw new Error("수정할 종목을 찾지 못했습니다.");
  }

  if (hasOwn(data, "enabled")) {
    payload.enabled = normalizeEnabled(data.enabled);
  }

  if (hasOwn(data, "oddsThreshold")) {
    payload.oddsThreshold = normalizeOddsThreshold(data.oddsThreshold);
  }

  if (hasOwn(data, "intervalSeconds")) {
    payload.intervalSeconds = normalizeIntervalSeconds(data.intervalSeconds);
  }

  if (Object.keys(payload).length === 0) {
    return;
  }

  payload.updatedAt = window.firebase.firestore.FieldValue.serverTimestamp();

  await db.collection("sport").doc(normalizedSportId).set(payload, { merge: true });

  if (sport) {
    Object.assign(sport, payload);
  }
}

async function deleteSportRecord(sportId) {
  const normalizedSportId = normalizeSportId(sportId);
  const currentSport = state.sports.find((sport) => sport.id === normalizedSportId);

  if (!normalizedSportId || !currentSport) {
    throw new Error("삭제할 종목을 찾지 못했습니다.");
  }

  const linkedLeagues = await db.collection("league").where("sport", "==", currentSport.sportName).limit(1).get();

  if (!linkedLeagues.empty) {
    throw new Error("이 종목명을 사용하는 리그가 있습니다. 리그를 먼저 다른 종목으로 변경해주세요.");
  }

  await db.collection("sport").doc(normalizedSportId).delete();
}

async function createCountryRecord(data) {
  if (!db) {
    throw new Error("Firebase 연결이 필요합니다.");
  }

  const payload = createCountryPayload(data, {
    createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  });
  const countryId = normalizeCountryId(payload.countryName);
  const countryRef = db.collection("country").doc(countryId);
  const snapshot = await countryRef.get();

  if (snapshot.exists || hasDuplicateCountryName(payload.countryName)) {
    throw new Error("이미 등록된 국가명입니다.");
  }

  await countryRef.set(payload);
}

async function updateCountryRecord(countryId, data) {
  const normalizedCountryId = normalizeCountryId(countryId);
  const currentCountry = state.countries.find((country) => country.id === normalizedCountryId);

  if (!normalizedCountryId || !currentCountry) {
    throw new Error("수정할 국가를 찾지 못했습니다.");
  }

  const payload = createCountryPayload(data);
  const nameChanged = payload.countryName !== currentCountry.countryName;

  if (nameChanged) {
    const newCountryId = normalizeCountryId(payload.countryName);
    const duplicateRef = db.collection("country").doc(newCountryId);
    const duplicateSnapshot = newCountryId === normalizedCountryId ? null : await duplicateRef.get();
    const duplicateName = hasDuplicateCountryName(payload.countryName, normalizedCountryId);

    if (duplicateSnapshot?.exists || duplicateName) {
      throw new Error("이미 등록된 국가명입니다.");
    }

    if (await hasLinkedLeaguesForCountry(currentCountry)) {
      throw new Error("이 국가명을 사용하는 리그가 있습니다. 리그를 먼저 다른 국가로 변경해주세요.");
    }

    if (newCountryId !== normalizedCountryId) {
      const batch = db.batch();
      const renamedPayload = {
        ...payload,
        createdAt: currentCountry.createdAt ?? window.firebase.firestore.FieldValue.serverTimestamp(),
      };

      batch.set(duplicateRef, renamedPayload);
      batch.delete(db.collection("country").doc(normalizedCountryId));
      await batch.commit();
      return;
    }
  }

  await db.collection("country").doc(normalizedCountryId).set(payload, { merge: true });
}

async function updateCountryInlineFields(countryId, data) {
  const normalizedCountryId = normalizeCountryId(countryId);
  const country = state.countries.find((item) => item.id === normalizedCountryId);
  const payload = {};

  if (!normalizedCountryId || !db) {
    throw new Error("수정할 국가를 찾지 못했습니다.");
  }

  if (hasOwn(data, "enabled")) {
    payload.enabled = normalizeEnabled(data.enabled);
  }

  if (Object.keys(payload).length === 0) {
    return;
  }

  payload.updatedAt = window.firebase.firestore.FieldValue.serverTimestamp();

  await db.collection("country").doc(normalizedCountryId).set(payload, { merge: true });

  if (country) {
    Object.assign(country, payload);
  }
}

async function deleteCountryRecord(countryId) {
  const normalizedCountryId = normalizeCountryId(countryId);
  const currentCountry = state.countries.find((country) => country.id === normalizedCountryId);

  if (!normalizedCountryId || !currentCountry) {
    throw new Error("삭제할 국가를 찾지 못했습니다.");
  }

  if (await hasLinkedLeaguesForCountry(currentCountry)) {
    throw new Error("이 국가명을 사용하는 리그가 있습니다. 리그를 먼저 다른 국가로 변경해주세요.");
  }

  await db.collection("country").doc(normalizedCountryId).delete();
}

async function hasLinkedLeaguesForCountry(country) {
  if (!db) {
    return false;
  }

  const countryIds = [...new Set([
    country.id,
    normalizeCountryId(country.countryName),
  ].filter(Boolean))];

  for (const countryId of countryIds) {
    const snapshot = await db.collection("league").where("countryId", "==", countryId).limit(1).get();

    if (!snapshot.empty) {
      return true;
    }
  }

  if (country.countryName) {
    const snapshot = await db.collection("league").where("country", "==", country.countryName).limit(1).get();

    if (!snapshot.empty) {
      return true;
    }
  }

  return false;
}

async function saveSportOrder(orderedSports) {
  if (!db) {
    throw new Error("Firebase 연결이 필요합니다.");
  }

  const batch = db.batch();
  const now = window.firebase.firestore.FieldValue.serverTimestamp();

  orderedSports.forEach((sport, index) => {
    batch.set(
      db.collection("sport").doc(sport.id),
      {
        sortOrder: index + 1,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  await batch.commit();
}

async function saveCountryOrder(orderedCountries) {
  if (!db) {
    throw new Error("Firebase 연결이 필요합니다.");
  }

  const batch = db.batch();
  const now = window.firebase.firestore.FieldValue.serverTimestamp();

  orderedCountries.forEach((country, index) => {
    batch.set(
      db.collection("country").doc(country.id),
      {
        sortOrder: index + 1,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  await batch.commit();
}

async function upsertKLeagueSampleRecord() {
  if (!db) {
    throw new Error("Firebase 연결이 필요합니다.");
  }

  const now = window.firebase.firestore.FieldValue.serverTimestamp();
  const sportRef = db.collection("sport").doc(normalizeSportId(kLeagueSampleSport.sportName));
  const sportSnapshot = await sportRef.get();
  const sportPayload = createSportPayload(kLeagueSampleSport, sportSnapshot.exists ? {} : { createdAt: now });

  await sportRef.set(sportPayload, { merge: true });

  const sampleSport = normalizeSport({ id: normalizeSportId(sportPayload.sportName), ...sportPayload });
  state.sports = [
    sampleSport,
    ...state.sports.filter((sport) => sport.id !== sampleSport.id),
  ];

  const countryRef = db.collection("country").doc(kLeagueSampleLeague.countryId);
  const countrySnapshot = await countryRef.get();
  const countryPayload = createCountryPayload(kLeagueSampleCountry, countrySnapshot.exists ? {} : { createdAt: now });

  await countryRef.set(countryPayload, { merge: true });

  const sampleCountry = normalizeCountry({ id: kLeagueSampleLeague.countryId, ...countryPayload });
  state.countries = [
    sampleCountry,
    ...state.countries.filter((country) => country.id !== sampleCountry.id),
  ];

  const leagueRef = db.collection("league").doc(kLeagueSampleLeague.id);
  const leagueSnapshot = await leagueRef.get();
  const leaguePayload = createLeaguePayload(kLeagueSampleLeague, leagueSnapshot.exists ? {} : { createdAt: now });

  await leagueRef.set(leaguePayload, { merge: true });
}

function createSportPayload(data, extra = {}) {
  const sportName = String(data.sportName ?? data.sport ?? data["종목명"] ?? "").trim();
  const sortOrder = normalizeSortOrder(data.sortOrder ?? data.order ?? data["순서"], getNextSportSortOrder());

  if (!sportName) {
    throw new Error("종목명을 입력해주세요.");
  }

  if (sportName.includes("/")) {
    throw new Error("종목명에는 / 문자를 사용할 수 없습니다.");
  }

  return {
    sportName,
    sortOrder,
    enabled: normalizeEnabled(data.enabled),
    ...extra,
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  };
}

function createCountryPayload(data, extra = {}) {
  const countryName = String(data.countryName ?? data.country ?? data.name ?? data["국가명"] ?? data["국가"] ?? "").trim();
  const sortOrder = normalizeSortOrder(data.sortOrder ?? data.order ?? data["순서"], getNextCountrySortOrder());

  if (!countryName) {
    throw new Error("국가명을 입력해주세요.");
  }

  if (countryName.includes("/")) {
    throw new Error("국가명에는 / 문자를 사용할 수 없습니다.");
  }

  return {
    countryName,
    sortOrder,
    enabled: normalizeEnabled(data.enabled),
    ...extra,
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  };
}

async function createLeagueRecord(data) {
  if (!db) {
    throw new Error("Firebase 연결이 필요합니다.");
  }

  const payload = createLeaguePayload(data, {
    createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  });

  await ensureLeagueNameAvailable(payload.leagueName);

  const leagueRef = await db.collection("league").add(payload);
  return leagueRef.id;
}

async function updateLeagueRecord(leagueId, data) {
  if (!leagueId) {
    throw new Error("수정할 리그를 찾지 못했습니다.");
  }

  const payload = createLeaguePayload(data);
  await ensureLeagueNameAvailable(payload.leagueName, leagueId);

  await db.collection("league").doc(leagueId).set(payload, { merge: true });
  return leagueId;
}

async function importLeagueAfterSave(leagueId) {
  try {
    const result = await requestGameImport(leagueId);
    const parsedGames = Number(result.parsedGames ?? 0);
    const savedGames = Number(result.savedGames ?? 0);
    const failedLeague = result.failedLeagues?.[0];
    const skippedLeague = result.skippedLeagues?.[0];

    if (failedLeague) {
      return {
        message: "",
        error: `리그는 저장되었지만 경기 자동 확인에 실패했습니다. ${failedLeague.reason || "연결 정보를 확인해주세요."}`,
      };
    }

    if (skippedLeague) {
      return {
        message: "",
        error: `리그는 저장되었지만 자동 수집 대상이 아닙니다. ${skippedLeague.reason || "리그 설정을 확인해주세요."}`,
      };
    }

    if (savedGames > 0) {
      return {
        message: `${savedGames}개 경기를 바로 저장했습니다.`,
        error: "",
      };
    }

    if (parsedGames > 0) {
      return {
        message: `${parsedGames}개 일정을 확인했으며 모두 이미 등록된 경기입니다.`,
        error: "",
      };
    }

    return {
      message: "현재 등록 가능한 예정 경기가 없습니다. 서버가 계속 자동 확인합니다.",
      error: "",
    };
  } catch (error) {
    return {
      message: "",
      error: `리그는 저장되었지만 즉시 경기 확인에 실패했습니다. 서버 자동 수집은 계속 실행됩니다. ${toFriendlyError(error)}`,
    };
  }
}

async function deleteLeagueRecord(leagueId) {
  if (!leagueId || !db) {
    throw new Error("삭제할 리그를 찾지 못했습니다.");
  }

  await db.collection("league").doc(leagueId).delete();
}

async function updateMarketInlineFields(marketId, data) {
  if (!marketId || !db) {
    throw new Error("수정할 마켓을 찾지 못했습니다.");
  }

  const market = state.markets.find((item) => item.id === marketId);

  if (!market) {
    throw new Error("수정할 마켓을 찾지 못했습니다.");
  }

  const payload = {
    sportId: market.sportId,
    sportName: market.sportName,
    marketType: market.marketType,
    marketName: getMarketName(market.sportName, market.marketType),
    enabled: hasOwn(data, "enabled") ? normalizeEnabled(data.enabled) : market.enabled,
    alertEnabled: hasOwn(data, "alertEnabled") ? normalizeEnabled(data.alertEnabled) : market.alertEnabled,
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  };

  if (!market.persisted) {
    payload.createdAt = window.firebase.firestore.FieldValue.serverTimestamp();
  }

  await db.collection("market").doc(marketId).set(payload, { merge: true });
  Object.assign(market, payload, {
    persisted: true,
    enabled: payload.enabled,
    alertEnabled: payload.alertEnabled,
  });
}

async function updateLeagueInlineFields(leagueId, data) {
  if (!leagueId || !db) {
    throw new Error("수정할 리그를 찾지 못했습니다.");
  }

  const league = state.leagues.find((item) => item.id === leagueId);
  const payload = {
    provider: normalizeOddsProvider(league?.provider),
    oddsThreshold: normalizeOddsThreshold(league?.oddsThreshold),
    intervalSeconds: normalizeIntervalSeconds(league?.intervalSeconds),
    enabled: normalizeEnabled(league?.enabled),
    alertEnabled: normalizeAlertEnabled(league?.alertEnabled),
  };

  if (hasOwn(data, "oddsThreshold")) {
    payload.oddsThreshold = normalizeOddsThreshold(data.oddsThreshold);
  }

  if (hasOwn(data, "intervalSeconds")) {
    payload.intervalSeconds = normalizeIntervalSeconds(data.intervalSeconds);
  }

  if (hasOwn(data, "provider")) {
    payload.provider = normalizeOddsProvider(data.provider);
  }

  if (hasOwn(data, "enabled")) {
    payload.enabled = normalizeEnabled(data.enabled);
  }

  if (hasOwn(data, "alertEnabled")) {
    payload.alertEnabled = normalizeAlertEnabled(data.alertEnabled);
  }

  if (Object.keys(payload).length === 0) {
    return;
  }

  payload.updatedAt = window.firebase.firestore.FieldValue.serverTimestamp();

  await db.collection("league").doc(leagueId).set(payload, { merge: true });

  if (league) {
    Object.assign(league, payload);
  }
}

async function updateGameInlineFields(gameId, data) {
  if (!gameId || !db) {
    throw new Error("수정할 경기를 찾지 못했습니다.");
  }

  const game = state.games.find((item) => item.id === gameId);
  const payload = {};

  if (hasOwn(data, "enabled")) {
    payload.enabled = normalizeEnabled(data.enabled);
  }

  if (Object.keys(payload).length === 0) {
    return;
  }

  payload.updatedAt = window.firebase.firestore.FieldValue.serverTimestamp();

  await db.collection("game").doc(gameId).set(payload, { merge: true });

  if (game) {
    Object.assign(game, payload);
  }
}

async function importGamesFromEnabledLeagues() {
  if (!db) {
    throw new Error("Firebase 연결이 필요합니다.");
  }

  const enabledLeagues = state.leagues.filter((league) => league.enabled);

  if (enabledLeagues.length === 0) {
    state.message = "선택 ON 된 리그가 없습니다.";
    render();
    return;
  }

  state.gameImporting = true;
  state.error = "";
  state.message = "";
  render();

  const failedLeagues = [];
  const skippedLeagues = [];

  try {
    const importResult = await runGameImport(enabledLeagues);
    const savedCount = Number(importResult.savedGames ?? 0);
    const parsedCount = Number(importResult.parsedGames ?? savedCount);
    const checkedCount = Number(importResult.checkedLeagues ?? enabledLeagues.length);

    failedLeagues.push(...(importResult.failedLeagues ?? []));
    skippedLeagues.push(...(importResult.skippedLeagues ?? []));
    await loadGames();

    if (failedLeagues.length > 0) {
      const savedText = savedCount > 0 ? ` ${savedCount}개 경기는 저장했습니다.` : "";
      state.error = `일부 리그(${failedLeagues.length}개)는 외부 사이트 접근 제한으로 경기를 가져오지 못했습니다.${savedText}`;
    } else if (savedCount === 0 && skippedLeagues.length === checkedCount) {
      state.error = "선택 ON 된 리그에 현재 API사 URL이 없습니다. 리그관리에서 URL을 입력해주세요.";
    } else if (savedCount === 0 && parsedCount > 0) {
      state.message = "이미 등록된 경기만 확인되어 새로 추가한 경기는 없습니다.";
    } else if (savedCount === 0) {
      const skippedText = skippedLeagues.length > 0 ? ` URL이 없는 리그 ${skippedLeagues.length}개는 제외되었습니다.` : "";
      state.error = `서버가 페이지를 열었지만 경기 정보를 찾지 못했습니다. API사 페이지가 자바스크립트 렌더링 또는 봇 차단 방식일 수 있습니다.${skippedText}`;
    } else {
      const skippedText = skippedLeagues.length > 0 ? ` URL이 없는 리그 ${skippedLeagues.length}개는 제외되었습니다.` : "";
      const fallbackText = importResult.fallback ? " 서버 함수 대신 Fonbet JSON으로 처리했습니다." : "";
      state.message = `${savedCount}개 경기를 저장했습니다.${skippedText}${fallbackText}`;
    }
  } catch (error) {
    state.error = toFriendlyError(error);
  } finally {
    state.gameImporting = false;
    render();
  }
}

async function runGameImport(enabledLeagues) {
  try {
    return await requestGameImport();
  } catch (error) {
    const fallbackResult = await importGamesInBrowser(enabledLeagues);

    if (fallbackResult.checkedLeagues > 0) {
      return {
        ...fallbackResult,
        fallback: true,
        serverError: error.message,
      };
    }

    throw error;
  }
}

async function importGamesInBrowser(enabledLeagues) {
  const importedGames = [];
  const failedLeagues = [];
  const skippedLeagues = [];
  let fonbetPayload = null;

  for (const league of enabledLeagues) {
    const sourceUrl = getLeagueImportUrl(league);

    if (!sourceUrl) {
      skippedLeagues.push(toLeagueImportResult(league, "현재 API사 URL이 없습니다."));
      continue;
    }

    try {
      if (normalizeOddsProvider(league.provider) === "fonbet") {
        fonbetPayload = fonbetPayload || await fetchFonbetJson();
        importedGames.push(...parseFonbetGamesFromJson(fonbetPayload, league, sourceUrl));
      } else {
        importedGames.push(...await fetchLeagueGames(league, sourceUrl));
      }
    } catch (error) {
      failedLeagues.push(toLeagueImportResult(league, error.message || "가져오기 실패"));
    }
  }

  const savedGames = await saveGameRecords(importedGames);

  return {
    ok: true,
    checkedLeagues: enabledLeagues.length,
    parsedGames: importedGames.length,
    savedGames,
    failedLeagues,
    skippedLeagues,
  };
}

async function requestAdminLogin(loginId, password) {
  const endpoint = getLoginAdminEndpoint();
  let response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginId, password }),
    });
  } catch {
    throw new Error("관리자 로그인 서버에 연결하지 못했습니다.");
  }

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.ok === false || !payload?.token) {
    throw new Error(payload?.message || "아이디 또는 비밀번호를 다시 확인해주세요.");
  }

  return payload;
}

async function getAdminAuthorizationHeader() {
  const currentUser = auth?.currentUser;

  if (!currentUser) {
    throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
  }

  const token = await currentUser.getIdToken();
  return `Bearer ${token}`;
}

async function requestGameImport(leagueId = "") {
  const endpoint = getImportGamesEndpoint();
  const authorization = await getAdminAuthorizationHeader();
  let response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({
        requestedBy: state.user?.loginId ?? "",
        leagueId,
      }),
    });
  } catch {
    throw new Error("경기 가져오기 서버 함수에 연결하지 못했습니다. Functions 배포와 함수 URL을 확인해주세요.");
  }

  const payload = await readJsonResponse(response);

  if (response.status === 404) {
    throw new Error("경기 가져오기 서버 함수가 아직 배포되지 않았거나 함수 URL이 다릅니다.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error(payload?.message || "관리자 인증이 만료되었습니다. 다시 로그인해주세요.");
  }

  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.message || "경기 가져오기 서버 함수가 실패했습니다.");
  }

  return payload;
}

async function requestSettingsUpdate(settings, password) {
  const endpoint = getUpdateSettingsEndpoint();
  const authorization = await getAdminAuthorizationHeader();
  let response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({
        loginId: state.user?.loginId ?? "",
        password,
        settings,
      }),
    });
  } catch {
    throw new Error("설정 저장 서버 함수에 연결하지 못했습니다. Functions 배포와 함수 URL을 확인해주세요.");
  }

  const payload = await readJsonResponse(response);

  if (response.status === 404) {
    throw new Error("설정 저장 서버 함수가 아직 배포되지 않았거나 함수 URL이 다릅니다.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error(payload?.message || "비밀번호를 다시 확인해주세요.");
  }

  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.message || "설정 저장 서버 함수가 실패했습니다.");
  }

  return payload;
}

function getImportGamesEndpoint() {
  const explicitUrl = normalizeProviderUrl(env.VITE_IMPORT_GAMES_URL);

  if (explicitUrl) {
    return explicitUrl;
  }

  const region = String(env.VITE_FIREBASE_FUNCTIONS_REGION || "asia-northeast3").trim();

  if (!firebaseConfig.projectId || !region) {
    throw new Error("경기 가져오기 함수 URL을 만들 수 없습니다. Firebase 프로젝트 ID와 Functions 리전을 확인해주세요.");
  }

  return `https://${region}-${firebaseConfig.projectId}.cloudfunctions.net/importGames`;
}

function getLoginAdminEndpoint() {
  const explicitUrl = normalizeProviderUrl(env.VITE_LOGIN_ADMIN_URL);

  if (explicitUrl) {
    return explicitUrl;
  }

  const region = String(env.VITE_FIREBASE_FUNCTIONS_REGION || "asia-northeast3").trim();

  if (!firebaseConfig.projectId || !region) {
    throw new Error("관리자 로그인 함수 URL을 만들 수 없습니다.");
  }

  return `https://${region}-${firebaseConfig.projectId}.cloudfunctions.net/loginAdmin`;
}

function getUpdateSettingsEndpoint() {
  const explicitUrl = normalizeProviderUrl(env.VITE_UPDATE_SETTINGS_URL);

  if (explicitUrl) {
    return explicitUrl;
  }

  const region = String(env.VITE_FIREBASE_FUNCTIONS_REGION || "asia-northeast3").trim();

  if (!firebaseConfig.projectId || !region) {
    throw new Error("설정 저장 함수 URL을 만들 수 없습니다. Firebase 프로젝트 ID와 Functions 리전을 확인해주세요.");
  }

  return `https://${region}-${firebaseConfig.projectId}.cloudfunctions.net/updateSettings`;
}

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchFonbetJson() {
  const response = await fetch(fonbetListUrl, {
    cache: "no-store",
    headers: {
      accept: "application/json, text/plain, */*",
    },
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Fonbet 응답 오류: ${response.status}`);
  }

  return payload;
}

async function fetchLeagueGames(league, sourceUrl) {
  const response = await fetch(sourceUrl, {
    credentials: "omit",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error("경기 페이지를 불러오지 못했습니다.");
  }

  const html = await response.text();
  return parseGamesFromHtml(html, league, sourceUrl);
}

async function saveGameRecords(records) {
  if (!db || records.length === 0) {
    return 0;
  }

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

  for (const record of normalizedRecords) {
    const gameRef = db.collection("game").doc(record.id);
    const snapshot = await gameRef.get();

    if (snapshot.exists) {
      continue;
    }

    const now = window.firebase.firestore.FieldValue.serverTimestamp();
    const payload = {
      gameTime: record.gameTime,
      sport: record.sport,
      countryId: record.countryId,
      country: record.country,
      leagueId: record.leagueId,
      leagueName: record.leagueName,
      provider: record.provider,
      homeTeam: record.homeTeam,
      awayTeam: record.awayTeam,
      status: "scheduled",
      oddsThreshold: normalizeOddsThreshold(record.oddsThreshold),
      intervalSeconds: normalizeIntervalSeconds(record.intervalSeconds),
      enabled: true,
      sourceUrl: record.sourceUrl,
      sourceKey: record.sourceKey,
      seenAt: now,
      createdAt: now,
      updatedAt: now,
    };

    await gameRef.set(payload);
    savedCount += 1;
  }

  return savedCount;
}

async function saveTeamRecords(gameRecords) {
  if (!db || gameRecords.length === 0) {
    return 0;
  }

  const teams = new Map();

  gameRecords.forEach((game) => {
    [game.homeTeam, game.awayTeam].forEach((sourceName) => {
      const normalizedSourceName = String(sourceName || "").trim();

      if (!normalizedSourceName || !game.leagueId) {
        return;
      }

      const id = createTeamId(game.leagueId, game.provider, normalizedSourceName);
      teams.set(id, normalizeTeam({
        id,
        sport: game.sport,
        countryId: game.countryId,
        country: game.country,
        leagueId: game.leagueId,
        leagueName: game.leagueName,
        provider: game.provider,
        sourceName: normalizedSourceName,
        displayName: normalizedSourceName,
      }));
    });
  });

  let savedCount = 0;

  for (const team of teams.values()) {
    const teamRef = db.collection("team").doc(team.id);
    const snapshot = await teamRef.get();

    if (snapshot.exists) {
      continue;
    }

    const now = window.firebase.firestore.FieldValue.serverTimestamp();
    await teamRef.set({
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
    savedCount += 1;
  }

  return savedCount;
}

function createLeaguePayload(data, extra = {}) {
  const sport = String(data.sport ?? "").trim();
  const country = String(data.country || data.countryName || "").trim();
  const countryId = normalizeCountryId(data.countryId || country);
  const leagueName = String(data.leagueName ?? "").trim();
  const provider = normalizeOddsProvider(data.provider || "xbet");
  const fonbetLeague = createProviderLeaguePayload(data, "fonbet");
  const xbetLeague = createProviderLeaguePayload(data, "xbet");
  const pinnacleLeague = createProviderLeaguePayload(data, "pinnacle");
  const tournament = provider === "fonbet"
    ? normalizeTournament(fonbetLeague.fonbetLeagueId || data.tournament)
    : normalizeTournament(data.tournament);

  if (!sport || !countryId || !country || !leagueName) {
    throw new Error("종목, 국가, 리그명을 입력해주세요.");
  }

  return {
    sport,
    countryId,
    country,
    leagueName,
    provider,
    tournament,
    oddsThreshold: normalizeOddsThreshold(data.oddsThreshold),
    intervalSeconds: normalizeIntervalSeconds(data.intervalSeconds),
    enabled: normalizeEnabled(data.enabled),
    alertEnabled: normalizeAlertEnabled(data.alertEnabled),
    ...fonbetLeague,
    ...xbetLeague,
    ...pinnacleLeague,
    ...extra,
    updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
  };
}

function createProviderLeaguePayload(data, provider) {
  const url = normalizeProviderUrl(getProviderLeagueValue(data, provider, "Url"));
  const parsed = parseProviderLeagueUrl(provider, url);
  const name = String(getProviderLeagueValue(data, provider, "Name") ?? "").trim() || parsed.name;
  const id = String(getProviderLeagueValue(data, provider, "Id") ?? "").trim() || parsed.id;

  return {
    [`${provider}LeagueName`]: name,
    [`${provider}LeagueId`]: id,
    [`${provider}LeagueUrl`]: url,
  };
}

function getProviderLeagueValue(data, provider, field) {
  const lowerField = field.toLowerCase();
  const directKey = `${provider}League${field}`;
  const shortKey = `${provider}${field}`;
  const aliases = provider === "fonbet"
    ? [
      `fombetLeague${field}`,
      `pombetLeague${field}`,
      `fonbet${field}`,
      `fombet${field}`,
      `pombet${field}`,
      `fombet리그${field}`,
      `pombet리그${field}`,
      `fonbet리그${field}`,
      `fombet${lowerField}`,
      `pombet${lowerField}`,
      `fonbet${lowerField}`,
    ]
    : [];

  return [directKey, shortKey, ...aliases].reduce((value, key) => value ?? data[key], undefined);
}

function parseProviderLeagueUrl(provider, url) {
  if (!url) {
    return { id: "", name: "" };
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    return { id: "", name: "" };
  }

  const segments = parsedUrl.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  if (provider === "xbet") {
    const leagueSegment = segments.find((segment) => /^\d+-/.test(segment)) ?? "";
    const match = leagueSegment.match(/^(\d+)-(.+)$/);

    return {
      id: match?.[1] ?? "",
      name: match?.[2] ?? leagueSegment,
    };
  }

  if (provider === "fonbet") {
    const tournamentIndex = segments.findIndex((segment) => segment === "tournament");
    const countryIndex = segments.findIndex((segment) => segment === "country");
    const id = tournamentIndex >= 0 ? segments[tournamentIndex + 1] ?? "" : "";
    const countryCode = countryIndex >= 0 ? segments[countryIndex + 1] ?? "" : "";

    return {
      id,
      name: countryCode || (id ? `tournament-${id}` : ""),
    };
  }

  if (provider === "pinnacle") {
    const soccerIndex = segments.findIndex((segment) => segment === "soccer");
    const slug = soccerIndex >= 0 ? segments[soccerIndex + 1] ?? "" : "";

    return {
      id: slug,
      name: slug,
    };
  }

  return { id: "", name: "" };
}

function getLeagueProviderUrl(league) {
  const provider = normalizeOddsProvider(league.provider);
  return normalizeProviderUrl(league[`${provider}LeagueUrl`]);
}

function getLeagueImportUrl(league) {
  const provider = normalizeOddsProvider(league.provider);
  const providerUrl = getLeagueProviderUrl(league);

  if (provider === "fonbet" && (providerUrl || getFonbetLeagueId(league))) {
    return providerUrl || fonbetListUrl;
  }

  return providerUrl;
}

function getFonbetLeagueId(league) {
  const directId = String(league.tournament || league.fonbetLeagueId || league.fombetLeagueId || league.pombetLeagueId || "").trim();

  if (directId) {
    return directId;
  }

  return parseProviderLeagueUrl("fonbet", league.fonbetLeagueUrl).id;
}

function parseGamesFromHtml(html, league, sourceUrl) {
  const parser = new DOMParser();
  const page = parser.parseFromString(html, "text/html");
  const records = [
    ...parseGamesFromJsonLd(page, league, sourceUrl),
    ...parseGamesFromVisibleText(page, league, sourceUrl),
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

function parseFonbetGamesFromJson(data, league, sourceUrl) {
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
    .sort((left, right) => getDateValue(left.gameTime) - getDateValue(right.gameTime));
}

function resolveFonbetSportId(data, league) {
  const directId = Number(getFonbetLeagueId(league));
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

function parseGamesFromJsonLd(page, league, sourceUrl) {
  return [...page.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap((script) => parseJsonLdScript(script.textContent))
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
    return flattenJsonLdItems(JSON.parse(text || "null"));
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
  return types.some((type) => ["sportsevent", "event"].includes(String(type ?? "").toLowerCase()));
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

function parseGamesFromVisibleText(page, league, sourceUrl) {
  const lines = String(page.body?.innerText || "")
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
  const text = String(value ?? "").replace(/\s+/g, " ").trim();

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
  const text = String(value ?? "").trim();
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
  const text = String(value ?? "");
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
  const homeTeam = String(data.homeTeam ?? "").trim();
  const awayTeam = String(data.awayTeam ?? "").trim();
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
  const text = String(value ?? "");

  for (let index = 0; index < text.length; index += 1) {
    hash = (Math.imul(hash, 31) + text.charCodeAt(index)) | 0;
  }

  return (hash >>> 0).toString(36);
}

function toLeagueImportResult(league, reason) {
  return {
    id: league.id,
    leagueName: league.leagueName,
    provider: league.provider,
    reason,
  };
}

async function handleSignOut() {
  try {
    await auth?.signOut();
  } catch {
    // Local session cleanup still proceeds if the network is unavailable.
  }

  clearSession();
  state.message = "";
  state.error = "";
  state.modal = null;
  state.editingMember = null;
  state.editingSport = null;
  state.editingCountry = null;
  state.editingLeague = null;
  state.pendingSettings = null;
  state.filters.page = 1;
  window.location.hash = "#/login";
  render();
}

function updateSportsView() {
  const result = getFilteredSports();
  const resultText = document.querySelector("[data-sport-result-text]");
  const pageIndicator = document.querySelector("[data-sport-page-indicator]");
  const sportBody = document.querySelector("[data-sport-body]");
  const prevButton = document.querySelector("[data-sport-page-prev]");
  const nextButton = document.querySelector("[data-sport-page-next]");

  if (resultText) {
    resultText.textContent = getSportResultText(result);
  }

  if (pageIndicator) {
    pageIndicator.textContent = `${result.page} / ${result.totalPages}`;
  }

  if (sportBody) {
    sportBody.innerHTML = renderSportRows(result.rows);
  }

  if (prevButton) {
    prevButton.disabled = result.page <= 1;
  }

  if (nextButton) {
    nextButton.disabled = result.page >= result.totalPages;
  }

  bindSportRowEvents();
  bindMarketRowEvents();
}

function updateCountriesView() {
  const result = getFilteredCountries();
  const resultText = document.querySelector("[data-country-result-text]");
  const pageIndicator = document.querySelector("[data-country-page-indicator]");
  const countryBody = document.querySelector("[data-country-body]");
  const prevButton = document.querySelector("[data-country-page-prev]");
  const nextButton = document.querySelector("[data-country-page-next]");

  if (resultText) {
    resultText.textContent = getCountryResultText(result);
  }

  if (pageIndicator) {
    pageIndicator.textContent = `${result.page} / ${result.totalPages}`;
  }

  if (countryBody) {
    countryBody.innerHTML = renderCountryRows(result.rows);
  }

  if (prevButton) {
    prevButton.disabled = result.page <= 1;
  }

  if (nextButton) {
    nextButton.disabled = result.page >= result.totalPages;
  }

  bindCountryRowEvents();
}

function updateLeaguesView() {
  const result = getFilteredLeagues();
  const resultText = document.querySelector("[data-league-result-text]");
  const pageIndicator = document.querySelector("[data-league-page-indicator]");
  const leagueBody = document.querySelector("[data-league-body]");
  const prevButton = document.querySelector("[data-league-page-prev]");
  const nextButton = document.querySelector("[data-league-page-next]");

  if (resultText) {
    resultText.textContent = getLeagueResultText(result);
  }

  if (pageIndicator) {
    pageIndicator.textContent = `${result.page} / ${result.totalPages}`;
  }

  if (leagueBody) {
    leagueBody.innerHTML = renderLeagueRows(result.rows);
  }

  if (prevButton) {
    prevButton.disabled = result.page <= 1;
  }

  if (nextButton) {
    nextButton.disabled = result.page >= result.totalPages;
  }

  bindLeagueRowEvents();
}

function updateTeamsView() {
  const result = getFilteredTeams();
  const resultText = document.querySelector("[data-team-result-text]");
  const pageIndicator = document.querySelector("[data-team-page-indicator]");
  const teamBody = document.querySelector("[data-team-body]");
  const prevButton = document.querySelector("[data-team-page-prev]");
  const nextButton = document.querySelector("[data-team-page-next]");

  if (resultText) {
    resultText.textContent = getTeamResultText(result);
  }

  if (pageIndicator) {
    pageIndicator.textContent = `${result.page} / ${result.totalPages}`;
  }

  if (teamBody) {
    teamBody.innerHTML = renderTeamRows(result.rows);
  }

  if (prevButton) {
    prevButton.disabled = result.page <= 1;
  }

  if (nextButton) {
    nextButton.disabled = result.page >= result.totalPages;
  }

  bindTeamRowEvents();
}

function updateGamesView() {
  const result = getFilteredGames();
  const resultText = document.querySelector("[data-game-result-text]");
  const pageIndicator = document.querySelector("[data-game-page-indicator]");
  const gameBody = document.querySelector("[data-game-body]");
  const prevButton = document.querySelector("[data-game-page-prev]");
  const nextButton = document.querySelector("[data-game-page-next]");

  if (resultText) {
    resultText.textContent = getGameResultText(result);
  }

  if (pageIndicator) {
    pageIndicator.textContent = `${result.page} / ${result.totalPages}`;
  }

  if (gameBody) {
    gameBody.innerHTML = renderGameRows(result.rows);
  }

  if (prevButton) {
    prevButton.disabled = result.page <= 1;
  }

  if (nextButton) {
    nextButton.disabled = result.page >= result.totalPages;
  }

  bindGameRowEvents();
}

function updateOddsView() {
  const result = getFilteredOdds();
  const resultText = document.querySelector("[data-odd-result-text]");
  const pageIndicator = document.querySelector("[data-odd-page-indicator]");
  const oddBody = document.querySelector("[data-odd-body]");
  const prevButton = document.querySelector("[data-odd-page-prev]");
  const nextButton = document.querySelector("[data-odd-page-next]");

  if (resultText) {
    resultText.textContent = getOddResultText(result);
  }

  if (pageIndicator) {
    pageIndicator.textContent = `${result.page} / ${result.totalPages}`;
  }

  if (oddBody) {
    oddBody.innerHTML = renderOddRows(result.rows);
  }

  if (prevButton) {
    prevButton.disabled = result.page <= 1;
  }

  if (nextButton) {
    nextButton.disabled = result.page >= result.totalPages;
  }

  bindOddRowEvents();
}

function updateAlertsView() {
  const result = getFilteredAlerts();
  const resultText = document.querySelector("[data-alert-result-text]");
  const pageIndicator = document.querySelector("[data-alert-page-indicator]");
  const alertBody = document.querySelector("[data-alert-body]");
  const prevButton = document.querySelector("[data-alert-page-prev]");
  const nextButton = document.querySelector("[data-alert-page-next]");

  if (resultText) {
    resultText.textContent = getAlertResultText(result);
  }

  if (pageIndicator) {
    pageIndicator.textContent = `${result.page} / ${result.totalPages}`;
  }

  if (alertBody) {
    alertBody.innerHTML = renderAlertRows(result.rows);
  }

  if (prevButton) {
    prevButton.disabled = result.page <= 1;
  }

  if (nextButton) {
    nextButton.disabled = result.page >= result.totalPages;
  }

  bindAlertRowEvents();
}

function updateMembersView() {
  const result = getFilteredMembers();
  const resultText = document.querySelector("[data-result-text]");
  const pageIndicator = document.querySelector("[data-page-indicator]");
  const memberBody = document.querySelector("[data-member-body]");
  const prevButton = document.querySelector("[data-page-prev]");
  const nextButton = document.querySelector("[data-page-next]");

  if (resultText) {
    resultText.textContent = getResultText(result);
  }

  if (pageIndicator) {
    pageIndicator.textContent = `${result.page} / ${result.totalPages}`;
  }

  if (memberBody) {
    memberBody.innerHTML = renderMemberRows(result.rows);
  }

  if (prevButton) {
    prevButton.disabled = result.page <= 1;
  }

  if (nextButton) {
    nextButton.disabled = result.page >= result.totalPages;
  }

  bindMemberRowEvents();
}

function getFilteredSports() {
  const filters = state.sportFilters;
  const query = normalizeText(filters.query);
  const filtered = state.sports.filter((sport) => {
    const enabledMatches =
      filters.enabled === "all"
      || (filters.enabled === "enabled" && sport.enabled)
      || (filters.enabled === "disabled" && !sport.enabled);
    const queryTarget = normalizeText([
      sport.sportName,
      sport.enabled ? "사용" : "중지",
    ].join(" "));

    return enabledMatches && (!query || queryTarget.includes(query));
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * filters.pageSize;
  const end = start + filters.pageSize;

  filters.page = page;

  return {
    total,
    totalPages,
    page,
    start,
    end: Math.min(end, total),
    rows: filtered.slice(start, end),
  };
}

function getFilteredCountries() {
  const filters = state.countryFilters;
  const query = normalizeText(filters.query);
  const filtered = state.countries.filter((country) => {
    const enabledMatches =
      filters.enabled === "all"
      || (filters.enabled === "enabled" && country.enabled)
      || (filters.enabled === "disabled" && !country.enabled);
    const queryTarget = normalizeText([
      country.countryName,
      country.enabled ? "사용" : "중지",
    ].join(" "));

    return enabledMatches && (!query || queryTarget.includes(query));
  });
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * filters.pageSize;
  const end = start + filters.pageSize;

  filters.page = page;

  return {
    total,
    totalPages,
    page,
    start,
    end: Math.min(end, total),
    rows: filtered.slice(start, end),
  };
}

function getFilteredLeagues() {
  const filters = state.leagueFilters;
  const query = normalizeText(filters.query);
  const filtered = state.leagues.filter((league) => {
    const sportMatches = filters.sport === "all" || league.sport === filters.sport;
    const providerMatches = filters.provider === "all" || league.provider === filters.provider;
    const enabledMatches =
      filters.enabled === "all"
      || (filters.enabled === "enabled" && league.enabled)
      || (filters.enabled === "disabled" && !league.enabled);
    const queryTarget = normalizeText([
      league.sport,
      league.countryId,
      league.country,
      league.leagueName,
      league.oddsThreshold,
      league.intervalSeconds,
      league.tournament,
      league.fonbetLeagueName,
      league.fonbetLeagueId,
      league.fonbetLeagueUrl,
      league.xbetLeagueName,
      league.xbetLeagueId,
      league.xbetLeagueUrl,
      league.pinnacleLeagueName,
      league.pinnacleLeagueId,
      league.pinnacleLeagueUrl,
      getProviderLabel(league.provider),
      league.enabled ? "선택" : "미선택",
      league.alertEnabled ? "알림" : "알림꺼짐",
    ].join(" "));

    return sportMatches && providerMatches && enabledMatches && (!query || queryTarget.includes(query));
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * filters.pageSize;
  const end = start + filters.pageSize;

  filters.page = page;

  return {
    total,
    totalPages,
    page,
    start,
    end: Math.min(end, total),
    rows: filtered.slice(start, end),
  };
}

function getFilteredTeams() {
  const filters = state.teamFilters;
  const query = normalizeText(filters.query);
  const filtered = state.teams.filter((team) => {
    const sportMatches = filters.sport === "all" || team.sport === filters.sport;
    const leagueMatches = filters.league === "all" || team.leagueId === filters.league;
    const queryTarget = normalizeText([
      team.sport,
      team.country,
      team.leagueName,
      team.sourceName,
      team.displayName,
      getProviderLabel(team.provider),
    ].join(" "));

    return sportMatches && leagueMatches && (!query || queryTarget.includes(query));
  });

  filtered.sort(compareTeams);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * filters.pageSize;
  const end = start + filters.pageSize;

  filters.page = page;

  return {
    total,
    totalPages,
    page,
    start,
    end: Math.min(end, total),
    rows: filtered.slice(start, end),
  };
}

function getFilteredGames() {
  const filters = state.gameFilters;
  const query = normalizeText(filters.query);
  const filtered = state.games.filter((game) => {
    const gameStatus = normalizeGameStatus(game.status, game.gameTime);
    const gameDate = getGameDateFilterValue(game.gameTime);
    const dateFromMatches = !filters.dateFrom || (gameDate && gameDate >= filters.dateFrom);
    const dateToMatches = !filters.dateTo || (gameDate && gameDate <= filters.dateTo);
    const sportMatches = filters.sport === "all" || game.sport === filters.sport;
    const countryMatches = filters.country === "all" || game.country === filters.country;
    const statusMatches = filters.status === "all" || gameStatus === filters.status;
    const enabledMatches =
      filters.enabled === "all"
      || (filters.enabled === "enabled" && game.enabled)
      || (filters.enabled === "disabled" && !game.enabled);
    const queryTarget = normalizeText([
      game.leagueName,
      game.homeTeam,
      game.awayTeam,
      getTeamDisplayName(game.homeTeam, game.leagueId, game.leagueName),
      getTeamDisplayName(game.awayTeam, game.leagueId, game.leagueName),
    ].join(" "));

    return dateFromMatches
      && dateToMatches
      && sportMatches
      && countryMatches
      && statusMatches
      && enabledMatches
      && (!query || queryTarget.includes(query));
  });

  filtered.sort(compareGames);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * filters.pageSize;
  const end = start + filters.pageSize;

  filters.page = page;

  return {
    total,
    totalPages,
    page,
    start,
    end: Math.min(end, total),
    rows: filtered.slice(start, end),
  };
}

function getFilteredOdds() {
  const filters = state.oddFilters;
  const query = normalizeText(filters.query);
  const filtered = getOddGroups().filter((group) => {
    const latest = group.records[0];
    const isPastKboGame = normalizeText(latest.leagueName).includes("kbo")
      && getDateValue(latest.gameTime) > 0
      && getDateValue(latest.gameTime) <= Date.now();

    if (isPastKboGame) {
      return false;
    }

    const sportMatches = filters.sport === "all" || latest.sport === filters.sport;
    const leagueMatches = filters.league === "all" || latest.leagueName === filters.league;
    const marketType = normalizeOddMarketType(latest.marketType, latest.marketName);
    const marketMatches = filters.market === "all" || marketType === filters.market;
    const queryTarget = normalizeText([
      formatGameTime(latest.gameTime),
      latest.sport,
      latest.leagueName,
      latest.marketName,
      latest.homeTeam,
      latest.awayTeam,
      getTeamDisplayName(latest.homeTeam, latest.leagueId, latest.leagueName),
      getTeamDisplayName(latest.awayTeam, latest.leagueId, latest.leagueName),
      formatOddValue(latest.betHome),
      formatOddValue(latest.betDraw),
      formatOddValue(latest.betAway),
    ].join(" "));

    return sportMatches && leagueMatches && marketMatches && (!query || queryTarget.includes(query));
  });

  if (filters.sortField) {
    filtered.sort((left, right) => compareOddGroups(left, right, filters.sortField, filters.sortDirection));
  } else {
    filtered.sort(compareDefaultOddGroups);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * filters.pageSize;
  const end = start + filters.pageSize;

  filters.page = page;

  return {
    total,
    totalPages,
    page,
    start,
    end: Math.min(end, total),
    rows: filtered.slice(start, end),
  };
}

function getFilteredAlerts() {
  const filters = state.alertFilters;
  const query = normalizeText(filters.query);
  const filtered = state.alerts.filter((alert) => {
    const sportMatches = filters.sport === "all" || alert.sport === filters.sport;
    const leagueMatches = filters.league === "all" || alert.leagueName === filters.league;
    const marketMatches = filters.market === "all"
      || normalizeOddMarketType(alert.marketType, alert.marketName) === filters.market;
    const statusMatches = filters.status === "all"
      || (filters.status === "unread" && !alert.acknowledged)
      || (filters.status === "acknowledged" && alert.acknowledged);
    const queryTarget = normalizeText([
      alert.leagueName,
      alert.homeTeam,
      alert.awayTeam,
      getTeamDisplayName(alert.homeTeam, alert.leagueId, alert.leagueName),
      getTeamDisplayName(alert.awayTeam, alert.leagueId, alert.leagueName),
    ].join(" "));

    return sportMatches
      && leagueMatches
      && marketMatches
      && statusMatches
      && (!query || queryTarget.includes(query));
  });

  filtered.sort(compareAlerts);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * filters.pageSize;
  const end = start + filters.pageSize;

  filters.page = page;

  return {
    total,
    totalPages,
    page,
    start,
    end: Math.min(end, total),
    rows: filtered.slice(start, end),
  };
}

function compareOddGroups(left, right, field, direction) {
  const leftRecord = left.records[0];
  const rightRecord = right.records[0];
  let comparison = 0;

  if (field === "gameTime") {
    comparison = getDateValue(leftRecord?.gameTime) - getDateValue(rightRecord?.gameTime);
  } else if (field === "homeTeam" || field === "awayTeam") {
    comparison = getTeamDisplayName(leftRecord?.[field], leftRecord?.leagueId, leftRecord?.leagueName).localeCompare(
      getTeamDisplayName(rightRecord?.[field], rightRecord?.leagueId, rightRecord?.leagueName),
      "ko-KR",
      { sensitivity: "base" },
    );
  }

  if (comparison !== 0) {
    return direction === "desc" ? -comparison : comparison;
  }

  if (isSameOddGame(leftRecord, rightRecord)) {
    return compareGameOddGroups(left, right);
  }

  return compareDefaultOddGroups(left, right);
}

function compareDefaultOddGroups(left, right) {
  const leftRecord = left.records[0] || {};
  const rightRecord = right.records[0] || {};
  const timeDiff = getDateValue(leftRecord.gameTime) - getDateValue(rightRecord.gameTime);

  if (timeDiff !== 0) {
    return timeDiff;
  }

  const gameDiff = [leftRecord.leagueName, getTeamDisplayName(leftRecord.homeTeam, leftRecord.leagueId, leftRecord.leagueName), getTeamDisplayName(leftRecord.awayTeam, leftRecord.leagueId, leftRecord.leagueName), leftRecord.gameId].join("|").localeCompare(
    [rightRecord.leagueName, getTeamDisplayName(rightRecord.homeTeam, rightRecord.leagueId, rightRecord.leagueName), getTeamDisplayName(rightRecord.awayTeam, rightRecord.leagueId, rightRecord.leagueName), rightRecord.gameId].join("|"),
    "ko-KR",
    { sensitivity: "base" },
  );

  if (gameDiff !== 0) {
    return gameDiff;
  }

  return compareGameOddGroups(left, right);
}

function isSameOddGame(left = {}, right = {}) {
  const leftGameKey = left.gameId || left.gameKey;
  const rightGameKey = right.gameId || right.gameKey;

  return Boolean(leftGameKey && rightGameKey && leftGameKey === rightGameKey);
}

function getFilteredMembers() {
  const query = normalizeText(state.filters.query);
  const filtered = state.members.filter((member) => {
    const statusMatches = state.filters.status === "all" || normalizeStatus(member.status) === state.filters.status;
    const queryTarget = normalizeText([
      member.loginId,
      member.nickname,
      getStatusLabel(member.status),
    ].join(" "));

    return statusMatches && (!query || queryTarget.includes(query));
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / state.filters.pageSize));
  const page = Math.min(Math.max(1, state.filters.page), totalPages);
  const start = (page - 1) * state.filters.pageSize;
  const end = start + state.filters.pageSize;

  state.filters.page = page;

  return {
    total,
    totalPages,
    page,
    start,
    end: Math.min(end, total),
    rows: filtered.slice(start, end),
  };
}

function getSportResultText(result = getFilteredSports()) {
  if (result.total === 0) {
    return "검색 결과 0건";
  }

  return `검색 결과 ${result.total}건 중 ${result.start + 1}-${result.end}건 표시`;
}

function getCountryResultText(result = getFilteredCountries()) {
  if (result.total === 0) {
    return "검색 결과 0건";
  }

  return `검색 결과 ${result.total}건 중 ${result.start + 1}-${result.end}건 표시`;
}

function getLeagueResultText(result = getFilteredLeagues()) {
  if (result.total === 0) {
    return "검색 결과 0건";
  }

  return `검색 결과 ${result.total}건 중 ${result.start + 1}-${result.end}건 표시`;
}

function getTeamResultText(result = getFilteredTeams()) {
  if (result.total === 0) {
    return "검색 결과 0건";
  }

  return `검색 결과 ${result.total}건 중 ${result.start + 1}-${result.end}건 표시`;
}

function getGameResultText(result = getFilteredGames()) {
  if (result.total === 0) {
    return "검색 결과 0건";
  }

  return `검색 결과 ${result.total}건 중 ${result.start + 1}-${result.end}건 표시`;
}

function getOddResultText(result = getFilteredOdds()) {
  if (result.total === 0) {
    return "검색 결과 0건";
  }

  return `검색 결과 ${result.total}개 마켓 중 ${result.start + 1}-${result.end}개 표시`;
}

function getAlertResultText(result = getFilteredAlerts()) {
  if (result.total === 0) {
    return "검색 결과 0건";
  }

  return `검색 결과 ${result.total}건 중 ${result.start + 1}-${result.end}건 표시`;
}

function getResultText(result = getFilteredMembers()) {
  if (result.total === 0) {
    return "검색 결과 0건";
  }

  return `검색 결과 ${result.total}건 중 ${result.start + 1}-${result.end}건 표시`;
}

function getSportStats(sports) {
  return sports.reduce(
    (stats, sport) => {
      stats.total += 1;

      if (sport.enabled) {
        stats.enabled += 1;
      } else {
        stats.disabled += 1;
      }

      return stats;
    },
    { total: 0, enabled: 0, disabled: 0 },
  );
}

function getCountryStats(countries) {
  return countries.reduce(
    (stats, country) => {
      stats.total += 1;

      if (country.enabled) {
        stats.enabled += 1;
      } else {
        stats.disabled += 1;
      }

      return stats;
    },
    { total: 0, enabled: 0, disabled: 0 },
  );
}

function getLeagueStats(leagues) {
  return leagues.reduce(
    (stats, league) => {
      stats.total += 1;

      if (league.enabled) {
        stats.enabled += 1;
      } else {
        stats.disabled += 1;
      }

      if (league.alertEnabled) {
        stats.alerts += 1;
      }

      stats.providers[league.provider] = (stats.providers[league.provider] ?? 0) + 1;
      return stats;
    },
    { total: 0, enabled: 0, disabled: 0, alerts: 0, providers: {} },
  );
}

function getTeamStats(teams) {
  return teams.reduce(
    (stats, team) => {
      stats.total += 1;

      if (normalizeText(team.displayName) !== normalizeText(team.sourceName)) {
        stats.customized += 1;
      } else {
        stats.original += 1;
      }

      return stats;
    },
    { total: 0, customized: 0, original: 0 },
  );
}

function getGameStats(games) {
  return games.reduce(
    (stats, game) => {
      stats.total += 1;

      if (game.enabled) {
        stats.enabled += 1;
      } else {
        stats.disabled += 1;
      }

      return stats;
    },
    { total: 0, enabled: 0, disabled: 0 },
  );
}

function getOddStats(groups) {
  const gameIds = new Set();

  return groups.reduce(
    (stats, group) => {
      const latest = group.records[0];
      stats.markets += 1;
      stats.records += group.records.length;

      if (latest.gameId || latest.gameKey) {
        gameIds.add(latest.gameId || latest.gameKey);
      }

      stats.games = gameIds.size;
      return stats;
    },
    { markets: 0, games: 0, records: 0 },
  );
}

function getAlertStats(alerts) {
  return alerts.reduce(
    (stats, alert) => {
      stats.total += 1;

      if (alert.acknowledged) {
        stats.acknowledged += 1;
      } else {
        stats.unread += 1;
      }

      return stats;
    },
    { total: 0, unread: 0, acknowledged: 0 },
  );
}

function getUnreadAlertCount() {
  return state.alerts.reduce((count, alert) => count + (alert.acknowledged ? 0 : 1), 0);
}

function formatAlertBadgeCount(count) {
  if (count <= 0) {
    return "";
  }

  return count > 99 ? "99+" : String(count);
}

function getMarketsForSport(sport) {
  return marketDefinitions.map((definition) => {
    const market = state.markets.find((item) => (
      item.sportId === sport.id && item.marketType === definition.type
    ));

    return market || normalizeMarket({
      id: createMarketId(sport.id, definition.type),
      persisted: false,
      sportId: sport.id,
      sportName: sport.sportName,
      marketType: definition.type,
      marketName: getMarketName(sport.sportName, definition.type),
      enabled: true,
      alertEnabled: true,
    });
  });
}

function buildSportMarkets(sports, storedMarkets) {
  const storedByKey = new Map();

  storedMarkets.forEach((market) => {
    storedByKey.set(getMarketSettingKey(market.sportId, market.marketType), market);
    storedByKey.set(getMarketSettingKey(market.sportName, market.marketType), market);
  });

  return sports.flatMap((sport) => marketDefinitions.map((definition) => {
    const stored = storedByKey.get(getMarketSettingKey(sport.id, definition.type))
      || storedByKey.get(getMarketSettingKey(sport.sportName, definition.type));

    return normalizeMarket({
      id: stored?.id || createMarketId(sport.id, definition.type),
      persisted: Boolean(stored),
      sportId: sport.id,
      sportName: sport.sportName,
      marketType: definition.type,
      marketName: getMarketName(sport.sportName, definition.type),
      enabled: stored?.enabled ?? true,
      alertEnabled: stored?.alertEnabled ?? true,
      createdAt: stored?.createdAt,
      updatedAt: stored?.updatedAt,
    });
  }));
}

function getMarketSettingKey(sport, marketType) {
  return `${normalizeText(sport)}|${normalizeOddMarketType(marketType)}`;
}

function createMarketId(sportId, marketType) {
  return `market-${createHash(getMarketSettingKey(sportId, marketType))}`;
}

function getMarketName(sport, marketType) {
  const normalizedType = normalizeOddMarketType(marketType);

  if (normalizedType === "handicap") {
    return "핸디캡";
  }

  if (normalizedType === "total") {
    return "오버언더";
  }

  const normalizedSport = normalizeText(sport);
  return ["축구", "football", "soccer"].some((name) => normalizedSport.includes(name)) ? "승무패" : "승패";
}

function getMemberStats(members) {
  return members.reduce(
    (stats, member) => {
      const status = normalizeStatus(member.status);
      stats.total += 1;
      stats[status] = (stats[status] ?? 0) + 1;
      return stats;
    },
    { total: 0, active: 0, inactive: 0 },
  );
}

function canManageMembers() {
  return Boolean(state.user);
}

function canManageMasterData() {
  return Boolean(state.user);
}

function loadSidebarOrder() {
  const defaultOrder = sidebarItems.map((item) => item.hash);

  try {
    const storedOrder = JSON.parse(window.localStorage.getItem(sidebarOrderKey) ?? "[]");

    if (!Array.isArray(storedOrder)) {
      return defaultOrder;
    }

    const validOrder = storedOrder.filter((hash, index) => (
      defaultOrder.includes(hash) && storedOrder.indexOf(hash) === index
    ));

    return [...validOrder, ...defaultOrder.filter((hash) => !validOrder.includes(hash))];
  } catch {
    return defaultOrder;
  }
}

function saveSidebarOrder(order) {
  try {
    window.localStorage.setItem(sidebarOrderKey, JSON.stringify(order));
  } catch {
    // The reordered menu still works for the current page when storage is unavailable.
  }
}

function getOrderedSidebarItems() {
  const itemsByHash = new Map(sidebarItems.map((item) => [item.hash, item]));
  return state.sidebarOrder
    .map((hash) => itemsByHash.get(hash))
    .filter(Boolean);
}

function ensureRoute() {
  const allowedHashes = sidebarItems.map((item) => item.hash);

  if (!allowedHashes.includes(window.location.hash)) {
    window.location.hash = "#/sports";
  }
}

function getActiveHash() {
  const allowedHashes = sidebarItems.map((item) => item.hash);
  return allowedHashes.includes(window.location.hash) ? window.location.hash : "#/sports";
}

function markActivePageForReload() {
  const activeHash = getActiveHash();

  if (activeHash === "#/sports") {
    state.sportLoaded = false;
    state.marketLoaded = false;
  } else if (activeHash === "#/countries") {
    state.countryLoaded = false;
  } else if (activeHash === "#/leagues") {
    state.leagueLoaded = false;
  } else if (activeHash === "#/games") {
    state.gameLoaded = false;
  } else if (activeHash === "#/odds") {
    state.oddLoaded = false;
  } else if (activeHash === "#/settings") {
    state.settingLoaded = false;
  }
}

function createEmptySport() {
  return normalizeSport({
    id: "",
    sportName: "",
    sortOrder: getNextSportSortOrder(),
    enabled: true,
  });
}

function getSportFormData(formData) {
  return {
    sportName: formData.get("sportName"),
    sortOrder: formData.get("sortOrder"),
    enabled: formData.get("enabled"),
  };
}

function createEmptyCountry() {
  return normalizeCountry({
    id: "",
    countryName: "",
    sortOrder: getNextCountrySortOrder(),
    enabled: true,
  });
}

function getCountryFormData(formData) {
  return {
    countryName: formData.get("countryName"),
    sortOrder: formData.get("sortOrder"),
    enabled: formData.get("enabled"),
  };
}

function createEmptyLeague() {
  const defaultSport = getEnabledSports()[0] ?? "축구";
  const defaultCountry = getEnabledCountries()[0];

  return normalizeLeague({
    id: "",
    sport: defaultSport,
    countryId: defaultCountry?.id ?? "",
    country: defaultCountry?.countryName ?? "",
    leagueName: "",
    provider: "xbet",
    tournament: "",
    oddsThreshold: 0,
    intervalSeconds: 0,
    enabled: true,
    alertEnabled: false,
    fonbetLeagueName: "",
    fonbetLeagueId: "",
    fonbetLeagueUrl: "",
    xbetLeagueName: "",
    xbetLeagueId: "",
    xbetLeagueUrl: "",
    pinnacleLeagueName: "",
    pinnacleLeagueId: "",
    pinnacleLeagueUrl: "",
  });
}

function getLeagueFormData(formData) {
  const country = formData.get("country");
  const selectedCountry = findCountryByName(country);

  return {
    sport: formData.get("sport"),
    countryId: selectedCountry?.id ?? country,
    country,
    leagueName: formData.get("leagueName"),
    provider: formData.get("provider"),
    tournament: formData.get("tournament"),
    enabled: formData.get("enabled"),
    fonbetLeagueName: formData.get("fonbetLeagueName"),
    fonbetLeagueId: formData.get("fonbetLeagueId"),
    fonbetLeagueUrl: formData.get("fonbetLeagueUrl"),
    xbetLeagueName: formData.get("xbetLeagueName"),
    xbetLeagueId: formData.get("xbetLeagueId"),
    xbetLeagueUrl: formData.get("xbetLeagueUrl"),
    pinnacleLeagueName: formData.get("pinnacleLeagueName"),
    pinnacleLeagueId: formData.get("pinnacleLeagueId"),
    pinnacleLeagueUrl: formData.get("pinnacleLeagueUrl"),
  };
}

function normalizeSport(raw) {
  const sportName = String(raw.sportName || raw.sport || raw.name || raw["종목명"] || raw["종목"] || "").trim();

  return {
    ...raw,
    id: normalizeSportId(raw.id || sportName),
    sportName,
    sortOrder: normalizeSortOrder(raw.sortOrder ?? raw.order ?? raw["순서"], 0),
    enabled: normalizeEnabled(raw.enabled ?? raw.isEnabled ?? raw["사용여부"] ?? raw["사용"]),
    createdAtText: formatDate(raw.createdAt),
  };
}

function normalizeCountry(raw) {
  const countryName = String(raw.countryName || raw.country || raw.name || raw["국가명"] || raw["국가"] || "").trim();

  return {
    ...raw,
    id: normalizeCountryId(raw.id || raw.countryId || countryName),
    countryName,
    sortOrder: normalizeSortOrder(raw.sortOrder ?? raw.order ?? raw["순서"], 0),
    enabled: normalizeEnabled(raw.enabled ?? raw.isEnabled ?? raw["사용여부"] ?? raw["사용"]),
    createdAtText: formatDate(raw.createdAt),
  };
}

function normalizeMarket(raw) {
  const sportName = String(raw.sportName || raw.sport || raw["종목"] || "").trim();
  const sportId = normalizeSportId(raw.sportId || sportName);
  const marketType = normalizeOddMarketType(raw.marketType, raw.marketName);

  return {
    ...raw,
    id: String(raw.id || createMarketId(sportId, marketType)),
    sportId,
    sportName,
    marketType,
    marketName: getMarketName(sportName, marketType),
    enabled: normalizeEnabled(raw.enabled),
    alertEnabled: normalizeEnabled(raw.alertEnabled),
    persisted: Boolean(raw.persisted),
  };
}

function normalizeLeague(raw) {
  const countryId = normalizeCountryId(raw.countryId || raw["국가ID"] || raw["국가 ID"] || "");
  const country = String(raw.country || raw.countryName || raw["국가"] || "").trim();

  return {
    ...raw,
    id: String(raw.id ?? ""),
    sport: String(raw.sport || raw["종목"] || "").trim(),
    countryId,
    country,
    leagueName: String(raw.leagueName || raw["리그명"] || "").trim(),
    provider: normalizeOddsProvider(raw.provider || raw.oddsProvider || raw["사용 사이트"]),
    tournament: normalizeTournament(raw.tournament || raw["tournament"] || raw["토너먼트"]),
    oddsThreshold: normalizeOddsThreshold(raw.oddsThreshold ?? raw.odds ?? raw["배당"]),
    intervalSeconds: normalizeIntervalSeconds(raw.intervalSeconds ?? raw.intervalSecond ?? raw.interval ?? raw["간격초"] ?? raw["간격 초"]),
    enabled: normalizeEnabled(raw.enabled ?? raw.isEnabled ?? raw["사용온오프"] ?? raw["사용"]),
    alertEnabled: normalizeAlertEnabled(raw.alertEnabled ?? raw.isAlertEnabled ?? raw["알림"]),
    fonbetLeagueName: String(raw.fonbetLeagueName || raw.fombetLeagueName || raw.pombetLeagueName || raw["fombet리그명"] || raw["fonbet리그명"] || raw["pombet리그명"] || "").trim(),
    fonbetLeagueId: String(raw.fonbetLeagueId || raw.fombetLeagueId || raw.pombetLeagueId || raw["fombet리그ID"] || raw["fonbet리그ID"] || raw["pombet리그ID"] || "").trim(),
    fonbetLeagueUrl: normalizeProviderUrl(raw.fonbetLeagueUrl || raw.fombetLeagueUrl || raw.pombetLeagueUrl || raw["fombet리그URL"] || raw["fonbet리그URL"] || raw["pombet리그URL"] || ""),
    xbetLeagueName: String(raw.xbetLeagueName || raw["1xbet리그명"] || "").trim(),
    xbetLeagueId: String(raw.xbetLeagueId || raw["1xbet리그ID"] || "").trim(),
    xbetLeagueUrl: normalizeProviderUrl(raw.xbetLeagueUrl || raw["1xbet리그URL"] || ""),
    pinnacleLeagueName: String(raw.pinnacleLeagueName || raw["pinnacle리그명"] || "").trim(),
    pinnacleLeagueId: String(raw.pinnacleLeagueId || raw["pinnacle리그ID"] || "").trim(),
    pinnacleLeagueUrl: normalizeProviderUrl(raw.pinnacleLeagueUrl || raw["pinnacle리그URL"] || ""),
    createdAtText: formatDate(raw.createdAt),
  };
}

function normalizeTeam(raw) {
  const sourceName = String(raw.sourceName || raw.fonbetTeamName || raw.teamName || raw["팀명"] || "").trim();

  return {
    ...raw,
    id: String(raw.id || ""),
    sport: String(raw.sport || raw["종목"] || "").trim(),
    countryId: normalizeCountryId(raw.countryId || raw["국가ID"] || ""),
    country: String(raw.country || raw.countryName || raw["국가"] || "").trim(),
    leagueId: String(raw.leagueId || raw["리그ID"] || "").trim(),
    leagueName: String(raw.leagueName || raw["리그명"] || "").trim(),
    provider: normalizeOddsProvider(raw.provider),
    sourceName,
    displayName: String(raw.displayName || raw["표기명"] || sourceName).trim() || sourceName,
  };
}

function getTeamDisplayName(sourceName, leagueId = "", leagueName = "") {
  const normalizedSourceName = normalizeText(sourceName);

  if (!normalizedSourceName) {
    return "";
  }

  const normalizedLeagueId = normalizeText(leagueId);
  const normalizedLeagueName = normalizeText(leagueName);
  const team = state.teams.find((item) => (
    normalizeText(item.sourceName) === normalizedSourceName
    && (
      (normalizedLeagueId && normalizeText(item.leagueId) === normalizedLeagueId)
      || (!normalizedLeagueId && normalizedLeagueName && normalizeText(item.leagueName) === normalizedLeagueName)
    )
  )) || state.teams.find((item) => (
    normalizeText(item.sourceName) === normalizedSourceName
    && normalizedLeagueName
    && normalizeText(item.leagueName) === normalizedLeagueName
  ));

  return team?.displayName || sourceName;
}

function normalizeGame(raw) {
  const leagueId = String(raw.leagueId || raw["리그ID"] || "").trim();
  const leagueName = String(raw.leagueName || raw["리그명"] || "").trim();
  const homeTeam = String(raw.homeTeam || raw.home || raw["홈팀"] || "").trim();
  const awayTeam = String(raw.awayTeam || raw.away || raw["어웨이팀"] || "").trim();
  const gameTime = normalizeGameTime(raw.gameTime || raw.startTime || raw.startDate || raw["경기시간"]);
  const hasOddsThreshold = hasOwn(raw, "oddsThreshold") || hasOwn(raw, "odds") || hasOwn(raw, "배당");
  const hasIntervalSeconds = hasOwn(raw, "intervalSeconds") || hasOwn(raw, "intervalSecond") || hasOwn(raw, "interval") || hasOwn(raw, "간격초") || hasOwn(raw, "간격 초");
  const sourceUrl = normalizeProviderUrl(raw.sourceUrl || raw.url || "");
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
    sport: String(raw.sport || raw["종목"] || "").trim(),
    countryId: normalizeCountryId(raw.countryId || raw["국가ID"] || raw["국가 ID"] || ""),
    country: String(raw.country || raw.countryName || raw["국가"] || "").trim(),
    leagueId,
    leagueName,
    provider: normalizeOddsProvider(raw.provider),
    homeTeam,
    awayTeam,
    status: normalizeGameStatus(raw.status || raw["상태"], gameTime),
    oddsThreshold: hasOddsThreshold ? normalizeOddsThreshold(raw.oddsThreshold ?? raw.odds ?? raw["배당"]) : null,
    intervalSeconds: hasIntervalSeconds ? normalizeIntervalSeconds(raw.intervalSeconds ?? raw.intervalSecond ?? raw.interval ?? raw["간격초"] ?? raw["간격 초"]) : null,
    enabled: raw.enabled === undefined || raw.enabled === null ? true : normalizeEnabled(raw.enabled),
    sourceUrl,
    sourceKey,
  };
}

function normalizeOddRecord(raw) {
  const gameId = String(raw.gameId || raw.gameID || raw["경기ID"] || raw["경기 ID"] || "").trim();
  const gameTime = normalizeGameTime(raw.gameTime || raw.startTime || raw.startDate || raw["경기시간"]);
  const sport = String(raw.sport || raw["종목"] || "").trim();
  const marketName = String(raw.marketName || raw.market || raw.marketLabel || raw["마켓이름"] || raw["마켓"] || "승무패").trim();
  const homeTeam = String(raw.homeTeam || raw.home || raw["홈팀명"] || raw["홈팀"] || "").trim();
  const awayTeam = String(raw.awayTeam || raw.away || raw["어웨이팀명"] || raw["어웨이팀"] || "").trim();
  const changedAt = normalizeGameTime(raw.changedAt || raw.changedTime || raw.time || raw["변경시간"] || raw["시간"] || raw.updatedAt || raw.createdAt);
  const betHome = normalizeOddValue(raw.betHome ?? raw.homeOdds ?? raw.oddsHome ?? raw.winOdds ?? raw["벳승"] ?? raw["벳(승)"] ?? raw["승"]);
  const betDraw = normalizeOddValue(raw.betDraw ?? raw.drawOdds ?? raw.oddsDraw ?? raw.line ?? raw.point ?? raw.baseLine ?? raw["벳무"] ?? raw["벳(무)"] ?? raw["기준점"] ?? raw["무"]);
  const betAway = normalizeOddValue(raw.betAway ?? raw.awayOdds ?? raw.oddsAway ?? raw.loseOdds ?? raw["벳패"] ?? raw["벳(패)"] ?? raw["패"]);
  const baseOdds = normalizeOddValue(raw.baseOdds ?? raw.standardOdds ?? raw.thresholdOdds ?? raw["기준배당"]);
  const marketType = normalizeOddMarketType(raw.marketType, marketName);
  const lineValue = marketType === "result"
    ? null
    : normalizeOddValue(raw.lineValue ?? raw.betDraw ?? raw.line ?? raw.point ?? raw.baseLine ?? raw["기준점"]);
  const gameKey = gameId || [
    gameTime ? getDateValue(gameTime) : "",
    sport,
    homeTeam,
    awayTeam,
  ].map(normalizeText).join("|");

  return {
    ...raw,
    id: String(raw.id || ""),
    gameId,
    gameKey,
    leagueId: String(raw.leagueId || raw["리그ID"] || "").trim(),
    leagueName: String(raw.leagueName || raw["리그명"] || "").trim(),
    country: String(raw.country || raw.countryName || raw["국가"] || "").trim(),
    provider: normalizeOddsProvider(raw.provider),
    gameTime,
    sport,
    marketType,
    marketName,
    marketKey: String(raw.marketKey || raw.sourceKey || raw["마켓키"] || "").trim(),
    homeTeam,
    awayTeam,
    betHome,
    betDraw,
    betAway,
    lineValue,
    baseOdds,
    changedAt,
  };
}

function normalizeAlert(raw) {
  const marketName = String(raw.marketName || raw.market || "승무패").trim();
  const marketType = normalizeOddMarketType(raw.marketType, marketName);
  const changedFields = Array.isArray(raw.changedFields)
    ? raw.changedFields.filter((field) => ["betHome", "betDraw", "betAway"].includes(field))
    : [];

  return {
    ...raw,
    id: String(raw.id || ""),
    type: String(raw.type || "odds-change"),
    gameId: String(raw.gameId || "").trim(),
    gameTime: normalizeGameTime(raw.gameTime),
    sport: String(raw.sport || "").trim(),
    country: String(raw.country || "").trim(),
    leagueId: String(raw.leagueId || "").trim(),
    leagueName: String(raw.leagueName || "").trim(),
    provider: normalizeOddsProvider(raw.provider),
    marketType,
    marketName,
    marketKey: String(raw.marketKey || "").trim(),
    homeTeam: String(raw.homeTeam || "").trim(),
    awayTeam: String(raw.awayTeam || "").trim(),
    previousBetHome: normalizeOddValue(raw.previousBetHome),
    previousBetDraw: normalizeOddValue(raw.previousBetDraw),
    previousBetAway: normalizeOddValue(raw.previousBetAway),
    currentBetHome: normalizeOddValue(raw.currentBetHome),
    currentBetDraw: normalizeOddValue(raw.currentBetDraw),
    currentBetAway: normalizeOddValue(raw.currentBetAway),
    lineValue: marketType === "result" ? null : normalizeOddValue(raw.lineValue ?? raw.currentBetDraw),
    changedFields,
    maxDifference: normalizeOddValue(raw.maxDifference) ?? 0,
    threshold: normalizeOddsThreshold(raw.threshold),
    intervalSeconds: normalizeIntervalSeconds(raw.intervalSeconds),
    acknowledged: normalizeAlertEnabled(raw.acknowledged),
    acknowledgedAt: normalizeGameTime(raw.acknowledgedAt),
    acknowledgedBy: String(raw.acknowledgedBy || "").trim(),
    changedAt: normalizeGameTime(raw.changedAt || raw.createdAt),
    createdAt: normalizeGameTime(raw.createdAt),
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

function normalizeMember(raw) {
  const loginId = normalizeLoginId(raw.loginId || raw["아이디"] || raw.id || raw.uid || "-");
  const nickname = normalizeNickname(raw.nickname || raw["닉네임"], loginId);
  const status = raw.status || raw["상태"] || "active";

  return {
    ...raw,
    id: normalizeLoginId(raw.id || loginId),
    uid: raw.uid || raw.id || loginId,
    loginId,
    nickname,
    status: normalizeStatus(status),
    createdAtText: formatDate(raw.createdAt),
  };
}

function getDisplayName(profile) {
  if (!profile) {
    return "사용자";
  }

  return profile.nickname || profile.name || profile.loginId || "사용자";
}

function getStatusLabel(status) {
  const value = normalizeStatus(status);
  return statusOptions.find((item) => item.value === value)?.label ?? "사용";
}

function getProviderLabel(provider) {
  const normalized = normalizeOddsProvider(provider);
  return oddsProviders.find((item) => item.value === normalized)?.label ?? "Pombet";
}

function getOrderedSports() {
  return [...state.sports].sort(compareSports);
}

function getOrderedCountries() {
  return [...state.countries].sort(compareCountries);
}

function compareSports(left, right) {
  const orderDiff = getSportSortValue(left) - getSportSortValue(right);

  if (orderDiff !== 0) {
    return orderDiff;
  }

  return left.sportName.localeCompare(right.sportName, "ko-KR");
}

function compareCountries(left, right) {
  const orderDiff = getCountrySortValue(left) - getCountrySortValue(right);

  if (orderDiff !== 0) {
    return orderDiff;
  }

  return left.countryName.localeCompare(right.countryName, "ko-KR");
}

function compareTeams(left, right) {
  return [left.sport, left.country, left.leagueName, left.sourceName].join("|").localeCompare(
    [right.sport, right.country, right.leagueName, right.sourceName].join("|"),
    "ko-KR",
    { sensitivity: "base" },
  );
}

function compareGames(left, right) {
  const leftTime = getDateValue(left.gameTime);
  const rightTime = getDateValue(right.gameTime);
  const leftStatus = normalizeGameStatus(left.status, left.gameTime);
  const rightStatus = normalizeGameStatus(right.status, right.gameTime);

  if (leftStatus !== rightStatus) {
    return leftStatus === "scheduled" ? -1 : 1;
  }

  const timeDiff = leftStatus === "finished"
    ? rightTime - leftTime
    : leftTime - rightTime;

  if (timeDiff !== 0) {
    return timeDiff;
  }

  return [left.leagueName, getTeamDisplayName(left.homeTeam, left.leagueId, left.leagueName), getTeamDisplayName(left.awayTeam, left.leagueId, left.leagueName)].join(" ").localeCompare(
    [right.leagueName, getTeamDisplayName(right.homeTeam, right.leagueId, right.leagueName), getTeamDisplayName(right.awayTeam, right.leagueId, right.leagueName)].join(" "),
    "ko-KR",
  );
}

function compareOddRecords(left, right) {
  const changedDiff = getDateValue(right.changedAt) - getDateValue(left.changedAt);

  if (changedDiff !== 0) {
    return changedDiff;
  }

  return [left.marketName, left.homeTeam, left.awayTeam, left.id].join(" ").localeCompare(
    [right.marketName, right.homeTeam, right.awayTeam, right.id].join(" "),
    "ko-KR",
  );
}

function compareAlerts(left, right) {
  const changedDiff = getDateValue(right.changedAt) - getDateValue(left.changedAt);

  if (changedDiff !== 0) {
    return changedDiff;
  }

  return String(right.id || "").localeCompare(String(left.id || ""));
}

function getSportSortValue(sport) {
  return sport.sortOrder > 0 ? sport.sortOrder : Number.MAX_SAFE_INTEGER;
}

function getCountrySortValue(country) {
  return country.sortOrder > 0 ? country.sortOrder : Number.MAX_SAFE_INTEGER;
}

function getSportDisplayOrder(sport) {
  const sportIndex = getOrderedSports().findIndex((item) => item.id === sport.id);
  return sportIndex >= 0 ? sportIndex + 1 : getNextSportSortOrder();
}

function getCountryDisplayOrder(country) {
  const countryIndex = getOrderedCountries().findIndex((item) => item.id === country.id);
  return countryIndex >= 0 ? countryIndex + 1 : getNextCountrySortOrder();
}

function getNextSportSortOrder() {
  const maxOrder = state.sports.reduce((currentMax, sport) => Math.max(currentMax, normalizeSortOrder(sport.sortOrder, 0)), 0);
  return Math.max(maxOrder, state.sports.length) + 1;
}

function getNextCountrySortOrder() {
  const maxOrder = state.countries.reduce((currentMax, country) => Math.max(currentMax, normalizeSortOrder(country.sortOrder, 0)), 0);
  return Math.max(maxOrder, state.countries.length) + 1;
}

function getEnabledSports() {
  return [...new Set(getOrderedSports()
    .filter((sport) => sport.enabled && sport.sportName)
    .map((sport) => sport.sportName))];
}

function getEnabledCountries() {
  return getOrderedCountries().filter((country) => country.enabled && country.countryName);
}

function getLeagueSportOptions() {
  return [...new Set([
    ...getOrderedSports().map((sport) => sport.sportName).filter(Boolean),
    ...sportOptions,
    ...state.leagues.map((league) => league.sport).filter(Boolean),
  ])];
}

function getLeagueCountryOptions() {
  return [...new Set([
    ...getOrderedCountries().map((country) => country.countryName).filter(Boolean),
    ...state.leagues.map((league) => league.country).filter(Boolean),
  ])];
}

function getTeamSportOptions() {
  return [...new Set(state.teams.map((team) => team.sport).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, "ko-KR"));
}

function getTeamLeagueOptions(sport = "all") {
  const leagues = new Map();

  state.teams
    .filter((team) => sport === "all" || team.sport === sport)
    .forEach((team) => {
      if (team.leagueId && team.leagueName) {
        leagues.set(team.leagueId, team.leagueName);
      }
    });

  return [...leagues.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((left, right) => left.name.localeCompare(right.name, "ko-KR"));
}

function getGameSportOptions() {
  return [...new Set(state.games
    .map((game) => game.sport)
    .filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, "ko-KR"));
}

function getGameCountryOptions(sport = "all") {
  return [...new Set(state.games
    .filter((game) => sport === "all" || game.sport === sport)
    .map((game) => game.country)
    .filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, "ko-KR"));
}

function getOddSportOptions() {
  return [...new Set([
    ...getOrderedSports().map((sport) => sport.sportName).filter(Boolean),
    ...state.odds.map((odd) => odd.sport).filter(Boolean),
  ])].sort((left, right) => left.localeCompare(right, "ko-KR"));
}

function getOddLeagueOptions(sport = "all") {
  return [...new Set(state.odds
    .filter((odd) => sport === "all" || odd.sport === sport)
    .map((odd) => odd.leagueName)
    .filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, "ko-KR"));
}

function getAlertSportOptions() {
  return [...new Set([
    ...getOrderedSports().map((sport) => sport.sportName).filter(Boolean),
    ...state.alerts.map((alert) => alert.sport).filter(Boolean),
  ])].sort((left, right) => left.localeCompare(right, "ko-KR"));
}

function getAlertLeagueOptions(sport = "all") {
  return [...new Set(state.alerts
    .filter((alert) => sport === "all" || alert.sport === sport)
    .map((alert) => alert.leagueName)
    .filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, "ko-KR"));
}

function getOddGroups() {
  return groupOddRecords(state.odds);
}

function groupOddRecords(records) {
  const groups = new Map();

  records.forEach((record) => {
    const groupId = getOddGroupId(record);
    const group = groups.get(groupId) ?? {
      id: groupId,
      records: [],
    };

    group.records.push(record);
    groups.set(groupId, group);
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      records: group.records.sort(compareOddRecords),
    }))
    .sort((left, right) => getDateValue(right.records[0]?.changedAt) - getDateValue(left.records[0]?.changedAt));
}

function getOddGroupById(groupId) {
  return getOddGroups().find((group) => group.id === groupId) ?? null;
}

function getSelectedGameOddGroupById(groupId) {
  return groupOddRecords(state.selectedGameOdds).find((group) => group.id === groupId) ?? null;
}

function findCountryByName(countryName) {
  const normalizedCountryName = String(countryName ?? "").trim();
  return state.countries.find((country) => country.countryName === normalizedCountryName) ?? null;
}

function hasDuplicateSportName(sportName, excludeSportId = "") {
  const normalizedName = normalizeText(sportName);
  const normalizedExcludeId = normalizeSportId(excludeSportId);

  if (!normalizedName) {
    return false;
  }

  return state.sports.some((sport) => {
    return sport.id !== normalizedExcludeId && normalizeText(sport.sportName) === normalizedName;
  });
}

function hasDuplicateCountryName(countryName, excludeCountryId = "") {
  const normalizedName = normalizeText(countryName);
  const normalizedExcludeId = normalizeCountryId(excludeCountryId);

  if (!normalizedName) {
    return false;
  }

  return state.countries.some((country) => {
    return country.id !== normalizedExcludeId && normalizeText(country.countryName) === normalizedName;
  });
}

function hasDuplicateLeagueName(leagueName, excludeLeagueId = "") {
  const normalizedName = normalizeText(leagueName);

  if (!normalizedName) {
    return false;
  }

  return state.leagues.some((league) => {
    return league.id !== excludeLeagueId && normalizeText(league.leagueName) === normalizedName;
  });
}

async function ensureLeagueNameAvailable(leagueName, excludeLeagueId = "") {
  const normalizedLeagueName = String(leagueName ?? "").trim();

  if (!normalizedLeagueName) {
    return;
  }

  if (hasDuplicateLeagueName(normalizedLeagueName, excludeLeagueId)) {
    throw new Error("이미 등록된 리그명입니다.");
  }

  if (!db) {
    return;
  }

  const snapshot = await db.collection("league").where("leagueName", "==", normalizedLeagueName).limit(10).get();
  const duplicateDoc = snapshot.docs.find((doc) => doc.id !== excludeLeagueId);

  if (duplicateDoc) {
    throw new Error("이미 등록된 리그명입니다.");
  }
}

function normalizeOddsProvider(provider) {
  const value = String(provider ?? "xbet").trim().toLowerCase();
  const providerMap = {
    fombet: "fonbet",
    pombet: "fonbet",
    pom: "fonbet",
    fonbet: "fonbet",
    "1xbet": "xbet",
    xbet: "xbet",
    pinnacle: "pinnacle",
  };

  return providerMap[value] ?? "xbet";
}

function normalizeProviderUrl(url) {
  const value = String(url ?? "").trim();

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

function normalizeSportId(sportId) {
  return String(sportId ?? "").trim().toLowerCase();
}

function normalizeCountryId(countryId) {
  return String(countryId ?? "").trim().toLowerCase();
}

function normalizeSortOrder(value, fallback = 0) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 1) {
    return fallback;
  }

  return Math.floor(numberValue);
}

function normalizeOddsThreshold(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return 0;
  }

  return Math.round(numberValue * 100) / 100;
}

function formatOddsInput(value) {
  const numberValue = normalizeOddsThreshold(value);
  return numberValue === 0 ? "" : String(numberValue);
}

function formatOddsDisplay(value) {
  const numberValue = normalizeOddsThreshold(value);
  return numberValue === 0 ? "-" : numberValue.toFixed(2);
}

function normalizeIntervalSeconds(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return 0;
  }

  return Math.floor(numberValue);
}

function formatIntervalInput(value) {
  const numberValue = normalizeIntervalSeconds(value);
  return numberValue === 0 ? "" : String(numberValue);
}

function formatIntervalDisplay(value) {
  const numberValue = normalizeIntervalSeconds(value);
  return numberValue === 0 ? "-" : String(numberValue);
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

function formatOddValue(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return "-";
  }

  return numberValue.toFixed(2);
}

function getOddGroupId(record) {
  const marketType = normalizeOddMarketType(record.marketType, record.marketName);

  if (marketType !== "result") {
    const lineValue = normalizeOddValue(record.lineValue ?? record.betDraw);

    if (lineValue !== null) {
      return [
        record.gameId || record.gameKey,
        record.provider,
        marketType,
        lineValue.toFixed(2),
      ].map(normalizeText).join("|");
    }
  }

  const explicitKey = String(record.marketKey || record.groupKey || "").trim();

  if (explicitKey) {
    return explicitKey;
  }

  return [
    record.gameId || record.gameKey,
    record.marketName,
    record.homeTeam,
    record.awayTeam,
  ].map(normalizeText).join("|");
}

function normalizeTournament(value) {
  return String(value ?? "").trim();
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

function getGameStatusLabel(status) {
  return status === "finished" ? "경기종료" : "시작전";
}

function normalizeAppSettings(raw = {}) {
  return {
    ...raw,
    oddsUpdaterEnabled: raw.oddsUpdaterEnabled === undefined || raw.oddsUpdaterEnabled === null
      ? true
      : normalizeEnabled(raw.oddsUpdaterEnabled),
  };
}

function normalizeAlertEnabled(value) {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  return normalizeEnabled(value);
}

function normalizeEnabled(value) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value ?? "true").trim().toLowerCase();
  return !["false", "0", "off", "disabled", "중지", "미사용", "사용안함"].includes(normalized);
}

function hasOwn(source, key) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

function normalizeStatus(status) {
  const value = String(status ?? "active").trim();
  const statusMap = {
    active: "active",
    inactive: "inactive",
    disabled: "inactive",
    blocked: "inactive",
    "사용": "active",
    "미사용": "inactive",
    "차단": "inactive",
  };

  return statusMap[value] ?? "active";
}

function normalizeNickname(nickname, fallback) {
  return String(nickname ?? "").trim() || normalizeLoginId(fallback);
}

async function createPasswordRecord(password) {
  const passwordSalt = createSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  return { passwordHash, passwordSalt };
}

async function verifyPassword(profile, password) {
  if (!profile.passwordHash || !profile.passwordSalt) {
    throw new Error("이 계정에는 비밀번호 정보가 없습니다. 회원 리스트에서 회원추가로 다시 생성해주세요.");
  }

  const passwordHash = await hashPassword(password, profile.passwordSalt);
  return passwordHash === profile.passwordHash;
}

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error("브라우저 보안 기능을 사용할 수 없습니다. 최신 브라우저 또는 localhost/https 환경에서 다시 시도해주세요.");
  }

  const source = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", source);
  return bytesToHex(new Uint8Array(digest));
}

function createSalt() {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalizeLoginId(loginId) {
  return String(loginId ?? "").trim().toLowerCase();
}

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function selected(current, expected) {
  return String(current) === String(expected) ? "selected" : "";
}

function toEnvName(configKey) {
  const map = {
    apiKey: "VITE_FIREBASE_API_KEY",
    authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
    projectId: "VITE_FIREBASE_PROJECT_ID",
    appId: "VITE_FIREBASE_APP_ID",
  };

  return map[configKey] ?? configKey;
}

function toFriendlyError(error) {
  const code = error?.code ?? "";

  if (code.includes("permission-denied")) {
    return "Firestore 접근 권한이 없습니다. 해당 테이블의 읽기/쓰기 규칙을 확인해주세요.";
  }

  return error?.message ?? "요청을 처리하지 못했습니다.";
}

function getDateValue(value) {
  if (!value) {
    return 0;
  }

  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
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

function formatGameTime(value) {
  return formatDate(normalizeGameTime(value));
}

function getGameDateFilterValue(value) {
  const date = normalizeGameTime(value);

  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultGameDateRange() {
  const dateFrom = new Date();
  const dateTo = new Date(dateFrom);
  dateTo.setDate(dateTo.getDate() + 7);

  return {
    dateFrom: getGameDateFilterValue(dateFrom),
    dateTo: getGameDateFilterValue(dateTo),
  };
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
