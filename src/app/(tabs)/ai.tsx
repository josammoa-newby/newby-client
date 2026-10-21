import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { askAI, type AiAnswer } from '@/api';
import { AiMascot, ChatInputBar } from '@/components';
import { AiHeader } from '@/features/ai/AiHeader';
import { SuggestionCard } from '@/features/ai/SuggestionCard';
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

export default function Ai() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setAnswer] = useState<AiAnswer | null>(null);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    setInput('');
    setLoading(true);
    try {
      setAnswer(await askAI({ question }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AiHeader />
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
});
