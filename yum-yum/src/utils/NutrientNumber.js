// 값이 없으면 undefined 있으면 Number
export const toNum = (v) => (v == null || String(v).trim() === '' ? '-' : Number(v));
