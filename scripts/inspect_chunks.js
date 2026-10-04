const fs = require('fs');

async function main() {
  const html = fs.readFileSync('scripts/managr_full.html', 'utf8');
  const scriptSrcs = (html.match(/src="(\/_next\/static\/chunks\/[^"]+)"/g) || []).map(s => s.replace('src="', '').replace('"', ''));
  console.log('Script chunks count:', scriptSrcs.length);

  for (const chunk of scriptSrcs) {
    try {
      const url = 'https://managr.in' + chunk;
      const res = await fetch(url);
      const text = await res.text();
      console.log(`Chunk ${chunk}: length ${text.length}`);
      
      // Search for text strings inside the chunk
      const strings = text.match(/"([^"\\]{15,120})"/g) || [];
      const interesting = strings.map(s => s.replace(/"/g, '')).filter(s => 
        !s.includes('webpack') &&
        !s.includes('chunk') &&
        !s.includes('react') &&
        !s.includes('svg') &&
        !s.includes('http') &&
        !s.includes('flex') &&
        !s.includes('text-') &&
        !s.includes('bg-') &&
        !s.includes('border-') &&
        /[a-z]{3,}\s+[a-z]{3,}/i.test(s)
      );
      if (interesting.length > 0) {
        console.log(`--- Interesting strings in ${chunk} (${interesting.length}) ---`);
        console.log(interesting.slice(0, 15).join('\n'));
      }
    } catch (e) {
      console.error('Error fetching ' + chunk, e.message);
    }
  }
}

main();
