import React from 'react';

export default function MealTabs({ activeTabId, onChange, tabItem }) {
  return (
    <div className='flex'>
      {tabItem.map((tab) => (
        <button
          key={tab.id}
          type='button'
          onClick={() => onChange(tab.id)}
          className={`w-full py-4 text-center cursor-pointer text-gray-800 font-bold text-md ${
            activeTabId === tab.id ? 'border-b-2 border-primary' : 'border-b-2 border-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
