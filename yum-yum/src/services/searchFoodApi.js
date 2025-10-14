// 공공 데이터 음식 정보 불러오기
export const fetchNutritionData = async (searchKeyword = '') => {
  const baseUrl = 'http://api.data.go.kr/openapi/tn_pubr_public_nutri_info_api';
  const serviceKey = import.meta.env.VITE_OPEN_API_KEY;

  const params = new URLSearchParams({
    serviceKey: serviceKey,
    pageNo: '1',
    numOfRows: '100',
    type: 'json', // JSON 형식으로 요청
    foodNm: searchKeyword, // 검색할 음식명
  });

  try {
    const response = await fetch(`${baseUrl}?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    // console.log('원본 데이터:', jsonData);

    // 데이터 구조에 따라 파싱
    return parseNutritionData(jsonData);
  } catch (error) {
    console.error('API 호출 또는 파싱 에러:', error);
    throw error;
  }
};

// 데이터 파싱 함수
const parseNutritionData = (jsonData) => {
  const items = jsonData.response?.body?.items || [];

  if (!Array.isArray(items)) {
    return [items]; // 단일 객체인 경우 배열로 변환
  }
  // 필요하면 더 추가
  // console.log(items);
  return items.map((item) => {
    const { amount: size, unit } = parsedFoodSize(item.foodSize);
    const { amount: serving, unit: servingUnit } = parsedFoodSize(item.nutConSrtrQua);
    // console.log(size, unit, serving, servingUnit);
    return {
      id: item.foodCd,
      foodCode: item.foodCd, // 음식코드
      foodName: item.foodNm, // 음식명
      nutrient: {
        kcal: Math.round(parsedKcalAndNutrients(parseFloat(item.enerc), serving, size)) || 0, // 칼로리
        carbs: parsedKcalAndNutrients(parseFloat(item.chocdf), serving, size) || 0, // 탄수화물
        fat: parsedKcalAndNutrients(parseFloat(item.fatce), serving, size) || 0, // 지방
        sugar: parsedKcalAndNutrients(parseFloat(item.sugar), serving, size) || 0, // 당분
        fiber: parsedKcalAndNutrients(parseFloat(item.fibtg), serving, size) || 0, // 식이섬유
        satFat: parsedKcalAndNutrients(parseFloat(item.fasat), serving, size) || 0, // 포화 지방
        transFat: parsedKcalAndNutrients(parseFloat(item.fatrn), serving, size) || 0, // 트랜스지방
        cholesterol: parsedKcalAndNutrients(parseFloat(item.chole), serving, size) || 0, // 콜레스테롤
        sodium: parsedKcalAndNutrients(parseFloat(item.nat), serving, size) || 0, // 나트륨
        protein: parsedKcalAndNutrients(parseFloat(item.prot), serving, size) || 0, // 단백질
      },
      foodSize: size, // 기준량
      foodUnit: unit, // 식품 양 단위
      makerName:
        item.companyNm && item.companyNm !== '해당없음'
          ? item.companyNm
          : item.mkrNm && item.mkrNm !== '해당없음'
            ? item.mkrNm
            : '',
    };
  });
};

// 숫자, 단위 분리(1000ml => 1000, ml)
const parsedFoodSize = (foodSize) => {
  if (!foodSize) return { amount: null, unit: null };

  const match = foodSize.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);

  if (match) {
    return {
      amount: parseFloat(match[1]),
      unit: match[2] || null,
    };
  }
  return { amount: null, unit: foodSize };
};

// 칼로리 및 영양정보 파싱 함수
const parsedKcalAndNutrients = (food, serving, size) => {
  return Number((food * (size / serving)).toFixed(2));
};
