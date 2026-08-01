const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// The file is corrupted, let's fix the bottom nav area
const brokenPart = \`{/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-100 flex md:hidden justify-around items-center h-[60px] fixed bottom-0 w-full z-20 px-4">
        {bottomNavItems.map((item, index) => {
          const isSelected = selectedItem === item.title || (item.title === 'Categories' && selectedItem.startsWith('Category_'));
          return (
            <button
              key={\\\`\\\${item.title}-\\\${index}\\\`\}
              onClick={() => setSelectedItem(item.title)}
              className={\\\`flex items-center justify-center transition-all duration-300 h-[40px] \\\${isSelected ? 'bg-dark-bg text-brand-yellow px-4 rounded-full space-x-2' : 'flex-col space-y-1 w-[60px] text-gray-400'}\\\`}
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
      </div>
                <item.icon size={20} className={isSelected ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-400'} />
                {item.title === 'Cart' && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <span className={\\\`text-[10px] \\\${isSelected ? 'text-dark-bg font-bold' : 'text-gray-400 font-medium'}\\\`}>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}\`;

const correctPart = \`{/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-100 flex md:hidden justify-around items-center h-[60px] fixed bottom-0 w-full z-20 px-4">
        {bottomNavItems.map((item, index) => {
          const isSelected = selectedItem === item.title || (item.title === 'Categories' && selectedItem.startsWith('Category_'));
          return (
            <button
              key={\\\`\\\${item.title}-\\\${index}\\\`\}
              onClick={() => setSelectedItem(item.title)}
              className={\\\`flex items-center justify-center transition-all duration-300 h-[40px] \\\${isSelected ? 'bg-dark-bg text-brand-yellow px-4 rounded-full space-x-2' : 'flex-col space-y-1 w-[60px] text-gray-400'}\\\`}
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
      </div>
    </div>
  );
}\`;

content = content.replace(brokenPart, correctPart);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
