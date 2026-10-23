import { request } from './client';

// 서버가 돌려주는 AI 답변 카드. (화면 mock 의 AiAnswer 와 이름이 겹치지 않게 Payload 를 붙였다)
export type AiAnswerPayload = {
  intent: string;
  confidence: 'high' | 'medium' | 'low';
  persona_basis: string[];
  recommended_action: string;
  suggested_message: string;
  avoid: string;
  follow_up_question: string | null;
  safety_flag: boolean;
};

export type Session = {
  id: string;
  supervisorId: string | null;
  title: string | null;
  createdAt: string;
};

// AI 답변(role 'ai')은 payload 에 답변 카드가 들어 있고, 첫 인사 메시지의 payload 는 null 이다.
export type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  text: string | null;
  payload: AiAnswerPayload | null;
  createdAt: string;
};

export type SessionWithMessages = {
  session: Session;
  messages: ChatMessage[];
};

export type SendMessageResult = {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
};

// AI 응답은 느릴 수 있어 이 호출만 타임아웃을 40초로 한다.
const SEND_MESSAGE_TIMEOUT_MS = 40000;

const sessionPath = (id: string) => `/api/sessions/${encodeURIComponent(id)}`;

// 내 상사와의 상담 세션을 만들고 AI 첫 인사 메시지를 함께 받는다.
export function createSession(supervisorId: string): Promise<SessionWithMessages> {
  return request<SessionWithMessages>('/api/sessions', {
    method: 'POST',
    body: { supervisorId },
    auth: true,
  });
}

export function sendMessage(sessionId: string, text: string): Promise<SendMessageResult> {
  return request<SendMessageResult>(`${sessionPath(sessionId)}/messages`, {
    method: 'POST',
    body: { text },
    auth: true,
    timeoutMs: SEND_MESSAGE_TIMEOUT_MS,
  });
}

// 세션 정보와 메시지(시간순)
export function getSession(sessionId: string): Promise<SessionWithMessages> {
  return request<SessionWithMessages>(sessionPath(sessionId), { auth: true });
}
