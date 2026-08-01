const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldHomeScreenBlock = `function HomeScreen({ onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
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

const newHomeScreenBlock = `function HomeScreen({ searchQuery, onNavigate, products, categories, banners, favorites, cartItems, toggleFavorite, incrementCart, decrementCart }: any) {
  const displayedProducts = searchQuery 
    ? products.filter((p:any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  return (
    <div className="flex flex-col w-full pb-4 animate-in fade-in pt-4">`;

content = content.replace(oldHomeScreenBlock, newHomeScreenBlock);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
