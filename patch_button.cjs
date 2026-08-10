const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const regex = /<button[\s\S]*?onClick=\{async \(\) => \{[\s\S]*?alert\("Push Notifications Enabled!"\);[\s\S]*?alert\("Permission granted\. Please refresh to receive notifications\."\);[\s\S]*?\} catch \(e\) \{[\s\S]*?console\.error\(e\);[\s\S]*?\}[\s\S]*?\}\}[\s\S]*?className="bg-brand-yellow text-dark-bg px-3 py-1\.5 rounded-lg text-xs font-bold shadow-sm"[\s\S]*?>[\s\S]*?Enable Push[\s\S]*?<\/button>/;

const newCode = `<button 
          onClick={async () => {
             try {
                if ("Notification" in window) {
                   const perm = await Notification.requestPermission();
                   if (perm === "granted" && (window as any).requestFCMToken) {
                      const success = await (window as any).requestFCMToken();
                      if (success) alert("Push Notifications Enabled!");
                      else alert("Failed to get push token. Ensure VAPID key is configured and try again.");
                   } else if (perm === "granted") {
                      alert("Permission granted. Please refresh to receive notifications.");
                   } else {
                      alert("Permission denied. You can change this in your browser settings.");
                   }
                } else {
                   alert("Push notifications are not supported in this browser.");
                }
             } catch (e) {
                console.error(e);
             }
          }}
          className="bg-brand-yellow text-dark-bg px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
        >
           Enable Push
        </button>`;

if (regex.test(content)) {
    content = content.replace(regex, newCode);
    fs.writeFileSync('src/components/MainAppScreen.tsx', content);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find regex match");
}
