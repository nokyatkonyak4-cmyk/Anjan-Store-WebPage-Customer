const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const regex = /\{bottomNavItems\.map\(\(item, index\) => \{[\s\S]*?onClick=\{async \(\) => \{[\s\S]*?Enable Push[\s\S]*?<\/button>\s*<\/div>/;

const newCode = `{bottomNavItems.map((item, index) => {
            const isSelected =
              selectedItem === item.title ||
              (item.title === "Categories" &&
                selectedItem.startsWith("Category_"));
            return (
              <button
                key={\`desktop-nav-\${index}\`}
                onClick={() => handleNavigate(item.title)}
                className={\`flex items-center w-full px-4 py-3 rounded-xl transition-all \${
                  isSelected
                    ? "bg-white text-dark-bg font-bold shadow-sm"
                    : "text-dark-bg/80 hover:bg-white/50 hover:text-dark-bg font-medium"
                }\`}
              >
                <div className="relative mr-3">
                  <item.icon size={20} className={isSelected ? "text-dark-bg" : "text-dark-bg/80"} />
                  {item.title === "Cart" && cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                      {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                    </span>
                  )}
                </div>
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col flex-1 relative min-w-0">
        <div className="bg-brand-yellow text-dark-bg flex flex-col sticky top-0 z-20 shadow-md md:shadow-sm md:border-b md:border-brand-yellow/20">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 md:hidden">
              <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden">
                <img src="/AppIcon-512x512.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Anjan Store</span>
                <span className="text-[9px] tracking-widest font-semibold uppercase">All in one place</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center">
              <h1 className="text-xl font-bold text-dark-bg">
                {selectedItem.startsWith("Product_") ? "Product Details" : selectedItem.startsWith("Category_") ? "Category" : selectedItem}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigate("Favorites")}
                className="md:hover:bg-white/50 md:p-2 md:rounded-full transition"
              >
                <Heart size={24} className="text-dark-bg" />
              </button>
              <button
                onClick={() => handleNavigate("Notifications")}
                className="relative md:hover:bg-white/50 md:p-2 md:rounded-full transition"
              >
                <Bell size={24} className="text-dark-bg" />
              </button>
              <button
                onClick={() => handleNavigate("Profile")}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-dark-bg text-[#FFC107] flex items-center justify-center font-bold text-sm md:text-base cursor-pointer shadow-sm hover:opacity-90 transition"
              >
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide md:px-4 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
             {selectedItem === 'Home' && <div className="p-4 text-center mt-10"><h2>Home Screen is being restored...</h2></div>}
             {selectedItem === 'Cart' && <div className="p-4 text-center mt-10"><h2>Cart Screen is being restored...</h2></div>}
             {selectedItem === 'Categories' && <div className="p-4 text-center mt-10"><h2>Categories Screen is being restored...</h2></div>}
             {selectedItem === 'Favorites' && <div className="p-4 text-center mt-10"><h2>Favorites Screen is being restored...</h2></div>}
             {selectedItem === 'Profile' && <ProfileScreen savedAddress={savedAddress} savedPhone={savedPhone} profileImage={profileImage} onNavigate={handleNavigate} />}
             {selectedItem === 'Notifications' && <NotificationsScreen notifications={notifications} onNavigate={handleNavigate} />}
          </div>
        </div>

        <div className="md:hidden bg-white border-t border-gray-100 flex items-center justify-around py-3 px-2 z-20 pb-safe">
          {bottomNavItems.map((item, index) => {
            const isSelected = selectedItem === item.title || (item.title === "Categories" && selectedItem.startsWith("Category_"));
            return (
              <button
                key={\`mobile-nav-\${index}\`}
                onClick={() => handleNavigate(item.title)}
                className={\`flex flex-col items-center p-2 rounded-xl transition-all \${isSelected ? "text-dark-bg" : "text-gray-400"}\`}
              >
                <item.icon size={24} className={isSelected ? "text-dark-bg" : "text-gray-400"} />
                <span className="text-[10px] font-semibold">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NotificationsScreen({ notifications, onNavigate }: any) {
    const handleNotificationClick = (notif: any) => {};
    const handleDeleteNotification = (notif: any, e: any) => {};
    return (
        <div className="flex flex-col h-full bg-white animate-fade-in p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center cursor-pointer" onClick={() => onNavigate("Back")}>
                    <ArrowLeft size={24} className="text-dark-bg mr-3" />
                    <h2 className="text-xl font-bold text-dark-bg">Notifications</h2>
                </div>
                <button 
                  onClick={async () => {
                     try {
                        if ("Notification" in window) {
                           const perm = await Notification.requestPermission();
                           if (perm === "granted" && (window as any).requestFCMToken) {
                              const success = await (window as any).requestFCMToken();
                              if (success) alert("Push Notifications Enabled!");
                              else alert("Failed to get push token.");
                           } else if (perm === "granted") {
                              alert("Permission granted. Please refresh to receive notifications.");
                           }
                        }
                     } catch (e) {
                        console.error(e);
                     }
                  }}
                  className="bg-brand-yellow text-dark-bg px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                >
                   Enable Push
                </button>
            </div>`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Replaced!");
