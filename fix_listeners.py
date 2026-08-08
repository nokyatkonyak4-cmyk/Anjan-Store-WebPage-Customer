import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """    // Listen to Orders
    unsubs.push(
      onSnapshot(query(collection(db, "orders"), where("customerId", "==", user.uid)), (snapshot) => {
          const fetchedOrders = snapshot.docs
            .map((d) => {
              const data = d.data();
              let dateStr = "Recently";
              if (data.createdAt && data.createdAt.toDate) {
                dateStr = data.createdAt.toDate().toLocaleString();
              } else if (data.createdAtMs) {
                dateStr = new Date(data.createdAtMs).toLocaleString();
              }
              return {
                id: d.id,
                date: dateStr,
                status: data.status || "Pending Approval",
                total: data.totalPrice,
                deliveryFee: data.deliveryFee || 0,
                ...data,
                itemCount: data.items?.length || 0,
              };
            })
            .sort(
              (a: any, b: any) => (b.createdAtMs || 0) - (a.createdAtMs || 0),
            );
          setOrders(fetchedOrders);
        }, (error) => console.error("Orders snapshot error:", error)),
    );

    // Listen to Notifications
    unsubs.push(
      onSnapshot(collection(db, "users", user.uid, "notifications"), (snapshot) => {
          setNotifications(
            snapshot.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .sort(
                (a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0),
              ),
          );
        }, (error) => console.error("Notifications snapshot error:", error)),
    );"""

replacement = """    // Listen to Orders
    unsubs.push(
      onSnapshot(query(collection(db, "orders"), where("customerId", "==", user.uid)), (snapshot) => {
          const fetchedOrders = snapshot.docs
            .map((d) => {
              const data = d.data();
              let dateStr = "Recently";
              if (data.createdAt && data.createdAt.toDate) {
                dateStr = data.createdAt.toDate().toLocaleString();
              } else if (data.createdAtMs) {
                dateStr = new Date(data.createdAtMs).toLocaleString();
              }
              return {
                id: d.id,
                date: dateStr,
                status: data.status || "Pending Approval",
                total: data.totalPrice,
                deliveryFee: data.deliveryFee || 0,
                ...data,
                itemCount: data.items?.length || 0,
              };
            })
            .sort(
              (a: any, b: any) => (b.createdAtMs || 0) - (a.createdAtMs || 0),
            );
          setOrders(fetchedOrders);

          snapshot.docChanges().forEach((change) => {
            if (change.type === "modified") {
              const data = change.doc.data();
              const orderId = change.doc.id;
              const newStatus = data.status;
              const oldStatus = previousOrderStatuses.current[orderId];
              
              if (oldStatus && newStatus !== oldStatus) {
                const msg = `Your order #${orderId.slice(0, 6).toUpperCase()} is ${newStatus}.`;
                
                const notifRef1 = doc(collection(db, "users", user.uid, "notifications"));
                const notifData = {
                  id: notifRef1.id,
                  title: "Order Status Update",
                  message: msg,
                  timestamp: Date.now(),
                  isRead: false,
                  orderId: orderId,
                  userId: user.uid,
                  customerId: user.uid
                };
                
                setDoc(notifRef1, notifData);
                const notifRef2 = doc(collection(db, "userNotifications"), notifRef1.id);
                setDoc(notifRef2, notifData);
              }
              previousOrderStatuses.current[orderId] = newStatus;
            } else if (change.type === "added") {
              previousOrderStatuses.current[change.doc.id] = change.doc.data().status;
            }
          });
        }, (error) => console.error("Orders snapshot error:", error)),
    );

    const mapNotification = (d: any) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        title: data.title || data.type || "Notification",
        message: data.message || data.body || data.text || data.content || ""
      };
    };

    // Listen to Notifications (users/{userId}/notifications)
    unsubs.push(
      onSnapshot(collection(db, "users", user.uid, "notifications"), (snapshot) => {
          setNotifications1(snapshot.docs.map(mapNotification));
        }, (error) => console.error("Notifications 1 snapshot error:", error)),
    );

    // Listen to userNotifications (where userId == currentUser.uid)
    unsubs.push(
      onSnapshot(query(collection(db, "userNotifications"), where("userId", "==", user.uid)), (snapshot) => {
          setNotifications2(snapshot.docs.map(mapNotification));
        }, (error) => console.error("Notifications 2 snapshot error:", error)),
    );

    // Listen to notifications (where customerId == currentUser.uid)
    unsubs.push(
      onSnapshot(query(collection(db, "notifications"), where("customerId", "==", user.uid)), (snapshot) => {
          setNotifications3(snapshot.docs.map(mapNotification));
        }, (error) => console.error("Notifications 3 snapshot error:", error)),
    );"""

if target in content:
    content = content.replace(target, replacement)
    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target not found!")
