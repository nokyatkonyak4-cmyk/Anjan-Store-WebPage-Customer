import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead && auth?.currentUser) {
      if (onNavigate) {
         onNavigate("optimistic_read_" + notif.id);
      }
      try {
        if (notif._path) {
          await updateDoc(doc(db, notif._path), { isRead: true });
        } else {
          const ref1 = doc(db, "users", auth.currentUser.uid, "notifications", notif.id);
          const ref2 = doc(db, "notifications", notif.id);
          const ref3 = doc(db, "userNotifications", notif.id);
          await Promise.allSettled([
            setDoc(ref1, { isRead: true }, { merge: true }),
            setDoc(ref2, { isRead: true }, { merge: true }),
            setDoc(ref3, { isRead: true }, { merge: true })
          ]);
        }
      } catch (e) {
        console.error("Error marking notification as read:", e);
      }
    }
  };

  const handleDeleteNotification = async (notif: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (auth?.currentUser) {
      if (onNavigate) {
         onNavigate("optimistic_delete_" + notif.id);
      }
      try {
        if (notif._path) {
          await deleteDoc(doc(db, notif._path));
        } else {
          const ref1 = doc(db, "users", auth.currentUser.uid, "notifications", notif.id);
          const ref2 = doc(db, "notifications", notif.id);
          const ref3 = doc(db, "userNotifications", notif.id);
          await Promise.allSettled([
            deleteDoc(ref1),
            deleteDoc(ref2),
            deleteDoc(ref3)
          ]);
        }
      } catch (e) {
        console.error("Error deleting notification:", e);
      }
    }
  };"""

replacement = """  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead && auth?.currentUser) {
      if (onNavigate) {
         onNavigate("optimistic_read_" + notif.id);
      }
      try {
        const ref1 = doc(db, "users", auth.currentUser.uid, "notifications", notif.id);
        const ref2 = doc(db, "notifications", notif.id);
        const ref3 = doc(db, "userNotifications", notif.id);
        await Promise.allSettled([
          setDoc(ref1, { isRead: true }, { merge: true }),
          setDoc(ref2, { isRead: true }, { merge: true }),
          setDoc(ref3, { isRead: true }, { merge: true })
        ]);
      } catch (e) {
        console.error("Error marking notification as read:", e);
      }
    }
  };

  const handleDeleteNotification = async (notif: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (auth?.currentUser) {
      if (onNavigate) {
         onNavigate("optimistic_delete_" + notif.id);
      }
      try {
        const ref1 = doc(db, "users", auth.currentUser.uid, "notifications", notif.id);
        const ref2 = doc(db, "notifications", notif.id);
        const ref3 = doc(db, "userNotifications", notif.id);
        await Promise.allSettled([
          deleteDoc(ref1),
          deleteDoc(ref2),
          deleteDoc(ref3)
        ]);
      } catch (e) {
        console.error("Error deleting notification:", e);
      }
    }
  };"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced notification click/delete logic")
else:
    print("Target not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
