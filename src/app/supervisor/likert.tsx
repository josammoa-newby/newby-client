import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { StepIndicator } from '@/components';
import { QuizLayout } from '@/features/supervisor/components/QuizLayout';
import { LikertRow } from '@/features/supervisor/components/LikertRow';
import { useSupervisor } from '@/features/supervisor/SupervisorContext';
import { signupLayout } from '@/theme';

const PAGE_SIZE = 3;

// STEP 2 — 리커트 질문: 3문항씩, 진행 막대로 묶음 진행도 표시
export default function SupervisorLikert() {
  const { form, update } = useSupervisor();
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const likert = form.questions?.likert ?? [];
  const totalPages = Math.max(1, Math.ceil(likert.length / PAGE_SIZE));
  const pageItems = likert.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  // 질문지 없이 바로 들어온 경우 상사 추가 화면으로 보냄
  useEffect(() => {
    if (!form.questions) router.replace('/supervisor/index');
  }, [form.questions]);

  const setAnswer = (id: string, value: number) => {
    update({ likertAnswers: { ...form.likertAnswers, [id]: value } });
  };

  const handleNext = () => {
    const unanswered = pageItems.some((q) => form.likertAnswers[q.id] == null);
    if (unanswered) {
      setError('모든 문항에 답해주세요');
      return;
    }
    setError(null);
    if (page + 1 < totalPages) {
      setPage(page + 1);
    } else {
      router.push('/supervisor/scenario');
    }
  };

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1);
    } else {
      router.back();
    }
  };

  return (
    <QuizLayout
      progress={2 / 4}
      title="리커트 질문"
      onNext={handleNext}
      onBack={handleBack}
      error={error}
    >
      <View style={styles.indicator}>
        <StepIndicator current={page + 1} total={totalPages} />
      </View>
      <View style={styles.list}>
        {pageItems.map((question) => (
          <LikertRow
            key={question.id}
            text={question.text}
            value={form.likertAnswers[question.id] ?? null}
            onChange={(value) => setAnswer(question.id, value)}
          />
        ))}
      </View>
    </QuizLayout>
  );
}

const styles = StyleSheet.create({
  indicator: {
    marginTop: signupLayout.titleToIndicator,
  },
  list: {
    marginTop: signupLayout.indicatorToQuestion,
  },
});
