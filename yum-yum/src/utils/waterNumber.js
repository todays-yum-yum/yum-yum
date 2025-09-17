export const toNum = (v) => {
  if (v == null) return null;

  // 인풋 지웠을때 0사라지게
  const str = String(v).trim();
  if (str === '') return '';

  // 숫자가 아니면 ''
  const num = Number(str);
  return isNaN(num) ? '' : num;
};
