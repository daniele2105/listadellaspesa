import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Inserisci email e password');
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenziali non valide. Riprova.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Tentativo di accesso Google...');
      const user = await loginWithGoogle();
      console.log('Accesso Google riuscito:', user);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Errore dettagliato Google Auth:', err);
      console.error('Codice errore:', err.code);
      console.error('Messaggio errore:', err.message);
      
      let errorMessage = 'Accesso con Google fallito. Riprova.';
      
      if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Popup bloccato dal browser. Abilita i popup per questo sito.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Accesso annullato dall\'utente.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = 'Dominio non autorizzato. Contatta l\'amministratore.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url(/neon-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Overlay scuro per migliorare la leggibilità */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="max-w-md w-full space-y-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20 relative z-10">
          <div className="text-center">
            <div className="flex justify-center">
              <ShoppingCart className="h-12 w-12 text-primary-500" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              Accedi al tuo account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Gestisci le tue liste della spesa da qualsiasi dispositivo
            </p>
          </div>
          
          {error && (
            <div className="bg-error-50 dark:bg-error-900/30 text-error-700 dark:text-error-400 p-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="la-tua-email@esempio.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Accedi
                  </>
                )}
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Oppure
                </span>
              </div>
            </div>
            
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="btn btn-outline w-full"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Accedi con Google
              </button>
            </div>
          </form>
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Non hai ancora un account?{' '}
            <Link to="/register" className="font-medium text-primary-500 hover:text-primary-600">
              Registrati ora
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;