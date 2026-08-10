const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        if (Notification.permission === "granted") {
          const notification = new Notification(
            notificationTitle,
            notificationOptions,
          );
          notification.onclick = (event) => {
            event.preventDefault();
            if (
              payload.data?.click_action === "OPEN_ORDER" &&
              payload.data?.orderId
            ) {
              window.location.href = \`/track_order/\${payload.data.orderId}\`;
            }
          };
        }`;

const replacement = `        if (Notification.permission === "granted") {
          try {
            if (navigator.serviceWorker) {
              navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(notificationTitle, notificationOptions);
              });
            } else {
              const notification = new Notification(notificationTitle, notificationOptions);
              notification.onclick = (event) => {
                event.preventDefault();
                if (payload.data?.click_action === "OPEN_ORDER" && payload.data?.orderId) {
                  window.location.href = \`/track_order/\${payload.data.orderId}\`;
                }
              };
            }
          } catch (e) {
            console.error("Error showing notification:", e);
          }
        }`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Fixed successfully.");
} else {
  console.log("Target not found.");
}
