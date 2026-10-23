import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily } from '@/theme';

type Props = {
  date: Date;
};

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
  return weeks;
}

// Figma: 배너 안 미니 캘린더 4:159 (월 라벨 + 7열 날짜, 오늘은 흰 원 + 주황 숫자)
export function MiniCalendar({ date }: Props) {
  const weeks = buildWeeks(date);
  const today = date.getDate();
  const monthLabel = date.toLocaleDateString('en-US', { month: 'long' });

  return (
    <View style={styles.container}>
      <Text style={styles.month}>{monthLabel}</Text>
      {weeks.map((week, i) => (
        <View key={i} style={styles.week}>
          {week.map((day, j) => {
            const isToday = day === today;
            return (
              <View key={j} style={[styles.cell, isToday && styles.cellToday]}>
                {day !== null && (
                  <Text style={[styles.day, isToday && styles.dayToday]}>{day}</Text>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const CELL_SIZE = 15.714;

const styles = StyleSheet.create({
  container: {
    width: CELL_SIZE * DAYS_PER_WEEK,
  },
  month: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11.224,
    lineHeight: 13,
    color: colors.white,
  },
  week: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CELL_SIZE / 2,
  },
  cellToday: {
    backgroundColor: colors.white,
  },
  day: {
    fontFamily: fontFamily.semiBold,
    fontSize: 6.735,
    lineHeight: 10,
    color: colors.white,
  },
  dayToday: {
    color: colors.accent,
  },
});
