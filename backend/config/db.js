const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

let db;
let isSqlite = false;

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('sqlite')) {
  isSqlite = true;
  const sqlite3 = require('sqlite3').verbose();
  let dbPath = path.resolve(__dirname, '../../database.sqlite');
  if (process.env.RENDER) {
    dbPath = '/tmp/database.sqlite';
  }
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Sqlite connection error:', err);
    else console.log('Connected to SQLite database at', dbPath);
  });
} else {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = pool;
}

// Unified query wrapper
const query = (text, params) => {
  if (isSqlite) {
    // Convert $1, $2 to ?, ? for SQLite
    const sqliteSql = text.replace(/\$\d+/g, '?');
    return new Promise((resolve, reject) => {
      // Use .all for SELECT, .run for INSERT/UPDATE
      if (sqliteSql.trim().toUpperCase().startsWith('SELECT')) {
        db.all(sqliteSql, params, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows });
        });
      } else {
        db.run(sqliteSql, params, function(err) {
          if (err) reject(err);
          else resolve({ rows: [{ id: this.lastID }], lastID: this.lastID });
        });
      }
    });
  } else {
    return db.query(text, params);
  }
};

module.exports = {
  query,
  isSqlite,
  db
};
