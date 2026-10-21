// 서버가 준비되기 전까지 mock 응답을 돌려주기 위한 공통 헬퍼.
// 서버 연동 시 각 API 함수 내부만 실제 요청으로 교체한다.
const MOCK_DELAY_MS = 300;

export async function mockResponse<T>(data: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return data;
}
