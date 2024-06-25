import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = await open({
  filename: join(__dirname, './a01_teste.db'),
  driver: sqlite3.Database
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS Mega (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    num1 INTEGER,
    num2 INTEGER,
    num3 INTEGER,
    num4 INTEGER,
    num5 INTEGER,
    num6 INTEGER
  )
`);

export default db;
