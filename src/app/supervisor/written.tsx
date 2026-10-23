import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TextField } from '@/components';
import { PairInput } from '@/features/supervisor/components/PairInput';
import { QuizLayout } from '@/features/supervisor/components/QuizLayout';
import { TagInput } from '@/features/supervisor/components/TagInput';
import {
  createSupervisor,
  type CreateSupervisorPayload,
  type QuestionMode,
} from '@/features/supervisor/mock';
import { useSupervisor } from '@/features/supervisor/SupervisorContext';
import { colors, signupLayout, typography } from '@/theme';

const TEXT_MAX_LENGTH = 200;
const TAG_MAX = 3;
const PAIR_MAX = 3;

// STEP 4 — 서술형 답변 (전부 선택): 제출 시 mock 서버 호출 후 결과 화면으로 이동
export default function SupervisorWritten() {
  const { form, update } = useSupervisor();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!form.questions) router.replace('/supervisor/index');
  }, [form.questions]);

  const updateWritten = (patch: Partial<typeof form.written>) =>
    update({ written: { ...form.written, ...patch } });

  const handleSubmit = async () => {
    if (!form.mode) return;
    setError(null);
    setLoading(true);
    try {
      const payload: CreateSupervisorPayload = {
        nickname: form.nickname.trim(),
        position: form.position,
        channel: form.channel,
        mode: form.mode as QuestionMode,
        answers: { ...form.likertAnswers, ...form.scenarioAnswers },
        written: form.written,
      };
      const { supervisor } = await createSupervisor(payload);
      update({ result: supervisor });
      router.replace('/supervisor/result');
    } catch {
      setError('제출에 실패했어요. 잠시 후 다시 시도해주세요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuizLayout
      progress={4 / 4}
      title="서술형 답변"
      onNext={handleSubmit}
      nextLabel="제출"
      loading={loading}
      error={error}
    >
      <Text style={styles.hint}>전부 선택 입력이에요</Text>
      <View style={styles.form}>
        <TagInput
          label="상사님 말버릇"
          value={form.written.catchphrases}
          max={TAG_MAX}
          onChange={(catchphrases) => updateWritten({ catchphrases })}
          placeholder="예: 다시 한번 검토해보자"
        />

        <TextField
          label="화났을 때 신호"
          placeholder="예: 말이 짧아지고 톤이 낮아진다"
          value={form.written.angerSignals}
          onChangeText={(angerSignals) => updateWritten({ angerSignals })}
          multiline
          maxLength={TEXT_MAX_LENGTH}
        />
        <TextField
          label="기분 좋을 때 신호"
          placeholder="예: 농담을 자주 한다"
          value={form.written.happySignals}
          onChangeText={(happySignals) => updateWritten({ happySignals })}
          multiline
          maxLength={TEXT_MAX_LENGTH}
        />
        <TextField
          label="싫어하는 것"
          placeholder="예: 근거 없는 보고"
          value={form.written.dislikes}
          onChangeText={(dislikes) => updateWritten({ dislikes })}
          multiline
          maxLength={TEXT_MAX_LENGTH}
        />
        <TextField
          label="중요하게 여기는 것"
          placeholder="예: 보고 타이밍"
          value={form.written.values}
          onChangeText={(values) => updateWritten({ values })}
          multiline
          maxLength={TEXT_MAX_LENGTH}
        />

        <PairInput
          label="실제 발언과 진짜 뜻 예시"
          hint="이거 쓰면 훨씬 정확해져요"
          value={form.written.examples}
          max={PAIR_MAX}
          onChange={(examples) => updateWritten({ examples })}
        />
      </View>
    </QuizLayout>
  );
}

const styles = StyleSheet.create({
  hint: {
    ...typography.caption,
    color: colors.accent,
    marginTop: signupLayout.titleToForm,
  },
  form: {
    gap: signupLayout.formGap,
    marginTop: signupLayout.formGap,
  },
});
