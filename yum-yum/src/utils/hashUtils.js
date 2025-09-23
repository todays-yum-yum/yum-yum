// 데이터 해시 생성
export function generateDataHash(meals) {
  // console.log(meals);
  // meals 객체의 totalNutrition 속성을 문자열로 변환하여 해시 생성
  const dataString = JSON.stringify(meals?.totalNutrition);
  const data = new TextEncoder().encode(dataString);
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data[i];
    hash != 0;
  }
  return Math.abs(hash).toString(16);
}
