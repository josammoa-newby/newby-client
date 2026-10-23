import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontFamily, radius, spacing } from '@/theme';
import { ColorChips } from './ColorChips';
import { customizeColors, customizeLayout } from './constants';
import { DuckPreview } from './DuckPreview';
import { ItemGrid } from './ItemGrid';
import { DEFAULT_CHIP, ITEMS, TABS, type ChipTabKey, type TabKey } from './items';

const DEFAULT_SELECTION: Record<TabKey, number> = { face: 0, beak: 0, accessory: 0 };

// Figma: 커스터마이징 표정 20:1646 · 부리 20:1689 · 악세서리 20:1743 — 같은 화면의 탭 3개
// 위쪽(미리보기·탭·색상 칩)은 고정이고, 항목 선택 영역만 세로로 스크롤된다
export function CustomizeScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>('face');
  const [selection, setSelection] = useState(DEFAULT_SELECTION);
  const [chips, setChips] = useState(DEFAULT_CHIP);
  // 미리보기는 가장 최근에 고른 (기본이 아닌) 항목을 보여준다
  const [previewTab, setPreviewTab] = useState<TabKey | null>(null);

  const hasChips = tab !== 'accessory';
  const previewItem =
    previewTab && selection[previewTab] !== 0 ? ITEMS[previewTab][selection[previewTab]] : null;

  const handleSelectItem = (index: number) => {
    setSelection((prev) => ({ ...prev, [tab]: index }));
    setPreviewTab(index === 0 ? null : tab);
  };

  const handleReset = () => {
    setSelection(DEFAULT_SELECTION);
    setChips(DEFAULT_CHIP);
    setPreviewTab(null);
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top + customizeLayout.stageHeight }}>
        <DuckPreview item={previewItem} statusBarHeight={insets.top} />
        <View style={[styles.topRow, { top: insets.top + customizeLayout.buttonTop }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="뒤로가기" onPress={handleBack}>
            <Image source={require('../../../assets/customize/back.svg')} style={styles.back} />
          </Pressable>
          <Pressable accessibilityRole="button" onPress={handleBack} style={styles.pill}>
            <Text style={styles.pillText}>완료</Text>
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={handleReset}
          style={[styles.pill, styles.reset]}
        >
          <Image source={require('../../../assets/customize/reset.svg')} style={styles.resetIcon} />
          <Text style={styles.pillText}>초기화</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        <View style={styles.tabs}>
          {TABS.map(({ key, label }) => {
            const active = key === tab;
            return (
              <Pressable
                key={key}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => setTab(key)}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {hasChips && (
          <ColorChips
            selected={chips[tab as ChipTabKey]}
            onSelect={(index) => setChips((prev) => ({ ...prev, [tab]: index }))}
          />
        )}

        <ScrollView
          style={styles.gridScroll}
          contentContainerStyle={[
            styles.gridContent,
            {
              paddingTop: hasChips ? customizeLayout.chipsBottom : customizeLayout.gridTopNoChips,
              paddingBottom: insets.bottom + spacing.lg,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ItemGrid items={ITEMS[tab]} selected={selection[tab]} onSelect={handleSelectItem} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topRow: {
    position: 'absolute',
    left: spacing.screenPadding,
    right: spacing.screenPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: {
    width: customizeLayout.backButton,
    height: customizeLayout.backButton,
  },
  pill: {
    height: customizeLayout.backButton,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl + 6, // 완료: 30
    borderRadius: radius.circle * 10,
    backgroundColor: colors.white,
  },
  pillText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textLabel,
  },
  reset: {
    position: 'absolute',
    left: spacing.screenPadding,
    bottom: customizeLayout.resetBottom,
    paddingHorizontal: spacing.xl - 4, // 초기화: 20
  },
  resetIcon: {
    width: 20,
    height: 20,
  },
  panel: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: customizeLayout.tabPaddingY,
    borderBottomWidth: customizeLayout.tabUnderline,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 27,
    color: colors.textMuted,
  },
  tabTextActive: {
    fontFamily: fontFamily.semiBold,
    color: colors.textLabel,
  },
  gridScroll: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: spacing.screenPadding,
  },
});
