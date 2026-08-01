const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldProductCard = `function ProductCard({ product, cartQuantity, isFavorite, onToggleFavorite, onIncrement, onDecrement }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-[280px] border border-gray-100/50 hover:shadow-md transition-shadow">
      <div className="relative h-[130px] bg-gray-50 w-full shrink-0 p-3 flex items-center justify-center">
        <img src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />
        <button onClick={onToggleFavorite} className="absolute top-2 right-2 w-7 h-7 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
          <Heart size={14} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-3.5 flex flex-col flex-1 bg-white">
        <h3 className="font-bold text-[13px] text-dark-bg line-clamp-1 mb-1.5">{product.name}</h3>
        
        <div className="mb-2">
          <span className="px-1.5 py-0.5 bg-[#FFF9E6] rounded text-[9px] font-bold text-dark-bg">{product.category || 'Unknown'}</span>
        </div>
        
        <div className="flex items-center mb-3">
          <Star size={10} className="fill-[#FFC107] text-[#FFC107] mr-1" />
          <span className="text-[10px] text-gray-400 font-medium">{product.rating || 4.5} ({product.reviewCount || Math.floor(Math.random() * 100) + 10})</span>
        </div>
        
        <div className="mt-auto flex flex-col justify-end">
          <span className="font-bold text-sm text-dark-bg mb-2.5 block">₹{product.price.toFixed(1)}</span>
          
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-brand-yellow rounded-full h-9 px-1">
              <button onClick={onDecrement} className="w-8 h-full flex items-center justify-center"><Minus size={14} className="text-dark-bg font-bold" /></button>
              <span className="font-bold text-dark-bg text-[13px]">{cartQuantity}</span>
              <button onClick={onIncrement} className="w-8 h-full flex items-center justify-center"><Plus size={14} className="text-dark-bg font-bold" /></button>
            </div>
          ) : (
            <button onClick={onIncrement} className="w-full bg-brand-yellow text-dark-bg rounded-full h-9 font-bold text-[12px] flex items-center justify-center">
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
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden flex flex-col h-[240px] md:h-[280px] border border-gray-100/50 hover:shadow-md transition-shadow">
      <div className="relative h-[90px] md:h-[130px] bg-gray-50 w-full shrink-0 p-2 md:p-3 flex items-center justify-center">
        <img src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />
        <button onClick={onToggleFavorite} className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-6 h-6 md:w-7 md:h-7 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
          <Heart size={12} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-2 md:p-3.5 flex flex-col flex-1 bg-white">
        <h3 className="font-bold text-[11px] md:text-[13px] text-dark-bg line-clamp-1 mb-1 md:mb-1.5">{product.name}</h3>
        
        <div className="mb-1.5 md:mb-2">
          <span className="px-1 md:px-1.5 py-[1px] md:py-0.5 bg-[#FFF9E6] rounded text-[8px] md:text-[9px] font-bold text-dark-bg">{product.category || 'Unknown'}</span>
        </div>
        
        <div className="flex items-center mb-1.5 md:mb-3">
          <Star size={9} className="fill-[#FFC107] text-[#FFC107] mr-1" />
          <span className="text-[9px] md:text-[10px] text-gray-400 font-medium">{product.rating || 4.5}</span>
        </div>
        
        <div className="mt-auto flex flex-col justify-end">
          <span className="font-bold text-xs md:text-sm text-dark-bg mb-1.5 md:mb-2.5 block">₹{product.price.toFixed(1)}</span>
          
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-brand-yellow rounded-full h-7 md:h-9 px-1">
              <button onClick={onDecrement} className="w-6 md:w-8 h-full flex items-center justify-center"><Minus size={12} className="text-dark-bg font-bold" /></button>
              <span className="font-bold text-dark-bg text-[11px] md:text-[13px]">{cartQuantity}</span>
              <button onClick={onIncrement} className="w-6 md:w-8 h-full flex items-center justify-center"><Plus size={12} className="text-dark-bg font-bold" /></button>
            </div>
          ) : (
            <button onClick={onIncrement} className="w-full bg-brand-yellow text-dark-bg rounded-full h-7 md:h-9 font-bold text-[10px] md:text-[12px] flex items-center justify-center">
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
