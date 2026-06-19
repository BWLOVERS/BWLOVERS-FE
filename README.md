<img width="214" height="50" alt="title 로고" src="https://github.com/user-attachments/assets/186ad803-09ee-47ae-8857-557a7dde444e" />
<img width="2031" height="1142" alt="image" src="https://github.com/user-attachments/assets/00bf4993-879c-4189-b426-670221383da1" />

베베슈어는 임신과 출산을 준비하는 사용자가 자신의 정보와 보유 보험을 기반으로 보험을 더 쉽게 이해하고 관리할 수 있도록 돕는 AI 보험 분석 서비스입니다. 네이버 OAuth 로그인, 사용자 정보 입력, AI 보험 추천, 보장 시뮬레이션, 보험 약관 OCR 해설, 저장한 보험과 분석 리포트 관리를 제공합니다.

## 🔗 Deployment

[베베슈어](https://bebesure.vercel.app)

<br/>

---
<br/>

# SOURCE CODE 설명
## 프로젝트 구조

```text
BWLOVERS-FE/
├─ README.md
└─ BWLOVERS/
   ├─ package.json
   ├─ vite.config.ts
   ├─ vercel.json
   ├─ src/
   │  ├── router.tsx    # 라우팅 관리
   │  ├── assets/       # svg, img 관리
   │  ├─ apis/          # Axios 인스턴스와 도메인별 API 함수
   │  ├─ common/        # 공통 레이아웃, 헤더, 버튼, 모달, 내비게이션
   │  ├─ Login/         # 네이버 로그인과 OAuth 콜백
   │  ├─ SignUp/        # 계정, 기본 정보, 건강 정보 입력
   │  ├─ Insurance/     # 추천, 보장 시뮬레이션, OCR 보험 이해
   │  ├─ Home/          # 홈, 저장 보험, 저장 리포트, 프로필 관리
   │  └─ AboutUs/
   └─ public/
```
## 주요 패키지

- react
- react-router-dom
- axios
- zustand
- react-markdown
- @react-pdf/renderer
- tailwindcss

## 전체 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| UI | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, Pretendard, SVG React Component |
| Routing | React Router DOM 7 |
| State | Zustand, localStorage |
| API | Axios, Axios Interceptor |
| Document/Content | React Markdown, React PDF Renderer |
| Quality | ESLint 9, Prettier, prettier-plugin-tailwindcss |
| Deploy | Vercel SPA fallback 설정 |
| Pakage Manager | Yarn |



## 주요 기능

### 1. 로그인과 온보딩

- 네이버 OAuth 인증 URL 생성
- `/auth/redirect/naver` 콜백에서 인가 코드 처리
- 신규 사용자는 계정 정보, 임신 관련 기본 정보, 건강 정보를 순서대로 입력
- access token과 refresh token을 `localStorage`에 저장

### 2. AI 보험 추천

- 사용자가 입력한 건강/임신 정보를 기반으로 `/ai/recommend` 추천 작업 시작
- 추천 결과 목록과 상세 페이지 제공
- 추천된 보험의 특약, 추천 사유, 근거 페이지 정보를 확인
- 선택한 보험과 특약을 `/insurances/selected`로 저장

### 3. 보장 시뮬레이션

- 저장한 보험을 선택하고 특약과 질문을 입력
- `/ai/simulation`으로 분석 작업 시작
- 결과 페이지에서 보장 여부와 근거 특약을 확인
- 분석 결과를 `/simulations/save`로 저장하고 이후 리포트로 다시 조회

### 4. 보험 약관 OCR 해설

- 약관 또는 보험 문서 이미지를 최대 5장 업로드
- `/ocr/jobs`로 OCR 작업 생성 후 진행 상태 조회
- 한 줄 요약, 쉬운 설명, 중요 포인트, 주의사항, 용어 풀이 제공

### 5. 홈과 마이페이지

- 홈에서 최근 저장 보험과 최근 보장 분석 리포트 확인
- 저장 보험 목록, 상세, 삭제, 메모 수정
- 저장 리포트 목록, 상세, 삭제
- 프로필 이미지와 사용자명 수정
- 로그아웃과 회원 탈퇴

## 라우트 맵

| 경로 | 화면 |
| --- | --- |
| `/` | 네이버 로그인 |
| `/auth/redirect/naver` | 네이버 OAuth 콜백 |
| `/signup/account` | 계정 정보 입력 |
| `/signup/info` | 임신/기본 정보 입력 |
| `/signup/health` | 건강 정보 입력 |
| `/home` | 홈 |
| `/insurance` | 보험 분석 메인 |
| `/insurance/recommend/loading` | 보험 추천 요청/로딩 |
| `/insurance/recommend/result` | 보험 추천 결과 |
| `/insurance/recommend/result/detail` | 보험 추천 상세 |
| `/insurance/coverage` | 보장 시뮬레이션 입력 |
| `/insurance/coverage/loading` | 보장 시뮬레이션 로딩 |
| `/insurance/coverage/result/:resultId` | 보장 시뮬레이션 결과 |
| `/insurance/explain/upload` | 보험 문서 이미지 업로드 |
| `/insurance/explain/loading` | OCR 분석 로딩 |
| `/insurance/explain/result` | 보험 문서 해설 결과 |
| `/myinsurance` | 저장 보험 목록 |
| `/myinsurance/detail/:insuranceId` | 저장 보험 상세 |
| `/myreport` | 저장 리포트 목록 |
| `/myreport/:simulationId` | 저장 리포트 상세 |
| `/profile/edit` | 프로필 수정 |
| `/about` | 서비스 소개 |

## API 연동 구조

- 공통 Axios 인스턴스: `src/apis/axiosInstance.ts`
- `VITE_BASE_URL`을 `baseURL`로 사용
- 요청 인터셉터에서 access token을 `Authorization: Bearer ...` 헤더로 주입
- 401 응답이 오면 `/auth/refresh`로 토큰 재발급 후 원 요청 재시도
- refresh token이 없거나 재발급 실패 시 토큰을 지우고 로그인 화면으로 이동

주요 API 그룹:

| 그룹 | 파일 | 주요 엔드포인트 |
| --- | --- | --- |
| 인증 | `src/apis/auth/authApi.ts` | `/auth/login`, `/auth/refresh`, `/users/withdraw` |
| 사용자 | `src/apis/users/*` | `/users/me`, `/users/me/pregnancy-info`, `/users/me/health-status` |
| 보험 | `src/apis/insurance/insurancesApi.ts` | `/insurances`, `/insurances/details`, `/insurances/:id` |
| 추천 | `src/apis/insurance/recommendApi.ts` | `/ai/recommend`, `/ai/results/:resultId/items/:itemId` |
| 시뮬레이션 | `src/apis/insurance/coverageApi.ts` | `/ai/simulation`, `/simulations/save` |
| OCR | `src/apis/ocr/ocrApi.ts` | `/ocr/jobs`, `/ocr/jobs/:jobId` |
| 리포트 | `src/apis/insurance/myreportApi.ts` | `/simulations`, `/simulations/details`, `/simulations/:id` |

---
<br/>

# HOW TO INSTALL
```
git clone https://github.com/BWLOVERS/BWLOVERS-FE.git
cd BWLOVERS-FE/BWLOVERS
yarn install
```


### 환경 변수
프로젝트 실행을 위해 환경변수 설정이 필요합니다.
프로젝트 루트에 `.env` 파일을 생성합니다.

```env
VITE_BASE_URL=https://your-api-server.com  
VITE_NAVER_CLIENT_ID=naver-client-id
VITE_REDIRECT_URI=http://localhost:5173/auth/redirect/naver
```
네이버 Developers 콘솔에도 동일한 Redirect URI를 등록해야 합니다. 배포 환경에서는 배포 도메인을 기준으로 `https://배포주소/auth/redirect/naver` 형태로 맞춥니다.


# HOW TO BUILD
## 실행 명령

```bash
# 타입 체크와 프로덕션 빌드
yarn build

# 린트
yarn lint

# 빌드 결과 미리보기
yarn preview
```

<br/>
# HOW TO RUN
```bash
# 개발 서버
yarn dev
```

# HOW TO TEST
```
yarn lint
yarn build
```

빌드가 정상적으로 완료되면 프로젝트가 정상적으로 구성된 것입니다.

---

## 새 환경 재현 체크리스트

- Node.js 20 이상 설치
- `BWLOVERS` 폴더에서 의존성 설치
- `.env.local` 생성
- 백엔드 서버 실행 또는 접근 가능한 API 주소 설정
- 네이버 OAuth Redirect URI 등록
- `yarn dev`로 로컬 실행 확인
- `yarn build`로 `dist/` 생성 확인

## 문제 해결

- `yarn` 명령이 없으면 `corepack enable` 후 `corepack prepare yarn@1.22.22 --activate`를 실행합니다.
- 네이버 로그인 후 콜백 오류가 나면 `.env.local`의 `VITE_REDIRECT_URI`와 네이버 Developers 콘솔의 Redirect URI가 같은지 확인합니다.
- API 요청이 401로 반복 실패하면 브라우저 `localStorage`의 `accessToken`, `refreshToken`을 삭제하고 다시 로그인합니다.
- 쿠키 또는 인증 연동 문제가 있으면 백엔드 CORS 설정에서 프론트엔드 Origin과 credentials 허용 여부를 확인합니다.


<br/>
<br/>

# Author
<img width="180" height="180" alt="image" src="https://github.com/user-attachments/assets/ca0d1a75-0755-4a84-ab11-7d33647262f6" />

2025-2~2026-1 캡스톤디자인과창업프로젝트 
- 이화여자대학교 컴퓨터공학전공
- 우윤수 (Woo Yunsoo) @wys0530

