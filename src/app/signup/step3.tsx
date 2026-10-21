import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OptionButton, StepIndicator } from '@/components';
import { SignupLayout } from '@/features/signup/SignupLayout';
import { useSignup } from '@/features/signup/SignupContext';
import { WORK_STYLES } from '@/features/signup/options';
import { colors, signupLayout, typography } from '@/theme';

// STEP 3 — 1/2: 나는 어떤 사람인가요?
export default function SignupStep3() {
  const { form, update } = useSignup();
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!form.workStyle) {
      setError('하나를 선택해주세요');
      return;
    }
    setError(null);
    router.push('/signup/step3-boss');
  };

  return (
    <SignupLayout
      progress={1}
      title={'STEP 3.\nAI 맞춤 설정'}
      onNext={handleNext}
      error={error}
    >
      <View style={styles.indicator}>
        <StepIndicator current={1} total={2} />
      </View>
      <Text style={styles.question}>나는 어떤 사람인가요?</Text>
      <View style={styles.options}>
        {WORK_STYLES.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            selected={form.workStyle === option.value}
            onPress={() => update({ workStyle: option.value })}
          />
        ))}
      </View>
    </SignupLayout>
  );
}

const styles = StyleSheet.create({
  indicator: {
    marginTop: signupLayout.titleToIndicator,
  },
  question: {
    ...typography.question,
    color: colors.textPrimary,
    marginTop: signupLayout.indicatorToQuestion,
  },
  options: {
    gap: signupLayout.optionGap,
    marginTop: signupLayout.questionToOptions,
  },
});
