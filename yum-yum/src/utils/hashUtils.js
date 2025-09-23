// 해시할 키 배열
const NUTRI_KEYS = ['totalCalories', 'totalCarbs', 'totalProtein', 'totalFat'];

// NUTRI_KEYS 값 문자열화
function makeSignature(totalNutrition) {
  if (!totalNutrition) return '';
  const arr = NUTRI_KEYS.map((key) => totalNutrition[key]);
  return arr.join('|');
}

// 데이터 해시 생성
export function generateDataHash(meals) {
  const dataString = makeSignature(meals?.totalNutrition);
  // console.log(dataString);
  const data = new TextEncoder().encode(dataString);
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data[i];
    hash != 0;
  }
  return Math.abs(hash).toString(16);
}
