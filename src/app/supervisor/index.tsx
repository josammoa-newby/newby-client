import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OptionButton, SelectCard, TextField } from '@/components';
import { QuizLayout } from '@/features/supervisor/components/QuizLayout';
import { getQuestions, type QuestionMode } from '@/features/supervisor/mock';
import { CHANNELS, MODES, POSITIONS } from '@/features/supervisor/options';
import { useSupervisor } from '@/features/supervisor/SupervisorContext';
import { colors, signupLayout, typography } from '@/theme';

const NICKNAME_MAX_LENGTH = 20;

// STEP 1 — 상사 추가: 별명/직급/소통 채널/측정 방식
export default function SupervisorAdd() {
  const { form, update } = useSupervisor();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    const nickname = form.nickname.trim();
    if (!nickname) {
      setError('별명을 입력해주세요');
      return;
    }
    if (!form.channel) {
      setError('주로 소통하는 방식을 선택해주세요');
      return;
    }
    if (!form.mode) {
      setError('측정 방식을 선택해주세요');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const questions = await getQuestions(form.mode as QuestionMode);
      update({ nickname, questions, likertAnswers: {}, scenarioAnswers: {} });
      router.push('/supervisor/likert');
    } catch {
      setError('질문지를 불러오지 못했어요. 잠시 후 다시 시도해주세요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuizLayout progress={1 / 4} title="상사 추가" onNext={handleNext} loading={loading} error={error}>
      <Text style={styles.hint}>실명 대신 별명을 써주세요</Text>
      <View style={styles.form}>
        <TextField
          label="별명"
          placeholder="예: 꼼꼼팀장"
          value={form.nickname}
          onChangeText={(nickname) => update({ nickname: nickname.slice(0, NICKNAME_MAX_LENGTH) })}
          maxLength={NICKNAME_MAX_LENGTH}
        />

        <View>
          <Text style={styles.label}>직급 (선택)</Text>
          <View style={styles.optionList}>
            {POSITIONS.map((position) => (
              <OptionButton
                key={position.value}
                label={position.label}
                selected={form.position === position.value}
                onPress={() =>
                  update({ position: form.position === position.value ? '' : position.value })
                }
              />
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.label}>주로 소통하는 방식</Text>
          <View style={styles.optionList}>
            {CHANNELS.map((channel) => (
              <OptionButton
                key={channel.value}
                label={channel.label}
                selected={form.channel === channel.value}
                onPress={() => update({ channel: channel.value })}
              />
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.label}>측정 방식</Text>
          <View style={styles.modeRow}>
            {MODES.map((mode) => (
              <SelectCard
                key={mode.value}
                emoji={mode.emoji}
                label={mode.label}
                selected={form.mode === mode.value}
                onPress={() => update({ mode: mode.value })}
              />
            ))}
          </View>
        </View>
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
  label: {
    ...typography.label,
    color: colors.textLabel,
    marginBottom: signupLayout.optionGap,
  },
  optionList: {
    gap: signupLayout.optionGap,
  },
  modeRow: {
    flexDirection: 'row',
    gap: signupLayout.cardGap,
  },
});
