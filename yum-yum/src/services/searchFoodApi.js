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
    return [];
  }
};

// 데이터 파싱 함수
const parseNutritionData = (jsonData) => {
  const items = jsonData.response?.body?.items || [];

  if (!Array.isArray(items)) {
    return [items]; // 단일 객체인 경우 배열로 변환
  }
  // 필요하면 더 추가
  return items.map((item) => {
    const { amount: size, unit } = parsedFoodSize(item.foodSize);
    return {
      id: item.foodCd,
      foodCode: item.foodCd, // 음식코드
      foodName: item.foodNm, // 음식명
      nutrient: {
        kcal: parseFloat(item.enerc) || 0, // 칼로리
        carbs: parseFloat(item.chocdf) || 0, // 탄수화물
        fat: parseFloat(item.fatce) || 0, // 지방
        sugar: parseFloat(item.sugar) || 0, // 당분
        fiber: parseFloat(item.fibtg) || 0, // 식이섬유
        satFat: parseFloat(item.fasat) || 0, // 포화 지방
        transFat: parseFloat(item.fatrn) || 0, // 트랜스지방
        cholesterol: parseFloat(item.chole) || 0, // 콜레스테롤
        sodium: parseFloat(item.nat) || 0, // 나트륨
        protein: parseFloat(item.prot) || 0, // 단백질
      },
      foodSize: size, // 기준량
      foodUnit: unit, // 식품 양 단위
      makerName: item.mkrNm || '', // 제조사
      company: item.companyNm || '', // 제조사
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
