# Selfolio - 나만의 포트폴리오 서비스

Selfolio는 개발자들이 마크다운으로 포트폴리오를 쉽게 작성하고 공유할 수 있는 서비스입니다. 개인 서브도메인(`[닉네임].selfolio.im`)을 통해 나만의 공간에서 포트폴리오를 선보일 수 있습니다.

## 주요 기능

- **마크다운 기반 포트폴리오**: 직관적인 마크다운 에디터로 손쉽게 포트폴리오 작성
- **개인화된 URL**: 회원가입 시 설정한 닉네임으로 `[닉네임].selfolio.im` 형태의 개인 URL 제공
- **대표 포트폴리오 설정**: 여러 포트폴리오 중 대표 작품을 지정하여 개인 URL로 접근 시 보여줄 수 있음
- **실시간 미리보기**: 작성하면서 바로 결과를 확인할 수 있는 분할 화면 지원

## 기술 스택

- **프레임워크**: [Nuxt 3](https://nuxt.com)
- **UI 컴포넌트**: [Nuxt UI](https://ui.nuxt.com)
- **인증 및 데이터베이스**: [Supabase](https://supabase.com)
- **마크다운 렌더링**: [MDC(Markdown Components)](https://content.nuxt.com/components/mdc)
- **스타일링**: [TailwindCSS](https://tailwindcss.com) 및 Typography 플러그인

## 시작하기

### 사전 요구사항

- Node.js 18.0 이상
- PNPM 패키지 매니저
- Supabase 계정 및 프로젝트

### 설치 방법

1. 저장소 클론:
   ```bash
   git clone https://github.com/yemson/selfolio-real.git
   cd selfolio-real
   ```

2. 의존성 설치:
   ```bash
   pnpm install
   ```

3. 환경 변수 설정:
   `.env` 파일을 생성하고 Supabase 연결 정보 입력:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-anon-key
   ```

4. 개발 서버 실행:
   ```bash
   pnpm run dev
   ```

5. 브라우저에서 `http://localhost:3000` 접속

### 로컬 환경에서 서브도메인 테스트

1. 로컬 환경에서는 다음과 같이 서브도메인을 테스트할 수 있습니다:
   - `[닉네임].localhost:3000` 형식으로 접속

## 사용 방법

1. 회원가입: 이메일, 비밀번호, 닉네임을 입력하여 계정 생성
2. 로그인: 생성한 계정으로 로그인
3. 포트폴리오 작성: "새 포트폴리오" 버튼을 클릭하여 마크다운 에디터로 콘텐츠 작성
4. 저장 및 대표 설정: 작성 완료 후 저장하고 필요시 대표 포트폴리오로 지정
5. 확인: `[닉네임].selfolio.im` 주소로 접속하여 포트폴리오 확인
