import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { askAI, type AiAnswer } from '@/api';
import { AiMascot, ChatInputBar } from '@/components';
import { AiHeader } from '@/features/ai/AiHeader';
import { AiResultCard } from '@/features/ai/AiResultCard';
import { FollowUpChip } from '@/features/ai/FollowUpChip';
import { SuggestionCard } from '@/features/ai/SuggestionCard';
import { UserBubble } from '@/features/ai/UserBubble';
import { colors, spacing, typography } from '@/theme';

// 에러 문구는 Figma에 없는 임시 디자인
const MESSAGE_FAILED = '답변을 불러오지 못했어요. 잠시 후 다시 시도해주세요';

// 예시 질문 카드. Figma 에는 카드 문구만 있어 눌렀을 때 보낼 질문 문장은 임의로 정함
const SUGGESTIONS = [
  {
    title: '직장 상사의 언어 해석',
    description: '분명 보고서 괜찮다고 하셨는데...',
    question: '상사가 보고서 보고 "다시 한번 검토해보자"라고 했는데 무슨 뜻이야?',
  },
  {
    title: 'AI 조언 듣기',
    description: '어떻게 해야 적응할 수 있을까...',
    question: '회사에 어떻게 해야 빨리 적응할 수 있을까?',
  },
];

type Turn = {
  id: number;
  question: string;
  status: 'loading' | 'done' | 'error';
  answer?: AiAnswer;
};

// 질문이 없으면 입력 상태(Figma 1:372), 질문을 보내면 결과 상태(Figma 1:408)를 같은 화면에서 보여줌
export default function Ai() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const nextId = useRef(0);
  const [input, setInput] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);

  const last = turns[turns.length - 1];
  const loading = last?.status === 'loading';

  const update = (id: number, patch: Partial<Turn>) =>
    setTurns((prev) => prev.map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)));

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;

    const id = nextId.current++;
    setInput('');
    setTurns((prev) => [...prev, { id, question, status: 'loading' }]);
    try {
      update(id, { status: 'done', answer: await askAI({ question }) });
    } catch {
      update(id, { status: 'error' });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AiHeader />

        {turns.length === 0 ? (
          <>
            <View style={styles.hero}>
              <AiMascot />
              <Text style={styles.headline}>언제 어디서든, 뉴비 AI</Text>
              <Text style={styles.subline}>혼자 고민하지 마세요, 바로 물어보세요</Text>
            </View>
            <ScrollView
              horizontal
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}
              style={styles.suggestions}
              contentContainerStyle={styles.suggestionsContent}
            >
              {SUGGESTIONS.map((item) => (
                <SuggestionCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  onPress={() => send(item.question)}
                />
              ))}
            </ScrollView>
          </>
        ) : (
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.flex}
            contentContainerStyle={styles.chat}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {turns.map((turn) => (
              <View key={turn.id} style={styles.turn}>
                <UserBubble text={turn.question} />
                {turn.status === 'loading' && (
                  // 로딩 표시는 Figma에 없는 임시 디자인
                  <ActivityIndicator color={colors.primary} style={styles.loading} />
                )}
                {turn.status === 'error' && <Text style={styles.error}>{MESSAGE_FAILED}</Text>}
                {turn.answer && <AiResultCard answer={turn.answer} />}
              </View>
            ))}
            {last?.answer?.followUps.map((followUp) => (
              <FollowUpChip key={followUp} text={followUp} onPress={() => send(followUp)} />
            ))}
          </ScrollView>
        )}

        <ChatInputBar
          value={input}
          onChangeText={setInput}
          onSubmit={() => send(input)}
          sendDisabled={loading || !input.trim()}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    ...typography.aiHeadline,
    marginTop: spacing.xl,
    color: colors.textPrimary,
  },
  subline: {
    ...typography.aiSubline,
    color: colors.accent,
  },
  suggestions: {
    flexGrow: 0,
    marginBottom: spacing.cardInnerGap,
  },
  suggestionsContent: {
    gap: spacing.chatGap,
    paddingHorizontal: spacing.lg,
  },
  chat: {
    gap: spacing.chatGap,
    // Figma: 헤더 하단(94) ~ 첫 말풍선(134)
    paddingTop: spacing.chatTop,
    paddingBottom: spacing.chatGap,
  },
  turn: {
    gap: spacing.chatGap,
  },
  loading: {
    alignSelf: 'flex-start',
    marginLeft: spacing.xl,
  },
  error: {
    ...typography.caption,
    marginLeft: spacing.lg,
    color: colors.textMuted,
  },
});
