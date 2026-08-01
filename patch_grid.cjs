const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// Replace grids
content = content.replace(/className="grid grid-cols-2 gap-4"/g, 'className="grid grid-cols-4 gap-2"');
content = content.replace(/className="grid grid-cols-2 gap-4 pb-6"/g, 'className="grid grid-cols-4 gap-2 pb-6"');

// Replace ProductCard to be smaller
const oldProductCard = `function ProductCard({ product, cartQuantity, isFavorite, onToggleFavorite, onIncrement, onDecrement }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[260px] border border-gray-100">
      <div className="relative h-[120px] bg-gray-100 w-full shrink-0">
        <img src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />
        <button onClick={onToggleFavorite} className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
          <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-sm text-dark-bg line-clamp-1 mb-1">{product.name}</h3>
        <span className="self-start px-1.5 py-0.5 bg-brand-yellow/20 rounded text-[10px] font-medium text-dark-bg mb-1">{product.category}</span>
        <div className="flex items-center mb-2">
          <Star size={10} className="fill-[#FFC107] text-[#FFC107] mr-1" />
          <span className="text-[10px] text-gray-500">{product.rating || 4.5} ({product.reviewCount || Math.floor(Math.random() * 100) + 10})</span>
        </div>
        <div className="mt-auto flex flex-col justify-between h-[60px]">
          <span className="font-semibold text-sm text-dark-bg mb-2 block">₹{product.price}</span>
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-brand-yellow rounded-lg h-9 px-1">
              <button onClick={onDecrement} className="w-8 h-full flex items-center justify-center"><Minus size={16} className="text-dark-bg" /></button>
              <span className="font-bold text-dark-bg text-sm">{cartQuantity}</span>
              <button onClick={onIncrement} className="w-8 h-full flex items-center justify-center"><Plus size={16} className="text-dark-bg" /></button>
            </div>
          ) : (
            <button onClick={onIncrement} className="w-full bg-brand-yellow text-dark-bg rounded-lg h-9 font-bold text-xs shadow-sm">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}`;

const newProductCard = `function ProductCard({ product, cartQuantity, isFavorite, onToggleFavorite, onIncrement, onDecrement }: any) {
  return (
    <div className="bg-white rounded-[10px] shadow-sm overflow-hidden flex flex-col h-[180px] border border-gray-100">
      <div className="relative h-[80px] bg-gray-100 w-full shrink-0">
        <img src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />
        <button onClick={onToggleFavorite} className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
          <Heart size={12} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-2 flex flex-col flex-1">
        <h3 className="font-bold text-[10px] leading-tight text-dark-bg line-clamp-2 mb-1">{product.name}</h3>
        
        <div className="mt-auto flex flex-col justify-between">
          <span className="font-bold text-[11px] text-dark-bg mb-1.5 block">₹{product.price}</span>
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-brand-yellow rounded-md h-7 px-1">
              <button onClick={onDecrement} className="w-6 h-full flex items-center justify-center"><Minus size={12} className="text-dark-bg" /></button>
              <span className="font-bold text-dark-bg text-[10px]">{cartQuantity}</span>
              <button onClick={onIncrement} className="w-6 h-full flex items-center justify-center"><Plus size={12} className="text-dark-bg" /></button>
            </div>
          ) : (
            <button onClick={onIncrement} className="w-full bg-brand-yellow text-dark-bg rounded-md h-7 font-bold text-[10px] shadow-sm">
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(oldProductCard, newProductCard);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
