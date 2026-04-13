const { query, isSqlite } = require('./config/db');

const initDb = async () => {
  const serialType = isSqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'SERIAL PRIMARY KEY';
  const jsonType = isSqlite ? 'TEXT' : 'JSONB';
  const timestampType = isSqlite ? 'DATETIME DEFAULT CURRENT_TIMESTAMP' : 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP';

  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id ${serialType},
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      profile_photo TEXT,
      created_at ${timestampType}
    )`,
    `CREATE TABLE IF NOT EXISTS resumes (
      id ${serialType},
      user_id INTEGER REFERENCES users(id),
      file_url TEXT,
      extracted_text TEXT,
      created_at ${timestampType}
    )`,
    `CREATE TABLE IF NOT EXISTS jobs (
      id ${serialType},
      description_text TEXT NOT NULL,
      created_at ${timestampType}
    )`,
    `CREATE TABLE IF NOT EXISTS analysis (
      id ${serialType},
      user_id INTEGER REFERENCES users(id),
      resume_id INTEGER REFERENCES resumes(id),
      job_id INTEGER REFERENCES jobs(id),
      match_score INTEGER,
      domain VARCHAR(100),
      missing_skills ${jsonType},
      suggestions ${jsonType},
      strengths ${jsonType},
      weaknesses ${jsonType},
      ats_check ${jsonType},
      suggested_projects ${jsonType},
      section_feedback ${jsonType},
      created_at ${timestampType}
    )`
  ];

  try {
    for (let q of queries) {
      await query(q, []);
    }

    // Handle updates to existing tables (specifically for SQLite since it was already initialized)
    if (isSqlite) {
      try { await query('ALTER TABLE users ADD COLUMN phone VARCHAR(20)', []); } catch (e) {}
      try { await query('ALTER TABLE users ADD COLUMN profile_photo TEXT', []); } catch (e) {}
      try { await query('ALTER TABLE analysis ADD COLUMN domain VARCHAR(100)', []); } catch (e) {}
      try { await query('ALTER TABLE analysis ADD COLUMN suggested_projects TEXT', []); } catch (e) {}
      try { await query('ALTER TABLE analysis ADD COLUMN section_feedback TEXT', []); } catch (e) {}
    }

    console.log('Database initialized successfully (' + (isSqlite ? 'SQLite' : 'PostgreSQL') + ')');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

if (require.main === module) {
  initDb().then(() => process.exit());
}

module.exports = initDb;
