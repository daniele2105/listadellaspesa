import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <ShoppingCart className="h-24 w-24 text-primary-500 mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Pagina non trovata
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
          
          <Link 
            to="/" 
            className="btn btn-primary inline-block"
          >
            Torna alla Home
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;