import React from 'react';
import clsx from 'clsx';
import IconMode from '@/assets/icons/icon-mode.svg?react';
import IconPlus from '@/assets/icons/icon-plus.svg?react';

export default function CheckButton({ hasData = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:scale-105',
        hasData ? 'bg-secondary hover:bg-secondary-hover' : 'bg-primary hover:bg-primary-hover',
      )}
    >
      {hasData ? (
        // 편집 아이콘 (빨간색)
        <IconMode />
      ) : (
        // 추가 아이콘 (초록색)
        <IconPlus fill={'#12b76a'} />
      )}
    </button>
  );
}
