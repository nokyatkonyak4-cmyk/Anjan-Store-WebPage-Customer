import re

content = open('src/components/DigitalBillScreen.tsx', 'r').read()

content = content.replace('  const tax = subtotal * 0.05;\n', '')

open('src/components/DigitalBillScreen.tsx', 'w').write(content)
print("Removed tax")
