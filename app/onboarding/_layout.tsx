import ProgressDots from '@/components/ProgressDots';
import { useOnboarding } from '@/hooks/useOnboarding';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ActiveScreen from './active';
import AgeScreen from './age';
import DietScreen from './diet';
import GenderScreen from './gender';
import GoalScreen from './goal';
import HeightScreen from './height';
import IdealWeightScreen from './idealWeight';
import NameScreen from './name';
import WaterScreen from './water';
import WeightScreen from './weight';

interface OnboardingScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const ONBOARDING_SCREENS: {
  id: string;
  component: React.ComponentType<OnboardingScreenProps>;
}[] = [
  { id: 'name', component: NameScreen },
  { id: 'goal', component: GoalScreen},
  { id: 'gender', component: GenderScreen },
  { id: 'age', component: AgeScreen },
  { id: 'height', component: HeightScreen },
  { id: 'weight', component: WeightScreen },
  { id: 'idealWeight', component: IdealWeightScreen },
  { id: 'active', component: ActiveScreen },
  { id: 'diet', component: DietScreen },
  { id: 'water', component: WaterScreen },
];

export default function OnboardingLayout() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const { completeOnboarding } = useOnboarding();

  const handleNext = async () => {
    if (currentScreenIndex < ONBOARDING_SCREENS.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    } else {
      try {
        await completeOnboarding();
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }
  };

  const handleBack = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    }
  };

  const CurrentScreen = ONBOARDING_SCREENS[currentScreenIndex].component;

  return (
    <View style={styles.container}>
      <ProgressDots
        currentIndex={currentScreenIndex}
        total={ONBOARDING_SCREENS.length}
      />
      <CurrentScreen onNext={handleNext} onBack={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF4E9',
      paddingHorizontal: 24,
    },
  });