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
  addDays,
  addWeeks,
  addMonths,
  startOfMonth,
  endOfMonth,
  isDate,
  isValid,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { ko } from 'date-fns/locale';

const today = new Date();
const dateFormat = 'yyyy년 MM월 dd일';

export function dateFormatting(date) {
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

// 이번달 시작 날짜
export function getStartDateOfMonth(date) {
  const newDate = parseDate(date);

  return dateFormatting(startOfMonth(newDate));
}

// 이번달 종료 날짜
export function getEndDateOfMonth(date) {
  const newDate = parseDate(date);

  return dateFormatting(endOfMonth(newDate));
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
  const lastWeekStart = startOfWeek(lastWeek, { locale: ko });

  return dateFormatting(lastWeekStart);
}

// 다음 주
export function getNextWeek(date) {
  const newDate = parseDate(date);
  const nextWeek = addWeeks(newDate, 1);
  const NextWeekStart = startOfWeek(nextWeek, { locale: ko });

  return dateFormatting(NextWeekStart);
}

// 이전달
export function getLastMonth(date) {
  const newDate = parseDate(date);
  const lastMonth = subMonths(newDate, 1);
  const lastMonthStart = startOfMonth(lastMonth);

  return dateFormatting(lastMonthStart);
}

// 다음달
export function getNextMonth(date) {
  const newDate = parseDate(date);
  const nextMonth = addMonths(newDate, 1);
  const NextMonthStart = startOfMonth(nextMonth);

  return dateFormatting(NextMonthStart);
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
    originDate:  new Date(Number(year), Number(month) - 1, Number(date))
  };
};

export const parseKeyDateString = (dateString) => {
  const regex = /^(\d{4})-(\d{1,2})-(\d{2})$/;

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

  let newDate;

  // 비교 대상은 (오늘이 포함된) 단위 기간의 맨 끝 날짜
  // 그 이전이면, 넘어갈 수 있음에도 넘어가지 못할 수 있음
  let compareDate = new Date();

  // 날짜에 따라, 일간/주간/월간 + 1
  if (days === 1) {
    newDate = addDays(curDate, 1);
  } else if (days === 7) {
    newDate = addWeeks(curDate, 1);
    compareDate = endOfWeek(compareDate);
  } else if (days === 30) {
    newDate = addMonths(curDate, 1);
    compareDate = endOfMonth(compareDate);
  }

  newDate.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);

  return newDate <= compareDate;
};

/**
 * 오늘 날짜를 'yyyy-MM-dd' 형식의 키로 변환
 * @param {*} date : Date or date string
 * @returns
 */
export function getTodayKey(input) {
  return format(new Date(input), 'yyyy-MM-dd');
}

/**
 * 시작날짜, 마지막날짜 구하는 함수
 * @param {date} date
 * @param {string} week or month
 */
export function getStartDateAndEndDate(date, type) {
  if (!date) return;
  // console.log(date);
  let startDate, endDate;
  if (type === 'month') {
    startDate = startOfMonth(date);
    endDate = endOfMonth(date);
  } else if (type === 'week') {
    // 해당 주의 시작일, 끝일
    startDate = startOfWeek(date, { weekStartsOn: 0 });
    endDate = endOfWeek(date, { weekStartsOn: 0 });
  } else {
    // year
    // 한 해의 시작일, 끝 일자
    startDate = startOfYear(date);
    endDate = endOfYear(date);
  }
  return {
    start: format(startDate, 'yyyy-MM-dd'),
    end: format(endDate, 'yyyy-MM-dd'),
  };
}
