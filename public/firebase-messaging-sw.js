importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  projectId: "gen-lang-client-0690213156",
  appId: "1:408212829164:web:7e5677ae980e592d5986c9",
  apiKey: "AIzaSyDKRVKnHVL6V0OdaqHTPqkBHXMfeTrs-qs",
  authDomain: "gen-lang-client-0690213156.firebaseapp.com",
  messagingSenderId: "408212829164",
  storageBucket: "gen-lang-client-0690213156.firebasestorage.app"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || "Anjan Store Update";
  
  let url = '/';
  if (payload.data?.click_action === 'OPEN_ORDER' && payload.data?.orderId) {
      url = '/track_order/' + payload.data.orderId;
  }
  
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/AppIcon-512x512.png',
    data: {
      url: url
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
