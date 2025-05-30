import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBymLTV-JnpCWn8Lm9I_OMpdBpBshd42G4",
  authDomain: "shopping-list-50fab.firebaseapp.com",
  projectId: "shopping-list-50fab",
  storageBucket: "shopping-list-50fab.firebasestorage.app",
  messagingSenderId: "392918381659",
  appId: "1:392918381659:web:abfcfd7503ab6abf07bb7e",
  measurementId: "G-K1ZY4R2RGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;