// 값이 없으면 0 있으면 Number
export const toNum = (v) => {
  if (v == null || String(v).trim() === '') return 0;
  return Number.isNaN(Number(v)) ? 0 : Number(v);
};
