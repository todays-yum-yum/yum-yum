// components/ProfileItem.jsx
// svg
import IconRight from '@/assets/icons/icon-right.svg?react';

const ProfileItem = ({ label, value, unit, onClick }) => {
  return (
    <li className='flex justify-between mx-8 my-8'>
      <p className='text-gray-600'>{label}</p>
      <button className='font-bold flex gap-2' onClick={onClick}>
        {value}
        {unit && unit}
        <IconRight />
      </button>
    </li>
  );
};

export default ProfileItem;
