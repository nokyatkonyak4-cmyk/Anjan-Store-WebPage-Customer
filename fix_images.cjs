const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf-8');

// Banner image
content = content.replace(
  /<img src=\{banners\[0\]\.imageUrl\} alt=\{banners\[0\]\.title\} className="w-full h-full object-cover" \/>/g,
  '<img src={banners[0].imageUrl || banners[0].image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"} alt={banners[0].title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"; }} />'
);

// Category images (HomeScreen)
content = content.replace(
  /<img src=\{cat\.imageUrl\} alt=\{cat\.name\} className="w-full h-full object-contain" \/>/g,
  '<img src={cat.imageUrl || cat.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"} alt={cat.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200"; }} />'
);

// Cart item images
content = content.replace(
  /<img src=\{item\.product\.imageUrl\} alt=\{item\.product\.name\} className="w-16 h-16 rounded-lg object-cover bg-gray-50 mr-3 shrink-0" \/>/g,
  '<img src={item.product.imageUrl || item.product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50 mr-3 shrink-0" onError={(e) => { e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />'
);

// ProductCard images
content = content.replace(
  /<img src=\{product\.imageUrl\} alt=\{product\.name\} className="w-full h-full object-cover" \/>/g,
  '<img src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src="https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300"; }} />'
);

// Add watermark
content = content.replace(
  /        \)\}\n      <\/div>\n    <\/div>\n  \);\n\}\n\nfunction CategoriesScreen/g,
  `        )}\n      </div>\n      {/* Watermark */}\n      <div className="flex flex-col items-center justify-center pt-12 pb-24 opacity-50">\n        <img src="/AppIcon-512x512.png" alt="Logo" className="w-8 h-8 object-contain mb-2 grayscale" />\n        <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Anjan Store</span>\n        <span className="text-[10px] text-gray-400">All in one place</span>\n      </div>\n    </div>\n  );\n}\n\nfunction CategoriesScreen`
);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
