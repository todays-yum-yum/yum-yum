import { format, parse } from 'date-fns';
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

export function todayDate() {
  return dateFormatting(today)
}

export function getDayOfWeekShort(date) {
  const newDate = parseDate(date)
  return format(newDate, 'E', { locale: ko }); 
}