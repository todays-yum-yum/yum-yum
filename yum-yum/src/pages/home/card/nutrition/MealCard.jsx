// 메인 식단(아침,점심,저녁) 기록 카드
import React from 'react';
import clsx from 'clsx';
import CheckButton from './CheckButton';

const MealCard = ({
  meals = {
    _id: 1,
    breakfast: {
      calories: 280,
      foods: '쌀밥, 미역국, 김치, 소고기장조림, 보쌈, 쌀밥, 미역국, 김치, 소고...',
    },
    lunch: { calories: 0, foods: null },
    dinner: { calories: 0, foods: null },
    snack: { calories: 0, foods: null },
  },
  water = { current: 1.2, goal: 2.0 },
  onAddMeal,
  onUpdateMeal,
  onAddWater,
}) => {
  const mealSections = [
    { key: 'breakfast', title: '아침', data: meals.breakfast },
    { key: 'lunch', title: '점심', data: meals.lunch },
    { key: 'dinner', title: '저녁', data: meals.dinner },
    { key: 'snack', title: '기타', data: meals.snack },
  ];

  return (
    <div>
      {/* 식사 섹션들 */}
      {mealSections.map((section, index) => (
        <div key={section.key}>
          <div className='flex justify-between items-start mb-3'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-2'>
                <h3 className='text-gray-800 text-xl font-extrabold'>{section.title}</h3>
                {section.data.foods && section.data.foods.length > 0 && (
                  <div className='flex items-baseline gap-2'>
                    <span className='text-gray-800 text-2xl font-extrabold'>
                      {Math.round(section.data?.calories)}
                    </span>
                    <span className='text-pink-500 text-base font-bold'>kcal</span>
                  </div>
                )}
              </div>

              <p className='text-gray-500 text-sm leading-relaxed line-clamp-1'>
                {section.data.foods || '아직 기록이 없습니다'}
              </p>
            </div>
            <CheckButton
              hasData={section.data.foods && section.data.foods.length > 0}
              onClick={() => {
                if (section.data.calories > 0) {
                  onUpdateMeal(meals._id, section.key);
                } else {
                  onAddMeal(meals._id, section.key);
                }
              }}
            />
          </div>

          {/* 구분선 (마지막 섹션 제외) */}
          {index < mealSections.length - 1 && <div className='border-b border-gray-300 my-4'></div>}
        </div>
      ))}

      {/* 물 섭취 섹션 */}
      <div className='border-b border-gray-300 my-4'></div>

      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <h3 className='text-gray-800 text-xl font-extrabold'>물</h3>
          <div className='flex items-baseline gap-2'>
            <span className='text-pink-500 text-2xl font-extrabold'>
              {water?.current.toFixed(1)}
            </span>
            <span className='text-gray-800 text-base font-bold'>/{water?.goal.toFixed(1)}L</span>
          </div>
        </div>

        <CheckButton hasData={false} onClick={() => onAddWater?.()} />
      </div>
    </div>
  );
};

export default MealCard;
