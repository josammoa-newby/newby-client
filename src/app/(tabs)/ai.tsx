import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AiMascot, Button, ChatInputBar } from '@/components';
import { AiHeader } from '@/features/ai/AiHeader';
import { AiResultCard } from '@/features/ai/AiResultCard';
import {
  FOLLOW_UP_HINT,
  MAX_MESSAGE_LENGTH,
  NO_SUPERVISOR_BUTTON,
  NO_SUPERVISOR_MESSAGE,
  RETRY_LABEL,
  THINKING_MESSAGE,
} from '@/features/ai/constants';
import { FeedbackBox } from '@/features/ai/FeedbackBox';
import { SuggestionCard } from '@/features/ai/SuggestionCard';
import { useAiChat } from '@/features/ai/useAiChat';
import { useAiFeedback } from '@/features/ai/useAiFeedback';
import { UserBubble } from '@/features/ai/UserBubble';
import { colors, spacing, typography } from '@/theme';

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

// 질문이 없으면 입력 상태(Figma 1:372), 질문을 보내면 결과 상태(Figma 1:408)를 같은 화면에서 보여줌.
// 상사/세션/전송 로직은 useAiChat 이 맡고 이 파일은 그리기만 한다
export default function Ai() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [input, setInput] = useState('');
  const chat = useAiChat();
  const feedback = useAiFeedback();

  const ready = chat.supervisorState === 'ready';
  const last = chat.turns[chat.turns.length - 1];

  const submit = () => {
    const text = input;
    if (!ready || chat.loading || !text.trim()) return;
    setInput('');
    chat.send(text);
  };

  const renderBody = () => {
    if (chat.supervisorState === 'empty') {
      // 등록한 상사가 없으면 입력 대신 등록 유도 (임시 디자인)
      return (
        <View style={styles.hero}>
          <Text style={styles.notice}>{NO_SUPERVISOR_MESSAGE}</Text>
          <Button
            title={NO_SUPERVISOR_BUTTON}
            onPress={() => router.push('/supervisors')}
            style={styles.noticeButton}
          />
        </View>
      );
    }
    if (chat.supervisorState === 'error') {
      return (
        <View style={styles.hero}>
          <Text style={styles.notice}>{chat.supervisorError}</Text>
          <Button title={RETRY_LABEL} onPress={chat.retryLoadSupervisor} style={styles.noticeButton} />
        </View>
      );
    }
    if (chat.turns.length === 0) {
      return (
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
                onPress={() => ready && chat.send(item.question)}
              />
            ))}
          </ScrollView>
        </>
      );
    }
    return (
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.flex}
        contentContainerStyle={styles.chat}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {chat.turns.map((turn) => (
          <View key={turn.id} style={styles.turn}>
            <UserBubble text={turn.question} />
            {turn.status === 'loading' && (
              // 로딩 표시는 Figma에 없는 임시 디자인
              <View style={styles.loading}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.loadingText}>{THINKING_MESSAGE}</Text>
              </View>
            )}
            {turn.status === 'error' && (
              <View style={styles.errorBox}>
                <Text style={styles.error}>{turn.error}</Text>
                {turn.id === last?.id && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => chat.retry(turn.id)}
                    style={styles.retry}
                  >
                    <Text style={styles.retryText}>{RETRY_LABEL}</Text>
                  </Pressable>
                )}
              </View>
            )}
            {turn.answer && <AiResultCard answer={turn.answer} />}
            {turn.answer && turn.aiMessageId && (
              <FeedbackBox
                state={feedback.get(turn.aiMessageId)}
                onHelpful={() => feedback.submit(turn.aiMessageId!, true)}
                onNotHelpful={() => feedback.openReason(turn.aiMessageId!)}
                onReasonChange={(text) => feedback.setReason(turn.aiMessageId!, text)}
                onSendReason={() =>
                  feedback.submit(turn.aiMessageId!, false, feedback.get(turn.aiMessageId!).reason)
                }
                onSkipReason={() => feedback.submit(turn.aiMessageId!, false)}
                onRetry={() => feedback.submit(turn.aiMessageId!, true)}
              />
            )}
          </View>
        ))}
        {last?.answer && last.answer.followUps.length > 0 && (
          // 후속 질문은 AI가 묻는 문장일 뿐이라 누를 수 없는 일반 텍스트로 보여준다
          <View style={styles.followUp}>
            <Text style={styles.followUpHint}>{FOLLOW_UP_HINT}</Text>
            {last.answer.followUps.map((followUp) => (
              <Text key={followUp} style={styles.followUpText}>
                {followUp}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  const showInput = chat.supervisorState !== 'empty' && chat.supervisorState !== 'error';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AiHeader />
        {renderBody()}
        {showInput && (
          <ChatInputBar
            value={input}
            onChangeText={setInput}
            onSubmit={submit}
            maxLength={MAX_MESSAGE_LENGTH}
            editable={ready}
            sendDisabled={!ready || chat.loading || !input.trim()}
          />
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    marginLeft: spacing.xl,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  followUp: {
    gap: spacing.xs,
    marginLeft: spacing.lg,
  },
  followUpHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  followUpText: {
    ...typography.body,
    color: colors.textLabel,
  },
  errorBox: {
    gap: spacing.sm,
    marginLeft: spacing.lg,
  },
  error: {
    ...typography.caption,
    color: colors.textMuted,
  },
  retry: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  retryText: {
    ...typography.action,
    color: colors.primaryDark,
  },
  notice: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textMuted,
  },
  noticeButton: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
});
