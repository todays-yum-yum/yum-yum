// utils/normalizeData.ts
import { eachDayOfInterval, format } from "date-fns";

export function normalizeDataRange(rawData, start, end) {
  // 기준의 모든 날짜만큼 생성
  const allDays = eachDayOfInterval({ start, end });

  // rawData를 Map으로 변환해서 빠른 조회 가능
  const dataMap = new Map(rawData.map((d) => [d.date, d.value]));

  // 모든 날짜를 돌면서 없는 날은 0으로 채움
  return allDays.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    return { date: key, value: dataMap.get(key) ?? 0 };
  });
}
