import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = '<div className="flex flex-col w-full p-4 items-center animate-in fade-in pb-24 max-w-2xl w-full mx-auto">'
replacement = '<div className="flex flex-col w-full p-4 items-center animate-in fade-in pb-6 max-w-2xl w-full mx-auto">'

if target in content:
    content = content.replace(target, replacement)
    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target not found")
