import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { login } from '@/api';
import { Button, Checkbox, SocialButton, TextField } from '@/components';
import { authErrorMessage } from '@/features/auth/errorMessage';
import { colors, layout, size, spacing, typography } from '@/theme';

// 에러 문구와 색은 Figma에 없는 임시 디자인 (에러 전용 색 토큰 없음)
const MESSAGE_EMPTY = '아이디와 비밀번호를 입력해주세요';

export default function Login() {
  const insets = useSafeAreaInsets();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // state 갱신 전에 연속으로 눌러도 중복 요청이 나가지 않게 막는다
  const submitting = useRef(false);

  const handleLogin = async () => {
    if (submitting.current) return;
    if (!id.trim() || !password) {
      setError(MESSAGE_EMPTY);
      return;
    }
    setError(null);
    submitting.current = true;
    setLoading(true);
    try {
      // TODO: keepSignedIn(로그인 상태 유지)은 서버 연동 시 api 로 전달
      await login({ id: id.trim(), password });
      router.replace('/home');
    } catch (err) {
      setError(authErrorMessage(err));
      submitting.current = false;
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../../assets/login/logo-newby.svg')}
            style={styles.logo}
          />
          <Text style={styles.title}>
            다시 만나서 반가워요!{'\n'}오늘도 한 걸음 나아가볼까요?
          </Text>

          <View style={styles.form}>
            <TextField
              label="아이디"
              placeholder="아이디를 입력하세요"
              value={id}
              onChangeText={(text) => setId(text.toLowerCase())}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <TextField
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secure
              autoCapitalize="none"
              editable={!loading}
              onSubmitEditing={handleLogin}
            />
          </View>

          <View style={styles.options}>
            <Checkbox
              checked={keepSignedIn}
              onChange={setKeepSignedIn}
              label="로그인 상태 유지"
            />
            <Pressable
              accessibilityRole="link"
              // TODO: 비밀번호 찾기 화면 연결 (다음 브랜치)
              onPress={() => {}}
              style={styles.underlined}
            >
              <Text style={styles.linkMuted}>비밀번호 찾기</Text>
            </Pressable>
          </View>

          <View style={styles.errorArea}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <Button title="로그인" onPress={handleLogin} loading={loading} />

          <View style={styles.links}>
            <Pressable accessibilityRole="link" onPress={() => router.push('/signup')}>
              <Text style={styles.linkText}>회원가입</Text>
            </Pressable>
            <View style={styles.separator} />
            {/* TODO: 아이디 찾기 화면 연결 (다음 브랜치) */}
            <Pressable accessibilityRole="link" onPress={() => {}}>
              <Text style={styles.linkText}>아이디찾기</Text>
            </Pressable>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>간편 로그인</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.social}>
            {/* TODO: 카카오/구글/Apple 로그인 연결 (서버 연동 시) */}
            <SocialButton
              label="카카오 로그인"
              source={require('../../assets/login/social-kakao.png')}
              borderless
              onPress={() => {}}
            />
            <SocialButton
              label="구글 로그인"
              source={require('../../assets/login/social-google.png')}
              onPress={() => {}}
            />
            <SocialButton
              label="Apple 로그인"
              source={require('../../assets/login/social-apple.png')}
              imageStyle={styles.appleImage}
              onPress={() => {}}
            />
          </View>
        </ScrollView>
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
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: layout.logoTop,
    paddingBottom: spacing.xl,
  },
  logo: {
    width: size.logoWidth,
    height: size.logoHeight,
    marginBottom: layout.logoToTitle,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  form: {
    gap: layout.fieldGap,
    marginTop: layout.titleToForm,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: layout.fieldToOptions,
  },
  underlined: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
  },
  linkMuted: {
    ...typography.link,
    color: colors.textMuted,
  },
  // 체크박스 줄 ~ 버튼 사이(Figma 53). 에러 문구가 없어도 간격 유지
  errorArea: {
    minHeight: layout.optionsToButton,
    justifyContent: 'center',
  },
  error: {
    ...typography.caption,
    color: colors.primary,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: layout.linkGap,
    marginTop: layout.buttonToLinks,
  },
  linkText: {
    ...typography.body,
    color: colors.textBody,
  },
  separator: {
    width: 1,
    height: size.linkSeparatorHeight,
    backgroundColor: colors.placeholder,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginTop: layout.linksToDivider,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    ...typography.body,
    color: colors.textMuted,
  },
  social: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: layout.socialGap,
    marginTop: layout.dividerToSocial,
  },
  // Figma 1:205: 원보다 큰 이미지를 잘라 배치
  appleImage: {
    position: 'absolute',
    width: '152.39%',
    height: '270.81%',
    left: '-24.45%',
    top: '-84.12%',
  },
});
