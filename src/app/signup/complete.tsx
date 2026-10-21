import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components';
import { useSignup } from '@/features/signup/SignupContext';
import { colors, signupLayout, size, spacing, typography } from '@/theme';

export default function SignupComplete() {
  const insets = useSafeAreaInsets();
  const { form, reset } = useSignup();

  // 가입이 끝났으므로 Android 뒤로가기로 이전 단계에 돌아가지 못하게 막음
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, []);

  const handleStart = () => {
    reset();
    // Figma에 이동 대상이 없어 임시 홈으로 이동
    router.replace('/home');
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + signupLayout.completeTop },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {`환영해요. ${form.name}님,\n회원가입이 완료되었어요! 👏`}
        </Text>
        <Text style={styles.body}>
          {'아래 버튼을 눌러서\n뉴비를 시작해보세요!'}
        </Text>
        <Image
          source={require('../../../assets/signup/mascot-welcome.png')}
          contentFit="cover"
          style={styles.mascot}
        />
      </View>
      <View style={styles.footer}>
        <Button title="뉴비 시작하기" onPress={handleStart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  title: {
    ...typography.completeTitle,
    color: colors.textPrimary,
  },
  body: {
    ...typography.completeBody,
    color: colors.textMuted,
    marginTop: signupLayout.completeTitleToBody,
  },
  mascot: {
    alignSelf: 'center',
    width: size.mascot,
    height: size.mascot,
    marginTop: signupLayout.completeBodyToMascot,
  },
  footer: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: signupLayout.footerBottom,
  },
});
