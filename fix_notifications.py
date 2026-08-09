import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """function NotificationsScreen({ notifications, onNavigate }: any) {
  const handleNotificationClick = async (notif: any) => {
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
  };

  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={() => onNavigate("Back")}
      >
        <ArrowLeft size={24} className="text-dark-bg mr-3" />
        <h2 className="text-xl font-bold text-dark-bg">Notifications</h2>
      </div>
      {!notifications || notifications.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 mt-20">
          No new notifications
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif: any, index: number) => (
            <div
              key={`${notif.id}-${index}`}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${notif.isRead ? "bg-white border-gray-100" : "bg-[#FFF9E6] border-yellow-200 hover:bg-yellow-50"}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-dark-bg text-sm">
                  {notif.title}
                </h4>
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1"></span>
                )}
              </div>"""

replacement = """function NotificationsScreen({ notifications, onNavigate }: any) {
  const handleNotificationClick = async (notif: any) => {
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
  };

  const handleDeleteNotification = async (notif: any, e: React.MouseEvent) => {
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
  };

  return (
    <div className="flex flex-col w-full p-4 animate-in fade-in">
      <div
        className="flex items-center mb-6 cursor-pointer"
        onClick={() => onNavigate("Back")}
      >
        <ArrowLeft size={24} className="text-dark-bg mr-3" />
        <h2 className="text-xl font-bold text-dark-bg">Notifications</h2>
      </div>
      
      {notifications?.length > 20 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex flex-col gap-1 animate-pulse">
            <span className="font-bold flex items-center gap-2"><Info size={16} /> Storage limit approaching</span>
            <span>You have more than 20 notifications. Please delete older notifications to save space.</span>
        </div>
      )}

      {!notifications || notifications.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 mt-20">
          No new notifications
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif: any, index: number) => (
            <div
              key={`${notif.id}-${index}`}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${notif.isRead ? "bg-white border-gray-100" : "bg-[#FFF9E6] border-yellow-200 hover:bg-yellow-50"}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-dark-bg text-sm">
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </div>
                <button 
                  onClick={(e) => handleDeleteNotification(notif, e)} 
                  className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1 rounded-md transition-colors"
                  aria-label="Delete notification"
                >
                   <Trash2 size={16} />
                </button>
              </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced NotificationsScreen successfully")
else:
    print("Target not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
