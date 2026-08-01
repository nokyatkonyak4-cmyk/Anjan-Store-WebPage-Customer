const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');
content = content.replace("import { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';");
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
