import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyActAqg4N9h6mUO8x53JSFG9TgahGe0tnI",
  authDomain: "smartgovi-9378a.firebaseapp.com",
  projectId: "smartgovi-9378a",
  storageBucket: "smartgovi-9378a.firebasestorage.app",
  messagingSenderId: "789055550094",
  appId: "1:789055550094:android:fb4b45482494546acb4fdf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
// Use initializeAuth with persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Use initializeFirestore with persistentLocalCache (replaces enableIndexedDbPersistence)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

export const storage = getStorage(app);

export default app;