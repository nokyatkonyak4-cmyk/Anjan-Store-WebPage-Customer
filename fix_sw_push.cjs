const fs = require('fs');
let content = fs.readFileSync('public/firebase-messaging-sw.js', 'utf8');

const importStatement = `importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js');`;

if (!content.includes('firebase-firestore-compat.js')) {
    content = content.replace(
        `importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');`,
        `importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');\n${importStatement}`
    );
}

const idbLogic = `
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
`;

const backgroundMsgRegex = /messaging\.onBackgroundMessage\(\(payload\) => \{([\s\S]*?)self\.registration\.showNotification\(notificationTitle, notificationOptions\);\n\}\);/;

const newBackgroundMsgLogic = `messaging.onBackgroundMessage(async (payload) => {
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
});`;

if (!content.includes('getUidFromIndexedDB')) {
    content = content.replace(/messaging\.onBackgroundMessage\(\(payload\) => \{[\s\S]*?\}\);/, idbLogic + '\n' + newBackgroundMsgLogic);
}

fs.writeFileSync('public/firebase-messaging-sw.js', content);
console.log("Updated firebase-messaging-sw.js to save background push to Firestore");
