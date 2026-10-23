import { getMyProfile } from '@/api';

// 인사말에 쓸 가입 시 등록한 이름. 못 가져오면 null (인사말은 이름 없이 표시).
export async function getGreetingName(): Promise<string | null> {
  try {
    const { name } = await getMyProfile();
    return name?.trim() || null;
  } catch {
    return null;
  }
}
