const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../sales.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err); // Log error if connection fails
    } else {
        // console.log('Connected to SQLite database'); // Silent success for cleaner logs
        db.run("PRAGMA journal_mode = WAL;"); // Enable WAL mode for concurrency
    }
});

module.exports = db;
