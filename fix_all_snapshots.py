import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

content = content.replace('console.error("Categories snapshot error:", error)', 'console.warn("Categories snapshot error:", error?.message)')
content = content.replace('console.error("Products snapshot error:", error)', 'console.warn("Products snapshot error:", error?.message)')
content = content.replace('console.error("Banners snapshot error:", error)', 'console.warn("Banners snapshot error:", error?.message)')
content = content.replace('console.error("Settings snapshot error:", error)', 'console.warn("Settings snapshot error:", error?.message)')
content = content.replace('console.error("Orders snapshot error:", error)', 'console.warn("Orders snapshot error:", error?.message)')
content = content.replace('console.error("User snapshot error:", error)', 'console.warn("User snapshot error:", error?.message)')
content = content.replace('console.error("Reviews snapshot error:", error)', 'console.warn("Reviews snapshot error:", error?.message)')

open('src/components/MainAppScreen.tsx', 'w').write(content)
print("patched all snapshots")
