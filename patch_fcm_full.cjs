const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const requestFCMToken = async \(\) => \{[\s\S]*?\(window as any\)\.requestFCMToken = requestFCMToken;/;

const newCode = `const requestFCMToken = async () => {
      try {
        if (!messaging || !db || !auth.currentUser) return false;
        
        console.log("Registering service worker...");
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log("Service Worker registered with scope:", registration.scope);

        console.log("Requesting FCM token...");
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log("FCM Token:", currentToken);
          await setDoc(doc(db, "customers", auth.currentUser.uid), { fcmToken: currentToken }, { merge: true });
          await setDoc(doc(db, "users", auth.currentUser.uid), { fcmToken: currentToken }, { merge: true });
          await setDoc(doc(db, 'fcmTokens', currentToken), {
            token: currentToken,
            userId: auth.currentUser.uid,
            role: 'customer',
            updatedAt: Date.now()
          });
          return true;
        } else {
          console.log("No registration token available. Request permission to generate one.");
          return false;
        }
      } catch (err) {
        console.error("An error occurred while retrieving token. ", err);
        if ((err as any).message) {
            toast.error("Push Error: " + (err as any).message);
        }
        return false;
      }
    };
    (window as any).requestFCMToken = requestFCMToken;`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/App.tsx', content);
