// components/ProfileList.jsx
import ProfileItem from './ProfileItem';

const ProfileList = ({ profileData, onItemClick }) => {
  return (
    <div className='bg-gray-50 rounded-[20px]'>
      <ul>
        {profileData &&
          profileData?.map((item) => (
            <ProfileItem
              key={item.id}
              label={item.label}
              value={item.value}
              unit={item.unit}
              onClick={() => onItemClick(item.id)}
            />
          ))}
      </ul>
    </div>
  );
};

export default ProfileList;
