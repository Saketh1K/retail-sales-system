
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Determine DB file: Env Var -> sales.db (if exists) -> sales_demo.db
let dbName = process.env.DB_FILE_NAME;
if (!dbName) {
    if (fs.existsSync(path.resolve(__dirname, '../../sales.db'))) {
        dbName = 'sales.db';
    } else {
        dbName = 'sales_demo.db';
    }
}

const dbPath = path.resolve(__dirname, '../../', dbName);
const isReadOnly = (process.env.NODE_ENV === 'production');

const db = new sqlite3.Database(dbPath, isReadOnly ? sqlite3.OPEN_READONLY : sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(`Could not connect to database at ${dbPath}`, err);
    } else {
        try {
            const stats = fs.statSync(dbPath);
            console.log(`Connected to SQLite database: ${dbName} at ${dbPath} (Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB, ReadOnly: ${isReadOnly})`);
        } catch (e) {
            console.log(`Connected to SQLite database: ${dbName} (Size check failed, ReadOnly: ${isReadOnly})`);
        }

        if (!isReadOnly) {
            db.run("PRAGMA journal_mode = WAL;");
        }
    }
});

module.exports = db;
