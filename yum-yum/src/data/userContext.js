// user context data

// 성별
export const gender = { male: '남성', female: '여성' };

// 목표
export const goalsOption = [
  { value: '', title: '목표 선택' },
  { value: 'loss', title: '체중 감량' },
  { value: 'gain', title: '체중 증가' },
  { value: 'maintain', title: '건강증진 및 유지' },
];

// 활동량
export const activityLevel = [
  { value: 'none', title: '운동 안함', sub: '일주일에 운동 0회' },
  { value: 'light', title: '가벼운 운동', sub: '주 1-3회, 30분씩 (산책, 요가)' },
  { value: 'moderate', title: '적당한 운동', sub: '주 3-5회, 45분씩 (헬스, 수영)' },
  { value: 'intense', title: '격렬한 운동', sub: '주 6-7회, 1시간씩 (크로스핏, 마라톤 훈련)' },
];

// 활동량 유틸
export const activityUtils = {
  // title 가져오기
  getTitle: (value) => {
    const activity = activityLevel.find((item) => item.value === value);
    return activity?.title || '미설정';
  },

  // sub 가져오기
  getSub: (value) => {
    const activity = activityLevel.find((item) => item.value === value);
    return activity?.sub || '';
  },

  // 전체 객체 가져오기
  getActivity: (value) => {
    return activityLevel.find((item) => item.value === value) || null;
  },

  // 모든 title 목록
  getAllTitles: () => {
    return activityLevel.map((item) => item.title);
  },
};

// 목표 유틸
export const goalsOptionUtils = {
  // value 가져오기
  getValue: (value) => {
    const goals = goalsOption.find((item) => item.value === value);
    return goals?.value || '';
  },
  // label 가져오기
  getLabel: (value) => {
    const goal = goalsOption.find((item) => item.value === value);
    return goal?.title || '미설정';
  },
  // 전체 객체 가져오기
  getGoals: (value) => {
    return goalsOption.find((item) => item.value === value) || null;
  },
  // 전체 title 가져오기
  getAllLabel: () => {
    return goalsOption.map((item) => item.title);
  },
};
