const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbName = process.env.DB_FILE_NAME || (process.env.NODE_ENV === 'production' ? 'sales_demo.db' : 'sales.db');
const dbPath = path.resolve(__dirname, '../../', dbName);
const isReadOnly = (process.env.NODE_ENV === 'production' || process.env.DB_FILE_NAME);

const db = new sqlite3.Database(dbPath, isReadOnly ? sqlite3.OPEN_READONLY : sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(`Could not connect to database at ${dbPath}`, err);
    } else {
        console.log(`Connected to SQLite database: ${dbName} at ${dbPath} (ReadOnly: ${isReadOnly})`);
        if (!isReadOnly) {
            db.run("PRAGMA journal_mode = WAL;");
        }
    }
});

module.exports = db;
