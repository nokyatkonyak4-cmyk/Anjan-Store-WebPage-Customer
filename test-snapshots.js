import fs from 'fs';

const files = [
  'src/components/MainAppScreen.tsx',
  'src/components/OrderTrackingScreen.tsx',
  'src/components/DigitalBillScreen.tsx',
  'src/App.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  console.log(file, content.includes('Snapshot error'));
}
