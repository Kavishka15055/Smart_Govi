import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import { useFarmStore } from '../store/farmStore';
import { AuthService } from '../services/authService';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainNavigator';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/constants';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { hasCompletedSetup, loadProfile } = useFarmStore();
  const [isChecking, setIsChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const checkFarmProfile = async () => {
      if (isAuthenticated && user) {
        // Check if farm profile exists
        const hasProfile = await AuthService.hasFarmProfile(user.id);
        if (!hasProfile) {
          setNeedsOnboarding(true);
        } else {
          // Load the profile
          await loadProfile(user.id);
          setNeedsOnboarding(false);
        }
      }
      setIsChecking(false);
    };

    checkFarmProfile();
  }, [isAuthenticated, user]);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : needsOnboarding || !hasCompletedSetup ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};