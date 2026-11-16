import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';
import { WEEKDAY_LABELS, diaryLayout, diaryOpacity, diaryText } from './constants';
import { DuckIcon } from './DuckIcon';
import { buildMonthGrid, toDateKey } from './utils';

type Props = {
  year: number;
  month: number;
  recordedDates: ReadonlySet<string>;
  // 기록이 있는 날을 눌렀을 때 ('YYYY-MM-DD'). 기록 없는 날은 눌러도 동작 없음
  onPressDay?: (date: string) => void;
};

// Figma: 일기 7:418 요일 줄(7:439) + 날짜 줄(7:447~). 기록한 날은 오리 아이콘이 켜진 모양
export function CalendarGrid({ year, month, recordedDates, onPressDay }: Props) {
  const weeks = buildMonthGrid(year, month);

  return (
    <View>
      <View style={[styles.row, styles.weekdays]}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} style={[styles.weekday, styles.cell]}>
            {label}
          </Text>
        ))}
      </View>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={[styles.row, styles.week]}>
          {week.map((day, dayIndex) => {
            if (day === null) return <View key={dayIndex} style={styles.cell} />;
            const dateKey = toDateKey(year, month, day);
            const recorded = recordedDates.has(dateKey);
            const content = (
              <>
                <Text style={styles.dayNumber}>{day}</Text>
                <DuckIcon recorded={recorded} />
              </>
            );
            if (!recorded || !onPressDay) {
              return (
                <View key={dayIndex} style={[styles.cell, styles.day]}>
                  {content}
                </View>
              );
            }
            return (
              <Pressable
                key={dayIndex}
                accessibilityRole="button"
                accessibilityLabel={`${month}월 ${day}일 일기 보기`}
                onPress={() => onPressDay(dateKey)}
                style={({ pressed }) => [styles.cell, styles.day, pressed && styles.pressed]}
              >
                {content}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: diaryLayout.cellGap,
  },
  weekdays: {
    marginBottom: diaryLayout.weekdaysToGrid,
  },
  week: {
    marginBottom: diaryLayout.rowGap,
  },
  cell: {
    width: diaryLayout.cellWidth,
  },
  weekday: {
    ...diaryText.weekday,
    textAlign: 'center',
    color: colors.textMuted,
  },
  day: {
    alignItems: 'center',
    gap: diaryLayout.cellNumberGap,
  },
  pressed: {
    opacity: diaryOpacity.pressed,
  },
  dayNumber: {
    ...diaryText.dayNumber,
    color: colors.placeholder,
  },
});
