import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """    try {
      const orderRef = await addDoc(collection(db, 'orders'), orderPayload);
      
      const notifRef = doc(collection(db, "users", auth.currentUser.uid, "notifications"));
      const notifData = {
        id: notifRef.id,
        title: "Order Placed Successfully",
        message: `Your order #${orderRef.id.substring(0, 6).toUpperCase()} has been placed successfully and is pending approval.`,
        timestamp: Date.now(),
        createdAt: Date.now(),
        isRead: false,
        userId: auth.currentUser.uid,
        customerId: auth.currentUser.uid
      };
      await setDoc(notifRef, notifData);

      setCartItems([]);
      setShowConfirm(false);
      onNavigate("Orders");
    } catch (e) {
      console.error(e);
      alert("Failed to place order");
    }"""

replacement = """    try {
      const sanitizedPayload = JSON.parse(JSON.stringify(orderPayload, (key, value) => value === undefined ? null : value));
      const orderRef = await addDoc(collection(db, 'orders'), sanitizedPayload);
      
      const notifRef = doc(collection(db, "users", auth.currentUser.uid, "notifications"));
      const notifData = {
        id: notifRef.id,
        title: "Order Placed Successfully",
        message: `Your order #${orderRef.id.substring(0, 6).toUpperCase()} has been placed successfully and is pending approval.`,
        timestamp: Date.now(),
        createdAt: Date.now(),
        isRead: false,
        userId: auth.currentUser.uid,
        customerId: auth.currentUser.uid
      };
      await setDoc(notifRef, notifData);

      setCartItems([]);
      setShowConfirm(false);
      onNavigate("Orders");
    } catch (e: any) {
      console.error(e);
      alert("Failed to place order: " + (e.message || "Unknown error"));
    }"""

if target in content:
    content = content.replace(target, replacement)
    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Fixed place order")
else:
    print("Target not found")
