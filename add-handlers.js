import fs from 'fs';

const files = [
  'src/components/MainAppScreen.tsx',
  'src/components/OrderTrackingScreen.tsx',
  'src/components/DigitalBillScreen.tsx',
  'src/App.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // App.tsx
  content = content.replace(/initialLoadRef\.current = false;\n\s*\}\);/g, 'initialLoadRef.current = false;\n    }, (err) => console.warn("Snapshot error App:", err));');
  
  // MainAppScreen
  content = content.replace(/c\.isActive !== false\)\);\n\s*\}\)\);/g, 'c.isActive !== false));\n    }, (err) => console.warn("Snapshot error Categories:", err)));');
  content = content.replace(/p\.stockQuantity > 0\)\);\n\s*\}\)\);/g, 'p.stockQuantity > 0));\n    }, (err) => console.warn("Snapshot error Products:", err)));');
  content = content.replace(/b\.isActive !== false\)\);\n\s*\}\)\);/g, 'b.isActive !== false));\n    }, (err) => console.warn("Snapshot error Banners:", err)));');
  content = content.replace(/setStoreSettings\(docSnap\.data\(\) as any\);\n\s*\}\n\s*\}\)\);/g, 'setStoreSettings(docSnap.data() as any);\n      }\n    }, (err) => console.warn("Snapshot error StoreSettings:", err)));');
  
  content = content.replace(/setOrders\(fetchedOrders\);\n\s*\}\)\);/g, 'setOrders(fetchedOrders);\n    }, (err) => console.warn("Snapshot error Orders:", err)));');
  
  content = content.replace(/a\.timestamp \|\| 0\)\)\);\n\s*\}\)\);/g, 'a.timestamp || 0)));\n    }, (err) => console.warn("Snapshot error Notifications:", err)));');
  
  content = content.replace(/setCartItems\(data\.cartItems\);\n\s*\}\n\s*\}\n\s*\}\)\);/g, 'setCartItems(data.cartItems);\n        }\n      }\n    }, (err) => console.warn("Snapshot error User:", err)));');
  
  // OrderTrackingScreen & DigitalBillScreen
  content = content.replace(/setOrderData\(snap\.data\(\) as any\);\n\s*\} else \{\n\s*setError\("Order not found"\);\n\s*\}\n\s*setLoading\(false\);\n\s*\}\);/g, 'setOrderData(snap.data() as any);\n      } else {\n        setError("Order not found");\n      }\n      setLoading(false);\n    }, (err) => {\n      console.warn("Snapshot error Order:", err);\n      setError("Permission Denied or Order Error");\n      setLoading(false);\n    });');
  
  fs.writeFileSync(file, content);
}
