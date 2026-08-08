import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = '<div className="flex flex-col w-full animate-in fade-in pb-20">'
replacement = '<div className="flex flex-col w-full animate-in fade-in pb-6">'

if target in content:
    content = content.replace(target, replacement)
    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target not found")
