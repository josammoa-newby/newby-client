import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SelectCard } from '@/components';
import { SignupLayout } from '@/features/signup/SignupLayout';
import { useSignup } from '@/features/signup/SignupContext';
import { JOBS } from '@/features/signup/options';
import { colors, signupLayout, typography } from '@/theme';

// 직무를 2열로 배치
const rows = JOBS.reduce<(typeof JOBS)[number][][]>((acc, job, i) => {
  if (i % 2 === 0) acc.push([job]);
  else acc[acc.length - 1].push(job);
  return acc;
}, []);

export default function SignupStep2() {
  const { form, update } = useSignup();
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!form.job) {
      setError('직무를 선택해주세요');
      return;
    }
    setError(null);
    router.push('/signup/step3');
  };

  return (
    <SignupLayout
      progress={2 / 3}
      title={'STEP 2.\n나를 알려주세요'}
      onNext={handleNext}
      error={error}
    >
      <Text style={styles.question}>어떤 일을 하고 있나요?</Text>
      <View style={styles.grid}>
        {rows.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((job) => (
              <SelectCard
                key={job.value}
                emoji={job.emoji}
                label={job.label}
                selected={form.job === job.value}
                onPress={() => update({ job: job.value })}
              />
            ))}
          </View>
        ))}
      </View>
    </SignupLayout>
  );
}

const styles = StyleSheet.create({
  question: {
    ...typography.question,
    color: colors.textPrimary,
    marginTop: signupLayout.titleToQuestion,
  },
  grid: {
    gap: signupLayout.cardGap,
    marginTop: signupLayout.questionToCards,
  },
  row: {
    flexDirection: 'row',
    gap: signupLayout.cardGap,
  },
});
