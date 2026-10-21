import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

// 임시 화면 — 다음 브랜치에서 로그인 화면으로 교체
export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>로그인</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  text: {
    ...typography.title,
    color: colors.textPrimary,
  },
});
