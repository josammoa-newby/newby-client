# Newby Client

사회초년생 대상 AI 직장 성장 코칭 앱 (Expo / React Native / TypeScript, expo-router)

## 디자인

- Figma: 파일 키 `lgc4kskTZcFSEenJeUgxWi`, "확정" 섹션(노드 1:173)이 개발 기준
- 화면을 구현하기 전에 /figma-design-to-code 스킬을 읽고 해당 노드를 get_design_context로 확인

## 규칙

- 색상·폰트·간격·radius는 `src/theme`의 토큰만 사용 (하드코딩 금지)
- 공용 UI는 `src/components`를 재사용하고, 없으면 만들어서 추가
- 서버 호출은 `src/api/` 함수로만 (지금은 mock 반환, 서버 연동 시 내부만 교체)
- 패키지 설치는 `npx expo install` 사용
- 커밋 전에 `npx tsc --noEmit` 통과 필수
- `.env`와 API 키는 커밋하지 않음

## 브랜치

- `main` 직접 푸시 금지, `feature/*` 브랜치에서 작업 후 PR
- 한 브랜치 = 한 기능(화면 묶음). 범위를 넘는 작업은 하지 않음

## 팀 협업 규칙

- 공유 파일(package.json, package-lock.json, src/api/, src/theme/, src/components/, src/app/(tabs)/_layout.tsx, .github/, CLAUDE.md)은 성찬만 수정한다. 다른 사람이 필요하면 수정하지 말고 요청한다.
- 패키지 설치가 필요하면 설치하지 말고 먼저 알려준다 (설치는 npx expo install).
- 항상 최신 main에서 브랜치를 만들고, PR 전에 git merge main 한다.
- 새 화면은 새 파일/새 폴더에 만든다. 기존 파일은 꼭 필요한 부분만 최소한으로 수정한다.
- 서버 호출은 mock으로 먼저 만들고, 응답 형태는 API 문서 기준으로 맞춘다.
- 한 브랜치 = 한 기능. git add는 파일을 지정해서 한다. git add . 금지.
