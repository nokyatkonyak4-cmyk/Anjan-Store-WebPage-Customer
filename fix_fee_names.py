import re

content = open('src/components/DigitalBillScreen.tsx', 'r').read()
content = content.replace('order.handlingFee || 0', 'order.platformFee || order.handlingFee || 0')
open('src/components/DigitalBillScreen.tsx', 'w').write(content)

content = open('src/components/MainAppScreen.tsx', 'r').read()
content = content.replace('order.handlingFee || 0', 'order.platformFee || order.handlingFee || 0')
open('src/components/MainAppScreen.tsx', 'w').write(content)

print("Replaced fee names")
