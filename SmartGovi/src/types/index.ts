// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  farmName?: string;
  location?: string;
  createdAt: Date;
}

export interface FarmProfile {
  userId: string;
  farmTypes: FarmType[];
  incomeCategories: IncomeCategory[];
  expenseCategories: ExpenseCategory[];
  units: Unit[];
}

export type FarmType = 'Mushrooms' | 'Vegetables' | 'Paddy' | 'Fruits' | 'Poultry' | 'Other';

export interface IncomeCategory {
  id: string;
  name: string;
  defaultUnit: string;
  isActive: boolean;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export type Unit = 'kg' | 'g' | 'dozen' | 'piece' | 'liter';

// Transaction Types
export interface Income {
  id: string;
  userId: string;
  date: Date;
  category: string;
  quantity: number;
  unit: string;
  amount: number;
  notes?: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  date: Date;
  category: string;
  amount: number;
  notes?: string;
  receiptUrl?: string;
  createdAt: Date;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
}

// Filter Types
export type FilterPeriod = 'Today' | 'This Week' | 'This Month' | 'Last 3 Months' | 'Custom';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Settings Types
export interface AppSettings {
  language: 'en' | 'si';
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  defaultReportPeriod: 'daily' | 'weekly' | 'monthly';
}