const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

content = content.replace(
  `  const unreadNotificationsCount = notifications.filter((n: any) => !n.isRead).length;\n\n  const notifications = React.useMemo(() => {`,
  `  const notifications = React.useMemo(() => {`
);

content = content.replace(
  `  }, [notifications1, notifications2, notifications3]);`,
  `  }, [notifications1, notifications2, notifications3]);\n\n  const unreadNotificationsCount = notifications.filter((n: any) => !n.isRead).length;`
);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Fixed TDZ error");
