const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldBottomNav = `      <div className="bg-white border-t border-gray-200 flex justify-around items-center py-2 fixed bottom-0 w-full max-w-md z-20">
        {bottomNavItems.map((item, index) => {
          const isSelected = selectedItem === item.title || (item.title === 'Categories' && selectedItem.startsWith('Category_'));
          return (
            <button
              key={\`\${item.title}-\${index}\`}
              onClick={() => setSelectedItem(item.title)}
              className={\`flex flex-col items-center justify-center w-16 space-y-1 \${isSelected ? 'text-[#FFC107]' : 'text-gray-400'}\`}
            >
              <item.icon size={24} className={isSelected ? 'text-[#FFC107]' : 'text-gray-400'} />
              <span className={\`text-[10px] \${isSelected ? 'text-dark-bg font-medium' : 'text-gray-400'}\`}>{item.title}</span>
            </button>
          );
        })}
      </div>`;

const newBottomNav = `      <div className="bg-white border-t border-gray-200 flex justify-around items-center py-2 fixed bottom-0 w-full max-w-md z-20">
        {bottomNavItems.map((item, index) => {
          const isSelected = selectedItem === item.title || (item.title === 'Categories' && selectedItem.startsWith('Category_'));
          return (
            <button
              key={\`\${item.title}-\${index}\`}
              onClick={() => setSelectedItem(item.title)}
              className="flex flex-col items-center justify-center w-[70px] space-y-1"
            >
              <div className={\`flex items-center justify-center w-[52px] h-[32px] rounded-full transition-colors \${isSelected ? 'bg-dark-bg' : 'bg-transparent'}\`}>
                <item.icon size={20} className={isSelected ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-400'} />
              </div>
              <span className={\`text-[10px] \${isSelected ? 'text-dark-bg font-bold' : 'text-gray-400 font-medium'}\`}>{item.title}</span>
            </button>
          );
        })}
      </div>`;

content = content.replace(oldBottomNav, newBottomNav);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);

