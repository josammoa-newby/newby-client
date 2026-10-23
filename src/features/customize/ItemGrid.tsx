import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';
import { customizeLayout } from './constants';
import {
  BEAK_BASE_SIZE,
  BEAK_BASE_SOURCE,
  BEAK_OVERLAY_SIZE,
  type Item,
} from './items';

type Props = {
  items: Item[];
  selected: number;
  onSelect: (index: number) => void;
};

// Figma: 115x115 타일 3열 (간격 8). 선택된 타일은 2px 검정 테두리
export function ItemGrid({ items, selected, onSelect }: Props) {
  return (
    <View style={styles.grid}>
      {items.map((item, index) => (
        <Pressable
          key={index}
          accessibilityRole="button"
          accessibilityState={{ selected: index === selected }}
          onPress={() => onSelect(index)}
          style={[styles.tile, index === selected && styles.tileSelected]}
        >
          <TileImage item={item} />
        </Pressable>
      ))}
    </View>
  );
}

function TileImage({ item }: { item: Item }) {
  if (item.kind === 'full') {
    return (
      <Image
        source={item.source}
        contentFit="fill"
        style={{
          position: 'absolute',
          left: item.left,
          top: item.top,
          width: item.size,
          height: item.size,
        }}
      />
    );
  }
  return (
    <>
      <Image
        source={BEAK_BASE_SOURCE}
        contentFit="cover"
        style={{
          position: 'absolute',
          left: item.baseLeft,
          top: item.baseTop,
          width: BEAK_BASE_SIZE.width,
          height: BEAK_BASE_SIZE.height,
        }}
      />
      {item.overlay && (
        <Image
          source={item.overlay.source}
          contentFit="fill"
          style={{
            position: 'absolute',
            left: item.overlay.left,
            top: item.overlay.top,
            width: BEAK_OVERLAY_SIZE.width,
            height: BEAK_OVERLAY_SIZE.height,
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: customizeLayout.tileGap,
  },
  tile: {
    width: customizeLayout.tile,
    height: customizeLayout.tile,
    borderRadius: customizeLayout.tileRadius,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  tileSelected: {
    borderWidth: customizeLayout.tileBorder,
    borderColor: colors.textPrimary,
  },
});
