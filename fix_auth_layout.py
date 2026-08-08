import re

content = open('src/components/AuthScreen.tsx', 'r').read()

content = content.replace('min-h-screen', 'min-h-[100dvh]')

open('src/components/AuthScreen.tsx', 'w').write(content)
print("Replaced successfully")
