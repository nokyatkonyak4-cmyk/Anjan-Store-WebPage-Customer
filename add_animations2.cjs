const fs = require('fs');

function addAnimations(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Basic button transition
    content = content.replace(
        /className="([^"]*\b(bg-brand-yellow|bg-dark-bg|bg-white\/80)\b[^"]*)"/g,
        (match, p1) => {
            if (p1.includes('transition-all')) return match; // already has it
            let newClasses = p1;
            if (!newClasses.includes('transition')) newClasses += ' transition-all';
            else if (!newClasses.includes('transition-all')) newClasses = newClasses.replace('transition', 'transition-all');
            
            if (!newClasses.includes('active:scale-95') && !newClasses.includes('active:scale-90')) newClasses += ' active:scale-95';
            if (!newClasses.includes('hover:scale-') && !newClasses.includes('hover:-translate-y-1') && !newClasses.includes('hover:opacity-')) newClasses += ' hover:opacity-90';
            
            return `className="${newClasses}"`;
        }
    );

    fs.writeFileSync(file, content);
}

['src/components/Screens.tsx', 'src/components/AuthScreen.tsx', 'src/components/OrderTrackingScreen.tsx'].forEach(addAnimations);
console.log("Added generic animations to other screens.");
