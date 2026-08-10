const fs = require('fs');

let mainContent = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const startIndex = mainContent.indexOf('export function ProductCard({');
if (startIndex !== -1) {
    const endIndexStr = '    </div>\n  );\n}';
    let endIndex = mainContent.indexOf(endIndexStr, startIndex);
    if (endIndex !== -1) {
        endIndex += endIndexStr.length;
        const pcCode = mainContent.substring(startIndex, endIndex);
        
        mainContent = mainContent.substring(0, startIndex) + mainContent.substring(endIndex);
        fs.writeFileSync('src/components/MainAppScreen.tsx', mainContent);
        
        let screensContent = fs.readFileSync('src/components/Screens.tsx', 'utf8');
        screensContent += '\n\n' + pcCode + '\n';
        fs.writeFileSync('src/components/Screens.tsx', screensContent);
        console.log("Moved by index.");
    } else {
        console.log("end not found");
    }
} else {
    console.log("start not found");
}
