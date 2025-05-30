import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  register: (email: string, password: string, displayName: string) => Promise<{ user: User; emailSent: boolean }>; // Aggiunto displayName
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

// Helper function to create user profile
async function createUserProfile(user: User, displayName?: string) {
  try {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      uid: user.uid,
      displayName: displayName || user.displayName || user.email?.split('@')[0] || 'Utente',
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to set session timeout
function setSessionTimeout(logoutCallback: () => void) {
  // Clear any existing timeout
  const existingTimeout = localStorage.getItem('sessionTimeout');
  if (existingTimeout) {
    clearTimeout(Number(existingTimeout));
  }
  
  // Set new timeout for 24 hours (24 * 60 * 60 * 1000 ms)
  const timeoutId = setTimeout(() => {
    logoutCallback();
    localStorage.removeItem('sessionTimeout');
    localStorage.removeItem('sessionStart');
  }, 24 * 60 * 60 * 1000);
  
  // Store timeout ID and session start time
  localStorage.setItem('sessionTimeout', timeoutId.toString());
  localStorage.setItem('sessionStart', Date.now().toString());
}

// Helper function to check if session is still valid
function isSessionValid(): boolean {
  const sessionStart = localStorage.getItem('sessionStart');
  if (!sessionStart) return false;
  
  const now = Date.now();
  const sessionAge = now - Number(sessionStart);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  
  return sessionAge < twentyFourHours;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function register(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send email verification
    let emailSent = false;
    try {
      await sendEmailVerification(user);
      emailSent = true;
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
    
    // Create user profile in Firestore with displayName
    await createUserProfile(user, displayName);
    
    return { user, emailSent };
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if email is verified
    if (!user.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error('Per favore verifica la tua email prima di accedere. Controlla la tua casella di posta.');
    }
    
    // Update user profile with last login
    await createUserProfile(user);
    
    // Set session timeout
    setSessionTimeout(() => logout());
    
    return user;
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    // Prova con redirect invece di popup
    const userCredential = await signInWithRedirect(auth, provider);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await createUserProfile(user);
    
    // Set session timeout
    setSessionTimeout(() => logout());
    
    return user;
  }

  async function logout() {
    // Clear session timeout
    const timeoutId = localStorage.getItem('sessionTimeout');
    if (timeoutId) {
      clearTimeout(Number(timeoutId));
      localStorage.removeItem('sessionTimeout');
      localStorage.removeItem('sessionStart');
    }
    
    return firebaseSignOut(auth);
  }

  async function resendVerificationEmail() {
    if (currentUser && !currentUser.emailVerified) {
      await sendEmailVerification(currentUser);
    } else {
      throw new Error('Nessun utente trovato o email già verificata.');
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // Check if session is still valid
        if (!isSessionValid()) {
          // Session expired, logout
          logout();
          return;
        }
        
        // If user is logged in and session is valid, set/reset timeout
        setSessionTimeout(() => logout());
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}