import type { ImageSource } from 'expo-image';

// 탭 3개와 선택지. 타일 안 이미지 위치(left/top/size)는 Figma 값 그대로
export type TabKey = 'face' | 'beak' | 'accessory';

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'face', label: '표정' },
  { key: 'beak', label: '부리' },
  { key: 'accessory', label: '악세서리' },
];

// 오리 한 마리가 통째로 들어있는 이미지 (표정·악세서리·기본 부리)
type FullItem = { kind: 'full'; source: ImageSource; left: number; top: number; size: number };
// 부리 탭은 머리 이미지 위에 부리 조각을 겹쳐 보여줌
export type BeakItem = {
  kind: 'beak';
  baseLeft: number;
  baseTop: number;
  overlay?: { source: ImageSource; left: number; top: number };
};
export type Item = FullItem | BeakItem;

const full = (source: ImageSource, left: number, top: number, size: number): FullItem => ({
  kind: 'full',
  source,
  left,
  top,
  size,
});

const beak = (
  baseLeft: number,
  baseTop: number,
  overlay?: { source: ImageSource; left: number; top: number },
): BeakItem => ({ kind: 'beak', baseLeft, baseTop, overlay });

// 첫 번째 항목이 기본 오리 (처음부터 선택돼 있음)
export const ITEMS: Record<TabKey, Item[]> = {
  face: [
    full(require('../../../assets/customize/face-0.png'), -9, 10, 130),
    full(require('../../../assets/customize/face-3.png'), -7, 11, 125),
    full(require('../../../assets/customize/face-5.png'), -5, 12, 125),
    full(require('../../../assets/customize/face-1.png'), -7, 11, 125),
    full(require('../../../assets/customize/face-4.png'), -7, 11, 125),
    full(require('../../../assets/customize/face-6.png'), -6, 10, 128),
    full(require('../../../assets/customize/face-2.png'), -7, 16, 125),
  ],
  beak: [
    full(require('../../../assets/customize/beak-0.png'), -9, 10, 130),
    beak(-12, 1, { source: require('../../../assets/customize/beak-2.png'), left: 37.02, top: 62.17 }),
    beak(-11, 1, { source: require('../../../assets/customize/beak-4.png'), left: 38.02, top: 61.27 }),
    beak(-12, 0, { source: require('../../../assets/customize/beak-1.png'), left: 37.02, top: 59.37 }),
    beak(-12, 0, { source: require('../../../assets/customize/beak-3.png'), left: 36.12, top: 59.37 }),
    beak(-12, 0, { source: require('../../../assets/customize/beak-5.png'), left: 37.02, top: 59.37 }),
    beak(-12, 0),
  ],
  accessory: [
    full(require('../../../assets/customize/acc-0.png'), -9, 10, 130),
    full(require('../../../assets/customize/acc-4.png'), -7, 12, 130),
    full(require('../../../assets/customize/acc-7.png'), -7, 12, 130),
    full(require('../../../assets/customize/acc-1.png'), -4, 12, 130),
    full(require('../../../assets/customize/acc-5.png'), -7, 12, 130),
    full(require('../../../assets/customize/acc-8.png'), -7, 12, 130),
    full(require('../../../assets/customize/acc-2.png'), -4, 12, 130),
    full(require('../../../assets/customize/acc-6.png'), -7, 12, 130),
    full(require('../../../assets/customize/acc-9.png'), -7, 12, 130),
    full(require('../../../assets/customize/acc-3.png'), -4, 12, 130),
  ],
};

export const BEAK_BASE_SOURCE = require('../../../assets/customize/beak-base.png');
export const BEAK_BASE_SIZE = { width: 140.822, height: 150.218 };
export const BEAK_OVERLAY_SIZE = { width: 42.948, height: 26.985 };

// 색상 칩이 있는 탭 (악세서리 탭은 칩 없음) — 칩은 아직 오리 색을 바꾸지 않고 선택 표시만 함
export type ChipTabKey = 'face' | 'beak';

// Figma 기준 처음 선택돼 있는 칩 (표정: 첫 번째, 부리: 세 번째)
export const DEFAULT_CHIP: Record<ChipTabKey, number> = { face: 0, beak: 2 };
