const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            const permission = await Notification.requestPermission();`;
const replacement = `            if (navigator.serviceWorker) {
              const registrations = await navigator.serviceWorker.getRegistrations();
              for (let reg of registrations) {
                if (reg.active && reg.active.scriptURL.includes('firebase-messaging-sw.js')) {
                  await reg.update();
                }
              }
            }
            const permission = await Notification.requestPermission();`;

if (app.includes(target) && !app.includes("reg.update()")) {
  app = app.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', app);
  console.log("Fixed SW registration update.");
} else {
  console.log("Target not found or already patched.");
}
