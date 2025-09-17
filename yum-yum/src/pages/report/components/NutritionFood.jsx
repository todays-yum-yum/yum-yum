import React, { useState } from 'react';
import BasicButton from '@/components/button/BasicButton';
import { toNum } from '../../../utils/NutrientNumber';
import clsx from 'clsx';

function FoodData({ foodName, percent, value, count }) {
  const textStyle = 'font-bold text-xl text-center';

  // 음식 정보 상세
  return (
    <div className='w-full flex flex-row items-center justify-around'>
      <span className={clsx(textStyle, 'w-45')}>{foodName}</span>
      <span className={clsx(textStyle, 'w-15')}>{percent}%</span>
      <span className={clsx(textStyle, 'w-25')}>{value}g</span>
      <span className={clsx(textStyle, 'w-20')}>{count}회</span>
    </div>
  );
}

function FoodSection({ rowData }) {
  // console.log(rowData);

  // 음식 데이터 줄별로
  return (
    <article className='w-full flex flex-col p-2.5 gap-2.5 border-b-1 border-gray-300'>
      <FoodData {...rowData} />
    </article>
  );
}

export default function NutritionFood({ foodData }) {
  // console.log(foodData);

  const [showMore, setShowMore] = useState(false);
  const [foodLength, setFoodLength] = useState(foodData.food?.length ?? 0);

  const nutritionType = (name) => {
    let types = "";

    if(name === "탄수화물" ) {
      types = "carbs"
    } else if(name === "단백질" ) {
      types = "protein"
    } else if(name === "지방" ) {
      types = "fat"
    }

    return types
  }

  const valueType = nutritionType(foodData.name);

  const totalValue = foodData.total;

  return (
    <section className='w-full flex flex-col items-center gap-7.5 mt-2.5 mb-2.5 '>
      {/* 음식 정보 */}
      {(showMore ? foodData.food : foodData.food.slice(0, Math.min(foodLength, 3))).map(
        (food, i) => {
          const foodValue = toNum(food.nutrient?.[valueType]);
          const percent = totalValue > 0 ? Math.round((foodValue / totalValue) * 100) : 0;

          // 동적으로 prop 객체 생성
          const dynamicProps = {
            foodName: food.foodName,
            percent: percent,
            value: foodValue.toFixed(1),
            count: food.count,
          };

          return <FoodSection key={i} rowData={dynamicProps} />;
        },
      )}
      {/* 음식 더보기 접기 버튼 */}
      <BasicButton onClick={() => setShowMore(!showMore)}>
        {showMore ? '접기' : '더보기'}
      </BasicButton>
    </section>
  );
}
