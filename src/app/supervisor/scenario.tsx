import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OptionButton } from '@/components';
import { QuizLayout } from '@/features/supervisor/components/QuizLayout';
import { useSupervisor } from '@/features/supervisor/SupervisorContext';
import { colors, signupLayout, typography } from '@/theme';

// STEP 3 — 상황 선택 질문: 4문항, a~d 중 1개 선택
export default function SupervisorScenario() {
  const { form, update } = useSupervisor();
  const [error, setError] = useState<string | null>(null);
  const scenarios = form.questions?.scenarios ?? [];

  useEffect(() => {
    if (!form.questions) router.replace('/supervisor/index');
  }, [form.questions]);

  const setAnswer = (id: string, key: string) => {
    update({ scenarioAnswers: { ...form.scenarioAnswers, [id]: key } });
  };

  const handleNext = () => {
    const unanswered = scenarios.some((q) => !form.scenarioAnswers[q.id]);
    if (unanswered) {
      setError('모든 상황에 답해주세요');
      return;
    }
    setError(null);
    router.push('/supervisor/written');
  };

  return (
    <QuizLayout progress={3 / 4} title="상황 질문" onNext={handleNext} error={error}>
      <View style={styles.list}>
        {scenarios.map((question) => (
          <View key={question.id} style={styles.question}>
            <Text style={styles.text}>{question.text}</Text>
            <View style={styles.options}>
              {question.options.map((option) => (
                <OptionButton
                  key={option.key}
                  label={`${option.key}. ${option.text}`}
                  selected={form.scenarioAnswers[question.id] === option.key}
                  onPress={() => setAnswer(question.id, option.key)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </QuizLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: signupLayout.titleToQuestion,
    gap: signupLayout.questionToOptions,
  },
  question: {
    gap: signupLayout.optionGap,
  },
  text: {
    ...typography.question,
    color: colors.textPrimary,
  },
  options: {
    gap: signupLayout.optionGap,
  },
});
