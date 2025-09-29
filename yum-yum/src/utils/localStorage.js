// AI 호출 관련 임시 저장용 localStorage
export function markExecutedInTimePeriod(date, timePeriodKey, dataHash) {
  localStorage.setItem(`nutrition_executed_${date}_${timePeriodKey}_${dataHash}`, 'true');
}

export function hasExecutedInTimePeriod(date, timePeriodKey, dataHash) {
  return localStorage.getItem(`nutrition_executed_${date}_${timePeriodKey}_${dataHash}`) === 'true';
}

// User 호출
export function callUserUid() {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    //JSON 파싱
    const parsedData = JSON.parse(authStorage);
    //userID 리턴
    const userid = parsedData.state.userId;
    // console.log(authStorage);
    return userid;
  } else {
    return null;
  }
}

export function hasCurrentWeight() {
  const weightStorage = localStorage.getItem('current-weight');
  if (weightStorage) {
    const parsedData = JSON.parse(weightStorage);
    const currentWeight = parsedData.state;
    return currentWeight;
  } else return null;
}
