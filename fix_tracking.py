import re

content = open('src/components/OrderTrackingScreen.tsx', 'r').read()

target = 'className="flex flex-col h-screen max-w-2xl w-full mx-auto bg-gray-100 relative animate-in slide-in-from-right overflow-hidden shadow-2xl"'
replacement = 'className="flex flex-col h-[100dvh] max-w-2xl w-full mx-auto bg-gray-100 relative animate-in slide-in-from-right overflow-hidden shadow-2xl"'

if target in content:
    content = content.replace(target, replacement)
    open('src/components/OrderTrackingScreen.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target not found")
