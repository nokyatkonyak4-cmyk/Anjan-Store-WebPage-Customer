import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """  const handleCheckout = async () => {
    if (!savedAddress || !savedPhone) {
      alert(
        "Please update your Delivery Address and Phone in the Profile tab first.",
      );
      onNavigate("Profile");
      return;
    }

    if (!auth?.currentUser || !db) return;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Example Usage during Checkout Submission:
    const finalOrderPayload = {
      customerId: auth.currentUser.uid,
      customerName: auth.currentUser.displayName || "Customer",
      phone: savedPhone,
      address: savedAddress,
      items: cartItems.map((i: any) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      totalPrice: getOrderItemsTotal(cartItems),
      handlingFee: handlingFee,
      deliveryFee: deliveryFee,
      totalBill: getGrandTotal(cartItems), // Always exactly Items + Handling + Delivery
      deliveryType,
      status: "Pending Approval",
      deliveryOtp: otp,
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(),
    };

    try {
      await addDoc(collection(db, "orders"), finalOrderPayload);
      setCartItems([]);
      setShowConfirm(false);
      onNavigate("Orders");
    } catch (e) {
      console.error(e);
      alert("Failed to place order");
    }
  };"""

replacement = """  const handleCheckout = async () => {
    if (!savedAddress || !savedPhone) {
      alert(
        "Please update your Delivery Address and Phone in the Profile tab first.",
      );
      onNavigate("Profile");
      return;
    }

    if (!auth?.currentUser || !db) return;

    const paymentMethod = "Cash on Delivery"; // Can be dynamic if you have a payment selector

    const productsTotal = getOrderItemsTotal(cartItems);
    const platformFee = handlingFee;
    const finalDeliveryFee = deliveryFee;
    const totalBill = productsTotal + finalDeliveryFee + platformFee;

    const formattedItems = cartItems.map((item: any) => ({
      id: String(item.product?.id || item.id),
      name: item.product?.name || item.name || item.title || "Product",
      quantity: Number(item.quantity) || 1,
      price: Number(item.product?.price || item.price) || 0
    }));

    const orderPayload = {
      status: 'Placed',
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(), // Critical for Admin Panel real-time sorting
      
      // Customer Info
      customerName: auth.currentUser.displayName || user?.name || 'Customer',
      phone: savedPhone || '',
      address: savedAddress || '',
      customerEmail: auth.currentUser.email || user?.email || '',
      userId: auth.currentUser.uid || '',
      fcmToken: '', 
      
      // Order Items
      items: formattedItems,
      itemsCount: formattedItems.length,
      
      // Pricing
      productsTotal,
      deliveryFee: finalDeliveryFee,
      platformFee,
      totalBill,
      totalPrice: totalBill, // Fallback field
      
      // Delivery & Payment Settings
      deliveryType, // Will be 'Instant', '1 Day', or '1 Week'
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      
      // Default required fields for Admin dispatch routing
      distanceStr: '',
      deliveryTimeStr: 'N/A',
      deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(), // 4-digit OTP for delivery boy
      deliveryBoyId: ''
    };

    try {
      await addDoc(collection(db, 'orders'), orderPayload);
      setCartItems([]);
      setShowConfirm(false);
      onNavigate("Orders");
    } catch (e) {
      console.error(e);
      alert("Failed to place order");
    }
  };"""

if target in content:
    content = content.replace(target, replacement)
    
    # Let's also ensure deliveryType UI options match 'Instant', '1 Day', '1 Week' if they don't already.
    content = content.replace('Instant delivery', 'Instant')
    content = content.replace('1 day delivery', '1 Day')
    content = content.replace('1 week delivery', '1 Week')

    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Replaced handleCheckout successfully")
else:
    print("Target not found")
