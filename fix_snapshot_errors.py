import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

content = content.replace(
    '(error) => console.error("Notifications 1 snapshot error:", error)',
    '(error) => { console.warn("Notifications 1 snapshot error:", error.message); if(error.code === "permission-denied") alert("Permission Denied: Please deploy the Firebase Security Rules from firestore.rules to your Firebase project to enable Notifications."); }'
)

content = content.replace(
    '(error) => console.error("Notifications 2 snapshot error:", error)',
    '(error) => { console.warn("Notifications 2 snapshot error:", error.message); }'
)

content = content.replace(
    '(error) => console.error("Notifications 3 snapshot error:", error)',
    '(error) => { console.warn("Notifications 3 snapshot error:", error.message); }'
)

open('src/components/MainAppScreen.tsx', 'w').write(content)
print("patched snapshot errors")
