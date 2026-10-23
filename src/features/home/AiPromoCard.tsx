import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius, spacing } from '@/theme';
import { homeLayout } from './constants';

type Props = {
  onPress: () => void;
};

// 원본 1500x1125 이미지를 153x174 영역에 맞춰 잘라 보여주는 크롭 비율 (Figma 12:1320)
const PHONE_CROP = { width: 610.38, height: 460.11, left: -143.64, top: -14.72 };

// Figma: 뉴비 AI 카드 12:1316~1328 (새로 추가된 섹션). 흰 카드 + 은은한 주황 그라데이션 + 아이폰 목업 + 말풍선 예시
export function AiPromoCard({ onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <LinearGradient
        colors={['rgba(249,160,46,0)', 'rgba(249,160,46,0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.titleRow}>
        <Image source={require('../../../assets/ai/header-star.svg')} style={styles.star} />
        <Text style={styles.title}>뉴비 AI</Text>
      </View>
      <Text style={styles.subtitle}>답변을 준비하고 있어요...</Text>

      <View style={styles.phoneFrame}>
        <Image
          source={require('../../../assets/home/ai-promo-phone.png')}
          style={[styles.phoneImage, PHONE_CROP]}
        />
      </View>

      <View style={styles.bubbleWrap}>
        <Image
          source={require('../../../assets/home/ai-promo-bubble.svg')}
          style={styles.bubbleImage}
        />
        <Text style={styles.bubbleText}>
          {'직장상사가 ‘다시 한번 검토해보자’\n라고 했는데 이거 무슨 뜻이야?'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: homeLayout.aiCardHeight,
    marginTop: homeLayout.aiCardTop,
    marginHorizontal: spacing.screenPadding,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.aiCard,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  gradient: StyleSheet.absoluteFill,
  titleRow: {
    position: 'absolute',
    left: 29,
    top: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  star: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  subtitle: {
    position: 'absolute',
    left: 39,
    top: 63,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.primaryDark,
  },
  phoneFrame: {
    position: 'absolute',
    left: 192,
    top: 10,
    width: 153,
    height: 174,
    overflow: 'hidden',
  },
  phoneImage: {
    position: 'absolute',
  },
  bubbleWrap: {
    position: 'absolute',
    left: 31,
    top: 110,
    width: 203,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleImage: StyleSheet.absoluteFill,
  // theme에 이 회색(#353535) 토큰이 없어 임시로 직접 지정함 (추후 theme 추가 검토)
  bubbleText: {
    width: '100%',
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    color: '#353535',
    textAlign: 'center',
  },
});
