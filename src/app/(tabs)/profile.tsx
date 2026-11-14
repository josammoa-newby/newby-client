import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { logout } from '@/api';
import { PlaceholderScreen } from '@/components';
import { colors, spacing, typography } from '@/theme';

// 임시 화면 — 이후 브랜치에서 프로필 화면으로 교체
export default function Profile() {
  return (
    <View style={styles.container}>
      <PlaceholderScreen name="프로필" />
      {/* TODO(temp): 마이페이지 디자인이 확정되면 상사 관리 진입점을 옮김 */}
      <Pressable accessibilityRole="button" onPress={() => router.push('/supervisors')} style={styles.supervisors}>
        <Text style={styles.supervisorsText}>내 상사 관리</Text>
      </Pressable>
      {/* TODO(temp): 마이페이지 디자인이 확정되면 이 버튼을 설정 화면으로 이동 */}
      <Pressable accessibilityRole="button" onPress={() => void logout()} style={styles.logout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  supervisors: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  supervisorsText: {
    ...typography.body,
    color: colors.primaryDark,
  },
  logout: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  logoutText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
