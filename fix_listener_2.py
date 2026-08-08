import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """          snapshot.docChanges().forEach((change) => {
            if (change.type === "modified") {
              const data = change.doc.data();
              const orderId = change.doc.id;
              const newStatus = data.status;
              const oldStatus = previousOrderStatuses.current[orderId];
              
              if (oldStatus && newStatus !== oldStatus) {
                
                let actionStr = `is now ${newStatus}`;
                if (newStatus.toLowerCase() === 'packed') actionStr = 'is packed and ready for delivery';
                if (newStatus.toLowerCase() === 'shipped') actionStr = 'has been shipped';
                if (newStatus.toLowerCase() === 'delivered') actionStr = 'has been delivered successfully';
                if (newStatus.toLowerCase() === 'cancelled') actionStr = 'has been cancelled';
                
                const msg = `Your order #${orderId.slice(0, 6).toUpperCase()} ${actionStr}.`;

                
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
          });"""

replacement = """          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const orderId = change.doc.id;
            const newStatus = data.status || "";
            const otp = data.deliveryOtp || "";

            if (change.type === "added") {
              previousOrderStatuses.current[orderId] = newStatus;
            } else if (change.type === "modified") {
              const oldStatus = previousOrderStatuses.current[orderId];
              
              if (oldStatus && newStatus !== oldStatus) {
                previousOrderStatuses.current[orderId] = newStatus;

                let alertMsg = "";
                let alertPin = "";

                if (newStatus === "Out for Delivery") {
                    if (otp) {
                        alertMsg = `Your order #${orderId.substring(0, 6).toUpperCase()} is out for delivery! The delivery partner is on the way.`;
                        alertPin = otp;
                    }
                } else if (newStatus && newStatus !== "Pending Approval") {
                    let formattedStatus = "";
                    switch (newStatus) {
                        case "Accepted by Store":
                        case "Accepted":
                            formattedStatus = "has been accepted by store";
                            break;
                        case "Driver Assigned":
                        case "Accepted by Delivery Boy":
                            formattedStatus = "has been assigned to a delivery partner";
                            break;
                        case "Packed":
                        case "Ready for Delivery":
                            formattedStatus = "is packed and ready for delivery";
                            break;
                        case "Delivered":
                            formattedStatus = "has been delivered. Thank you!";
                            break;
                        case "Pending Payment":
                            formattedStatus = "is pending payment";
                            break;
                        case "Arrived":
                        case "Reached":
                        case "Reached Location":
                            formattedStatus = "driver has reached your location";
                            break;
                        default:
                            formattedStatus = `status is now ${newStatus}`;
                    }
                    alertMsg = `Your order #${orderId.substring(0, 6).toUpperCase()} ${formattedStatus}`;
                }

                if (alertMsg) {
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
                }
              }
            }
          });"""

if target in content:
    content = content.replace(target, replacement)
    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target not found!")
