import re

content = open('src/components/OrderTrackingScreen.tsx', 'r').read()

content = content.replace(
    'alert("Invalid PIN. Please try again.");',
    'alert("delivery confirmation PIN is Incorrect.");'
)

open('src/components/OrderTrackingScreen.tsx', 'w').write(content)
