# Firebase Security Notes

- Firebase 설정값은 `.env.local`에만 보관합니다. `.env.local`은 저장소에 올리지 않습니다.
- Firebase 웹 `apiKey`는 브라우저에서 보이는 공개 설정값입니다. Google Cloud Console에서 HTTP referrer 제한을 걸어 도메인을 제한해주세요.
- 서비스 계정 JSON, Admin SDK private key, 서버용 비밀키는 프런트엔드 코드나 `public` 폴더에 두지 않습니다.
- Firebase Authentication은 사용하지 않습니다. 계정 생성은 회원 리스트의 회원추가에서 진행하고 Firestore `user` 컬렉션에 직접 저장합니다.
- 비밀번호 원문은 저장하지 않고 브라우저에서 만든 `passwordHash`, `passwordSalt`만 `user` 문서에 저장합니다.
- 종목은 Firestore `sport` 컬렉션에 저장합니다. 화면에는 `sortOrder`, `sportName`, `enabled`를 표시하고 순서 변경, 수정, 삭제할 수 있습니다.
- 국가는 Firestore `country` 컬렉션에 저장합니다. 화면에는 `sortOrder`, `countryName`, `enabled`를 표시하고 순서 변경, 수정, 삭제할 수 있습니다.
- 리그 관리는 Firestore `league` 컬렉션에 저장합니다. 각 리그에는 `sport`, `countryId`, `country`, `leagueName`, `provider`, `tournament`, `oddsThreshold`, `intervalSeconds`, `enabled`, `alertEnabled`, 사이트별 리그명, 리그 ID, 리그 URL이 저장됩니다.
- 경기 관리는 Firestore `game` 컬렉션에 저장합니다. 선택 ON 된 리그의 현재 API사 URL에서 가져온 `gameTime`, `sport`, `country`, `leagueName`, `homeTeam`, `awayTeam`, `oddsThreshold`, `intervalSeconds`, `enabled` 값이 저장됩니다.
- 배당 관리는 Firestore `odd` 컬렉션에서 읽습니다. Firebase Functions의 `updateOdds` 스케줄 함수가 서버에서 ON 경기의 `intervalSeconds` 기준으로 Fonbet의 승패(축구는 승무패), 여러 오버언더 기준점, 여러 핸디캡 기준점을 확인해 변경된 값만 `odd` 컬렉션에 추가합니다. 오버언더와 핸디캡은 `betDraw`와 `lineValue`에 기준점을 저장하며, `경기 + 마켓 + 기준점`별 변경 이력을 따로 묶어 보여줍니다.
- 설정 관리는 `updateSettings` 서버 함수가 비밀번호를 확인한 뒤 Firestore `settings/app` 문서에 저장합니다. `oddsUpdaterEnabled`가 `true`이면 서버의 `updateOdds` 스케줄 함수가 선택된 리그의 새 경기를 자동 저장한 뒤 배당을 갱신하고, `false`이면 두 작업을 모두 건너뜁니다.
- 경기 가져오기는 경기관리의 `경기가져오기` 버튼을 클릭했을 때만 Firebase Functions의 `importGames` HTTP 함수를 호출합니다. 외부 API사 URL 접근과 Firestore 저장은 서버 함수가 처리합니다.
- 프런트엔드 단독 로그인 구조는 운영 보안이 약합니다. 실제 운영에서는 서버 API 또는 Cloud Functions에서 bcrypt/argon2 같은 전용 비밀번호 해시를 적용하는 방식이 안전합니다.
- Firestore 규칙은 `firestore.rules`에 추가했습니다. 배포 전 Firebase Console 또는 Firebase CLI에서 규칙과 Functions를 적용해주세요.
