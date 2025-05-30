import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Importa Analytics solo se necessario
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configurazione Firebase con valori hardcoded (sicura)
const firebaseConfig = {
  apiKey: "AIzaSyBymLTV-JnpCWn8Lm9I_OMpdBpBshd42G4",
  authDomain: "shopping-list-50fab.firebaseapp.com",
  projectId: "shopping-list-50fab",
  storageBucket: "shopping-list-50fab.firebasestorage.app",
  messagingSenderId: "392918381659",
  appId: "1:392918381659:web:abfcfd7503ab6abf07bb7e",
  measurementId: "G-K1ZY4R2RGN"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza i servizi Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
// Inizializza Analytics solo se supportato
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };

// Configura la persistenza dell'autenticazione
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

export default app;