import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

content = content.replace(
    "const total = (order.totalPrice || 0) + (order.deliveryFee || 0) + (order.handlingFee || 0);",
    "const total = order.totalBill || ((order.totalPrice || order.total || 0) + (order.handlingFee || 0) + (order.deliveryFee || 0));"
)

open('src/components/MainAppScreen.tsx', 'w').write(content)
