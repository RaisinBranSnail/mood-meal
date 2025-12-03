import React, { createContext, useContext, useState, ReactNode } from 'react';

type OnboardingData = { [key: string]: any };

interface OnboardingDataContextType {
  data: OnboardingData;
  updateData: (newData: OnboardingData) => void;
}

const OnboardingDataContext = createContext<OnboardingDataContextType | undefined>(undefined);

export const OnboardingDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>({});

  const updateData = (newData: OnboardingData) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <OnboardingDataContext.Provider value={{ data, updateData }}>
      {children}
    </OnboardingDataContext.Provider>
  );
};

export const useOnboardingData = () => {
  const context = useContext(OnboardingDataContext);
  if (!context) {
    throw new Error('useOnboardingData must be used within OnboardingDataProvider');
  }
  return context;
};
