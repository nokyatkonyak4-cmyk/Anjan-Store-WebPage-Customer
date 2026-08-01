const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldBottomNavContent = `<div className={\`flex items-center justify-center w-[52px] h-[32px] rounded-full transition-colors \${isSelected ? 'bg-dark-bg' : 'bg-transparent'}\`}>
                <item.icon size={20} className={isSelected ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-400'} />
              </div>`;

const newBottomNavContent = `<div className={\`relative flex items-center justify-center w-[52px] h-[32px] rounded-full transition-colors \${isSelected ? 'bg-dark-bg' : 'bg-transparent'}\`}>
                <item.icon size={20} className={isSelected ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-400'} />
                {item.title === 'Cart' && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>`;

content = content.replace(oldBottomNavContent, newBottomNavContent);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
