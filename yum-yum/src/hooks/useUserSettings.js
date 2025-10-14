// 사용자 정보 확인 및 수정 훅
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useUserData } from './useUser';
import {
  gender,
  goalsOption,
  goalsOptionUtils,
  activityLevel,
  activityUtils,
} from '@/data/userContext';

// 커스텀 훅
export const useUserSettings = (userId) => {
  const queryClient = useQueryClient();
  // 사용자 설정 조회
  const { userData, isLoading } = useUserData(userId);

  // 설정 데이터 생성
  const { userSettings, defaultValues } = useMemo(() => {
    if (!userData) {
      return { userSettings: [], defaultValues: {} };
    }
    const settings = parsedUserSetting(userData);

    const defaults = settings.reduce((acc, item) => {
      // number 타입은 숫자만 추출, select는 그대로
      acc[item.id] = item.type === 'number' ? item.value.replace(/[^0-9.]/g, '') : item.key;
      return acc;
    }, {});

    return { userSettings: settings, defaultValues: defaults };
  }, [userData]);

  const { register, control, handleSubmit, reset, formState } = useForm({
    defaultValues,
    values: defaultValues,
  });

  // 모달 상태 관리
  const [modalState, setModalState] = useState({
    isOpen: false,
    currentItem: null,
  });

  // 설정 항목 클릭 핸들러
  const handleSettingClick = (itemId) => {
    console.log('클릭한거:', itemId);
    const item = userSettings.find((item) => item.id === itemId);
    setModalState({
      isOpen: true,
      currentItem: item,
    });
  };

  // 모달 닫기
  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      currentItem: null,
    });
  };

  // 저장 핸들러
  const handleSave = (data) => {
    const { currentItem } = modalState;
    const newValue = data[currentItem.id];
    console.log(currentItem);
    console.log(`${newValue}`);
    setModalState({ isOpen: false, currentItem: null });
  };
  // 설정 업데이트 mutation

  return {
    // 서버 상태
    userSettings,
    isLoading,

    // mutation 상태
    // isSaving: updateSettingMutation.isPending,
    // saveError: updateSettingMutation.error,

    // 클라이언트 상태
    modalState,

    // 핸들러들
    handleSettingClick,
    handleModalClose,

    // 파생 상태
    currentItem: modalState.currentItem,
    isModalOpen: modalState.isOpen,
    tempValue: modalState.tempValue,

    // hook form
    register,
    control,
    handleSubmit: handleSubmit(handleSave),
    reset,
    formState,
  };
};

const parsedUserSetting = (userData) => {
  if (!userData) return null;
  // 사용자 성별
  const usergender = gender[userData?.gender];
  // 사용자 목표 무게
  const goalWegiht = userData.goals['targetWeight'];
  // 사용자 목표
  const goal = goalsOptionUtils.getLabel(userData.goals['goal']);
  // 사용자 활동량
  const activity = activityUtils.getTitle(userData.goals['targetExercise']);
  return [
    {
      id: 'gender',
      label: '성별',
      key: userData.gender,
      value: usergender,
      type: 'select',
      options: gender,
    },
    {
      id: 'age',
      label: '나이',
      value: `${userData.age}`,
      type: 'number',
      unit: '세',
      min: 1,
      max: 100,
    },
    {
      id: 'height',
      label: '키',
      value: `${userData.height}`,
      type: 'number',
      unit: 'cm',
      min: 100,
      max: 250,
    },
    {
      id: 'targetWeight',
      label: '목표 체중',
      value: `${goalWegiht}`,
      type: 'number',
      unit: 'kg',
      min: 30,
      max: 200,
    },
    {
      id: 'goal',
      label: '목표 설정',
      key: userData.goals['goal'],
      value: goal,
      type: 'select',
      options: goalsOption,
    },
    {
      id: 'activity',
      label: '활동량',
      key: userData.goals['targetExercise'],
      value: activity,
      type: 'select',
      options: activityLevel,
    },
  ];
};
