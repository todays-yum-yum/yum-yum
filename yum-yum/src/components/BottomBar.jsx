import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 아이콘
import HomeIcon from '@/assets/icons/bottombar/home.svg?react';
import HomeActiveIcon from '@/assets/icons/bottombar/home_active.svg?react';
import ReportIcon from '@/assets/icons/bottombar/report.svg?react';
import ReportActiveIcon from '@/assets/icons/bottombar/report_active.svg?react';
import MypageIcon from '@/assets/icons/bottombar/my.svg?react';
import MypageActiveIcon from '@/assets/icons/bottombar/my_active.svg?react';

const navItem = [
  {
    id: 'home',
    label: '홈',
    to: '/',
    icon: HomeIcon,
    iconActive: HomeActiveIcon,
  },
  {
    id: 'report',
    label: '리포트',
    to: '/report',
    icon: ReportIcon,
    iconActive: ReportActiveIcon,
  },
  {
    id: 'mypage',
    label: '마이',
    to: '/mypage',
    icon: MypageIcon,
    iconActive: MypageActiveIcon,
  },
];

export default function BottomBar() {
  const [activeNav, setActiveNav] = useState('home');
  return (
    <nav className='fixed z-30 left-1/2 bottom-0 -translate-x-1/2 flex justify-around w-full max-w-[500px] px-5 bg-white border border-gray-100 shadow-2xl'>
      <ul className='flex items-center justify-center w-full'>
        {navItem.map((item) => {
          const isActiveNav = activeNav === item.id;
          const navColor = isActiveNav ? 'text-primary' : 'text-gray-400';
          const CurrentIcon = isActiveNav ? item.iconActive : item.icon;

          return (
            <li key={item.id} className='w-full py-2'>
              <Link
                to={item.to}
                onClick={() => setActiveNav(item.id)}
                className='flex flex-col items-center gap-1'
              >
                <div className='flex items-center justify-center'>
                  <CurrentIcon />
                </div>

                <p className={`text-xs font-bold ${navColor}`}>{item.label}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
