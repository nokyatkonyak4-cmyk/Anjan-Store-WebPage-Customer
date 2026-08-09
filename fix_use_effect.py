import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """  const [pinAlertModal, setPinAlertModal] = useState<string | null>(null);
  const seenPinNotifications = React.useRef(new Set<string>());

  useEffect(() => {
    notifications.forEach((notif) => {
      if (!seenPinNotifications.current.has(notif.id)) {
        seenPinNotifications.current.add(notif.id);
        const msg = String(notif.message || "");
        const title = String(notif.title || "");
        const isRead = notif.isRead || false;
        
        if (!isRead && (msg.toLowerCase().includes("pin") || title.toLowerCase().includes("pin"))) {
          const match = msg.match(/\\b\\d{4}\\b/);
          if (match) {
            setPinAlertModal(match[0]);
          }
        }
      }
    });
  }, [notifications]);"""

if target in content:
    content = content.replace(target, '')
    print("Deleted use effect logic")
else:
    print("Target not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
