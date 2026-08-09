import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """        await updateDoc(
          doc(db, "users", auth.currentUser.uid, "notifications", notif.id),
          {
            isRead: true,
          },
        );"""

replacement = """        const ref1 = doc(db, "users", auth.currentUser.uid, "notifications", notif.id);
        const ref2 = doc(db, "notifications", notif.id);
        const ref3 = doc(db, "userNotifications", notif.id);
        
        const updatePromises = [];
        
        try { updatePromises.push(updateDoc(ref1, { isRead: true })); } catch(e){}
        try { updatePromises.push(updateDoc(ref2, { isRead: true })); } catch(e){}
        try { updatePromises.push(updateDoc(ref3, { isRead: true })); } catch(e){}
        
        await Promise.allSettled(updatePromises);"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced mark-as-read logic")
else:
    print("Target not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
