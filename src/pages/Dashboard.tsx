import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  ShoppingBag, 
  Clock, 
  Share2, 
  MoreVertical,
  Trash2,
  Users,
  Edit,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useShoppingList, ShoppingList } from '../contexts/ShoppingListContext';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { lists, createList, deleteList, loading, error } = useShoppingList();
  
  const [newListName, setNewListName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [creatingError, setCreatingError] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newListName.trim()) {
      setCreatingError('Inserisci un nome per la lista');
      return;
    }
    
    try {
      await createList(newListName.trim());
      setNewListName('');
      setIsCreating(false);
      setCreatingError('');
    } catch (err) {
      setCreatingError('Errore nella creazione della lista');
      console.error(err);
    }
  };

  const handleDeleteListWithName = async (listId: string, listName: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare la lista "${listName}"?`)) {
      try {
        await deleteList(listId);
        setOpenDropdown(null);
      } catch (err) {
        console.error('Errore nell\'eliminazione della lista:', err);
      }
    }
  };

  const toggleDropdown = (listId: string) => {
    setOpenDropdown(openDropdown === listId ? null : listId);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  const getProductCount = (list: ShoppingList) => {
    return list.products.length;
  };
  
  const getPurchasedCount = (list: ShoppingList) => {
    return list.products.filter(p => p.purchased).length;
  };
  
  const handleDeleteList = async (listId: string) => {
    if (confirm('Sei sicuro di voler eliminare questa lista?')) {
      try {
        await deleteList(listId);
      } catch (err) {
        console.error('Errore nell\'eliminazione della lista', err);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container-narrow">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Le mie liste della spesa
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Ciao {currentUser?.email?.split('@')[0] || 'Utente'}! Gestisci le tue liste qui.
              </p>
            </div>
            
            <button
              onClick={() => setIsCreating(true)}
              className="btn btn-primary mt-4 sm:mt-0"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuova Lista
            </button>
          </div>
          
          {error && (
            <div className="bg-error-50 dark:bg-error-900/30 text-error-700 dark:text-error-400 p-4 rounded-lg mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {isCreating && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 animate-fade-in">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Crea nuova lista
              </h2>
              
              {creatingError && (
                <div className="bg-error-50 dark:bg-error-900/30 text-error-700 dark:text-error-400 p-3 rounded-lg mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{creatingError}</span>
                </div>
              )}
              
              <form onSubmit={handleCreateList}>
                <div className="mb-4">
                  <label htmlFor="listName" className="label">
                    Nome della lista
                  </label>
                  <input
                    id="listName"
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="input"
                    placeholder="es. Spesa settimanale"
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setNewListName('');
                      setCreatingError('');
                    }}
                    className="btn btn-outline"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Crea Lista
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : lists.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nessuna lista della spesa
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Crea la tua prima lista per iniziare a organizzare la spesa.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="btn btn-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crea Lista
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {lists.map((list) => (
                <div 
                  key={list.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-[1.02]"
                >
                  <Link 
                    to={`/list/${list.id}`}
                    className="block p-6"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {list.name}
                      </h3>
                      
                      {/* Dropdown menu per le azioni della lista */}
                      <div className="relative group">
                        <button 
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleDropdown(list.id);
                          }}
                        >
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>
                        
                        {openDropdown === list.id && (
                          <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Implementare funzionalità di modifica nome
                                  const newName = prompt('Nuovo nome della lista:', list.name);
                                  if (newName && newName.trim()) {
                                    // Qui andrà la funzione per rinominare la lista
                                    console.log('Rinomina lista:', newName);
                                  }
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Rinomina
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Implementare funzionalità di condivisione
                                  console.log('Condividi lista:', list.id);
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Condividi
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Alle linee 264 e 339, sostituisci:
                                  handleDeleteListWithName(list.id, list.name);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Elimina
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Aggiornata il {formatDate(list.updatedAt)}</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Prodotti: {getPurchasedCount(list)}/{getProductCount(list)}
                        </span>
                        {getProductCount(list) > 0 && (
                          <span className="text-sm font-medium text-primary-500">
                            {Math.round((getPurchasedCount(list) / getProductCount(list)) * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ 
                            width: getProductCount(list) > 0 
                              ? `${(getPurchasedCount(list) / getProductCount(list)) * 100}%` 
                              : '0%'
                          }}
                        ></div>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 flex justify-between items-center">
                    {/* Sezione di condivisione completamente rimossa */}
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/list/${list.id}`}
                        className="p-1.5 rounded-full text-gray-600 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-700"
                        title="Modifica"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      
                      {list.ownerId === currentUser?.email && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteList(list.id);
                          }}
                          className="p-1.5 rounded-full text-gray-600 hover:text-error-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-error-400 dark:hover:bg-gray-700"
                          title="Elimina"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;