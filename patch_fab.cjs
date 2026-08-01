const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldBottomNav = `      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 flex md:hidden justify-around items-center py-2 fixed bottom-0 w-full z-20">`;

const newBottomNav = `      {/* Floating Cart Button (Bottom Right) */}
      {cartItems.length > 0 && selectedItem !== 'Cart' && (
        <button
          onClick={() => setSelectedItem('Cart')}
          className="fixed bottom-20 md:bottom-8 right-4 bg-brand-yellow text-dark-bg p-4 rounded-full shadow-lg z-30 flex items-center justify-center animate-in zoom-in"
        >
          <div className="relative">
            <ShoppingCart size={24} className="fill-dark-bg" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-yellow">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
        </button>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 flex md:hidden justify-around items-center py-2 fixed bottom-0 w-full z-20">`;

content = content.replace(oldBottomNav, newBottomNav);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
