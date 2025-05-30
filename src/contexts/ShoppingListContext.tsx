import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  doc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: string;
  image: string;
  purchased: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  products: Product[];
  ownerId: string;
  sharedWith: string[];
  ownerEmail?: string;
  ownerDisplayName?: string; // Nuovo campo
}

// Helper function to get user info by email
async function getUserInfoByEmail(email: string): Promise<{uid: string, displayName: string} | null> {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', email)
    );
    
    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
        unsubscribe();
        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          const userData = userDoc.data();
          resolve({
            uid: userData.uid,
            displayName: userData.displayName || userData.email?.split('@')[0] || 'Utente'
          });
        } else {
          resolve(null);
        }
      }, (error) => {
        console.error('Error getting user info by email:', error);
        resolve(null);
      });
    });
  } catch (error) {
    console.error('Error getting user info by email:', error);
    return null;
  }
}

interface ShoppingListContextType {
  lists: ShoppingList[];
  createList: (name: string) => Promise<string>;
  updateList: (listId: string, data: Partial<ShoppingList>) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  addProduct: (listId: string, product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (listId: string, productId: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (listId: string, productId: string) => Promise<void>;
  shareList: (listId: string, email: string) => Promise<void>;
  removeSharedUser: (listId: string, email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
}

// Helper function to get user UID by email
async function getUserIdByEmail(email: string): Promise<string | null> {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', email)
    );
    
    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
        unsubscribe();
        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          resolve(userDoc.data().uid);
        } else {
          resolve(null);
        }
      }, (error) => {
        console.error('Error getting user ID by email:', error);
        resolve(null);
      });
    });
  } catch (error) {
    console.error('Error getting user ID by email:', error);
    return null;
  }
}

interface ShoppingListProviderProps {
  children: ReactNode;
}

