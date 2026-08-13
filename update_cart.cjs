const fs = require('fs');

const path = 'src/components/Screens.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('import { doc, addDoc } from')) {
    code = code.replace("from 'firebase/firestore';", "from 'firebase/firestore';\nimport { doc, addDoc } from 'firebase/firestore';");
}

if (!code.includes('import toast from')) {
    code = "import toast from 'react-hot-toast';\n" + code;
}

const checkoutLogic = `
    const handleCheckout = async () => {
        if (!auth.currentUser) {
            toast.error("Please login to place an order");
            return;
        }
        try {
            const newOrderRef = await addDoc(collection(db, "orders"), {
                customerId: auth.currentUser.uid,
                customerName: auth.currentUser.displayName || auth.currentUser.email || "Customer",
                items: cartItems.map((item: any) => ({
                    productId: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    imageUrl: item.product.imageUrls?.[0] || item.product.imageUrl || item.product.image || "/icon.512x512.png.png"
                })),
                totalPrice: total,
                deliveryFee: storeSettings?.deliveryFee || 0,
                status: "Pending Approval",
                createdAt: new Date(),
                createdAtMs: Date.now()
            });
            setCartItems([]);
            toast.success("Order placed successfully!");
            window.location.href = \`/digital_bill/\${newOrderRef.id}\`;
        } catch (error: any) {
            console.error("Checkout error", error);
            toast.error("Failed to place order: " + error.message);
        }
    };
`;

code = code.replace(
    'const total = cartItems.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);',
    'const total = cartItems.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);\n' + checkoutLogic
);

code = code.replace(
    '<button className="w-full bg-brand-yellow text-dark-bg py-3 rounded-full font-bold shadow-md transition-all active:scale-95 hover:opacity-90">Checkout</button>',
    '<button onClick={handleCheckout} className="w-full bg-brand-yellow text-dark-bg py-3 rounded-full font-bold shadow-md transition-all active:scale-95 hover:opacity-90">Checkout</button>'
);

fs.writeFileSync(path, code);
console.log("Updated CartScreen!");
