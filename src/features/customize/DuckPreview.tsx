import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { customizeColors, customizeLayout } from './constants';
import {
  BEAK_BASE_SIZE,
  BEAK_BASE_SOURCE,
  BEAK_OVERLAY_SIZE,
  type BeakItem,
  type Item,
} from './items';

type Props = {
  // null이면 기본 오리 (배경 이미지에 포함된 모습)
  item: Item | null;
  statusBarHeight: number;
};

// 선택한 항목이 크게 보이는 영역. 오리 머리 중심이 Figma 미리보기(image 4)와 같은 자리에 오도록 맞춤
export function DuckPreview({ item, statusBarHeight }: Props) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.stage]}>
      {item === null ? (
        <Image
          source={require('../../../assets/customize/preview-bg.png')}
          style={[
            styles.background,
            { top: statusBarHeight + customizeLayout.previewBackgroundTop },
          ]}
        />
      ) : (
        <View style={[styles.duck, { top: statusBarHeight + customizeLayout.previewDuckTop }]}>
          {item.kind === 'full' ? (
            <Image
              source={item.source}
              contentFit="fill"
              style={styles.fullDuck}
            />
          ) : (
            <BeakPreview item={item} />
          )}
        </View>
      )}
    </View>
  );
}

function BeakPreview({ item }: { item: BeakItem }) {
  const k = customizeLayout.previewBeakScale;
  const baseW = BEAK_BASE_SIZE.width * k;
  return (
    <>
      <Image
        source={BEAK_BASE_SOURCE}
        contentFit="cover"
        style={{
          position: 'absolute',
          left: -baseW / 2,
          top: 0,
          width: baseW,
          height: BEAK_BASE_SIZE.height * k,
        }}
      />
      {item.overlay && (
        <Image
          source={item.overlay.source}
          contentFit="fill"
          style={{
            position: 'absolute',
            left: -baseW / 2 + (item.overlay.left - item.baseLeft) * k,
            top: (item.overlay.top - item.baseTop) * k,
            width: BEAK_OVERLAY_SIZE.width * k,
            height: BEAK_OVERLAY_SIZE.height * k,
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: customizeColors.stage,
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    left: '50%',
    marginLeft: -customizeLayout.previewBackground / 2,
    width: customizeLayout.previewBackground,
    height: customizeLayout.previewBackground,
  },
  duck: {
    position: 'absolute',
    left: '50%',
    marginLeft: customizeLayout.previewCenterShift,
  },
  fullDuck: {
    position: 'absolute',
    left: -customizeLayout.previewDuck / 2,
    top: 0,
    width: customizeLayout.previewDuck,
    height: customizeLayout.previewDuck,
  },
});
