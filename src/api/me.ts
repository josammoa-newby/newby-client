import { request } from './client';

// GET /api/auth/me 응답 (서버 profileRepository 기준)
export type MyProfile = {
  id: string;
  username: string;
  name: string;
  email: string;
  job: string | null;
  workStyle: string | null;
  bossStyle: string | null;
  marketingAgreed: boolean;
  createdAt: string;
};

export function getMyProfile(): Promise<MyProfile> {
  return request<MyProfile>('/api/auth/me', { auth: true });
}
