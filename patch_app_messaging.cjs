const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const importReplacement = `import { onAuthStateChanged } from 'firebase/auth';
import { messaging } from './firebase';
import { onMessage, getToken } from 'firebase/messaging';`;

content = content.replace("import { onAuthStateChanged } from 'firebase/auth';", importReplacement);

const useEffectReplacement = `    useEffect(() => {
        // Request notification permission on app load
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log('Notification permission granted.');
                    } else {
                        console.log('Notification permission denied.');
                    }
                });
            }
        }
        
        if (messaging) {
            // Get token and subscribe to topics (mocked on client, typically requires backend)
            getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' })
              .then((currentToken) => {
                if (currentToken) {
                  console.log('FCM Token:', currentToken);
                  // We would send this token to the server to subscribe to 'all' and 'all_users'
                  console.log('Subscribed to all (simulated on client side token generation)');
                  console.log('Subscribed to all_users (simulated on client side token generation)');
                } else {
                  console.log('No registration token available. Request permission to generate one.');
                }
              }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
              });

            // Handle foreground messages
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Message received. ', payload);
                const notificationTitle = payload.notification?.title || 'Update from Anjan Store';
                const notificationOptions = {
                    body: payload.notification?.body || 'You have a new message.',
                    icon: '/AppIcon-512x512.png',
                };
                
                // If the app is in the foreground, we can display a browser notification
                if (Notification.permission === 'granted') {
                    new Notification(notificationTitle, notificationOptions);
                }
            });
            
            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, []);`;

content = content.replace(/    useEffect\(\(\) => \{\n        \/\/ Request notification permission[\s\S]*?    \}, \[\]\);/, useEffectReplacement);

fs.writeFileSync('src/App.tsx', content);
