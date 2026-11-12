import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components';
import { colors, opacity, radius, size, spacing, typography } from '@/theme';
import { DiaryLoading } from '../DiaryStatus';
import { AnalysisCard } from './AnalysisCard';
import { MAX_CONTENT_LENGTH, MIN_ANALYZE_LENGTH, writeLayout } from './constants';
import { MoodChips } from './MoodChips';
import { useDiaryWrite } from './useDiaryWrite';

const close = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/diary');
};

// 일기 작성 → 저장 → AI 분석 결과. Figma 디자인이 없는 임시 UI (색·간격은 일기 화면 스타일을 따름)
export function DiaryWriteScreen() {
  const insets = useSafeAreaInsets();
  const w = useDiaryWrite();
  const empty = w.trimmedLength === 0;
  const tooShort = !empty && w.trimmedLength < MIN_ANALYZE_LENGTH;

  let body: React.ReactNode;
  if (w.phase === 'analyzing') {
    body = <DiaryLoading message="AI가 일기를 읽고 있어요" />;
  } else if (w.phase === 'result' && w.analysis) {
    body = (
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>오늘의 일기 분석</Text>
        <AnalysisCard analysis={w.analysis} />
        <Button title="확인" onPress={close} />
      </ScrollView>
    );
  } else if (w.phase === 'analyzeFailed') {
    body = (
      <View style={styles.centered}>
        <Text style={styles.message}>일기는 저장됐어요. 분석은 다시 시도할 수 있어요</Text>
        {w.error && <Text style={styles.caption}>{w.error}</Text>}
        <Button title="분석 다시 시도" onPress={w.retryAnalyze} />
        <Pressable accessibilityRole="button" hitSlop={8} onPress={close}>
          <Text style={styles.later}>나중에 할게요</Text>
        </Pressable>
      </View>
    );
  } else if (w.phase === 'tooShort') {
    body = (
      <View style={styles.centered}>
        <Text style={styles.message}>일기가 저장됐어요</Text>
        <Text style={styles.caption}>{`${MIN_ANALYZE_LENGTH}자 이상 쓰면 AI 분석을 받을 수 있어요`}</Text>
        <Button title="확인" onPress={close} />
      </View>
    );
  } else {
    const saving = w.phase === 'saving';
    body = (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputBox}>
            <TextInput
              multiline
              editable={!saving}
              value={w.content}
              onChangeText={w.setContent}
              maxLength={MAX_CONTENT_LENGTH}
              placeholder="오늘 하루는 어땠나요?"
              placeholderTextColor={colors.placeholder}
              textAlignVertical="top"
              style={styles.input}
            />
            <Text style={styles.counter}>{`${w.content.length}/${MAX_CONTENT_LENGTH}`}</Text>
          </View>
          {tooShort && (
            <Text style={styles.caption}>{`${MIN_ANALYZE_LENGTH}자 이상 쓰면 AI 분석을 받을 수 있어요`}</Text>
          )}

          <View style={styles.moodSection}>
            <Text style={styles.label}>오늘의 기분 (선택)</Text>
            <MoodChips value={w.mood} onChange={w.setMood} />
          </View>

          {w.error && <Text style={styles.error}>{w.error}</Text>}
          <Button
            title="저장"
            loading={saving}
            onPress={empty ? undefined : w.save}
            style={empty ? styles.disabled : undefined}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="뒤로가기" hitSlop={16} onPress={close}>
          <Image source={require('../../../../assets/signup/back-arrow.svg')} style={styles.back} />
        </Pressable>
        <Text style={styles.title}>일기 쓰기</Text>
      </View>
      {body}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.lg,
  },
  back: {
    width: size.backArrowWidth,
    height: size.backArrowHeight,
  },
  title: {
    ...typography.header,
    color: colors.textPrimary,
  },
  content: {
    gap: writeLayout.sectionGap,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  heading: {
    ...typography.stepTitle,
    color: colors.textPrimary,
  },
  inputBox: {
    minHeight: writeLayout.inputMinHeight,
    padding: spacing.lg,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: writeLayout.inputMinHeight - spacing.lg * 4,
    color: colors.textPrimary,
  },
  counter: {
    ...typography.caption,
    alignSelf: 'flex-end',
    color: colors.textMuted,
  },
  moodSection: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textLabel,
  },
  caption: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textMuted,
  },
  error: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.primaryDark,
  },
  disabled: {
    opacity: opacity.disabled,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
  },
  message: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textBody,
  },
  later: {
    ...typography.action,
    color: colors.textMuted,
  },
});
