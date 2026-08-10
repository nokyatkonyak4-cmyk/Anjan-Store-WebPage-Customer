const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const target = `          setDoc(ref2, { isRead: true }, { merge: true }),`;
const replace = `          setDoc(ref2, notif.isGlobal ? { readBy: arrayUnion(auth.currentUser.uid) } : { isRead: true }, { merge: true }),`;

// Ensure we have arrayUnion imported
const importTarget = `import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";`;
const importReplace = `import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc, onSnapshot, arrayUnion } from "firebase/firestore";`;

if (content.includes(target)) {
    content = content.replace(target, replace);
    if (content.includes(importTarget)) {
        content = content.replace(importTarget, importReplace);
    }
    fs.writeFileSync('src/components/MainAppScreen.tsx', content);
    console.log("Patched click logic");
} else {
    console.log("Target not found");
}
