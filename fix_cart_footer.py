import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = '<div className="bg-white p-4 sticky bottom-0 left-0 right-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100 z-10 space-y-2 mt-4 -mx-4">'
replacement = '<div className="bg-white p-4 sticky bottom-[-1rem] left-0 right-0 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100 z-10 space-y-2 mt-4 -mx-4">'

if target in content:
    content = content.replace(target, replacement)
    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target not found")
