const fs = require('fs');

async function dump() {
  const url = 'https://managr.in/_next/static/chunks/294_gvjo-t13n.js';
  const res = await fetch(url);
  const text = await res.text();
  const strings = text.match(/"([^"\\]{5,250})"/g) || [];
  const clean = strings.map(s => s.slice(1, -1)).filter(s => /[a-zA-Z]{3,}\s+[a-zA-Z]{2,}/.test(s));
  fs.writeFileSync('scripts/chunk_294.txt', clean.join('\n'));
  console.log('Wrote scripts/chunk_294.txt, count:', clean.length);
}
dump();
