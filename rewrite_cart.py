import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """function CartScreen({
  cartItems,
  setCartItems,
  savedAddress,
  savedPhone,
  incrementCart,
  decrementCart,
  user,
  onNavigate,
}: any) {
  const total = cartItems.reduce(
    (acc: number, item: any) => acc + item.product.price * item.quantity,
    0,
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [deliveryType, setDeliveryType] = useState("Instant delivery");

  const handleCheckout = async () => {
    if (!savedAddress || !savedPhone) {
      alert(
        "Please update your Delivery Address and Phone in the Profile tab first.",
      );
      onNavigate("Profile");
      return;
    }

    if (!auth?.currentUser || !db) return;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const orderData = {
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
      totalPrice: total,
      deliveryFee: 0,
      deliveryType,
      status: "Pending Approval",
      deliveryOtp: otp,
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(),
    };"""

replacement = """function CartScreen({
  cartItems,
  setCartItems,
  savedAddress,
  savedPhone,
  incrementCart,
  decrementCart,
  user,
  onNavigate,
  storeSettings,
}: any) {
  // 1. Calculate the total cost of items in the cart
  const getOrderItemsTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + ((item.product.price || 0) * (item.quantity || 1)), 0);
  };

  // 2. Safely retrieve dynamic fees
  const handlingFee = storeSettings?.handlingFee || 0;
  const deliveryFee = storeSettings?.deliveryFee || 0;

  // 3. Accurately calculate the Grand Total Bill
  const getGrandTotal = (items: any[]) => {
    return getOrderItemsTotal(items) + handlingFee + deliveryFee;
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [deliveryType, setDeliveryType] = useState("Instant delivery");

  const handleCheckout = async () => {
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
    };"""

content = content.replace(target, replacement)

content = content.replace(
"""      await addDoc(collection(db, "orders"), orderData);""",
"""      await addDoc(collection(db, "orders"), finalOrderPayload);"""
)

open('src/components/MainAppScreen.tsx', 'w').write(content)
