const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes("Notification.requestPermission()")) {
    const importReplacement = `import { useEffect, useState } from 'react';`;
    
    const useEffectReplacement = `
    useEffect(() => {
        // Request notification permission on app load
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log('Notification permission granted.');
                        // Here you would typically get the FCM token and send it to your server
                        // For topic subscription ('all', 'all_users'), a backend is usually required on web.
                    } else {
                        console.log('Notification permission denied.');
                    }
                });
            }
        }
    }, []);

    useEffect(() => {
`;

    content = content.replace("useEffect(() => {", useEffectReplacement);
    fs.writeFileSync('src/App.tsx', content);
}
