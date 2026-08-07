import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

# Update storeSettings state type
content = content.replace(
"""  const [storeSettings, setStoreSettings] = useState<{
    supportEmail?: string;
    supportPhone?: string;
    supportWhatsapp?: string;
  } | null>(null);""",
"""  const [storeSettings, setStoreSettings] = useState<{
    supportEmail?: string;
    supportPhone?: string;
    supportWhatsapp?: string;
    deliveryFee?: number;
    handlingFee?: number;
  } | null>(null);"""
)

# Update CartScreen call
content = content.replace(
"""              <CartScreen
                cartItems={cartItems}
                setCartItems={setCartItems}
                savedAddress={savedAddress}
                savedPhone={savedPhone}
                incrementCart={incrementCart}
                decrementCart={decrementCart}
                onNavigate={handleNavigate}
              />""",
"""              <CartScreen
                cartItems={cartItems}
                setCartItems={setCartItems}
                savedAddress={savedAddress}
                savedPhone={savedPhone}
                incrementCart={incrementCart}
                decrementCart={decrementCart}
                onNavigate={handleNavigate}
                storeSettings={storeSettings}
              />"""
)

open('src/components/MainAppScreen.tsx', 'w').write(content)
