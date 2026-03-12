const fs = require('fs');
const path = require('path');

const p1 = path.join(__dirname, 'src/data/supplements.ts');
let c1 = fs.readFileSync(p1, 'utf8');
c1 = c1.replace(/\s*emoji:\s*string;/g, '');
c1 = c1.replace(/\s*emoji:\s*'.+?',?/g, '');
c1 = c1.replace(/['`]🔥\s*Fogachos['`]/g, '\'Fogachos\'');
c1 = c1.replace(/['`]🌙\s*Sono\s*e\s*Ansiedade['`]/g, '\'Sono e Ansiedade\'');
c1 = c1.replace(/['`]⚡\s*Energia\s*e\s*Cansaço['`]/g, '\'Energia e Cansaço\'');
c1 = c1.replace(/['`]💜\s*Libido\s*e\s*Secura['`]/g, '\'Libido e Secura\'');
c1 = c1.replace(/['`]✨\s*Cabelo\s*e\s*Unhas['`]/g, '\'Cabelo e Unhas\'');
c1 = c1.replace(/['`]🦴\s*Ossos\s*e\s*Articulações['`]/g, '\'Ossos e Articulações\'');
c1 = c1.replace(/['`]🫀\s*Coração\s*e\s*Circulação['`]/g, '\'Coração e Circulação\'');
c1 = c1.replace(/['`]😊\s*Humor\s*e\s*Memória['`]/g, '\'Humor e Memória\'');
fs.writeFileSync(p1, c1, 'utf8');

const p2 = path.join(__dirname, 'src/app/suplementos/page.tsx');
let c2 = fs.readFileSync(p2, 'utf8');
c2 = c2.replace(/<div.*?\{supplement\.emoji\}.*?<\/div>\s*/g, '');
c2 = c2.replace(/<div className="card-emoji-header">.*?<\/div>\s*/gs, '');
c2 = c2.replace(/<div style=\{\{ fontSize: '30px', flexShrink: 0 \}\}>.*?<\/div>\s*/gs, '');
fs.writeFileSync(p2, c2, 'utf8');

console.log('Done!');
