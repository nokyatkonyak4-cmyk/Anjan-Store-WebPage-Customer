const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldRegex = /toast\.error\("Permission " \+ perm \+ " - please open app in new tab or check settings\."\);/g;

const newText = `toast.error(
                                "Push notifications cannot be enabled inside this embedded preview (Permission: " + perm + "). \\n\\nPlease click the \\"Open in new tab\\" icon at the top right of the screen to enable push notifications.",
                                { duration: 6000 }
                              );`;

content = content.replace(oldRegex, newText);

fs.writeFileSync('src/components/MainAppScreen.tsx', content);
console.log("Updated error message to be more explicit about opening a new tab.");
