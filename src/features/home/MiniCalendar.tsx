import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, typography } from '@/theme';

type Props = {
  date: Date;
};

const WEEKS_MAX = 6;
const DAYS_PER_WEEK = 7;

function buildWeeks(date: Date): (number | null)[][] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % DAYS_PER_WEEK !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += DAYS_PER_WEEK) {
    weeks.push(cells.slice(i, i + DAYS_PER_WEEK));
  }
  return weeks.slice(0, WEEKS_MAX);
}

// 인사 배너 안의 미니 캘린더. Figma 디자인 없음 — 임시 구현 (날짜는 하드코딩 없이 계산)
export function MiniCalendar({ date }: Props) {
  const weeks = buildWeeks(date);
  const today = date.getDate();
  const monthLabel = date.toLocaleDateString('en-US', { month: 'long' });

  return (
    <View style={styles.container}>
      <Text style={styles.month}>{monthLabel}</Text>
      {weeks.map((week, i) => (
        <View key={i} style={styles.week}>
          {week.map((day, j) => (
            <View key={j} style={styles.cell}>
              {day && (
                <View style={[styles.dayWrap, day === today && styles.dayWrapToday]}>
                  <Text style={[styles.day, day === today && styles.dayToday]}>{day}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const CELL_SIZE = 16;

// theme에 이만큼 작은 폰트 크기·반투명 흰색 토큰이 없어 임시로 직접 지정함 (추후 theme 추가 검토)
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 2,
  },
  month: {
    ...typography.caption,
    color: colors.white,
    marginBottom: 2,
  },
  week: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayWrap: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.circle,
  },
  dayWrapToday: {
    backgroundColor: colors.white,
  },
  day: {
    fontSize: 9,
    lineHeight: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  dayToday: {
    color: colors.primary,
    fontWeight: '700',
  },
});
