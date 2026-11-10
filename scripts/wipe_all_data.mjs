/**
 * STAYWISE — COMPLETE DATABASE PURGE SCRIPT
 * Deletes all rows from every table in database.db
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database.db');
console.log('Connecting to database:', DB_PATH);
const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA foreign_keys = OFF;');
db.exec('PRAGMA journal_mode = WAL;');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

console.log(`Found ${tables.length} tables to wipe.`);

for (const t of tables) {
  try {
    db.exec(`DELETE FROM "${t.name}";`);
    console.log(`Cleared: ${t.name}`);
  } catch (err) {
    console.error(`Error clearing ${t.name}:`, err.message);
  }
}

db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
db.exec('VACUUM;');

console.log('\n--- VERIFYING TABLE ROW COUNTS ---');
let totalRows = 0;
for (const t of tables) {
  const count = db.prepare(`SELECT count(*) as c FROM "${t.name}"`).get().c;
  console.log(`${t.name.padEnd(34)}: ${count}`);
  totalRows += count;
}

console.log(`\nTotal rows across all tables: ${totalRows}`);
if (totalRows === 0) {
  console.log('✅ ALL DATA IN ALL TABLES HAS BEEN COMPLETELY DELETED!');
} else {
  console.warn(`⚠️ Warning: ${totalRows} rows still remain.`);
}

