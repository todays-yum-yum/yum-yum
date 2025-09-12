import { useState } from 'react';
import { getCurrentTimePeriod } from '../../../data/timePeriods';
import { useMeals } from '../../../hooks/useMeals';
import { useNutritionAnalysis } from '../../../hooks/useNutritionAnalysis';

const userId = 'yZxviIBudsaf8KYYhCCUWFpy3Ug1'; // test용 ID 추후 쿠키에서 불러오는 방향으로 수정
export default function TestPage() {
  const [searchType, setSearchType] = useState('daily');
  const selectedDate = new Date('2025-09-10');
  const currentTimePeriod = getCurrentTimePeriod(selectedDate);

  // 1. Firestore 에서 식단 가져오기
  const {
    data: meals,
    isLoading: mealsLoading,
    isError: mealsError,
    error: mealsErrorMsg,
    dataUpdatedAt,
    status: mealsStatus,
  } = useMeals(userId, selectedDate, searchType);

  // 2. meals가 준비되면 AI 분석
  const {
    data: aiResult,
    isLoading: aiLoading,
    isError: aiError,
    error: aiErrorMsg,
    status,
    isCached,
  } = useNutritionAnalysis(userId, meals, selectedDate, currentTimePeriod);

  // 로딩/에러 처리
  if (mealsLoading) return <div>식단 불러오는 중…</div>;
  if (mealsError) return <div>식단 조회 실패: {mealsErrorMsg.message}</div>;

  if (aiLoading) return <div>AI 결과 불러오는 중...</div>;
  if (aiError) return <div>AI 조회 실패: {aiErrorMsg.message} </div>;

  return (
    <div className='p-[20px] flex flex-col justify-center item-center text-center'>
      <h1 className='font-bold text-2xl p-3'>🍎 스마트 식단 분석 Test</h1>
      <select
        value={searchType || 'daily'}
        onChange={(e) => {
          setSearchType(e.target.value);
          // useMeals의 훅을 부르는것을 만들어야함
        }}
        // style={{ padding: '5px', fontSize: '14px' }}
        className='p-5 text-lg border rounded-lg mb-4'
      >
        <option value='daily'>일간</option>
        <option value='weekly'>주간</option>
        <option value='monthly'>월간</option>
      </select>
      <div className='mb-4 p-4 bg-gray-100 rounded-lg flex flex-col justify-center item-center text-center'>
        <h3 className='text-lg font-semibold'>📊 현재 상태</h3>
        <p>⏰ 분석 날짜: {new Date(selectedDate).toLocaleDateString()}</p>
        <p>✅ 분석 가능: {currentTimePeriod ? 'Yes' : 'No'}</p>
        <p>🔄 이번 시간대 실행 여부: {status ? 'Already Executed' : 'Not Executed'}</p>
        <p>💾 캐시 상태: {isCached ? '✅ Cached' : '🆕 No Cache'}</p>
        <p>📅 마지막 업데이트: {new Date(dataUpdatedAt).toLocaleString()}</p>
      </div>
      <div className='mb-4 p-4 bg-gray-100 rounded-lg flex flex-col justify-center item-center text-center'>
        {/* 식단 데이터 */}
        <h3 className='text-lg font-semibold'>식단 데이터</h3>
        <p>{JSON.stringify(meals, null, 2)}</p>
      </div>
      <div className='mb-4 p-4 bg-gray-100 rounded-lg flex flex-col justify-center item-center text-center'>
        <p className=''>{JSON.stringify(aiResult)}</p>
      </div>
    </div>
  );
}
