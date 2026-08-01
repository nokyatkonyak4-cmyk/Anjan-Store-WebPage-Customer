const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// 1. Update main container
content = content.replace(
  /className="flex flex-col h-\[100dvh\] max-w-md mx-auto bg-light-bg shadow-2xl overflow-hidden relative"/g,
  'className="flex flex-col h-[100dvh] w-full md:max-w-full lg:max-w-7xl mx-auto bg-light-bg overflow-hidden relative"'
);

// 2. Hide top header on desktop
content = content.replace(
  /<div className="bg-white p-4 shadow-sm z-10 sticky top-0">/g,
  '<div className="bg-white p-4 shadow-sm z-10 sticky top-0 md:hidden">'
);

// 3. Desktop Top Navbar
const desktopNav = `      {/* Desktop Top Navbar */}
      <div className="hidden md:flex bg-white shadow-sm z-20 sticky top-0 w-full px-6 py-3 items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setSelectedItem('Home')}>
            <img src="/AppIcon-512x512.png" alt="Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl text-dark-bg tracking-wide">Anjan Store</span>
          </div>
          
          <div className="flex space-x-6">
            {bottomNavItems.map((item, index) => {
              const isSelected = selectedItem === item.title || (item.title === 'Categories' && selectedItem.startsWith('Category_'));
              return (
                <button
                  key={\`desktop-nav-\${index}\`}
                  onClick={() => setSelectedItem(item.title)}
                  className={\`flex items-center space-x-1 font-semibold text-sm transition-colors \${isSelected ? 'text-brand-yellow' : 'text-gray-600 hover:text-dark-bg'}\`}
                >
                  <item.icon size={18} className={isSelected ? 'text-brand-yellow' : 'text-gray-500'} />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-yellow w-64"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>
`;
content = content.replace(
  /<div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-light-bg pb-20">/g,
  desktopNav + '\n      <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-light-bg pb-20 md:pb-0">'
);

// 4. Hide Bottom Nav on desktop
content = content.replace(
  /className="bg-white border-t border-gray-200 flex justify-around items-center py-2 fixed bottom-0 w-full max-w-md z-20"/g,
  'className="bg-white border-t border-gray-200 flex md:hidden justify-around items-center py-2 fixed bottom-0 w-full max-w-md z-20"'
);

// 5. Product Grid columns (Mobile: 3, Desktop: 4+)
content = content.replace(
  /className="grid grid-cols-2 gap-4 pb-6"/g,
  'className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 pb-6"'
);
content = content.replace(
  /className="grid grid-cols-2 gap-4"/g,
  'className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5"'
);

// 6. Categories Grid
content = content.replace(
  /className="grid grid-cols-3 gap-y-8 gap-x-4"/g,
  'className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-8 gap-x-4"'
);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
