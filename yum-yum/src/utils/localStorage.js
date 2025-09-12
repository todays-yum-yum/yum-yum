// AI 호출 관련 임시 저장용 localStorage
export function markExecutedInTimePeriod(date, timePeriodKey, dataHash) {
  localStorage.setItem(`nutrition_executed_${date}_${timePeriodKey}_${dataHash}`, 'true');
}

export function hasExecutedInTimePeriod(date, timePeriodKey, dataHash) {
  return localStorage.getItem(`nutrition_executed_${date}_${timePeriodKey}_${dataHash}`) === 'true';
}
