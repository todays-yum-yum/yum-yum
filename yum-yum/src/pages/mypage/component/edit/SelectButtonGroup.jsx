import React, { useEffect, useMemo } from 'react';
import BasicButton from '@/components/button/BasicButton';
import { Controller } from 'react-hook-form';

export default function SelectButtonGroup({ name, control, options, rules = {} }) {
  // 옵션 정규화
  const normalizedOptions = useMemo(() => {
    if (Array.isArray(options)) {
      return options.map((option) => ({
        value: typeof option === 'object' ? option.value : option,
        label: typeof option === 'object' ? option.title || option.label : option,
        sub: typeof option === 'object' ? option.sub : null,
      }));
    }
    // 객체인경우(gender)
    return Object.entries(options).map(([key, value]) => ({
      value: key,
      label: value,
      sub: null,
    }));
  }, [options]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // 저장하지 않을 때, 선택한 값 원래대로 돌려놓은상태로 진행
        return (
          <div className='py-4 space-y-3'>
            {normalizedOptions.map((option) => {
              return (
                <BasicButton
                  key={option.value}
                  type='button'
                  onClick={() => onChange(option.value)}
                  size='full'
                  color={value === option.value ? 'primary' : 'gray'}
                  variant='line'
                >
                  {/* <div className='flex flex-col justify-start items-start'> */}
                  <div>
                    <div
                      className={`text-md text-gray-800 font-bold ${
                        value === option.value ? 'text-primary' : 'text-gray-800'
                      }`}
                    >
                      {option.label}
                    </div>
                    {option.sub && <div className={`text-sm mt-1 text-gray-500`}>{option.sub}</div>}
                  </div>
                </BasicButton>
              );
            })}
          </div>
        );
      }}
    />
  );
}
