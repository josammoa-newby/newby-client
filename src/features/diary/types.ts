// 서버 응답과 같다고 가정한 타입. 날짜/시간은 ISO 문자열 (date 는 'YYYY-MM-DD', 나머지는 ISO 8601)

export type DiaryHeaderResponse = {
  userId: string;
  hasUnreadNotification: boolean;
};

export type DiaryEntry = {
  id: string;
  userId: string;
  date: string; // 일기를 쓴 날 'YYYY-MM-DD'
  createdAt: string;
};

export type DiaryCalendarResponse = {
  user: { id: string; nickname: string };
  year: number;
  month: number; // 1~12
  today: string; // 서버 기준 오늘 'YYYY-MM-DD'
  recordCount: number; // 해당 월에 남긴 기록 수
  entries: DiaryEntry[]; // 해당 월에 기록이 있는 날
};

export type CreateDiaryEntryInput = {
  date: string; // 'YYYY-MM-DD'
};

export type MissionLevel = {
  level: number;
  name: string;
  currentXp: number;
  nextLevelXp: number;
};

export type Mission = {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
};

export type MissionsResponse = {
  banner: { title: string; subtitle: string };
  level: MissionLevel;
  missions: Mission[];
};

export type ToggleMissionInput = {
  id: string;
  completed: boolean;
};

export type ToggleMissionResponse = {
  mission: Mission;
  level: MissionLevel;
};
