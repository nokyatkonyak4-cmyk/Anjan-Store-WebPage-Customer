import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

content = content.replace(
    "const handlingFee = storeSettings?.handlingFee || 0;",
    "const handlingFee = Number(storeSettings?.handlingFee || 0);"
)
content = content.replace(
    "const deliveryFee = storeSettings?.deliveryFee || 0;",
    "const deliveryFee = Number(storeSettings?.deliveryFee || 0);"
)

open('src/components/MainAppScreen.tsx', 'w').write(content)
