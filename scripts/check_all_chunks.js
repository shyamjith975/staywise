const fs = require('fs');

async function checkAllChunks() {
  const html = fs.readFileSync('scripts/managr_full.html', 'utf8');
  const scriptSrcs = (html.match(/src="(\/_next\/static\/chunks\/[^"]+)"/g) || []).map(s => s.replace('src="', '').replace('"', ''));

  let combined = '';
  for (const chunk of scriptSrcs) {
    try {
      const url = 'https://managr.in' + chunk;
      const res = await fetch(url);
      const text = await res.text();
      // Extract phrases with 3+ words
      const matches = text.match(/"([^"\\]{10,250})"/g) || [];
      const clean = matches.map(s => s.slice(1, -1)).filter(s => 
        !s.includes('{') &&
        !s.includes('function') &&
        !s.includes('class') &&
        !s.includes('style') &&
        !s.includes('webpack') &&
        !s.includes('0x') &&
        /[A-Za-z0-9]{3,}\s+[A-Za-z0-9]{2,}\s+[A-Za-z0-9]{2,}/.test(s)
      );
      if (clean.length > 0) {
        combined += `\n=== CHUNK ${chunk} (${clean.length}) ===\n` + clean.join('\n') + '\n';
      }
    } catch (e) {}
  }

  fs.writeFileSync('scripts/all_managr_chunks.txt', combined);
  console.log('Saved all_managr_chunks.txt, length:', combined.length);
}

checkAllChunks();
