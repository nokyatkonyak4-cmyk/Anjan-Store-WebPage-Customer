import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """  useEffect(() => {
    notifications.forEach((notif) => {
      if (!seenPinNotifications.current.has(notif.id)) {
        seenPinNotifications.current.add(notif.id);
        const text = String(notif.message || "");
        if (text.toLowerCase().includes("resend_pin")) {
          const match = text.match(/\\b\\d{4}\\b/);
          if (match) {
            setPinAlertModal(match[0]);
          }
        }
      }
    });
  }, [notifications]);"""

replacement = """  useEffect(() => {
    notifications.forEach((notif) => {
      if (!seenPinNotifications.current.has(notif.id)) {
        seenPinNotifications.current.add(notif.id);
        const msg = String(notif.message || "");
        const title = String(notif.title || "");
        const isRead = notif.isRead || false;
        
        if (!isRead && (title.toLowerCase().includes("resend_pin") || msg.toLowerCase().includes("resend_pin"))) {
          const match = msg.match(/\\b\\d{4}\\b/);
          if (match) {
            setPinAlertModal(match[0]);
          }
        }
      }
    });
  }, [notifications]);"""

if target in content:
    content = content.replace(target, replacement)
    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target not found!")
