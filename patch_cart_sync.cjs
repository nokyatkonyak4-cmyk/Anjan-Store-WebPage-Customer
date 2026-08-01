const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// Update user doc listener to also load cartItems
const oldListener = `      if (docSnap.exists()) {
        const data = docSnap.data();
        setFavorites(data.favorites || []);
        setSavedAddress(data.address || '');
        setSavedPhone(data.whatsappNumber || '');
      }`;

const newListener = `      if (docSnap.exists()) {
        const data = docSnap.data();
        setFavorites(data.favorites || []);
        setSavedAddress(data.address || '');
        setSavedPhone(data.whatsappNumber || '');
        if (data.cartItems) {
          setCartItems(data.cartItems);
        }
      }`;

content = content.replace(oldListener, newListener);

// Update incrementCart
const oldIncrement = `  const incrementCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };`;

const newIncrement = `  const incrementCart = (product: any) => {
    const existing = cartItems.find(item => item.product.id === product.id);
    let newCart;
    if (existing) {
      newCart = cartItems.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      newCart = [...cartItems, { product, quantity: 1 }];
    }
    setCartItems(newCart);
    if (user && db) {
      setDoc(doc(db, 'users', user.uid), { cartItems: newCart }, { merge: true });
    }
  };`;

content = content.replace(oldIncrement, newIncrement);

// Update decrementCart
const oldDecrement = `  const decrementCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.product.id !== product.id);
    });
  };`;

const newDecrement = `  const decrementCart = (product: any) => {
    const existing = cartItems.find(item => item.product.id === product.id);
    let newCart;
    if (existing && existing.quantity > 1) {
      newCart = cartItems.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item);
    } else {
      newCart = cartItems.filter(item => item.product.id !== product.id);
    }
    setCartItems(newCart);
    if (user && db) {
      setDoc(doc(db, 'users', user.uid), { cartItems: newCart }, { merge: true });
    }
  };`;

content = content.replace(oldDecrement, newDecrement);

// Update cart clearing after checkout
const oldCheckout = `      setCartItems([]);
      setSelectedItem('Orders');`;

const newCheckout = `      setCartItems([]);
      if (user && db) {
        setDoc(doc(db, 'users', user.uid), { cartItems: [] }, { merge: true });
      }
      setSelectedItem('Orders');`;

content = content.replace(oldCheckout, newCheckout);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);

