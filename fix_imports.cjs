const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const importStatement = `import { OrderHistoryScreen } from "./OrderHistoryScreen";`;
if (!content.includes('OrderHistoryScreen')) {
    content = content.replace(
        `import AuthScreen from "./AuthScreen";`,
        `import AuthScreen from "./AuthScreen";\n${importStatement}`
    );
    
    // Add rendering
    content = content.replace(
        `{selectedItem === 'Notifications' && <NotificationsScreen notifications={notifications} onNavigate={handleNavigate} />}`,
        `{selectedItem === 'Notifications' && <NotificationsScreen notifications={notifications} onNavigate={handleNavigate} />}\n             {selectedItem === 'OrderHistory' && <OrderHistoryScreen orders={orders} onNavigate={handleNavigate} />}\n             {selectedItem === 'Orders' && <OrderHistoryScreen orders={orders} onNavigate={handleNavigate} />}`
    );
    fs.writeFileSync('src/components/MainAppScreen.tsx', content);
    console.log("Updated MainAppScreen.tsx");
} else {
    console.log("Already updated");
}
