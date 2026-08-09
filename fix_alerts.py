import re

content = open('src/components/MainAppScreen.tsx', 'r').read()
content = content.replace('alert("Failed to place order: " + (e.message || "Unknown error"));', 'alert("Permission Denied: Please go to your Firebase Console -> Firestore Database -> Rules, and paste the rules from the firestore.rules file.\\n\\nDetailed Error: " + (e.message || "Unknown error"));')

open('src/components/MainAppScreen.tsx', 'w').write(content)
print("patched alert")
