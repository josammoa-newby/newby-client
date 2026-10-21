import { mockResponse } from './client';

export type LoginParams = {
  id: string;
  password: string;
};

export type SignupParams = {
  name: string;
  id: string;
  password: string;
  email: string;
  marketingAgreed: boolean;
  job: string;
  workStyle: string;
  bossStyle: string;
};

export type AuthResult = {
  token: string;
  user: { id: string; name: string };
};

// TODO: 서버 연동 시 내부를 실제 요청으로 교체
export async function login(params: LoginParams): Promise<AuthResult> {
  return mockResponse({
    token: 'mock-token',
    user: { id: params.id, name: '뉴비' },
  });
}

// TODO: 서버 연동 시 내부를 실제 요청으로 교체
export async function signup(params: SignupParams): Promise<AuthResult> {
  return mockResponse({
    token: 'mock-token',
    user: { id: params.id, name: params.name },
  });
}

// 아이디 중복확인. mock 은 'admin', 'newby' 만 사용 중인 아이디로 취급
const TAKEN_IDS = ['admin', 'newby'];

// TODO: 서버 연동 시 내부를 실제 요청으로 교체
export async function checkIdAvailable(id: string): Promise<{ available: boolean }> {
  return mockResponse({ available: !TAKEN_IDS.includes(id.toLowerCase()) });
}
