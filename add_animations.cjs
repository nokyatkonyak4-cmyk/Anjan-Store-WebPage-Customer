const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// Replace mobile nav button class
content = content.replace(
    /className=\{\`flex flex-col items-center p-2 rounded-xl transition-all \$\{isSelected \? "text-dark-bg" : "text-gray-400"\}\`\}/g,
    'className={`flex flex-col items-center p-2 rounded-xl transition-all active:scale-95 hover:scale-[1.05] ${isSelected ? "text-dark-bg" : "text-gray-400"}`}'
);

// Replace desktop nav button class
content = content.replace(
    /className=\{\`flex items-center w-full px-4 py-3 rounded-xl transition-all \$\{/g,
    'className={`flex items-center w-full px-4 py-3 rounded-xl transition-all active:scale-95 hover:scale-[1.02] ${'
);

// Top right icons (Favorites, Notifications, Profile)
content = content.replace(
    /className="md:hover:bg-white\/50 md:p-2 md:rounded-full transition"/g,
    'className="md:hover:bg-white/50 md:p-2 md:rounded-full transition-all active:scale-90 hover:scale-110"'
);
content = content.replace(
    /className="relative md:hover:bg-white\/50 md:p-2 md:rounded-full transition"/g,
    'className="relative md:hover:bg-white/50 md:p-2 md:rounded-full transition-all active:scale-90 hover:scale-110"'
);
content = content.replace(
    /className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-dark-bg text-\[\#FFC107\] flex items-center justify-center font-bold text-sm md:text-base cursor-pointer shadow-sm hover:opacity-90 transition"/g,
    'className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-dark-bg text-[#FFC107] flex items-center justify-center font-bold text-sm md:text-base cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95"'
);

// Category cards inside CategoryScreen (approximate structure)
content = content.replace(
    /className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-3 cursor-pointer border border-gray-100"/g,
    'className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-3 cursor-pointer border border-gray-100 transition-all hover:scale-[1.05] active:scale-95"'
);

// ProductCard
content = content.replace(
    /className="bg-white rounded-xl shadow-\[0_2px_10px_rgba\(0,0,0,0.03\)\] overflow-hidden flex flex-col h-\[200px\] md:h-\[250px\] border border-gray-100 transition-shadow relative"/g,
    'className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md overflow-hidden flex flex-col h-[200px] md:h-[250px] border border-gray-100 transition-all hover:-translate-y-1 relative"'
);

// Plus/Minus buttons in cart or product details
content = content.replace(
    /className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-dark-bg"/g,
    'className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-dark-bg transition-all active:scale-90 hover:bg-gray-200"'
);
content = content.replace(
    /className="w-8 h-8 flex items-center justify-center bg-gray-100 text-dark-bg"/g,
    'className="w-8 h-8 flex items-center justify-center bg-gray-100 text-dark-bg transition-all active:scale-90 hover:bg-gray-200"'
);
content = content.replace(
    /className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-dark-bg"/g,
    'className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-dark-bg transition-all active:scale-90 hover:bg-gray-200"'
);

// Add to cart buttons (large)
content = content.replace(
    /className="w-full py-4 bg-dark-bg text-brand-yellow font-bold text-lg rounded-2xl shadow-sm"/g,
    'className="w-full py-4 bg-dark-bg text-brand-yellow font-bold text-lg rounded-2xl shadow-sm transition-all hover:opacity-90 active:scale-95"'
);

// Back buttons (like in product details, checkout)
content = content.replace(
    /className="w-10 h-10 bg-white\/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-dark-bg"/g,
    'className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-dark-bg transition-all hover:scale-110 active:scale-90"'
);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Added animations!");
