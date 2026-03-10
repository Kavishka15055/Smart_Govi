import { FarmType, Unit } from '../types';

// Farm types
export const FARM_TYPES: FarmType[] = [
  'Mushrooms',
  'Vegetables',
  'Paddy',
  'Fruits',
  'Poultry',
  'Other'
];

// Farm type icons (using emoji or you can use vector icons)
export const FARM_TYPE_ICONS: Record<FarmType, string> = {
  'Mushrooms': '🍄',
  'Vegetables': '🥬',
  'Paddy': '🌾',
  'Fruits': '🍎',
  'Poultry': '🐓',
  'Other': '🌱'
};

// Default income categories for mushrooms
export const DEFAULT_MUSHROOM_INCOME_CATEGORIES = [
  { id: '1', name: 'Oyster Mushroom', defaultUnit: 'kg', isActive: true },
  { id: '2', name: 'Milky Mushroom', defaultUnit: 'kg', isActive: true },
  { id: '3', name: 'King Oyster', defaultUnit: 'kg', isActive: true },
];

// Default expense categories for mushrooms
export const DEFAULT_MUSHROOM_EXPENSE_CATEGORIES = [
  { id: '1', name: 'Spawn', isActive: true },
  { id: '2', name: 'Substrate', isActive: true },
  { id: '3', name: 'Labor', isActive: true },
  { id: '4', name: 'Transport', isActive: true },
  { id: '5', name: 'Packaging', isActive: true },
];

// Units
export const UNITS: Unit[] = ['kg', 'g', 'dozen', 'piece', 'liter'];

// Unit display names
export const UNIT_DISPLAY_NAMES: Record<Unit, string> = {
  'kg': 'Kilogram (kg)',
  'g': 'Gram (g)',
  'dozen': 'Dozen',
  'piece': 'Piece',
  'liter': 'Liter'
};

// Filter periods
export const FILTER_PERIODS = [
  'Today',
  'This Week',
  'This Month',
  'Last 3 Months',
  'Custom'
] as const;

// Default colors
export const COLORS = {
  primary: '#2E7D32',
  primaryLight: '#81C784',
  primaryDark: '#1B5E20',
  accent: '#FF8F00',
  income: '#4CAF50',
  expense: '#F44336',
  white: '#FFFFFF',
  background: '#F5F5F5',
  textPrimary: '#424242',
  textSecondary: '#757575',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
};

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  FARM: 'farm-storage',
  SETTINGS: 'settings-storage',
  LANGUAGE: 'app-language',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection.',
  GENERAL: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Data not found.',
  VALIDATION: 'Please check your input and try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully!',
  SIGNUP: 'Account created successfully!',
  LOGOUT: 'Logged out successfully!',
  ADD_INCOME: 'Income added successfully!',
  ADD_EXPENSE: 'Expense added successfully!',
  UPDATE: 'Updated successfully!',
  DELETE: 'Deleted successfully!',
} as const;

// App version
export const APP_VERSION = '1.0.0';