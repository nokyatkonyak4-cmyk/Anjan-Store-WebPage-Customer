const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// 1. Remove Top App Bar search
const topAppBarSearch = `{selectedItem === 'Home' && (
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
        )}`;
if(content.includes(topAppBarSearch)) {
  content = content.replace(topAppBarSearch, '');
} else {
  console.log("topAppBarSearch not found");
}

// 2. Add search to HomeScreen and pass setSearchQuery
content = content.replace(
  `<HomeScreen searchQuery={searchQuery} onNavigate={setSelectedItem} products={products} categories={categories} banners={banners} favorites={favorites} cartItems={cartItems} toggleFavorite={toggleFavorite} incrementCart={incrementCart} decrementCart={decrementCart} />`,
  `<HomeScreen searchQuery={searchQuery} setSearchQuery={setSearchQuery} onNavigate={setSelectedItem} products={products} categories={categories} banners={banners} favorites={favorites} cartItems={cartItems} toggleFavorite={toggleFavorite} incrementCart={incrementCart} decrementCart={decrementCart} />`
);

const homeScreenDef = `function HomeScreen({ searchQuery, onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
  const navigate = useNavigate();`;
const newHomeScreenDef = `function HomeScreen({ searchQuery, setSearchQuery, onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
  const navigate = useNavigate();`;
if(content.includes(homeScreenDef)) {
  content = content.replace(homeScreenDef, newHomeScreenDef);
} else {
  console.log("homeScreenDef not found");
}

const homeScreenReturn = `  return (
    <div className="flex flex-col w-full pb-4 animate-in fade-in pt-4">`;
const newHomeScreenReturn = `  return (
    <div className="flex flex-col w-full pb-4 animate-in fade-in pt-4">
      <div className="px-4 mb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for groceries, items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-xl py-3.5 pl-12 pr-4 text-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] outline-none border border-gray-100"
          />
          <Search size={18} className="absolute left-4 top-4 text-gray-500" />
        </div>
      </div>`;
if(content.includes(homeScreenReturn)) {
  content = content.replace(homeScreenReturn, newHomeScreenReturn);
} else {
  console.log("homeScreenReturn not found");
}

// 3. Fix ProductCard
const oldProductCardRegex = /function ProductCard\([\s\S]*?\n\}/;
const newProductCard = `function ProductCard({ product, cartQuantity, isFavorite, onToggleFavorite, onIncrement, onDecrement }: any) {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col h-[180px] md:h-[220px] border border-gray-100 transition-shadow relative" onClick={() => onIncrement(product)}>
      <div className="relative h-[100px] md:h-[130px] w-full shrink-0 p-3 flex items-center justify-center border-b border-gray-50">
        <img src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={product.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />
      </div>
      <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm z-10 border border-gray-100">
        <Heart size={14} className={isFavorite ? "fill-[#FFC107] text-[#FFC107]" : "text-gray-400"} />
      </button>
      <div className="p-2 md:p-3 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-dark-bg text-[11px] md:text-sm line-clamp-1 mb-1">{product.name}</h3>
          <span className="inline-block text-[9px] md:text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm mb-1">{product.category}</span>
        </div>
        <span className="font-bold text-xs md:text-sm text-dark-bg block mt-auto">₹{product.price.toFixed(1)}</span>
      </div>
    </div>
  );
}`;
content = content.replace(oldProductCardRegex, newProductCard);

// 4. Fix Bottom Nav
const oldBottomNavRegex = /\{\/\* Bottom Navigation \*\/\}[\s\S]*?<\/div>/;
const newBottomNav = `{/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-100 flex md:hidden justify-around items-center h-[60px] fixed bottom-0 w-full z-20 px-4">
        {bottomNavItems.map((item, index) => {
          const isSelected = selectedItem === item.title || (item.title === 'Categories' && selectedItem.startsWith('Category_'));
          return (
            <button
              key={\`\${item.title}-\${index}\`}
              onClick={() => setSelectedItem(item.title)}
              className={\`flex items-center justify-center transition-all duration-300 h-[40px] \${isSelected ? 'bg-dark-bg text-brand-yellow px-4 rounded-full space-x-2' : 'flex-col space-y-1 w-[60px] text-gray-400'}\`}
            >
              <div className="relative flex items-center justify-center">
                <item.icon size={20} className={isSelected ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-400'} />
                {item.title === 'Cart' && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              {isSelected ? (
                <span className="text-[12px] font-bold">{item.title}</span>
              ) : (
                <span className="text-[10px] font-medium">{item.title}</span>
              )}
            </button>
          );
        })}
      </div>`;
content = content.replace(oldBottomNavRegex, newBottomNav);

// 5. Remove Floating Cart Button
const fabRegex = /\{\/\* Floating Cart Button \(Bottom Right\) \*\/\}[\s\S]*?<\/button>\n      \)\}/;
content = content.replace(fabRegex, '');

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Patched successfully");
