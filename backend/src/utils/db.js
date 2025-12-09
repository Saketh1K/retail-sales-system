const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbName = process.env.DB_FILE_NAME || 'sales.db';
const dbPath = path.resolve(__dirname, '../../', dbName);

const db = new sqlite3.Database(dbPath, process.env.DB_FILE_NAME ? sqlite3.OPEN_READONLY : sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log(`Connected to SQLite database: ${dbName}`);
        if (!process.env.DB_FILE_NAME) {
            db.run("PRAGMA journal_mode = WAL;");
        }
    }
});

module.exports = db;
