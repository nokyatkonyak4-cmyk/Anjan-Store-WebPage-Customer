importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// You would need to inject or specify the config here for the SW, but we can do it via URL params if needed, or just hardcode if we have env vars, but SW doesn't have env vars natively.
// We'll leave placeholders, as is standard practice, or fetch it. Actually, standard Firebase requires config in SW.
// For the purpose of the demo, we can just catch the push event directly if we don't use the compat library for config, 
// OR we can rely on standard Push API. Let's use the standard Push API for receiving data payload.

self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const payload = event.data.json();
      
      const data = payload.data || {};
      const notification = payload.notification || {};
      
      const orderId = data.orderId;
      const notificationId = data.notificationId;
      
      const title = notification.title || "Update from Anjan Store";
      const body = notification.body || "You have a new message.";
      
      let url = '/';
      if (orderId) {
          url = '/digital_bill/' + orderId;
          if (notificationId) {
              url += '?notificationId=' + notificationId;
          }
      }
      
      const options = {
        body: body,
        icon: '/AppIcon-512x512.png',
        data: {
          url: url
        }
      };
      
      event.waitUntil(self.registration.showNotification(title, options));
    } catch (e) {
      console.error('Error parsing push payload', e);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || '/';
  
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
