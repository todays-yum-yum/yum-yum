import {
  format,
  parse,
  getWeekOfMonth as getWeekOfMonthFns,
  startOfWeek,
  endOfWeek,
  getMonth,
  subDays,
  subWeeks,
  subMonths,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';

const today = new Date();
const dateFormat = 'yyyy년 MM월 dd일';

function dateFormatting(date) {
  return format(date, dateFormat, { locale: ko });
}

function parseDate(date) {
  return parse(date, dateFormat, new Date());
}

// ----

// 오늘
export function todayDate() {
  return dateFormatting(today);
}

// 요일
export function getDayOfWeek(date) {
  const newDate = parseDate(date);
  return format(newDate, 'E', { locale: ko });
}

// 몇번째 주인지
export function getWeekOfMonth(date) {
  const newDate = parseDate(date);
  return getWeekOfMonthFns(newDate);
}

// 몇 월인지
export function getMonths(date) {
  const newDate = parseDate(date);
  return getMonth(newDate);
}

// 이번주 시작 날짜
export function getStartDateOfWeek(date) {
  const newDate = parseDate(date);
  return dateFormatting(startOfWeek(newDate));
}

// 이번주 종료 날짜
export function getEndDateOfWeek(date) {
  const newDate = parseDate(date);
  return dateFormatting(endOfWeek(newDate));
}

// ---

// 전날
export function getYesterday(date) {
  const newDate = parseDate(date);
  return dateFormatting(subDays(newDate, 1));
}

// 다음날
export function getTomorrow(date) {
  const newDate = parseDate(date);
  return dateFormatting(addDays(newDate, 1));
}

// 전 주
export function getLastWeek(date) {
  const newDate = parseDate(date);
  const lastWeek = subWeeks(newDate, 1);
  const lastWeekEnd = endOfWeek(lastWeek, { locale: ko });

  return dateFormatting(lastWeekEnd);
}

// 다음 주
export function getNextWeek(date) {
  const newDate = parseDate(date);
  const nextWeek = addWeeks(newDate, 1);
  const NextWeekend = endOfWeek(nextWeek, { locale: ko });

  return dateFormatting(NextWeekend);
}

// 이전달
export function getLastMonth(date) {
  const newDate = parseDate(date);
  const lastMonth = subMonths(newDate, 1);
  const lastMonthEnd = endOfMonth(lastMonth);
  return dateFormatting(lastMonthEnd);
}

// 다음달
export function getNextMonth(date) {
  const newDate = parseDate(date);
  const nextMonth = addMonths(newDate, 1);
  const NextMonthEnd = endOfMonth(nextMonth);
  return dateFormatting(NextMonthEnd);
}

// ---

// 년 월 일 추출 - 정규식 이용
export const parseDateString = (dateString) => {
  const regex = /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/;
  const match = dateString.match(regex);

  const [full, year, month, date] = match;

  return {
    year,
    month: month.padStart(2, '0'),
    date: date.padStart(2, '0'),
    fullDate: `${year}년 ${month.padStart(2, '0')}월 ${date.padStart(2, '0')}일`,
  };
};

// 오늘보다 미래로 갈수 없게, 이동 여부 가능 체크
export const canMoveDate = (date, days) => {
  const curDate = parseDate(date);
  const newDate = addDays(curDate, days)

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  newDate.setHours(0, 0, 0, 0);

  console.log(today, newDate);

  return newDate <= today;
};
