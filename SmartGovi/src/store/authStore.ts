import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/authService';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        const result = await AuthService.login(email, password);
        
        if (result.success && result.user) {
          set({ 
            user: result.user, 
            isLoading: false, 
            isAuthenticated: true,
            error: null 
          });
          return true;
        } else {
          set({ 
            error: result.error || 'Login failed', 
            isLoading: false,
            isAuthenticated: false 
          });
          return false;
        }
      },
      
      signUp: async (email: string, password: string, fullName: string, phoneNumber: string) => {
        set({ isLoading: true, error: null });
        
        const result = await AuthService.signUp(email, password, fullName, phoneNumber);
        
        if (result.success && result.user) {
          set({ 
            user: result.user, 
            isLoading: false, 
            isAuthenticated: true,
            error: null 
          });
          return true;
        } else {
          set({ 
            error: result.error || 'Sign up failed', 
            isLoading: false,
            isAuthenticated: false 
          });
          return false;
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        await AuthService.logout();
        set({ 
          user: null, 
          isLoading: false, 
          isAuthenticated: false,
          error: null 
        });
      },
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);