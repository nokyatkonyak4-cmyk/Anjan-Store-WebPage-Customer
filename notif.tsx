function NotificationsScreen({ notifications, onNavigate }: any) {
    const handleNotificationClick = async (notif: any) => {
        if (!notif.isRead) {
            onNavigate("optimistic_read_" + notif.id);
            try {
                await updateDoc(doc(db, "notifications", notif.id), { isRead: true });
            } catch (error) {
                console.error("Error updating notification", error);
            }
        }
    };
    
    const handleDeleteNotification = async (notif: any, e: any) => {
        e.stopPropagation();
        onNavigate("optimistic_delete_" + notif.id);
        try {
            await deleteDoc(doc(db, "notifications", notif.id));
            toast.success("Notification deleted");
        } catch (error) {
            console.error("Error deleting notification", error);
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-white animate-fade-in p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center cursor-pointer" onClick={() => onNavigate("Back")}>
                    <ArrowLeft size={24} className="text-dark-bg mr-3" />
                    <h2 className="text-xl font-bold text-dark-bg">Notifications</h2>
                </div>
                <button 
                  onClick={async () => {
                     try {
                        toast("Requesting notification permission...");
                        if ("Notification" in window) {
                           const perm = await Notification.requestPermission();
                           if (perm === "granted" && (window as any).requestFCMToken) {
                              const success = await (window as any).requestFCMToken();
                              if (success) toast.success("Push Notifications Enabled!");
                              else toast.error("Failed to get push token. Please make sure you are in a new tab.");
                           } else if (perm === "granted") {
                              toast.success("Permission granted. Please refresh to receive notifications.");
                           } else {
                              toast.error(
                                "Push notifications cannot be enabled inside this embedded preview (Permission: " + perm + "). \n\nPlease click the \"Open in new tab\" icon at the top right of the screen to enable push notifications.",
                                { duration: 6000 }
                              );
                           }
                        } else {
                           toast.error("Push notifications are not supported in this browser.");
                        }
                     } catch (e: any) {
                        console.error(e);
                        toast.error("Error: " + (e.message || "Unknown error"));
                     }
                  }}
                  className="bg-brand-yellow text-dark-bg px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 hover:opacity-90 transition-all"
                >
                   Enable Push
                </button>
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
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                {notif.message}
              </p>
              {notif.timestamp ? (
                <span className="text-[10px] text-gray-400">
                  {new Date(notif.timestamp).toLocaleString()}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

