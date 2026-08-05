import re

files = [
    'src/components/MainAppScreen.tsx',
    'src/components/OrderTrackingScreen.tsx',
    'src/components/DigitalBillScreen.tsx',
    'src/App.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # We need to find `onSnapshot(..., (snapshot) => { ... })` and add `}, (error) => { console.error("Snapshot error:", error); });`
    # Actually, in MainAppScreen it's `}));` at the end.
    
    # Let's just replace `}));` with `}, (err) => console.error(err)));` for unsubs.push
    content = re.sub(r'(\n\s*\}\)\);)', r'}, (err) => console.error("Snapshot error:", err)));', content)
    
    # In App.tsx, OrderTrackingScreen, DigitalBillScreen it's `});`
    content = re.sub(r'(\n\s*\}\);)', r'}, (err) => console.error("Snapshot error:", err));', content)

    with open(file, 'w') as f:
        f.write(content)
