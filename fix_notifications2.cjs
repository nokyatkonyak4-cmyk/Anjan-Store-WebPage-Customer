const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// Remove the wrongly placed import
content = content.replace('import { deleteDoc } from "firebase/firestore";\n\nfunction NotificationsScreen', 'function NotificationsScreen');

// Add deleteDoc to the firebase/firestore imports at the top
if (!content.includes('deleteDoc')) {
    content = content.replace(/import \{([\s\S]*?)onSnapshot,/g, 'import { deleteDoc, $1 onSnapshot,');
}

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
