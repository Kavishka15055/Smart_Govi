import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';

interface SettingsStore extends AppSettings {
  // Actions
  setLanguage: (language: 'en' | 'si') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setDefaultReportPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  language: 'en',
  theme: 'light',
  notificationsEnabled: true,
  defaultReportPeriod: 'monthly',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setLanguage: (language) => set({ language }),
      
      setTheme: (theme) => set({ theme }),
      
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      
      setDefaultReportPeriod: (period) => set({ defaultReportPeriod: period }),
      
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);