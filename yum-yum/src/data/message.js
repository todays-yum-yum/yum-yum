// 일반 메시지들: 로딩, 필수입력 같은 (필요시 수정해서 사용해주세요.)

export const COMMON_MESSAGES = {
  loading: '잠시만 기다려주세요...',
  error: {
    network: '인터넷 연결을 확인해주세요.',
    server: '서버에 문제가 발생했습니다',
    auth: '로그인이 필요한 서비스입니다',
    default: '다시 시도해주세요.',
  },
  success: {
    save: '성공적으로 저장되었습니다!',
    delete: '삭제되었습니다',
    update: '업데이트 완료!',
  },
};

export const VALIDATION_MESSAGES = {
  required: '필수 입력 항목입니다',
  email: '올바른 이메일 형식을 입력해주세요',
  password: '비밀번호는 8자 이상이어야 합니다',
};
