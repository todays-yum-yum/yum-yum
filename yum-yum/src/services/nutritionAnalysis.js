// AI 호출 API
import { addDoc, collection, getDocs, query, setDoc, where } from 'firebase/firestore';
import { firestore, model } from './firebase';
import { endOfMonth, format, formatDate, startOfMonth } from 'date-fns';
import { getCurrentTimePeriod } from '../data/timePeriods';
import { getTodayKey } from '../utils/dateUtils';

// 프롬프트 생성 함수
// 일간, 주간, 월간 으로 나뉘어짐. DB 저장할 때 해당 타입, 실행 일자, 필요
const systemPrompt = `
너는 영양 전문가입니다.
**분석 기준:**
- 성인 기준 1일 권장량: 탄수화물 300-400g, 단백질 50-60g, 지방 50-65g, 나트륨 2000mg 이하, 칼슘 700mg, 비타민C 100mg
- 과다/부족 기준: 권장량 대비 120% 이상은 과다, 80% 이하는 부족으로 판단
- 결측값(null)이 많은 영양소는 분석에서 제외
**요청사항:**
1-2문장으로 오늘의 영양 상태를 요약하고 개선사항을 제안해주세요.
예시: "오늘은 탄수화물과 나트륨 섭취가 적정하지만, 단백질이 부족합니다. 닭가슴살이나 두부 같은 단백질 식품을 추가로 섭취하세요."
`.trim();
function createPrompt(meals) {
  // 총합 정보만 남기고
  const summary = {
    date: meals.date,
    cal: meals.totalNutrition.totalCalories,
    carb: meals.totalNutrition.totalCarbs,
    prot: meals.totalNutrition.totalProtein,
    fat: meals.totalNutrition.totalFat,
    sodium: meals.totalNutrition.totalSodium,
  };
  return `오늘 식단 총합: ${JSON.stringify(summary)} 분석해줘.`;
}

// AI API 호출 함수
export async function generateNutritionAnalysis(userId, meals) {
  if (!meals) {
    // meals에 아무것도 없을 때
    return {
      text: '식단 데이터가 없습니다. 식단을 입력 후 다시 시도해주세요!',
      timestamp: new Date().toISOString(),
      generatedAt: new Date().toLocaleTimeString(),
      timePeriod: getCurrentTimePeriod()?.name || 'Unknown',
      error: true,
    };
  }
  const prompt = systemPrompt + createPrompt(meals);
  try {
    // model 호출 및 prompt start
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const data = {
      success: true,
      text: text,
      timestamp: new Date().toISOString(),
      generatedAt: new Date().toLocaleTimeString(),
      timePeriod: getCurrentTimePeriod()?.name || 'Unknown',
    };
    // DB 저장
    saveNutritionAnalysis(userId, data, meals.type);

    return data;
  } catch (error) {
    console.error(error);
    return {
      text: '영양 분석 중 오류가 발생했습니다.',
      timestamp: new Date().toISOString(),
      generatedAt: new Date().toLocaleTimeString(),
      timePeriod: getCurrentTimePeriod()?.name || 'Unknown',
      error: true,
    };
  }
}

// 백오프(서버에서 실패 시, 재 실행 함수)
export async function generateNutritionAnalysisWithBackoff(meals) {
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateNutritionAnalysis(meals);
    } catch (err) {
      const isResourceExhausted =
        err.type === 'RESOURCE_EXHAUSTED' || err.message?.includes('overloaded');
      if (!isResourceExhausted || i === maxRetries - 1) {
        // 더 이상 재시도하지 않거나 다른 에러면 던져버린다
        throw err;
      }
      // 잠깐 기다렸다가 재시도 (jitter 포함)
      const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

// ------------------------------
// Ai Api 호출을 위한 식단 데이터 조회
export async function getSelectedData(userId, selectedDate, type) {
  try {
    // 컬랙션 참조 생성
    const mealRef = collection(firestore, 'users', userId, 'meal');
    // type에 따라 쿼리 조건 다르게
    let mealQuery;
    if (type === 'daily') {
      // 하루데이터 = date
      mealQuery = query(mealRef, where('date', '==', format(selectedDate, 'yyyy-MM-dd')));
    } else if (type === 'weekly') {
      // 한 주 데이터
      const { start, end } = makeWeekRange(selectedDate);
      mealQuery = query(mealRef, where('date', '>=', start), where('date', '<=', end));
    } else if (type === 'monthly') {
      // 달 데이텨
      const { start, end } = makeMonthRange(selectedDate);
      mealQuery = query(mealRef, where('date', '>=', start), where('date', '<=', end));
    }
    const querySnapshot = await getDocs(mealQuery);
    const data = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    return {
      success: true,
      data,
      type,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// AI 메시지 로그 저장
export async function saveNutritionAnalysis(userId, analysis, type) {
  const colRef = collection(firestore, 'users', userId, 'aimessage');
  try {
    const docRef = await addDoc(colRef, {
      date: getTodayKey(analysis.timestamp),
      messageType: type,
      message: analysis.text,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(docRef);
    return {
      success: true,
      message: '저장 성공',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: '저장 실패',
    };
  }
}

function makeMonthRange(date) {
  const start = format(startOfMonth(date), 'yyyy-MM-dd');
  const end = format(endOfMonth(date), 'yyyy-MM-dd');
  return { start, end };
}

function makeWeekRange(date) {
  const start = format(startOfMonth(date), 'yyyy-MM-dd');
  const end = format(endOfMonth(date), 'yyyy-MM-dd');
  return { start, end };
}
