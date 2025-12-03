import { useState } from 'react';

export type Gender = 'male' | 'female' | 'other' | null;
export type Goal = 'lose' | 'healthy' | 'gain' | null;

interface OnboardingState {
  name: string;
  gender: Gender;
  goal: Goal;
  currentScreenIndex: number;
}

export function useOnboarding() {
  const [onboarding, setOnboarding] = useState<OnboardingState>({
    name: '',
    gender: null,
    goal: null,
    currentScreenIndex: 0,
  });

  const setName = (name: string) =>
    setOnboarding((prev) => ({ ...prev, name }));

  const setGender = (gender: Gender) =>
    setOnboarding((prev) => ({ ...prev, gender }));

  const setGoal = (goal: Goal) =>
    setOnboarding((prev) => ({ ...prev, goal }));

  const nextScreen = () =>
    setOnboarding((prev) => ({
      ...prev,
      currentScreenIndex: prev.currentScreenIndex + 1,
    }));

  const prevScreen = () =>
    setOnboarding((prev) => ({
      ...prev,
      currentScreenIndex: Math.max(prev.currentScreenIndex - 1, 0),
    }));

  const resetOnboarding = () =>
    setOnboarding({
      name: '',
      gender: null,
      goal: null,
      currentScreenIndex: 0,
    });

  const completeOnboarding = async () => {
    console.log('Onboarding complete:', onboarding);
  };

  return {
    ...onboarding,
    setName,
    setGender,
    setGoal,
    nextScreen,
    prevScreen,
    resetOnboarding,
    completeOnboarding,
  };
}
