import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target1 = """  const previousOrderStatuses = React.useRef<Record<string, string>>({});"""

replacement1 = """  const previousOrderStatuses = React.useRef<Record<string, string>>({});
  const [pinAlertModal, setPinAlertModal] = useState<string | null>(null);
  const seenPinNotifications = React.useRef(new Set<string>());

  useEffect(() => {
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


if target1 in content:
    content = content.replace(target1, replacement1)
    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target1 not found!")
