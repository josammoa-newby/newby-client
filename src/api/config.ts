// 경로는 호출 측에서 항상 /api 로 시작하게 붙인다. (예: request('/api/health'))
// 폰에서 테스트할 때는 EXPO_PUBLIC_API_URL 을 PC 의 IP 주소로 바꾼다.
const DEFAULT_API_URL = 'http://localhost:3000';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');
