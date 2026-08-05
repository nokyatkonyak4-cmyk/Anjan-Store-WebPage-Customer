import fs from 'fs';

const files = [
  'src/components/MainAppScreen.tsx',
  'src/components/OrderTrackingScreen.tsx',
  'src/components/DigitalBillScreen.tsx',
  'src/App.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace `    }));` with `    }, (err) => console.warn("Snapshot error", err)));`
  content = content.replace(/    \}\)\);/g, '    }, (err) => console.warn("Snapshot error", err)));');
  
  // Replace `    });` (for App.tsx and other screens)
  content = content.replace(/    \}\);/g, '    }, (err) => console.warn("Snapshot error", err));');
  
  fs.writeFileSync(file, content);
}
