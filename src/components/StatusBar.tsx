import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { colors, size, typography } from '@/theme';

// Figma: Status Bar (1:212) — 시간 영역 138 + 간격 112 + 신호/배터리 영역 143
export function StatusBar() {
  return (
    <View style={styles.container}>
      <View style={styles.time}>
        <Text style={styles.timeText}>9:41</Text>
      </View>
      <Image
        source={require('../../assets/icons/status-levels.svg')}
        style={styles.levels}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: size.statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    width: 138,
    height: size.statusBarHeight,
    alignItems: 'center',
    paddingTop: 18,
  },
  timeText: {
    ...typography.statusTime,
    color: colors.textPrimary,
  },
  levels: {
    width: 143,
    height: size.statusBarHeight,
  },
});
