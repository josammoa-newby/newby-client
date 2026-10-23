// 서버가 준비되기 전까지 mock 응답을 돌려주는 상사 성향 질문지 API.
// 서버 연동 시 각 함수 내부만 실제 요청으로 교체한다. (문항/채점은 서버에서 받아오게 됨)

function delay<T>(data: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export type QuestionMode = 'quick' | 'full';

export type LikertQuestion = { id: string; text: string };
export type ScenarioOption = { key: string; text: string };
export type ScenarioQuestion = { id: string; text: string; options: ScenarioOption[] };
export type WrittenFieldType = 'tags' | 'text' | 'pairs';
export type WrittenField = {
  id: string;
  label: string;
  type: WrittenFieldType;
  max?: number;
  hint?: string;
};

export type QuestionSet = {
  mode: QuestionMode;
  likert: LikertQuestion[];
  scenarios: ScenarioQuestion[];
  written: WrittenField[];
};

// 임시 예시 문장. 실제 문항은 서버 연동 시 받아온다.
const LIKERT_TEXTS = [
  '상사는 보고할 때 결론부터 말하길 원한다',
  '상사는 작은 실수에도 바로 피드백을 준다',
  '상사는 질문을 자주 해도 괜찮다고 느끼게 한다',
  '상사는 일정보다 완성도를 더 중요하게 여긴다',
  '상사는 감정 표현이 얼굴이나 말투에 잘 드러난다',
  '상사는 새로운 시도를 할 때 지지해준다',
  '상사는 보고 전에 미리 공유해주길 원한다',
  '상사는 메신저보다 직접 말로 전달하는 걸 선호한다',
  '상사는 수치나 근거가 부족한 보고를 좋아하지 않는다',
  '상사는 업무 진행 상황을 자주 확인하고 싶어한다',
  '상사는 회의 시간에 늦는 것을 민감하게 생각한다',
  '상사는 결과보다 과정에서의 노력을 더 중요하게 본다',
  '상사는 칭찬을 잘 표현하지 않는 편이다',
  '상사는 급한 업무가 생기면 바로 연락한다',
  '상사는 팀원의 의견을 먼저 물어보는 편이다',
  '상사는 야근보다 정시 퇴근을 권장한다',
  '상사는 문서나 자료의 형식을 꼼꼼히 확인한다',
  '상사는 실수를 지적할 때 다른 사람 앞에서도 말한다',
  '상사는 농담이나 가벼운 대화를 즐기는 편이다',
  '상사는 업무 지시를 구체적으로 설명해준다',
  '상사는 목표 달성 여부를 수치로 확인하려 한다',
  '상사는 새로운 의견이나 아이디어를 반영하려 한다',
  '상사는 개인적인 사정을 이야기하면 배려해준다',
  '상사는 변경 사항이 생기면 바로 공유해준다',
] as const;

const SCENARIOS: ScenarioQuestion[] = [
  {
    id: 'S1',
    text: '보고서를 제출했는데 "다시 한번 검토해보자"라는 말을 들었다면?',
    options: [
      { key: 'a', text: '바로 어떤 부분이 문제인지 여쭤본다' },
      { key: 'b', text: '혼자 다시 꼼꼼히 읽어보고 수정한다' },
      { key: 'c', text: '일단 알겠다고 하고 시간을 두고 생각한다' },
      { key: 'd', text: '동료에게 먼저 의견을 물어본다' },
    ],
  },
  {
    id: 'S2',
    text: '업무 중 모르는 부분이 생겼을 때, 상사는 보통 어떻게 반응하는가?',
    options: [
      { key: 'a', text: '바로 알려주고 자세히 설명해준다' },
      { key: 'b', text: '먼저 찾아보라고 한 뒤 질문을 받아준다' },
      { key: 'c', text: '질문하면 약간 귀찮아하는 눈치다' },
      { key: 'd', text: '다른 사람에게 물어보라고 한다' },
    ],
  },
  {
    id: 'S3',
    text: '퇴근 시간이 됐는데 업무가 남아있을 때, 상사의 태도는?',
    options: [
      { key: 'a', text: '정시 퇴근을 먼저 권한다' },
      { key: 'b', text: '상황을 보고 알아서 판단하게 한다' },
      { key: 'c', text: '마무리하고 가길 원하는 눈치를 준다' },
      { key: 'd', text: '명확하게 남아서 끝내라고 한다' },
    ],
  },
  {
    id: 'S4',
    text: '실수를 했을 때 상사는 주로 어떤 방식으로 피드백하는가?',
    options: [
      { key: 'a', text: '바로 짚어주고 개선 방법을 알려준다' },
      { key: 'b', text: '다음 보고 때 넌지시 언급한다' },
      { key: 'c', text: '다른 사람 앞에서도 바로 말한다' },
      { key: 'd', text: '따로 불러서 차분히 이야기한다' },
    ],
  },
];

const WRITTEN_FIELDS: WrittenField[] = [
  { id: 'catchphrases', label: '상사님 말버릇', type: 'tags', max: 3 },
  { id: 'angerSignals', label: '화났을 때 신호', type: 'text', max: 200 },
  { id: 'happySignals', label: '기분 좋을 때 신호', type: 'text', max: 200 },
  { id: 'dislikes', label: '싫어하는 것', type: 'text', max: 200 },
  { id: 'values', label: '중요하게 여기는 것', type: 'text', max: 200 },
  {
    id: 'examples',
    label: '실제 발언과 진짜 뜻 예시',
    type: 'pairs',
    max: 3,
    hint: '이거 쓰면 훨씬 정확해져요',
  },
];

const MOCK_DELAY_MS = 400;

// TODO: 서버 연동 시 내부를 실제 요청으로 교체
export async function getQuestions(mode: QuestionMode): Promise<QuestionSet> {
  const likertCount = mode === 'quick' ? 8 : 24;
  const likert = LIKERT_TEXTS.slice(0, likertCount).map((text, i) => ({
    id: `L${i + 1}`,
    text,
  }));
  return delay({ mode, likert, scenarios: SCENARIOS, written: WRITTEN_FIELDS }, MOCK_DELAY_MS);
}

export type SupervisorAxes = Record<string, number>;

export type Supervisor = {
  id: string;
  nickname: string;
  position: string;
  channel: string;
  mode: QuestionMode;
  code: string;
  typeName: string;
  typeSummary: string;
  axes: SupervisorAxes;
  tips: string[];
  cautions: string[];
  isDefault: boolean;
  createdAt: string;
};

export type WrittenAnswers = {
  catchphrases: string[];
  angerSignals: string;
  happySignals: string;
  dislikes: string;
  values: string;
  examples: { said: string; meant: string }[];
};

export type CreateSupervisorPayload = {
  nickname: string;
  position: string;
  channel: string;
  mode: QuestionMode;
  answers: Record<string, number | string>;
  written: WrittenAnswers;
};

const MOCK_CREATE_DELAY_MS = 800;

// TODO: 서버 연동 시 내부를 실제 요청으로 교체 (채점/유형 분류는 서버에서 처리)
export async function createSupervisor(
  payload: CreateSupervisorPayload,
): Promise<{ supervisor: Supervisor }> {
  return delay(
    {
      supervisor: {
        id: `sup-${Date.now()}`,
        nickname: payload.nickname,
        position: payload.position,
        channel: payload.channel,
        mode: payload.mode,
        code: 'DCRT',
        typeName: '레이더형 팀장',
        typeSummary:
          '분위기와 신호를 먼저 살피고, 근거가 분명할 때 빠르게 움직이는 스타일이에요.',
        axes: { direct: 62, meticulous: 74, fast: 55, warm: 48 },
        tips: [
          '결론부터 먼저 말하고 근거는 뒤에 붙이기',
          '수치나 자료로 뒷받침해서 보고하기',
          '중요한 변경은 미리 짧게 공유하기',
        ],
        cautions: ['준비 없이 급하게 보고하지 않기'],
        isDefault: false,
        createdAt: new Date().toISOString(),
      },
    },
    MOCK_CREATE_DELAY_MS,
  );
}
