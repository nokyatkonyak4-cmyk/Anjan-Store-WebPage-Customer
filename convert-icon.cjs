const pngToIco = require('png-to-ico').default;
const fs = require('fs');

pngToIco('public/brand-logo.png')
  .then(buf => {
    fs.writeFileSync('public/brand-favicon.ico', buf);
    console.log('Successfully created brand-favicon.ico');
  })
  .catch(console.error);
