const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

if (!content.includes('import toast from "react-hot-toast"')) {
    content = content.replace(
        'import React, { useState, useEffect } from "react";',
        'import React, { useState, useEffect } from "react";\nimport toast from "react-hot-toast";'
    );
}

const oldOnClick = /onClick=\{async \(\) => \{\s*try \{\s*if \("Notification" in window\) \{[\s\S]*?\} catch \(e\) \{\s*console\.error\(e\);\s*\}\s*\}\}/;

const newOnClick = `onClick={async () => {
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
                  }}`;

if (oldOnClick.test(content)) {
    content = content.replace(oldOnClick, newOnClick);
    fs.writeFileSync('src/components/MainAppScreen.tsx', content);
    console.log("Replaced!");
} else {
    console.log("Could not find regex.");
}
