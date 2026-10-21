import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { signup } from '@/api';
import { OptionButton, StepIndicator } from '@/components';
import { SignupLayout } from '@/features/signup/SignupLayout';
import { useSignup } from '@/features/signup/SignupContext';
import { BOSS_STYLES } from '@/features/signup/options';
import { colors, signupLayout, typography } from '@/theme';

// STEP 3 — 2/2: 주로 소통하는 상사는 어떤 스타일인가요? (마지막 단계: 가입 요청)
export default function SignupStep3Boss() {
  const { form, update } = useSignup();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    if (!form.bossStyle) {
      setError('하나를 선택해주세요');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signup({
        name: form.name.trim(),
        id: form.id.trim(),
        password: form.password,
        email: form.email.trim(),
        marketingAgreed: form.agreeMarketing,
        job: form.job,
        workStyle: form.workStyle,
        bossStyle: form.bossStyle,
      });
      router.replace('/signup/complete');
    } catch {
      setError('회원가입에 실패했어요. 잠시 후 다시 시도해주세요');
      setLoading(false);
    }
  };

  return (
    <SignupLayout
      progress={1}
      title={'STEP 3.\nAI 맞춤 설정'}
      onNext={handleNext}
      loading={loading}
      error={error}
    >
      <View style={styles.indicator}>
        <StepIndicator current={2} total={2} />
      </View>
      <Text style={styles.question}>{'주로 소통하는 상사는 \n어떤 스타일인가요?'}</Text>
      <View style={styles.options}>
        {BOSS_STYLES.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            selected={form.bossStyle === option.value}
            onPress={() => update({ bossStyle: option.value })}
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
    ...typography.questionLoose,
    color: colors.textPrimary,
    marginTop: signupLayout.indicatorToQuestion,
  },
  options: {
    gap: signupLayout.optionGap,
    marginTop: signupLayout.questionToOptions,
  },
});
