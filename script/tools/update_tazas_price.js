const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../../productos/tazas');
const enc = 'utf8';

function walkDir(dirPath) {
  return fs.readdirSync(dirPath).reduce((acc, name) => {
    const filePath = path.join(dirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      acc = acc.concat(walkDir(filePath));
    } else if (stat.isFile() && path.extname(name).toLowerCase() === '.html') {
      acc.push(filePath);
    }
    return acc;
  }, []);
}

const files = walkDir(dir);
console.log(`Found ${files.length} .html files in productos/tazas`);

const patterns = [
  {from:/value="8000"/g, to:'value="8500"'},
  {from:/value="8500"/g, to:'value="8500"'}, // normalize (no-op)
  {from:/\$8\.000/g, to:'$8.500'},
  {from:/\$8000/g, to:'$8.500'},
  {from:/\$8500/g, to:'$8.500'}
];

files.forEach(file => {
  let original = fs.readFileSync(file, enc);
  let modified = original;

  patterns.forEach(p => {
    modified = modified.replace(p.from, p.to);
  });

  if (modified !== original) {
    // write backup
    fs.writeFileSync(file + '.bak', original, enc);
    fs.writeFileSync(file, modified, enc);
    console.log('Updated', file);
  }
});

console.log('Done. Check .bak files for backups.');
