import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Ensure database directory exists
const dbDir = path.join(__dirname, "../data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "database.db");
const db = new Database(dbPath);

// Enable WAL mode for performance
db.pragma("journal_mode = WAL");

// Initialize users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )
`);

// Initialize towns table
db.exec(`
  CREATE TABLE IF NOT EXISTS towns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sinhalaName TEXT,
    description TEXT NOT NULL,
    order_num INTEGER NOT NULL,
    coordinates_x REAL NOT NULL,
    coordinates_y REAL NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL
  )
`);

// Initialize places table
db.exec(`
  CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    town_id TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    details TEXT,
    contact TEXT,
    FOREIGN KEY (town_id) REFERENCES towns(id) ON DELETE CASCADE
  )
`);

export default db;
