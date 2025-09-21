const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

const base = path.join('.next');
let removed = 0;
if (fs.existsSync(base)) {
  const all = walk(base);
  for (const f of all) {
    if (f.endsWith('.hot-update.js') && f.includes('admin') && f.includes('products')) {
      try {
        fs.unlinkSync(f);
        console.log('removed', f);
        removed++;
      } catch (e) {
        console.error('failed', f, e.message);
      }
    }
  }
}
console.log('done. removed=', removed);
