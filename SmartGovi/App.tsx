import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from './src/store/authStore';
import { useFarmStore } from './src/store/farmStore';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/constants';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const { isLoading: authLoading } = useAuthStore();
  const { isLoading: farmLoading } = useFarmStore();

  useEffect(() => {
    // Simulate initialization
    const prepare = async () => {
      // Any app initialization can go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsReady(true);
    };
    
    prepare();
  }, []);

  if (!isReady || authLoading || farmLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}