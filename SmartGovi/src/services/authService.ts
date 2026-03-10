import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, getFirebaseErrorMessage } from './firebaseConfig';
import { User } from '../types';

export class AuthService {
  // Sign up new user
  static async signUp(
    email: string, 
    password: string, 
    fullName: string, 
    phoneNumber: string
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user profile in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        email,
        fullName,
        phoneNumber,
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
      });
      
      return { success: true, user: userData };
    } catch (error: any) {
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }
  
  // Login user
  static async login(
    email: string, 
    password: string
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        return { success: true, user: { ...userData, id: firebaseUser.uid } };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error: any) {
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }
  
  // Logout user
  static async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  // Reset password
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  }
  
  // Check if farm profile exists
  static async hasFarmProfile(userId: string): Promise<boolean> {
    try {
      const profileDoc = await getDoc(doc(db, 'farmProfiles', userId));
      return profileDoc.exists();
    } catch (error) {
      console.error('Error checking farm profile:', error);
      return false;
    }
  }
}