const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const unreadCountCode = `  const unreadNotificationsCount = notifications.filter((n: any) => !n.isRead).length;`;

if (!content.includes('unreadNotificationsCount')) {
    content = content.replace(
        `const notifications = React.useMemo(() => {`,
        `${unreadCountCode}\n\n  const notifications = React.useMemo(() => {`
    );
}

const oldBellCode = `<button
                onClick={() => handleNavigate("Notifications")}
                className="relative md:hover:bg-white/50 md:p-2 md:rounded-full transition-all active:scale-90 hover:scale-110"
              >
                <Bell size={24} className="text-dark-bg" />
              </button>`;
              
const newBellCode = `<button
                onClick={() => handleNavigate("Notifications")}
                className="relative md:hover:bg-white/50 md:p-2 md:rounded-full transition-all active:scale-90 hover:scale-110"
              >
                <Bell size={24} className="text-dark-bg" />
                {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                )}
              </button>`;

content = content.replace(oldBellCode, newBellCode);
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Updated Bell icon");
