import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target_checkout = """    try {
      await addDoc(collection(db, 'orders'), orderPayload);
      setCartItems([]);
      setShowConfirm(false);
      onNavigate("Orders");
    } catch (e) {"""

replacement_checkout = """    try {
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
    } catch (e) {"""

if target_checkout in content:
    content = content.replace(target_checkout, replacement_checkout)
    print("Replaced checkout notification logic")
else:
    print("Target checkout not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
