const fs = require('fs');
let code = fs.readFileSync('src/components/SplashScreen.tsx', 'utf8');

// split on App Logo 2 and replace the src right before it
let parts = code.split('alt="App Logo 2"');
if(parts.length > 1) {
    let before = parts[0];
    before = before.replace(/src="\/app-picon-512x512-.png"(?=[^"]*$)/, 'src="/splash_icon_2.png.png"');
    code = before + 'alt="App Logo 2"' + parts[1];
    fs.writeFileSync('src/components/SplashScreen.tsx', code);
    console.log('updated');
} else {
    console.log('not found');
}
