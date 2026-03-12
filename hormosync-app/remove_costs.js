const fs = require('fs');

const path = 'src/data/supplements.ts';
let content = fs.readFileSync(path, 'utf8');

// Remove from Interface
content = content.replace(/\s*costRange:\s*string;/g, '');

// Remove from SUPPLEMENTS array
content = content.replace(/\s*costRange:\s*'[^\']+',?/g, '');

// Remove from manipulation formulas
content = content.replace(/Custo estimado:.*?(\r?\n)/g, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed costs in supplements.ts.');
