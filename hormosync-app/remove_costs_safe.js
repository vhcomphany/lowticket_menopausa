const fs = require('fs');
const path = require('path');

const suppsFile = path.join(__dirname, 'src/data/supplements.ts');
let supps = fs.readFileSync(suppsFile, 'utf8');

// Replace costRange property in interface Supplement
supps = supps.replace(/\s*costRange:\s*string;/g, '');

// Replace costRange: '...' in object definitions
supps = supps.replace(/\s*costRange:\s*'[^']*',/g, '');

// Replace the line "Custo estimado: xxx" in the template strings
supps = supps.replace(/Custo\s*estimado:.*?(\n|\r\n|$)/g, '');

fs.writeFileSync(suppsFile, supps, 'utf8');
console.log('Removed costRange from supplements.');

const appFile = path.join(__dirname, 'src/app/suplementos/page.tsx');
let appStr = fs.readFileSync(appFile, 'utf8');
// remove cost range display from the UI
appStr = appStr.replace(/\{ label:\s*'💰 Custo',\s*val:\s*sup\.costRange \},/g, '');
appStr = appStr.replace(/\{ label:\s*'💰 Custo',\s*val:\s*sup\.costRange\s*\}/g, '');
fs.writeFileSync(appFile, appStr, 'utf8');
console.log('Removed costRange from UI.');
