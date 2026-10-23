import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { checkIdAvailable } from '@/api';
import { Checkbox, TextField } from '@/components';
import { authErrorMessage } from '@/features/auth/errorMessage';
import {
  MAX_PASSWORD_LENGTH,
  USERNAME_RULE_MESSAGE,
  isValidUsername,
  normalizeUsername,
} from '@/features/auth/validation';
import { SignupLayout } from '@/features/signup/SignupLayout';
import { useSignup } from '@/features/signup/SignupContext';
import { signupLayout } from '@/theme';

// 비밀번호 최소 길이: Figma 플레이스홀더 "8자 이상 입력하세요"
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 에러 문구는 Figma에 없는 임시 문구
export default function SignupStep1() {
  const { form, update } = useSignup();
  const [checkingId, setCheckingId] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checking = useRef(false);

  const handleCheckId = async () => {
    if (checking.current) return;
    const id = normalizeUsername(form.id);
    if (!id) {
      setError('아이디를 입력해주세요');
      return;
    }
    if (!isValidUsername(id)) {
      setError(USERNAME_RULE_MESSAGE);
      return;
    }
    setError(null);
    checking.current = true;
    setCheckingId(true);
    try {
      const { available } = await checkIdAvailable(id);
      if (available) {
        update({ verifiedId: id });
      } else {
        update({ verifiedId: '' });
        setError('이미 사용 중인 아이디예요');
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      checking.current = false;
      setCheckingId(false);
    }
  };

  const handleNext = () => {
    const message = validate();
    setError(message);
    if (!message) router.push('/signup/step2');
  };

  const validate = () => {
    if (!form.name.trim()) return '이름을 입력해주세요';
    if (!form.id.trim()) return '아이디를 입력해주세요';
    if (!isValidUsername(normalizeUsername(form.id))) return USERNAME_RULE_MESSAGE;
    if (form.verifiedId !== normalizeUsername(form.id)) return '아이디 중복확인을 해주세요';
    if (form.password.length < MIN_PASSWORD_LENGTH) return '비밀번호는 8자 이상 입력해주세요';
    if (form.password.length > MAX_PASSWORD_LENGTH) return '비밀번호는 72자 이하로 입력해주세요';
    if (form.password !== form.passwordConfirm) return '비밀번호가 일치하지 않아요';
    if (!EMAIL_PATTERN.test(form.email.trim())) return '이메일 형식이 올바르지 않아요';
    if (!form.agreeTerms || !form.agreePrivacy) return '필수 약관에 동의해주세요';
    return null;
  };

  return (
    <SignupLayout
      progress={1 / 3}
      title={'STEP 1. \nNewby 시작하기'}
      onNext={handleNext}
      error={error}
    >
      <View style={styles.form}>
        <TextField
          label="이름"
          placeholder="이름을 입력하세요"
          value={form.name}
          onChangeText={(name) => update({ name })}
        />
        <TextField
          label="아이디"
          placeholder="아이디를 입력하세요"
          value={form.id}
          onChangeText={(id) => update({ id: id.toLowerCase() })}
          autoCapitalize="none"
          autoCorrect={false}
          action={{ title: '확인', onPress: handleCheckId, loading: checkingId }}
        />
        <TextField
          label="비밀번호"
          placeholder="8자 이상 입력하세요"
          value={form.password}
          onChangeText={(password) => update({ password })}
          secure
          autoCapitalize="none"
        />
        <TextField
          label="비밀번호 확인"
          placeholder="8자 이상 입력하세요"
          value={form.passwordConfirm}
          onChangeText={(passwordConfirm) => update({ passwordConfirm })}
          secure
          autoCapitalize="none"
        />
        <TextField
          label="이메일"
          placeholder="이메일을 입력하세요"
          value={form.email}
          onChangeText={(email) => update({ email })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.checks}>
        {/* TODO: 약관 상세 보기 화면은 Figma에 없음 */}
        <Checkbox
          checked={form.agreeTerms}
          onChange={(agreeTerms) => update({ agreeTerms })}
          label="이용약관 동의"
          tag={{ text: '(필수)', required: true }}
        />
        <Checkbox
          checked={form.agreePrivacy}
          onChange={(agreePrivacy) => update({ agreePrivacy })}
          label="개인정보 처리방침 동의"
          tag={{ text: '(필수)', required: true }}
        />
        <Checkbox
          checked={form.agreeMarketing}
          onChange={(agreeMarketing) => update({ agreeMarketing })}
          label="마케팅 정보 수신 동의"
          tag={{ text: '(선택)', required: false }}
        />
      </View>
    </SignupLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: signupLayout.formGap,
    marginTop: signupLayout.titleToForm,
  },
  checks: {
    gap: signupLayout.checkGap,
    marginTop: signupLayout.formToChecks,
  },
});
