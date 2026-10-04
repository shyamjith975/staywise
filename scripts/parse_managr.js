const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\44b7423e-19b3-4b73-81c1-c514b094e1f3\\.system_generated\\steps\\5030\\content.md', 'utf8');

// Match all string literals inside self.__next_f.push([1, "..."])
const regex = /self\.__next_f\.push\(\[1,"(.*?)"\]\)/gs;
let match;
let fullDecoded = '';

while ((match = regex.exec(content)) !== null) {
  try {
    const decoded = JSON.parse('"' + match[1] + '"');
    fullDecoded += decoded + '\n';
  } catch (e) {
    fullDecoded += match[1] + '\n';
  }
}

fs.writeFileSync('C:\\Users\\Lenovo\\Documents\\Staywise\\scripts\\managr_decoded.txt', fullDecoded);
console.log('Decoded text size:', fullDecoded.length);

// Extract clean human-readable text strings
const cleanStrings = fullDecoded.match(/[A-Za-z0-9][A-Za-z0-9 ,.?!':;()—\-\/₹%+]{4,}/g) || [];
const uniqueStrings = Array.from(new Set(cleanStrings)).filter(s => 
  !s.startsWith('chunks/') && 
  !s.startsWith('static/') && 
  !s.includes('__next') && 
  !s.includes('class') && 
  !s.includes('style') &&
  !s.includes('width') &&
  s.length > 8
);

fs.writeFileSync('C:\\Users\\Lenovo\\Documents\\Staywise\\scripts\\managr_clean_text.txt', uniqueStrings.join('\n'));
console.log('Clean text strings count:', uniqueStrings.length);
