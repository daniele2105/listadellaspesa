import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <ShoppingCart className="h-6 w-6 text-primary-500" />
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
              Lista della Spesa
            </span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Lista della Spesa. Tutti i diritti riservati.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              100% gratuito, nessun tracciamento.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                Termini
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                Contatti
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 text-sm">
                GitHub
              </a>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              Creato con <Heart className="h-4 w-4 text-error-500 mx-1" /> usando React & Firebase
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;