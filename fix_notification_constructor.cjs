const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(/const notification = new Notification\([^;]+;\s*notification\.onclick = \(event\) => {[^}]+};\s*}/g,
`navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(notificationTitle, notificationOptions);
          });
        }`);

fs.writeFileSync('src/App.tsx', app);
console.log("Fixed Notification constructor");
