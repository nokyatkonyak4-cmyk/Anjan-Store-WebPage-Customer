import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target_click = """  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead && auth?.currentUser) {
      try {
        const ref1 = doc(db, "users", auth.currentUser.uid, "notifications", notif.id);
        const ref2 = doc(db, "notifications", notif.id);
        const ref3 = doc(db, "userNotifications", notif.id);
        
        const updatePromises = [];
        
        try { updatePromises.push(updateDoc(ref1, { isRead: true })); } catch(e){}
        try { updatePromises.push(updateDoc(ref2, { isRead: true })); } catch(e){}
        try { updatePromises.push(updateDoc(ref3, { isRead: true })); } catch(e){}
        
        await Promise.allSettled(updatePromises);
      } catch (e) {
        console.error("Error marking notification as read:", e);
      }
    }
  };"""

replacement_click = """  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead && auth?.currentUser) {
      if (onNavigate) {
         onNavigate("optimistic_read_" + notif.id);
      }
      try {
        const ref1 = doc(db, "users", auth.currentUser.uid, "notifications", notif.id);
        const ref2 = doc(db, "notifications", notif.id);
        const ref3 = doc(db, "userNotifications", notif.id);
        
        const updatePromises = [];
        
        try { updatePromises.push(updateDoc(ref1, { isRead: true })); } catch(e){}
        try { updatePromises.push(updateDoc(ref2, { isRead: true })); } catch(e){}
        try { updatePromises.push(updateDoc(ref3, { isRead: true })); } catch(e){}
        
        await Promise.allSettled(updatePromises);
      } catch (e) {
        console.error("Error marking notification as read:", e);
      }
    }
  };"""

target_delete = """  const handleDeleteNotification = async (notif: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (auth?.currentUser) {
      try {
        const ref1 = doc(db, "users", auth.currentUser.uid, "notifications", notif.id);
        const ref2 = doc(db, "notifications", notif.id);
        const ref3 = doc(db, "userNotifications", notif.id);
        
        const deletePromises = [];
        
        try { deletePromises.push(deleteDoc(ref1)); } catch(e){}
        try { deletePromises.push(deleteDoc(ref2)); } catch(e){}
        try { deletePromises.push(deleteDoc(ref3)); } catch(e){}
        
        await Promise.allSettled(deletePromises);
      } catch (e) {
        console.error("Error deleting notification:", e);
      }
    }
  };"""

replacement_delete = """  const handleDeleteNotification = async (notif: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (auth?.currentUser) {
      if (onNavigate) {
         onNavigate("optimistic_delete_" + notif.id);
      }
      try {
        const ref1 = doc(db, "users", auth.currentUser.uid, "notifications", notif.id);
        const ref2 = doc(db, "notifications", notif.id);
        const ref3 = doc(db, "userNotifications", notif.id);
        
        const deletePromises = [];
        
        try { deletePromises.push(deleteDoc(ref1)); } catch(e){}
        try { deletePromises.push(deleteDoc(ref2)); } catch(e){}
        try { deletePromises.push(deleteDoc(ref3)); } catch(e){}
        
        await Promise.allSettled(deletePromises);
      } catch (e) {
        console.error("Error deleting notification:", e);
      }
    }
  };"""

if target_click in content and target_delete in content:
    content = content.replace(target_click, replacement_click)
    content = content.replace(target_delete, replacement_delete)
    print("Replaced optimistic logic inside NotificationsScreen")
else:
    print("Target not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
