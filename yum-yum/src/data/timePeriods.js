// 시간대 정의
export const TIME_PERIODS = {
  MORNING: { name: '아침', start: 7, end: 12 },
  AFTERNOON: { name: '점심', start: 12, end: 17 },
  EVENING: { name: '저녁', start: 17, end: 22 },
};

// 현재 시간대 확인
export function getCurrentTimePeriod(date = null) {
  const hour = date ? new Date(date)?.getHours() : new Date().getHours();

  for (const [key, period] of Object.entries(TIME_PERIODS)) {
    if (hour >= period.start && hour < period.end) {
      return { key, ...period };
    }
  }

  return null;
}
