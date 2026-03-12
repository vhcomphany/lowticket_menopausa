const fs = require('fs');

const path = 'src/data/supplements.ts';
let content = fs.readFileSync(path, 'utf8');

// Remove from Interface
content = content.replace(/\s*emoji:\s*string;/g, '');

// Remove from SUPPLEMENTS
content = content.replace(/\s*emoji:\s*'[^\']+',?/g, '');

// Some specific emoji replacements in GROUP_LABELS
content = content.replace(/[']??\s*Fogachos[']/g, '\'Fogachos\'');
content = content.replace(/[']??\s*Sono\s*e\s*Ansiedade[']/g, '\'Sono e Ansiedade\'');
content = content.replace(/[']?\s*Energia\s*e\s*Cansaço[']/g, '\'Energia e Cansaço\'');
content = content.replace(/[']??\s*Libido\s*e\s*Secura[']/g, '\'Libido e Secura\'');
content = content.replace(/[']?\s*Cabelo\s*e\s*Unhas[']/g, '\'Cabelo e Unhas\'');
content = content.replace(/[']??\s*Ossos\s*e\s*Articulações[']/g, '\'Ossos e Articulações\'');
content = content.replace(/[']??\s*Coração\s*e\s*Circulação[']/g, '\'Coração e Circulação\'');
content = content.replace(/[']??\s*Humor\s*e\s*Memória[']/g, '\'Humor e Memória\'');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed supplements.');
