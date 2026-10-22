import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

// 아직 구현하지 않은 탭 화면용 임시 화면 — 이후 브랜치에서 실제 화면으로 교체
export function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
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
