import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirestoreService } from '../services/firestoreService';
import { FarmProfile, FarmType, IncomeCategory, ExpenseCategory, Unit } from '../types';

interface FarmStore {
  profile: FarmProfile | null;
  isLoading: boolean;
  error: string | null;
  hasCompletedSetup: boolean;
  
  // Actions
  loadProfile: (userId: string) => Promise<void>;
  createProfile: (
    userId: string,
    farmTypes: FarmType[],
    incomeCategories: IncomeCategory[],
    expenseCategories: ExpenseCategory[],
    units: Unit[]
  ) => Promise<boolean>;
  updateProfile: (userId: string, updates: Partial<FarmProfile>) => Promise<boolean>;
  addIncomeCategory: (category: IncomeCategory) => void;
  addExpenseCategory: (category: ExpenseCategory) => void;
  clearError: () => void;
  reset: () => void;
}

export const useFarmStore = create<FarmStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,
      hasCompletedSetup: false,
      
      loadProfile: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const profile = await FirestoreService.getFarmProfile(userId);
          
          if (profile) {
            set({ 
              profile, 
              isLoading: false, 
              hasCompletedSetup: true 
            });
          } else {
            set({ 
              profile: null, 
              isLoading: false, 
              hasCompletedSetup: false 
            });
          }
        } catch (error: any) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
        }
      },
      
      createProfile: async (
        userId: string,
        farmTypes: FarmType[],
        incomeCategories: IncomeCategory[],
        expenseCategories: ExpenseCategory[],
        units: Unit[]
      ) => {
        set({ isLoading: true, error: null });
        
        const result = await FirestoreService.createFarmProfile(
          userId,
          farmTypes,
          incomeCategories,
          expenseCategories,
          units
        );
        
        if (result.success) {
          const newProfile: FarmProfile = {
            userId,
            farmTypes,
            incomeCategories,
            expenseCategories,
            units,
          };
          
          set({ 
            profile: newProfile, 
            isLoading: false, 
            hasCompletedSetup: true 
          });
          return true;
        } else {
          set({ 
            error: result.error || 'Failed to create profile', 
            isLoading: false 
          });
          return false;
        }
      },
      
      updateProfile: async (userId: string, updates: Partial<FarmProfile>) => {
        const success = await FirestoreService.updateFarmProfile(userId, updates);
        
        if (success && get().profile) {
          set({ 
            profile: { ...get().profile!, ...updates } 
          });
        }
        
        return success;
      },
      
      addIncomeCategory: (category: IncomeCategory) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              incomeCategories: [...currentProfile.incomeCategories, category]
            }
          });
        }
      },
      
      addExpenseCategory: (category: ExpenseCategory) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              expenseCategories: [...currentProfile.expenseCategories, category]
            }
          });
        }
      },
      
      clearError: () => set({ error: null }),
      
      reset: () => set({ 
        profile: null, 
        hasCompletedSetup: false 
      }),
    }),
    {
      name: 'farm-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);