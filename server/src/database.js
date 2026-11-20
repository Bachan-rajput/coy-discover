const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "coy.db");

const db = new Database(dbPath);

// Enable foreign key support
db.pragma("foreign_keys = ON");

// Create profiles table
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    photo TEXT,
    bio TEXT,
    city TEXT,
    college TEXT,
    interests TEXT,
    likedYou INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS swipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profileId INTEGER NOT NULL UNIQUE,
    action TEXT NOT NULL CHECK(action IN ('like', 'pass')),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profileId) REFERENCES profiles(id)
  );
`);

console.log("Coy Discover SQLite database connected!");

module.exports = db;
