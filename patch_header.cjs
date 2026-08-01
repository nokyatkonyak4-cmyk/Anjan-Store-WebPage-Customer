const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// 1. Add searchQuery state to MainAppScreen
content = content.replace(
  "const [selectedItem, setSelectedItem] = useState('Home');",
  "const [selectedItem, setSelectedItem] = useState('Home');\n  const [searchQuery, setSearchQuery] = useState('');"
);

// 2. Modify Top App Bar to include the search bar
const oldTopAppBar = `      {/* Top App Bar */}
      <div className="bg-brand-yellow text-dark-bg px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden">
            <img src="/AppIcon-512x512.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">Anjan Store</span>
            <span className="text-[9px] tracking-widest font-semibold uppercase">All in one place</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setSelectedItem('Favorites')}>
            <Heart size={24} className="text-dark-bg" />
          </button>
          <button onClick={() => setSelectedItem('Notifications')} className="relative">
            <Bell size={24} className="text-dark-bg" />
            {notifications.filter(n => !n.isRead).length > 0 && (
               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#FFC107] text-[8px] text-white flex items-center justify-center">
                 {notifications.filter(n => !n.isRead).length}
               </span>
            )}
          </button>
          <button onClick={() => setSelectedItem('Profile')} className="w-8 h-8 rounded-full bg-dark-bg text-[#FFC107] flex items-center justify-center font-bold text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </button>
        </div>
      </div>`;

const newTopAppBar = `      {/* Top App Bar */}
      <div className="bg-brand-yellow text-dark-bg flex flex-col sticky top-0 z-20 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden">
              <img src="/AppIcon-512x512.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">Anjan Store</span>
              <span className="text-[9px] tracking-widest font-semibold uppercase">All in one place</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSelectedItem('Favorites')}>
              <Heart size={24} className="text-dark-bg" />
            </button>
            <button onClick={() => setSelectedItem('Notifications')} className="relative">
              <Bell size={24} className="text-dark-bg" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#FFC107] text-[8px] text-white flex items-center justify-center">
                   {notifications.filter(n => !n.isRead).length}
                 </span>
              )}
            </button>
            <button onClick={() => setSelectedItem('Profile')} className="w-8 h-8 rounded-full bg-dark-bg text-[#FFC107] flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </button>
          </div>
        </div>
        
        {selectedItem === 'Home' && (
          <div className="px-4 pb-4 pt-1">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for groceries, items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/90 focus:bg-white rounded-xl py-3 pl-12 pr-4 text-sm shadow-inner outline-none border border-transparent focus:border-white transition-colors"
              />
              <Search size={18} className="absolute left-4 top-3.5 text-gray-500" />
            </div>
          </div>
        )}
      </div>`;

content = content.replace(oldTopAppBar, newTopAppBar);

// 3. Update the HomeScreen invocation
content = content.replace(
  "{selectedItem === 'Home' && <HomeScreen onNavigate={setSelectedItem} products={products} categories={categories} banners={banners} favorites={favorites} cartItems={cartItems} toggleFavorite={toggleFavorite} incrementCart={incrementCart} decrementCart={decrementCart} />}",
  "{selectedItem === 'Home' && <HomeScreen searchQuery={searchQuery} onNavigate={setSelectedItem} products={products} categories={categories} banners={banners} favorites={favorites} cartItems={cartItems} toggleFavorite={toggleFavorite} incrementCart={incrementCart} decrementCart={decrementCart} />}"
);

// 4. Update the HomeScreen definition
const oldHomeScreen = `// --- Screens ---
function HomeScreen({ onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const displayedProducts = searchQuery 
    ? products.filter((p:any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  return (
    <div className="flex flex-col w-full pb-4 animate-in fade-in">
      <div className="px-4 py-4 sticky top-0 bg-light-bg z-10">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for groceries, items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-xl py-3 pl-12 pr-4 text-sm shadow-sm outline-none border border-transparent focus:border-[#FFC107]"
          />
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
        </div>
      </div>`;

const newHomeScreen = `// --- Screens ---
function HomeScreen({ searchQuery, onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
  const displayedProducts = searchQuery 
    ? products.filter((p:any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  return (
    <div className="flex flex-col w-full pb-4 animate-in fade-in pt-4">`;

content = content.replace(oldHomeScreen, newHomeScreen);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
