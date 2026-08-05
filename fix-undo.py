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

    content = content.replace('}, (err) => console.error("Snapshot error:", err)));', '}));')
    content = content.replace('}, (err) => console.error("Snapshot error:", err));', '});')

    with open(file, 'w') as f:
        f.write(content)