export function ShoppingListProvider({ children }: ShoppingListProviderProps) {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLists([]);
      setLoading(false);
      return;
    }
  
    setLoading(true);
    setError(null);
  
    // Query lists where the current user is either the owner or shared with (using UID)
    const listsQuery = query(
      collection(db, 'shoppingLists'),
      where('ownerId', '==', currentUser.uid) // Changed to use UID
    );
  
    const sharedListsQuery = query(
      collection(db, 'shoppingLists'),
      where('sharedWith', 'array-contains', currentUser.uid) // Changed to use UID
    );
  
    let ownedLists: ShoppingList[] = [];
    let sharedLists: ShoppingList[] = [];
    let ownedLoaded = false;
    let sharedLoaded = false;
  
    const updateLists = () => {
      if (ownedLoaded && sharedLoaded) {
        // Remove duplicates by ID (in case a list is both owned and shared)
        const allLists = [...ownedLists, ...sharedLists];
        const uniqueLists = allLists.filter((list, index, self) => 
          index === self.findIndex(l => l.id === list.id)
        );
        setLists(uniqueLists);
        setLoading(false);
      }
    };
  
    // Combine both subscriptions
    const unsubscribeOwned = onSnapshot(listsQuery, (snapshot) => {
      ownedLists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShoppingList[];
      
      ownedLoaded = true;
      updateLists();
    }, (err) => {
      setError('Failed to fetch your shopping lists');
      setLoading(false);
      console.error('Error fetching owned lists:', err);
    });
  
    const unsubscribeShared = onSnapshot(sharedListsQuery, (snapshot) => {
      sharedLists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShoppingList[];
      
      sharedLoaded = true;
      updateLists();
    }, (err) => {
      setError('Failed to fetch shared shopping lists');
      setLoading(false);
      console.error('Error fetching shared lists:', err);
    });
  
    return () => {
      unsubscribeOwned();
      unsubscribeShared();
    };
  }, [currentUser]);

  async function createList(name: string) {
    console.log('createList called with:', name);
    console.log('currentUser:', currentUser);
    
    if (!currentUser) {
      console.error('No current user');
      throw new Error('You must be logged in');
    }
    
    try {
      const newList = {
        name,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        products: [],
        ownerId: currentUser.uid, // Changed to use UID
        sharedWith: [],
        ownerEmail: currentUser.email // Keep email for display
      };
      
      console.log('Creating list with data:', newList);
      const docRef = await addDoc(collection(db, 'shoppingLists'), newList);
      console.log('List created with ID:', docRef.id);
      return docRef.id;
    } catch (err) {
      console.error('Error in createList:', err);
      setError('Failed to create list');
      throw err;
    }
  }

  async function updateList(listId: string, data: Partial<ShoppingList>) {
    try {
      const listRef = doc(db, 'shoppingLists', listId);
      await updateDoc(listRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      setError('Failed to update list');
      throw err;
    }
  }

  async function deleteList(listId: string) {
    try {
      await deleteDoc(doc(db, 'shoppingLists', listId));
    } catch (err) {
      setError('Failed to delete list');
      throw err;
    }
  }

  async function addProduct(listId: string, product: Omit<Product, 'id'>) {
    try {
      const productWithId = {
        ...product,
        id: uuidv4(),
        purchased: false
      };
      
      const listRef = doc(db, 'shoppingLists', listId);
      await updateDoc(listRef, {
        products: arrayUnion(productWithId),
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      setError('Failed to add product');
      throw err;
    }
  }

  async function updateProduct(listId: string, productId: string, data: Partial<Product>) {
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) throw new Error('List not found');
      
      const productIndex = list.products.findIndex(p => p.id === productId);
      if (productIndex === -1) throw new Error('Product not found');
      
      const updatedProducts = [...list.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        ...data
      };
      
      const listRef = doc(db, 'shoppingLists', listId);
      await updateDoc(listRef, {
        products: updatedProducts,
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      setError('Failed to update product');
      throw err;
    }
  }

  async function deleteProduct(listId: string, productId: string) {
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) throw new Error('List not found');
      
      const productToRemove = list.products.find(p => p.id === productId);
      if (!productToRemove) throw new Error('Product not found');
      
      const listRef = doc(db, 'shoppingLists', listId);
      await updateDoc(listRef, {
        products: arrayRemove(productToRemove),
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      setError('Failed to delete product');
      throw err;
    }
  }

  async function shareList(listId: string, email: string) {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      // Usa getUserInfoByEmail per ottenere sia uid che displayName
      const userInfo = await getUserInfoByEmail(email);
      if (!userInfo) {
        throw new Error('Utente non trovato');
      }
      
      const listRef = doc(db, 'shoppingLists', listId);
      
      // Ottieni anche le informazioni del proprietario corrente
      const currentUserQuery = query(
        collection(db, 'users'),
        where('uid', '==', currentUser.uid)
      );
      
      return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(currentUserQuery, async (snapshot) => {
          unsubscribe();
          try {
            let ownerDisplayName = 'Utente';
            if (!snapshot.empty) {
              const userData = snapshot.docs[0].data();
              ownerDisplayName = userData.displayName || userData.email?.split('@')[0] || 'Utente';
            }
            
            await updateDoc(listRef, {
              sharedWith: arrayUnion(userInfo.uid),
              ownerDisplayName: ownerDisplayName // Salva il nome del proprietario
            });
            
            resolve(undefined);
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    } catch (error) {
      console.error('Error sharing list:', error);
      throw error;
    }
  }

  async function removeSharedUser(listId: string, email: string) {
    try {
      // Get user UID by email
      const userId = await getUserIdByEmail(email);
      
      if (!userId) {
        throw new Error('User not found');
      }
      
      const listRef = doc(db, 'shoppingLists', listId);
      await updateDoc(listRef, {
        sharedWith: arrayRemove(userId), // Use UID instead of email
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      setError('Failed to remove shared user');
      throw err;
    }
  }

  const value: ShoppingListContextType = {
    lists,
    createList,
    updateList,
    deleteList,
    addProduct,
    updateProduct,
    deleteProduct,
    shareList: async (listId: string, email: string): Promise<void> => {
      if (!currentUser) throw new Error('User not authenticated');
      
      try {
        const userInfo = await getUserInfoByEmail(email);
        if (!userInfo) {
          throw new Error('Utente non trovato');
        }
        
        const listRef = doc(db, 'shoppingLists', listId);
        
        const currentUserQuery = query(
          collection(db, 'users'),
          where('uid', '==', currentUser.uid)
        );
        
        const snapshot = await new Promise<any>((resolve, reject) => {
          const unsubscribe = onSnapshot(currentUserQuery, (snap) => {
            unsubscribe();
            resolve(snap);
          }, reject);
        });

        let ownerDisplayName = 'Utente';
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          ownerDisplayName = userData.displayName || userData.email?.split('@')[0] || 'Utente';
        }
        
        await updateDoc(listRef, {
          sharedWith: arrayUnion(userInfo.uid),
          ownerDisplayName: ownerDisplayName
        });
      } catch (error) {
        console.error('Error sharing list:', error);
        throw error;
      }
    },
    removeSharedUser,
    loading,
    error
  };

  return (
<ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}
