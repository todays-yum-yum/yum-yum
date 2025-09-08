// 테스트용 유저데이터
const mockUser = {
  _id: '1',
  userId: 'test@gmail.com',
  name: '김철수',
  password: 'password123', // 테스트용(암호화xx)
  profileImage: null, // 이미지 따로 저장하고 여긴 url만 저장 - 마이페이지 개발 시 사용
  gender: 'male',
  age: 28,
  weight: 75,
  height: 175,
  goals: {
    targetWeight: 70,
    targetExercise: 'moderate', // ['none', 'light', 'moderate', 'intense']
  },
  createdAt: new Date('2025-09-01T10:00:00.000Z'),
  updatedAt: new Date('2025-09-01T10:00:00.000Z'),
};
