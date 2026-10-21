# Newby Client

사회초년생 대상 AI 직장 성장 코칭 앱 (Expo / React Native / TypeScript, expo-router)

## 실행 방법

```bash
npm install
npx expo start
```

- 타입 검사: `npx tsc --noEmit`
- 패키지 설치는 `npx expo install <package>`를 사용합니다.
- `.env`와 API 키는 커밋하지 않습니다 (`.gitignore`에 포함).

## 폴더 구조

```
src/
  app/         expo-router 라우트 (화면)
  components/  공용 UI 컴포넌트
  theme/       colors / typography / spacing 토큰
  api/         서버 호출 함수 (현재 mock)
assets/icons/  Figma에서 내려받은 아이콘
```

## 규칙

- 색상·폰트·간격·radius는 `src/theme`의 토큰만 사용합니다.
- 공용 UI는 `src/components`를 재사용합니다.
- **화면에서 `fetch`를 직접 쓰지 않습니다.** 서버 호출은 `src/api/`의 함수로만 하며,
  지금은 가짜 데이터를 반환합니다. 서버 연동 시 함수 내부만 교체합니다.
