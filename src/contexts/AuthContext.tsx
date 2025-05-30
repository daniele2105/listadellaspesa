import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;  // Usa User invece di import('firebase/auth').User
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User | null>;  // Può restituire null per redirect
  register: (email: string, password: string, displayName: string) => Promise<{ user: User; emailSent: boolean }>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

// Helper function to create user profile
async function createUserProfile(user: User, displayName?: string) {
  try {
    const userData = {
      email: user.email,
      uid: user.uid,
      displayName: displayName || user.displayName || user.email?.split('@')[0] || 'Utente',
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
    console.log('User profile created successfully');
  } catch (error) {
    console.error('Error creating user profile:', error);
    // Non bloccare il login se la creazione del profilo fallisce
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
    console.log('🚀 Inizio loginWithGoogle');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const useRedirect = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.location.hostname !== 'localhost';
    
    console.log('📱 useRedirect:', useRedirect);
    console.log('🌐 hostname:', window.location.hostname);
    
    try {
      if (useRedirect) {
        console.log('🔄 Usando signInWithRedirect');
        await signInWithRedirect(auth, provider);
        return null;
      } else {
        console.log('🪟 Usando signInWithPopup');
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        
        console.log('✅ Popup completato, utente:', user.email);
        
        await createUserProfile(user);
        setSessionTimeout(() => logout());
        
        console.log('✅ Profilo creato e sessione impostata');
        return user;
      }
    } catch (error: any) {
      console.error('❌ Errore Google Auth:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      // Fallback a redirect se popup fallisce
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/popup-closed-by-user' ||
          error.code === 'auth/unauthorized-domain') {
        
        console.log('🔄 Fallback a redirect...');
        await signInWithRedirect(auth, provider);
        return null;
      }
      
      throw error;
    }
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
    // Gestisci risultato redirect Google
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          const user = result.user;
          await createUserProfile(user);
          setSessionTimeout(() => logout());
        }
      })
      .catch((error) => {
        console.error('Errore redirect Google:', error);
      });
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Se l'utente si è appena autenticato, non controllare la validità della sessione
        const sessionStart = localStorage.getItem('sessionStart');
        
        if (sessionStart && !isSessionValid()) {
          // Session expired, logout solo se esisteva già una sessione
          try {
            await logout();
          } catch (error) {
            console.error('Errore durante logout automatico:', error);
          }
          return;
        }
        
        // Imposta il timeout di sessione per utenti autenticati
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