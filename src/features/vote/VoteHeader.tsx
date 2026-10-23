import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { size, spacing } from '@/theme';
import { voteLayout } from './constants';

type Props = {
  onClosePress: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
};

// Figma: 퀴즈 17:1421 — 닫기(왼쪽), 검색·알림(오른쪽). 스크롤되지 않도록 화면에서 ScrollView 밖에 둔다
export function VoteHeader({ onClosePress, onSearchPress, onNotificationPress }: Props) {
  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" accessibilityLabel="닫기" onPress={onClosePress}>
        <Image source={require('../../../assets/vote/close.svg')} style={styles.icon} />
      </Pressable>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel="검색" onPress={onSearchPress}>
          <Image source={require('../../../assets/home/search.svg')} style={styles.icon} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="알림" onPress={onNotificationPress}>
          <Image source={require('../../../assets/home/bell.svg')} style={styles.icon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: voteLayout.headerTop,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm + 4, // 검색·알림 사이 12
  },
  icon: {
    width: size.icon,
    height: size.icon,
  },
});
