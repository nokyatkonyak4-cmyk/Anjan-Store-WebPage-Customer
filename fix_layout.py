import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

# 1. Fix mobile nav
content = content.replace(
    'md:hidden bg-white border-t border-gray-100 flex justify-around items-center h-[60px] absolute bottom-0 w-full z-20 px-4',
    'md:hidden bg-white border-t border-gray-100 flex justify-around items-center h-[60px] w-full z-20 px-4 shrink-0'
)

# 2. Fix scrollable content padding
content = content.replace(
    'flex-1 overflow-y-auto pb-20 md:pb-6 scrollbar-hide md:px-4 lg:px-8',
    'flex-1 overflow-y-auto pb-6 scrollbar-hide md:px-4 lg:px-8'
)

# 3. Fix CartScreen layout
content = content.replace(
    '<div className="flex flex-col w-full p-4 h-full relative animate-in fade-in">',
    '<div className="flex flex-col w-full p-4 min-h-full animate-in fade-in">'
)
content = content.replace(
    '<div className="space-y-3 flex-1 overflow-y-auto pb-48">',
    '<div className="space-y-3 flex-1 pb-6">'
)
content = content.replace(
    '<div className="bg-white p-4 absolute bottom-0 left-0 right-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100 z-10 pb-24 space-y-2">',
    '<div className="bg-white p-4 sticky bottom-0 left-0 right-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100 z-10 space-y-2 mt-4 -mx-4">'
)

open('src/components/MainAppScreen.tsx', 'w').write(content)
print("Replaced successfully")
