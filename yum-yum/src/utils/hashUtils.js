// 데이터 해시 생성
export function generateDataHash(meals) {
  const dataString = JSON.stringify(meals?.type);
  const encoder = new TextEncoder();
  const data = encoder.encode(dataString);
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data[i];
    hash != 0;
  }
  return Math.abs(hash).toString(16);
}
