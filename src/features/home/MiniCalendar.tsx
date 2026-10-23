import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily } from '@/theme';
import { homeColors } from './constants';

type Props = {
  date: Date;
};

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

// 오늘이 속한 주의 월~일 날짜 7개
function getWeekDates(date: Date): Date[] {
  const day = date.getDay(); // 0=일 ~ 6=토
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Figma: 배너 안 미니 캘린더 12:1224. 월~일 요일 pill 7개, 오늘만 흰 배경 + 강조색 텍스트
export function MiniCalendar({ date }: Props) {
  const weekDates = getWeekDates(date);

  return (
    <View style={styles.row}>
      {weekDates.map((d, i) => {
        const isToday = isSameDay(d, date);
        return (
          <View key={i} style={[styles.cell, isToday && styles.cellToday]}>
            <Text style={[styles.weekday, isToday && styles.textToday]}>{WEEKDAY_LABELS[i]}</Text>
            <Text style={[styles.dateNum, isToday && styles.textToday]}>{d.getDate()}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: 6,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  cellToday: {
    backgroundColor: colors.white,
  },
  weekday: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.white,
  },
  dateNum: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    lineHeight: 17,
    color: colors.white,
  },
  textToday: {
    color: homeColors.calendarToday,
  },
});
