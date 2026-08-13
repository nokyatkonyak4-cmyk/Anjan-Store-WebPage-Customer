const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const importStatement = `import { collection, addDoc } from "firebase/firestore";`;
if (!content.includes('addDoc')) {
    content = content.replace(
        `import { doc, setDoc, onSnapshot } from "firebase/firestore";`,
        `import { doc, setDoc, onSnapshot, collection, addDoc } from "firebase/firestore";`
    );
}

const onMessageRegex = /const unsubscribe = onMessage\(messaging, \(payload\) => \{([\s\S]*?)console\.log\("Message received\. ", payload\);/;

const newOnMessageLogic = `const unsubscribe = onMessage(messaging, async (payload) => {
        console.log("Message received. ", payload);
        
        // Also save this notification to the built-in bell icon list
        if (auth.currentUser && db) {
            try {
                await addDoc(collection(db, "users", auth.currentUser.uid, "notifications"), {
                    title: payload.notification?.title || "Update from Anjan Store",
                    body: payload.notification?.body || "You have a new message.",
                    data: payload.data || null,
                    isRead: false,
                    timestamp: Date.now()
                });
            } catch (err) {
                console.error("Failed to save push notification to DB:", err);
            }
        }`;

content = content.replace(onMessageRegex, newOnMessageLogic);
fs.writeFileSync('src/App.tsx', content);
console.log("Updated App.tsx to save foreground push to Firestore");
