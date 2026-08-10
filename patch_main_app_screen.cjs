const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

// 1. Add state variable
content = content.replace(
  'const [notifications3, setNotifications3] = useState<any[]>([]);',
  'const [notifications3, setNotifications3] = useState<any[]>([]);\n  const [notifications4, setNotifications4] = useState<any[]>([]);'
);

// 2. Add to useMemo all array
content = content.replace(
  'const all = [...notifications1, ...notifications2, ...notifications3];',
  'const all = [...notifications1, ...notifications2, ...notifications3, ...notifications4];'
);

// 3. Add updateFn
content = content.replace(
  'setNotifications3(updateFn);',
  'setNotifications3(updateFn);\n      setNotifications4(updateFn);'
);

// 4. Add filterFn
content = content.replace(
  'setNotifications3(filterFn);',
  'setNotifications3(filterFn);\n      setNotifications4(filterFn);'
);

// 5. Add global notifications listener
const searchListener = `    // Listen to notifications (where customerId == currentUser.uid)
    unsubs.push(
      onSnapshot(query(collection(db, "notifications"), where("customerId", "==", user.uid)), (snapshot) => {
          setNotifications3(snapshot.docs.map(mapNotification));
        }, (error) => { console.warn("Notifications 3 snapshot error:", error.message); }),
    );`;

const newListener = searchListener + `

    // Listen to global notifications (where isGlobal == true)
    unsubs.push(
      onSnapshot(query(collection(db, "notifications"), where("isGlobal", "==", true)), (snapshot) => {
          setNotifications4(snapshot.docs.map(mapNotification));
        }, (error) => { console.warn("Notifications 4 snapshot error:", error.message); }),
    );`;

if(content.includes(searchListener)) {
    content = content.replace(searchListener, newListener);
    fs.writeFileSync('src/components/MainAppScreen.tsx', content);
    console.log("Successfully patched MainAppScreen.tsx!");
} else {
    console.log("Could not find the listener block to replace.");
}

