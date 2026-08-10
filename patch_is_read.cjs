const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const target1 = `        title: data.title || data.type || "Notification",`;
const replace1 = `        title: data.title || data.type || "Notification",
        isRead: data.isRead || (data.readBy && auth?.currentUser?.uid && data.readBy.includes(auth.currentUser.uid)) || data.read || false,`;

if (content.includes(target1) && !content.includes('auth?.currentUser?.uid && data.readBy')) {
    content = content.replace(target1, replace1);
    fs.writeFileSync('src/components/MainAppScreen.tsx', content);
    console.log("Patched isRead logic");
} else {
    console.log("Already patched or target not found");
}
