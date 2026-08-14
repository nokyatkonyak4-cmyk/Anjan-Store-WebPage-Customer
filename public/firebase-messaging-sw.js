importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js');

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


function getUidFromIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('firebaseLocalStorageDb');
        request.onsuccess = function(event) {
            const db = event.target.result;
            try {
                if (!db.objectStoreNames.contains('firebaseLocalStorage')) {
                    resolve(null);
                    return;
                }
                const transaction = db.transaction('firebaseLocalStorage', 'readonly');
                const store = transaction.objectStore('firebaseLocalStorage');
                const getAllRequest = store.getAll();
                getAllRequest.onsuccess = function() {
                    const records = getAllRequest.result;
                    if (records && records.length > 0) {
                        const uid = records[0].value.uid;
                        resolve(uid);
                    } else {
                        resolve(null);
                    }
                };
            } catch(e) {
                resolve(null);
            }
        };
        request.onerror = function() {
            resolve(null);
        };
    });
}

messaging.onBackgroundMessage(async (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || "Anjan Store Update";
  
  let url = '/';
  if (payload.data?.click_action === 'OPEN_ORDER' && payload.data?.orderId) {
      url = '/track_order/' + payload.data.orderId;
  }
  
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/app-icon-512X512.png',
    data: {
      url: url
    }
  };

  // Save to Firestore so it appears in the bell icon
  try {
      const uid = await getUidFromIndexedDB();
      if (uid) {
          const db = firebase.firestore();
          await db.collection("users").doc(uid).collection("notifications").add({
              title: notificationTitle,
              body: notificationOptions.body || "You have a new message.",
              data: payload.data || null,
              isRead: false,
              timestamp: Date.now()
          });
      }
  } catch (err) {
      console.error("Failed to save background push to Firestore:", err);
  }

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
