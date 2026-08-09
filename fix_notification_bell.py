import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target_modified = """                if (alertMsg) {
                    const notifText = alertPin ? `${alertMsg} \\nPIN: ${alertPin}` : alertMsg;
                    const notifRef1 = doc(collection(db, "users", user.uid, "notifications"));
                    const notifData = {
                      id: notifRef1.id,
                      title: "Order Update",
                      message: notifText,
                      timestamp: Date.now(),
                      createdAt: Date.now(),
                      isRead: false,
                      userId: user.uid,
                      customerId: user.uid
                    };
                    
                    setDoc(notifRef1, notifData).catch(console.error);
                    const notifRef2 = doc(collection(db, "userNotifications"), notifRef1.id);
                    setDoc(notifRef2, notifData).catch(console.error);
                }"""

replacement_modified = """                if (alertMsg) {
                    const notifText = alertPin ? `${alertMsg} \\nPIN: ${alertPin}` : alertMsg;
                    const notifRef = doc(collection(db, "users", user.uid, "notifications"));
                    const notifData = {
                      id: notifRef.id,
                      title: "Order Update",
                      message: notifText,
                      timestamp: Date.now(),
                      createdAt: Date.now(),
                      isRead: false,
                      userId: user.uid,
                      customerId: user.uid
                    };
                    setDoc(notifRef, notifData).catch(console.error);
                }"""

if target_modified in content:
    content = content.replace(target_modified, replacement_modified)
    print("Replaced modified alert logic")
else:
    print("Target modified not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
