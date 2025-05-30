import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Trash2, 
  Share2, 
  User,
  X,
  ArrowLeft,
  Search,
  Mail,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useShoppingList, Product } from '../contexts/ShoppingListContext';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

// Product categories with their icons
export const CATEGORIES = [
  { id: 'fruits', name: 'Frutta e Verdura', emoji: '🍎', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  { id: 'dairy', name: 'Latticini', emoji: '🧀', color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'meat', name: 'Carne', emoji: '🥩', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  { id: 'fish', name: 'Pesce', emoji: '🐟', color: 'text-teal-500', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  { id: 'bakery', name: 'Pane e Dolci', emoji: '🍞', color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { id: 'beverages', name: 'Bevande', emoji: '🥤', color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'frozen', name: 'Surgelati', emoji: '🧊', color: 'text-cyan-500', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  { id: 'pantry', name: 'Dispensa', emoji: '🥫', color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'household', name: 'Casa e Pulizia', emoji: '🧽', color: 'text-lime-500', bgColor: 'bg-lime-100 dark:bg-lime-900/30' },
  { id: 'personal', name: 'Cura Personale', emoji: '🧴', color: 'text-pink-500', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  { id: 'other', name: 'Altro', emoji: '🛒', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-700/30' },
];

// Product images for each category
const PRODUCT_IMAGES: Record<string, string> = {
  fruits: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  dairy: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  meat: 'https://images.pexels.com/photos/1927377/pexels-photo-1927377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  fish: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  bakery: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  beverages: 'https://images.pexels.com/photos/1292862/pexels-photo-1292862.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  frozen: 'https://images.pexels.com/photos/7489012/pexels-photo-7489012.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  pantry: 'https://images.pexels.com/photos/6207297/pexels-photo-6207297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  household: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  personal: 'https://images.pexels.com/photos/3737599/pexels-photo-3737599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  other: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
};

// Keyword mapping for auto-categorization (SOLO ITALIANO)
const KEYWORDS_TO_CATEGORY: Record<string, string> = {
  // Frutta e Verdura
  mele: 'fruits', mela: 'fruits',
  pere: 'fruits', pea: 'fruits',
  arance: 'fruits', arancia: 'fruits',
  banane: 'fruits', banana: 'fruits',
  fragole: 'fruits', fragola: 'fruits',
  uva: 'fruits',
  kiwi: 'fruits',
  limoni: 'fruits', limone: 'fruits',
  pesche: 'fruits', pesca: 'fruits',
  albicocche: 'fruits', albicocca: 'fruits',
  ananas: 'fruits',
  ciliegie: 'fruits', ciliegia: 'fruits',
  mandarini: 'fruits', mandarino: 'fruits',
  fichi: 'fruits', fico: 'fruits',
  melone: 'fruits',
  cocomero: 'fruits',
  lamponi: 'fruits', lampone: 'fruits',
  mirtilli: 'fruits', mirtillo: 'fruits',
  insalata: 'fruits', lattuga: 'fruits',
  pomodori: 'fruits', pomodoro: 'fruits',
  cetrioli: 'fruits', cetriolo: 'fruits',
  zucchine: 'fruits', zucchina: 'fruits',
  carote: 'fruits', carota: 'fruits',
  peperoni: 'fruits', peperone: 'fruits',
  melanzane: 'fruits', melanzana: 'fruits',
  cipolle: 'fruits', cipolla: 'fruits',
  aglio: 'fruits',
  patate: 'fruits', patata: 'fruits',
  spinaci: 'fruits',
  cavolfiore: 'fruits',
  broccoli: 'fruits',
  funghi: 'fruits', fungo: 'fruits',
  finocchi: 'fruits', finocchio: 'fruits',
  porri: 'fruits', porro: 'fruits',
  verza: 'fruits',
  rapa: 'fruits', rape: 'fruits',
  
  // Pane e Dolci
  pane: 'bakery',
  'pane bianco': 'bakery',
  'pane integrale': 'bakery',
  'pane senza glutine': 'bakery',
  panini: 'bakery', panino: 'bakery',
  baguette: 'bakery',
  'pizza margherita': 'bakery',
  'pizza bianca': 'bakery',
  pizza: 'bakery',
  focaccia: 'bakery',
  grissini: 'bakery', grissino: 'bakery',
  'torta al cioccolato': 'bakery',
  torta: 'bakery',
  'crostata di marmellata': 'bakery',
  crostata: 'bakery',
  'biscotti secchi': 'bakery',
  biscotti: 'bakery', biscotto: 'bakery',
  cornetti: 'bakery', cornetto: 'bakery', croissant: 'bakery',
  'pan di spagna': 'bakery',
  ciambella: 'bakery',
  
  // Latticini e Uova
  'latte intero': 'dairy',
  'latte parzialmente scremato': 'dairy',
  'latte senza lattosio': 'dairy',
  latte: 'dairy',
  'yogurt bianco': 'dairy',
  'yogurt alla frutta': 'dairy',
  yogurt: 'dairy',
  burro: 'dairy',
  'panna da cucina': 'dairy',
  panna: 'dairy',
  formaggio: 'dairy',
  'formaggio grattugiato': 'dairy',
  mozzarella: 'dairy',
  'parmigiano reggiano': 'dairy',
  parmigiano: 'dairy',
  gorgonzola: 'dairy',
  ricotta: 'dairy',
  stracchino: 'dairy',
  crescenza: 'dairy',
  'uova biologiche': 'dairy',
  'uova medie': 'dairy',
  'uova grandi': 'dairy',
  uova: 'dairy', uovo: 'dairy',
  
  // Carne e Salumi
  pollo: 'meat',
  'fusi di pollo': 'meat',
  'petto di pollo': 'meat',
  tacchino: 'meat',
  'arrosto di tacchino': 'meat',
  manzo: 'meat',
  'bistecca di manzo': 'meat',
  bistecca: 'meat', bistecche: 'meat',
  'straccetti di manzo': 'meat',
  straccetti: 'meat',
  'macinato misto': 'meat',
  'macinato di manzo': 'meat',
  macinato: 'meat',
  'fettine di vitello': 'meat',
  vitello: 'meat',
  spezzatino: 'meat',
  'costine di maiale': 'meat',
  costine: 'meat',
  maiale: 'meat',
  salsiccia: 'meat', salsicce: 'meat',
  'prosciutto crudo': 'meat',
  'prosciutto cotto': 'meat',
  prosciutto: 'meat',
  salame: 'meat',
  mortadella: 'meat',
  speck: 'meat',
  bresaola: 'meat',
  wurstel: 'meat',
  lonza: 'meat',
  
  // Pesce e Frutti di Mare
  pesce: 'fish',
  'tonno in scatola': 'fish',
  'tonno sott\'olio': 'fish',
  'tonno al naturale': 'fish',
  tonno: 'fish',
  'salmone fresco': 'fish',
  'salmone affumicato': 'fish',
  salmone: 'fish',
  merluzzo: 'fish',
  gamberi: 'fish', gamberetto: 'fish',
  cozze: 'fish', cozza: 'fish',
  vongole: 'fish', vongola: 'fish',
  'acciughe sott\'olio': 'fish',
  acciughe: 'fish', acciuga: 'fish',
  sgombro: 'fish',
  polpo: 'fish',
  seppie: 'fish', seppia: 'fish',
  'pesce spada': 'fish',
  orata: 'fish',
  branzino: 'fish',
  calamari: 'fish', calamaro: 'fish',
  
  // Scatolame e Conserve
  'fagioli in scatola': 'pantry',
  fagioli: 'pantry',
  'ceci in scatola': 'pantry',
  ceci: 'pantry',
  'lenticchie precotte': 'pantry',
  lenticchie: 'pantry',
  piselli: 'pantry',
  'pomodori pelati': 'pantry',
  'passata di pomodoro': 'pantry',
  'polpa di pomodoro': 'pantry',
  passata: 'pantry',
  mais: 'pantry',
  sottaceti: 'pantry',
  'olive verdi': 'pantry',
  'olive nere': 'pantry',
  olive: 'pantry', oliva: 'pantry',
  carciofini: 'pantry',
  'funghi trifolati': 'pantry',
  'peperoni grigliati': 'pantry',
  
  // Pasta, Riso e Cereali
  pasta: 'pantry',
  'pasta corta': 'pantry',
  'pasta lunga': 'pantry',
  spaghetti: 'pantry',
  penne: 'pantry',
  fusilli: 'pantry',
  linguine: 'pantry',
  'riso arborio': 'pantry',
  'riso basmati': 'pantry',
  'riso integrale': 'pantry',
  'riso venere': 'pantry',
  riso: 'pantry',
  farro: 'pantry',
  orzo: 'pantry',
  couscous: 'pantry',
  gnocchi: 'pantry',
  polenta: 'pantry',
  quinoa: 'pantry',
  
  // Farine, Zuccheri e Preparati
  farina: 'pantry',
  'farina 00': 'pantry',
  'farina integrale': 'pantry',
  'farina di riso': 'pantry',
  'farina di mais': 'pantry',
  'zucchero bianco': 'pantry',
  'zucchero di canna': 'pantry',
  'zucchero a velo': 'pantry',
  zucchero: 'pantry',
  'lievito per dolci': 'pantry',
  'lievito di birra': 'pantry',
  lievito: 'pantry',
  'preparati per dolci': 'pantry',
  'cacao amaro': 'pantry',
  cacao: 'pantry',
  'fecola di patate': 'pantry',
  maizena: 'pantry',
  vanillina: 'pantry',
  'amido di mais': 'pantry',
  bicarbonato: 'pantry',
  
  // Condimenti e Spezie
  'sale fino': 'pantry',
  'sale grosso': 'pantry',
  sale: 'pantry',
  'pepe nero': 'pantry',
  pepe: 'pantry',
  'olio extravergine d\'oliva': 'pantry',
  'olio di semi': 'pantry',
  'olio extravergine': 'pantry',
  olio: 'pantry',
  'aceto di vino': 'pantry',
  'aceto balsamico': 'pantry',
  aceto: 'pantry',
  'salsa di soia': 'pantry',
  'salsa barbecue': 'pantry',
  senape: 'pantry',
  maionese: 'pantry',
  ketchup: 'pantry',
  curry: 'pantry',
  paprika: 'pantry',
  origano: 'pantry',
  basilico: 'pantry',
  rosmarino: 'pantry',
  timo: 'pantry',
  peperoncino: 'pantry',
  alloro: 'pantry',
  'noce moscata': 'pantry',
  zenzero: 'pantry',
  'dado da brodo': 'pantry',
  dado: 'pantry',
  
  // Bevande
  'acqua naturale': 'beverages',
  'acqua frizzante': 'beverages',
  acqua: 'beverages',
  'succo di frutta': 'beverages',
  'succhi 100% frutta': 'beverages',
  'spremute pronte': 'beverages',
  succo: 'beverages',
  'tè freddo': 'beverages',
  'tè in bottiglia': 'beverages',
  tè: 'beverages',
  birra: 'beverages',
  'vino rosso': 'beverages',
  'vino bianco': 'beverages',
  vino: 'beverages',
  'latte vegetale': 'beverages',
  'bibite energetiche': 'beverages',
  caffè: 'beverages',
  
  // Snacks e Dolciumi
  'cioccolato fondente': 'other',
  'cioccolato al latte': 'other',
  'cioccolato bianco': 'other',
  cioccolato: 'other',
  'caramelle gommose': 'other',
  'caramelle dure': 'other',
  caramelle: 'other', caramella: 'other',
  'patatine classiche': 'other',
  'patatine ondulate': 'other',
  patatine: 'other',
  'barrette ai cereali': 'other',
  'barrette energetiche': 'other',
  barrette: 'other',
  'crackers salati': 'other',
  taralli: 'other',
  noccioline: 'other',
  mandorle: 'other',
  anacardi: 'other',
  'frutta secca mista': 'other',
  'frutta secca': 'other',
  uvetta: 'other',
  
  // Prodotti per la Casa
  'carta igienica': 'household',
  'carta assorbente': 'household',
  carta: 'household',
  'carta cucina': 'household',
  'sacchetti immondizia': 'household',
  sacchetti: 'household',
  'detersivo per piatti': 'household',
  'detersivo per lavatrice': 'household',
  'detersivo per pavimenti': 'household',
  'detersivo piatti': 'household',
  'detersivo lavatrice': 'household',
  detersivo: 'household',
  ammorbidente: 'household',
  spugne: 'household', spugna: 'household',
  'guanti in lattice': 'household',
  'sapone piatti': 'household',
  'detergente wc': 'household',
  'spray disinfettante': 'household',
  
  // Cura Personale
  'sapone mani': 'personal',
  sapone: 'personal',
  bagnoschiuma: 'personal',
  dentifricio: 'personal',
  collutorio: 'personal',
};

export const ShoppingListPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    lists, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    shareList,
    removeSharedUser,
    loading, 
    error 
  } = useShoppingList();
  
  const currentList = lists.find(list => list.id === listId) || null;
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'other',
    quantity: '1'
  });
  
  // Auto-categorization function
  function autoDetectCategory(productName: string): string {
    const lower = productName.toLowerCase();
    
    for (const keyword in KEYWORDS_TO_CATEGORY) {
      if (lower.includes(keyword)) return KEYWORDS_TO_CATEGORY[keyword];
    }
    return 'other';
  }
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) {
      return;
    }
    try {
      if (listId) {
        await addProduct(listId, {
          ...newProduct,
          image: PRODUCT_IMAGES[newProduct.category] || PRODUCT_IMAGES.other,
          purchased: false
        });
        setNewProduct({ name: '', category: 'other', quantity: '1' });
        setIsAddingProduct(false);
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };
  
  const handleTogglePurchased = async (productId: string, purchased: boolean) => {
    if (listId) {
      try {
        await updateProduct(listId, productId, { purchased: !purchased });
      } catch (err) {
        console.error('Errore nell\'aggiornamento del prodotto', err);
      }
    }
  };
  
  const handleRemoveProduct = async (productId: string) => {
    if (listId) {
      try {
        await deleteProduct(listId, productId);
      } catch (err) {
        console.error('Errore nella rimozione del prodotto', err);
      }
    }
  };
  
  const handleShareList = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shareEmail.trim()) {
      return;
    }
    
    try {
      if (listId) {
        await shareList(listId, shareEmail.trim());
        setShareEmail('');
        setIsSharing(false);
      }
    } catch (err) {
      console.error('Error sharing list:', err);
    }
  };
  
  const handleRemoveSharedUser = async (email: string) => {
    if (listId) {
      try {
        await removeSharedUser(listId, email);
      } catch (err) {
        console.error('Errore nella rimozione dell\'utente condiviso', err);
      }
    }
  };
  
  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
  };
  
  // Filter products by search term and sort by category
  const filteredProducts = currentList?.products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryInfo(product.category).name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // First sort by purchased status
      if (a.purchased !== b.purchased) {
        return a.purchased ? 1 : -1;
      }
      // Then sort by category
      return a.category.localeCompare(b.category);
    }) || [];
  
  // Group products by category
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!currentList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Lista non trovata</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Fixed: Check if current user is owner using UID instead of email
  const isOwner = currentList.ownerId === currentUser?.uid;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
        <div className="container-narrow">
          <div className="mb-6 flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {currentList.name}
              </h1>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                {isOwner ? (
                  <>
                    <User className="h-4 w-4 mr-1" />
                    <span>La tua lista</span>
                  </>
                ) : (
                  <>
                    {currentList.ownerDisplayName && (
                      <>
                        <Share2 className="h-4 w-4 mr-1" />
                        <span>Condivisa da {currentList.ownerDisplayName}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {isOwner && (
              <button
                onClick={() => setIsSharing(true)}
                className="ml-auto btn btn-outline flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Condividi
              </button>
            )}
          </div>
          
          {error && (
            <div className="bg-error-50 dark:bg-error-900/30 text-error-700 dark:text-error-400 p-4 rounded-lg mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Search and Add Product */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cerca prodotti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="btn btn-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Aggiungi Prodotto
              </button>
            </div>
          </div>
          
          {/* Add Product Form */}
          {isAddingProduct && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Aggiungi nuovo prodotto
                </h2>
                <button
                  onClick={() => {
                    setIsAddingProduct(false);
                    setNewProduct({ name: '', category: 'other', quantity: '1' });
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleAddProduct}>
                <div>
                  <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome prodotto
                    </label>
                    <input
                      id="productName"
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setNewProduct({
                          ...newProduct,
                          name,
                          category: autoDetectCategory(name)
                        });
                      }}
                      className="input"
                      placeholder="Nome prodotto (es. Latte, Pane, Mela)"
                      autoFocus
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoria
                    </label>
                    <select
                      id="productCategory"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="input"
                    >
                      {CATEGORIES.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.emoji} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="productQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantità
                    </label>
                    <input
                      id="productQuantity"
                      type="text"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                      className="input"
                      placeholder="Quantità (es. 1 litro, 2 pezzi)"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setNewProduct({ name: '', category: 'other', quantity: '1' });
                      }}
                      className="btn btn-outline flex-1"
                    >
                      Annulla
                    </button>
                    <button type="submit" className="btn btn-primary flex-1">
                      Aggiungi
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          
          {/* Products List */}
          <div className="space-y-6">
            {Object.entries(productsByCategory).map(([categoryId, products]) => {
              const categoryInfo = getCategoryInfo(categoryId);
              return (
                <div key={categoryId} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <div className={`${categoryInfo.bgColor} px-4 py-3 border-b border-gray-200 dark:border-gray-700`}>
                    <h3 className={`font-semibold ${categoryInfo.color} flex items-center`}>
                      <span className="text-lg mr-2">{categoryInfo.emoji}</span>
                      {categoryInfo.name}
                      <span className="ml-auto text-sm font-normal text-gray-600 dark:text-gray-400">
                        {products.length} {products.length === 1 ? 'prodotto' : 'prodotti'}
                      </span>
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product) => (
                      <div key={product.id} className="p-4 flex items-center space-x-3">
                        <button
                          onClick={() => handleTogglePurchased(product.id, product.purchased)}
                          className="flex-shrink-0"
                        >
                          {product.purchased ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400 hover:text-green-500" />
                          )}
                        </button>
                        
                        <div className="flex-grow">
                          <div className={`font-medium ${
                            product.purchased 
                              ? 'text-gray-500 dark:text-gray-400 line-through' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {product.name}
                          </div>
                          {product.quantity && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {product.quantity}
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'Nessun prodotto trovato per la ricerca' : 'Nessun prodotto nella lista'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setIsAddingProduct(true)}
                    className="btn btn-primary mt-4"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Aggiungi il primo prodotto
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Share List Modal */}
          {isSharing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Condividi lista
                    </h2>
                    <button
                      onClick={() => {
                        setIsSharing(false);
                        setShareEmail('');
                      }}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleShareList}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="shareEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email utente
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="shareEmail"
                            type="email"
                            value={shareEmail}
                            onChange={(e) => setShareEmail(e.target.value)}
                            className="input pl-10"
                            placeholder="email@esempio.com"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSharing(false);
                            setShareEmail('');
                          }}
                          className="btn btn-outline flex-1"
                        >
                          Annulla
                        </button>
                        <button type="submit" className="btn btn-primary flex-1">
                          Condividi
                        </button>
                      </div>
                    </div>
                  </form>
                  
                  {/* Shared Users List - Note: This will need to be updated to show emails instead of UIDs */}
                  {currentList.sharedWith && currentList.sharedWith.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Condivisa con:
                      </h3>
                      <div className="space-y-2">
                        {/* Note: sharedWith now contains UIDs, you'll need to implement a way to display emails */}
                        {currentList.sharedWith.map((userId) => (
                          <div key={userId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {/* This will show UID for now - you might want to implement email lookup */}
                              Utente: {userId.substring(0, 8)}...
                            </span>
                            <button
                              onClick={() => handleRemoveSharedUser(userId)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShoppingListPage;