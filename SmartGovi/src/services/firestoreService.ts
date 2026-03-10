import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { 
  Income, 
  Expense, 
  FarmProfile, 
  IncomeCategory, 
  ExpenseCategory,
  FarmType,
  Unit,
  DateRange
} from '../types';

export class FirestoreService {
  // ========== FARM PROFILE ==========
  
  static async createFarmProfile(
    userId: string,
    farmTypes: FarmType[],
    incomeCategories: IncomeCategory[],
    expenseCategories: ExpenseCategory[],
    units: Unit[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const profileData = {
        userId,
        farmTypes,
        incomeCategories,
        expenseCategories,
        units,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'farmProfiles', userId), profileData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async getFarmProfile(userId: string): Promise<FarmProfile | null> {
    try {
      const profileDoc = await getDoc(doc(db, 'farmProfiles', userId));
      if (profileDoc.exists()) {
        return profileDoc.data() as FarmProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting farm profile:', error);
      return null;
    }
  }
  
  static async updateFarmProfile(userId: string, updates: Partial<FarmProfile>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'farmProfiles', userId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating farm profile:', error);
      return false;
    }
  }
  
  // ========== INCOME ==========
  
  static async addIncome(income: Omit<Income, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const docRef = await addDoc(collection(db, 'incomes'), {
        ...income,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async getIncomes(
    userId: string,
    dateRange?: DateRange,
    category?: string,
    limitCount: number = 50
  ): Promise<Income[]> {
    try {
      let q = query(
        collection(db, 'incomes'),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      
      if (dateRange) {
        q = query(
          collection(db, 'incomes'),
          where('userId', '==', userId),
          where('date', '>=', dateRange.startDate),
          where('date', '<=', dateRange.endDate),
          orderBy('date', 'desc'),
          limit(limitCount)
        );
      }
      
      if (category) {
        q = query(
          collection(db, 'incomes'),
          where('userId', '==', userId),
          where('category', '==', category),
          orderBy('date', 'desc'),
          limit(limitCount)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate(),
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
      })) as Income[];
    } catch (error) {
      console.error('Error getting incomes:', error);
      return [];
    }
  }
  
  static async updateIncome(id: string, updates: Partial<Income>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'incomes', id), updates);
      return true;
    } catch (error) {
      console.error('Error updating income:', error);
      return false;
    }
  }
  
  static async deleteIncome(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'incomes', id));
      return true;
    } catch (error) {
      console.error('Error deleting income:', error);
      return false;
    }
  }
  
  // ========== EXPENSES ==========
  
  static async addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...expense,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  static async getExpenses(
    userId: string,
    dateRange?: DateRange,
    category?: string,
    limitCount: number = 50
  ): Promise<Expense[]> {
    try {
      let q = query(
        collection(db, 'expenses'),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      
      if (dateRange) {
        q = query(
          collection(db, 'expenses'),
          where('userId', '==', userId),
          where('date', '>=', dateRange.startDate),
          where('date', '<=', dateRange.endDate),
          orderBy('date', 'desc'),
          limit(limitCount)
        );
      }
      
      if (category) {
        q = query(
          collection(db, 'expenses'),
          where('userId', '==', userId),
          where('category', '==', category),
          orderBy('date', 'desc'),
          limit(limitCount)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate(),
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
      })) as Expense[];
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  }
  
  static async updateExpense(id: string, updates: Partial<Expense>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'expenses', id), updates);
      return true;
    } catch (error) {
      console.error('Error updating expense:', error);
      return false;
    }
  }
  
  static async deleteExpense(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'expenses', id));
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
  }
  
  // ========== TRANSACTIONS BATCH ==========
  
  static async getAllTransactions(
    userId: string,
    dateRange?: DateRange
  ): Promise<{ incomes: Income[]; expenses: Expense[] }> {
    try {
      const [incomes, expenses] = await Promise.all([
        this.getIncomes(userId, dateRange, undefined, 100),
        this.getExpenses(userId, dateRange, undefined, 100)
      ]);
      
      return { incomes, expenses };
    } catch (error) {
      console.error('Error getting all transactions:', error);
      return { incomes: [], expenses: [] };
    }
  }
  
  static async deleteAllUserData(userId: string): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      
      // Delete all incomes
      const incomesQuery = query(collection(db, 'incomes'), where('userId', '==', userId));
      const incomesSnapshot = await getDocs(incomesQuery);
      incomesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // Delete all expenses
      const expensesQuery = query(collection(db, 'expenses'), where('userId', '==', userId));
      const expensesSnapshot = await getDocs(expensesQuery);
      expensesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // Delete farm profile
      const profileRef = doc(db, 'farmProfiles', userId);
      batch.delete(profileRef);
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      return false;
    }
  }
}