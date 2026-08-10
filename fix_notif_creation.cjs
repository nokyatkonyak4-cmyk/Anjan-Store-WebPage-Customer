const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const target = `                    const notifRef = doc(collection(db, "users", user.uid, "notifications"));
                    const notifData = {
                      id: notifRef.id,
                      title: "Order Update",
                      message: notifText,
                      timestamp: Date.now(),
                      createdAt: Date.now(),
                      isRead: false,
                      userId: user.uid,
                      customerId: user.uid
                    };
                    setDoc(notifRef, notifData).catch(console.error);`;

const replacement = `                    const notifRef = doc(collection(db, "notifications"));
                    const notifData = {
                      id: notifRef.id,
                      title: "Order Update",
                      message: notifText,
                      timestamp: Date.now(),
                      createdAt: Date.now(),
                      isRead: false,
                      userId: user.uid,
                      customerId: user.uid
                    };
                    const notifRefUser = doc(db, "users", user.uid, "notifications", notifRef.id);
                    setDoc(notifRef, notifData).catch(console.error);
                    setDoc(notifRefUser, notifData).catch(console.error);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/MainAppScreen.tsx', content);
  console.log("Fixed notification creation.");
} else {
  console.log("Target not found.");
}
