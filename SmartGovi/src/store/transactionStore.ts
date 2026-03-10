import { create } from 'zustand';
import { FirestoreService } from '../services/firestoreService';
import { Income, Expense, DateRange, TransactionSummary, FilterPeriod } from '../types';
import { DateHelpers } from '../utils/dateHelpers';

interface TransactionStore {
  incomes: Income[];
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  currentFilter: {
    period: FilterPeriod;
    customRange?: DateRange;
  };
  summary: TransactionSummary;
  
  // Actions
  loadTransactions: (userId: string, dateRange?: DateRange) => Promise<void>;
  addIncome: (income: Omit<Income, 'id' | 'createdAt'>) => Promise<boolean>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<boolean>;
  updateIncome: (id: string, updates: Partial<Income>) => Promise<boolean>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<boolean>;
  deleteIncome: (id: string) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  setFilter: (period: FilterPeriod, customRange?: DateRange) => void;
  calculateSummary: () => void;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  incomes: [],
  expenses: [],
  isLoading: false,
  error: null,
  currentFilter: {
    period: 'This Month',
  },
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    incomeByCategory: {},
    expenseByCategory: {},
  },
  
  loadTransactions: async (userId: string, dateRange?: DateRange) => {
    set({ isLoading: true, error: null });
    
    try {
      const [incomes, expenses] = await Promise.all([
        FirestoreService.getIncomes(userId, dateRange),
        FirestoreService.getExpenses(userId, dateRange)
      ]);
      
      set({ 
        incomes, 
        expenses, 
        isLoading: false 
      });
      
      get().calculateSummary();
    } catch (error: any) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  },
  
  addIncome: async (income) => {
    set({ isLoading: true });
    
    const result = await FirestoreService.addIncome(income);
    
    if (result.success) {
      // Reload transactions
      await get().loadTransactions(income.userId);
      return true;
    } else {
      set({ 
        error: result.error || 'Failed to add income', 
        isLoading: false 
      });
      return false;
    }
  },
  
  addExpense: async (expense) => {
    set({ isLoading: true });
    
    const result = await FirestoreService.addExpense(expense);
    
    if (result.success) {
      await get().loadTransactions(expense.userId);
      return true;
    } else {
      set({ 
        error: result.error || 'Failed to add expense', 
        isLoading: false 
      });
      return false;
    }
  },
  
  updateIncome: async (id, updates) => {
    const success = await FirestoreService.updateIncome(id, updates);
    
    if (success) {
      // Update local state
      const incomes = get().incomes.map(inc => 
        inc.id === id ? { ...inc, ...updates } : inc
      );
      set({ incomes });
      get().calculateSummary();
    }
    
    return success;
  },
  
  updateExpense: async (id, updates) => {
    const success = await FirestoreService.updateExpense(id, updates);
    
    if (success) {
      const expenses = get().expenses.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      );
      set({ expenses });
      get().calculateSummary();
    }
    
    return success;
  },
  
  deleteIncome: async (id) => {
    const success = await FirestoreService.deleteIncome(id);
    
    if (success) {
      const incomes = get().incomes.filter(inc => inc.id !== id);
      set({ incomes });
      get().calculateSummary();
    }
    
    return success;
  },
  
  deleteExpense: async (id) => {
    const success = await FirestoreService.deleteExpense(id);
    
    if (success) {
      const expenses = get().expenses.filter(exp => exp.id !== id);
      set({ expenses });
      get().calculateSummary();
    }
    
    return success;
  },
  
  setFilter: (period, customRange) => {
    set({ 
      currentFilter: { 
        period, 
        customRange 
      } 
    });
  },
  
  calculateSummary: () => {
    const { incomes, expenses } = get();
    
    // Calculate totals
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const balance = totalIncome - totalExpense;
    
    // Calculate by category
    const incomeByCategory: Record<string, number> = {};
    incomes.forEach(inc => {
      incomeByCategory[inc.category] = (incomeByCategory[inc.category] || 0) + inc.amount;
    });
    
    const expenseByCategory: Record<string, number> = {};
    expenses.forEach(exp => {
      expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + exp.amount;
    });
    
    set({
      summary: {
        totalIncome,
        totalExpense,
        balance,
        incomeByCategory,
        expenseByCategory,
      }
    });
  },
  
  clearError: () => set({ error: null }),
}));