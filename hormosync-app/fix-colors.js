const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files = files.concat(walk(full));
    else if (f.endsWith('.tsx') || f.endsWith('.ts')) files.push(full);
  }
  return files;
}

const replacements = [
  ["color: '#F0EAF5'", "color: 'var(--text-primary)'"],
  ['color: "#F0EAF5"', 'color: "var(--text-primary)"'],
  ["color: '#C8B8DC'", "color: 'var(--text-secondary)'"],
  ["color: '#9B8FA8'", "color: 'var(--text-muted)'"],
  ["color: '#8A7A9E'", "color: 'var(--text-muted)'"],
  ["background: 'rgba(0,0,0,0.2)'", "background: 'var(--bg-glass2)'"],
  ["background: 'rgba(0,0,0,0.1)'", "background: 'var(--bg-glass)'"],
  ["background: 'rgba(255,255,255,0.04)'", "background: 'var(--bg-glass)'"],
  ["background: 'rgba(255,255,255,0.05)'", "background: 'var(--bg-glass)'"],
  ["background: 'rgba(255,255,255,0.03)'", "background: 'var(--bg-glass)'"],
  ["background: 'rgba(255,255,255,0.08)'", "background: 'var(--bg-glass2)'"],
  ["background: 'rgba(255,255,255,0.06)'", "background: 'var(--bg-glass2)'"],
  ["'rgba(255,255,255,0.1)'", "'var(--bg-glass2)'"],
];

let filesChanged = 0;
for (const file of walk('src')) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  for (const [from, to] of replacements) {
    while (content.includes(from)) {
      content = content.replace(from, to);
    }
  }
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    filesChanged++;
    console.log('Fixed: ' + file);
  }
}
console.log('Done. Files changed: ' + filesChanged);
