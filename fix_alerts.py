import re
with open("src/components/MainAppScreen.tsx", "r") as f:
    content = f.read()

if 'import toast from "react-hot-toast"' not in content:
    content = content.replace(
        'import React, { useState, useEffect } from "react";',
        'import React, { useState, useEffect } from "react";\nimport toast from "react-hot-toast";'
    )

old_regex = r'onClick=\{async \(\) => \{\s*try \{\s*if \("Notification" in window\) \{[\s\S]*?\} catch \(e\) \{\s*console\.error\(e\);\s*\}\s*\}\}'

new_code = """onClick={async () => {
                     try {
                        toast("Requesting notification permission...");
                        if ("Notification" in window) {
                           const perm = await Notification.requestPermission();
                           if (perm === "granted" && (window as any).requestFCMToken) {
                              const success = await (window as any).requestFCMToken();
                              if (success) toast.success("Push Notifications Enabled!");
                              else toast.error("Failed to get push token. Please make sure you are in a new tab.");
                           } else if (perm === "granted") {
                              toast.success("Permission granted. Please refresh to receive notifications.");
                           } else {
                              toast.error("Permission " + perm + " - please open app in new tab or check settings.");
                           }
                        } else {
                           toast.error("Push notifications are not supported in this browser.");
                        }
                     } catch (e: any) {
                        console.error(e);
                        toast.error("Error: " + (e.message || "Unknown error"));
                     }
                  }}"""

if re.search(old_regex, content):
    content = re.sub(old_regex, new_code, content)
    with open("src/components/MainAppScreen.tsx", "w") as f:
        f.write(content)
    print("Replaced!")
else:
    print("Could not find regex.")
