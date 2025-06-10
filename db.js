const Database = require('better-sqlite3');
const db = new Database('scores.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS individuals (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT
  );
  
  CREATE TABLE IF NOT EXISTS criteria (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY,
    individual_id INTEGER,
    judge_id INTEGER,
    criterion_id INTEGER,
    score INTEGER CHECK(score BETWEEN 1 AND 10),
    FOREIGN KEY(individual_id) REFERENCES individuals(id),
    FOREIGN KEY(criterion_id) REFERENCES criteria(id)
  );
`);

module.exports = db;