self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log("[SW] Push Received.", payload);
      
      const data = payload.data || {};
      const notification = payload.notification || {};
      
      // If the payload has a 'notification' object, the browser might automatically show it.
      // To avoid duplicates, we can check if it's going to be shown.
      // But actually, without the FCM SDK, the browser might NOT automatically show FCM notifications 
      // unless it strictly follows the Web Push protocol for notifications.
      // Let's always show it, and if there are duplicates, we can fix it later. 
      // Right now, showing something is better than nothing.
      
      const title = notification.title || data.title || "Anjan Store Update";
      const body = notification.body || data.message || data.body || "You have a new update.";
      
      let url = '/';
      const orderId = data.orderId || notification.orderId;
      if (data.click_action === 'OPEN_ORDER' && orderId) {
          url = '/track_order/' + orderId;
      } else if (orderId) {
          url = '/digital_bill/' + orderId;
      }
      
      const options = {
        body: body,
        icon: '/AppIcon-512x512.png',
        data: {
          url: url
        }
      };
      
      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    } catch (e) {
      console.error('[SW] Error parsing push payload', e);
      // Fallback
      event.waitUntil(
        self.registration.showNotification("Anjan Store Update", {
          body: "You have a new message.",
          icon: '/AppIcon-512x512.png'
        })
      );
    }
  }
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
