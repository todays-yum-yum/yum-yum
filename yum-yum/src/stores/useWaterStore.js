import { create } from 'zustand';

export const useWaterStore = create((set) => ({
  waterAmount: 0,
  oneTimeIntake: 200,
  targetIntake: 2000,

  setWaterAmount: (v) => set({ waterAmount: v }),
  setOneTimeIntake: (v) => set({ oneTimeIntake: v }),
  setTargetIntake: (v) => set({ targetIntake: v }),
}));
