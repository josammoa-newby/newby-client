import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

// 임시 화면 — 이후 브랜치에서 홈 화면으로 교체
export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>홈</Text>
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
