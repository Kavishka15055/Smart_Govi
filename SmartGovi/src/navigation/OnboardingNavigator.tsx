import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FarmSetup1Screen } from '../screens/onboarding/FarmSetup1Screen';
import { FarmSetup2Screen } from '../screens/onboarding/FarmSetup2Screen';
import { FarmSetup3Screen } from '../screens/onboarding/FarmSetup3Screen';

export type OnboardingStackParamList = {
  FarmSetup1: undefined;
  FarmSetup2: { selectedFarmTypes: string[] };
  FarmSetup3: { 
    selectedFarmTypes: string[];
    incomeCategories: any[];
  };
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: 'Farm Setup',
        headerBackTitle: 'Back',
        headerTintColor: '#2E7D32',
      }}
    >
      <Stack.Screen 
        name="FarmSetup1" 
        component={FarmSetup1Screen} 
        options={{ title: 'Farm Setup (1/3)' }}
      />
      <Stack.Screen 
        name="FarmSetup2" 
        component={FarmSetup2Screen} 
        options={{ title: 'Farm Setup (2/3)' }}
      />
      <Stack.Screen 
        name="FarmSetup3" 
        component={FarmSetup3Screen} 
        options={{ title: 'Farm Setup (3/3)' }}
      />
    </Stack.Navigator>
  );
};