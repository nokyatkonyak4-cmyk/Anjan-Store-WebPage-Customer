import re

content = open('src/App.tsx', 'r').read()
content = content.replace('console.error("Settings snapshot error:", error)', 'console.warn("Settings snapshot error:", error?.message)')
open('src/App.tsx', 'w').write(content)
print("patched App.tsx")
