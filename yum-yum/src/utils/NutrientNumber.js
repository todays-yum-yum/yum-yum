// 값이 없으면 null 있으면 Number
export const toNum = (v) => {
  if (v == null || String(v).trim() === '') return null;
  return isNaN(Number(v)) ? null : Number(v);
};

// 숫자면 소수점 한자리까지 반올림
export const roundTo1 = (v) => (Number.isFinite(v) ? Math.round(v * 10) / 10 : v);

// 문자열을 숫자로 변환
export const strToNum = (v) => {
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};
