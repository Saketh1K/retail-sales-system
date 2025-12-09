
process.env.DB_FILE_NAME = 'sales_demo.db';
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../utils/db');

const csvPath = path.resolve(__dirname, '../../../truestate_assignment_dataset.csv');

function createTable() {
    return new Promise((resolve, reject) => {
        const sql = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id TEXT,
        date TEXT,
        customer_id TEXT,
        customer_name TEXT,
        phone TEXT,
        gender TEXT,
        age INTEGER,
        region TEXT,
        customer_type TEXT,
        product_id TEXT,
        product_name TEXT,
        brand TEXT,
        category TEXT,
        tags TEXT,
        quantity INTEGER,
        price REAL,
        discount REAL,
        total_amount REAL,
        final_amount REAL,
        payment_method TEXT,
        status TEXT,
        delivery_type TEXT,
        store_id TEXT,
        store_location TEXT,
        salesperson_id TEXT,
        employee_name TEXT
      );
    `;
        db.run(sql, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function clearTable() {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM transactions", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function seedDemo() {
    console.log(`Seeding Demo DB: ${process.env.DB_FILE_NAME}`);
    try {
        await createTable();
        await clearTable();

        console.log("Reading CSV...");
        const stream = fs.createReadStream(csvPath).pipe(csv());
        const LIMIT = 5000;
        let count = 0;
        let batch = [];
        const BATCH_SIZE = 1000;

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            const stmt = db.prepare(`INSERT INTO transactions (
                transaction_id, date, customer_id, customer_name, phone, gender, age, region, customer_type,
                product_id, product_name, brand, category, tags, quantity, price, discount, total_amount,
                final_amount, payment_method, status, delivery_type, store_id, store_location, salesperson_id, employee_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

            stream.on('data', (row) => {
                if (count >= LIMIT) {
                    stream.destroy(); // Stop reading
                    return;
                }

                batch.push(row);
                count++;

                if (batch.length >= BATCH_SIZE) {
                    batch.forEach(r => {
                        stmt.run([
                            r['Transaction ID'], r['Date'], r['Customer ID'], r['Customer Name'], r['Phone Number'],
                            r['Gender'], parseInt(r['Age']) || 0, r['Customer Region'], r['Customer Type'],
                            r['Product ID'], r['Product Name'], r['Brand'], r['Product Category'], r['Tags'],
                            parseInt(r['Quantity']) || 0, parseFloat(r['Price per Unit']) || 0, parseFloat(r['Discount Percentage']) || 0,
                            parseFloat(r['Total Amount']) || 0, parseFloat(r['Final Amount']) || 0, r['Payment Method'],
                            r['Order Status'], r['Delivery Type'], r['Store ID'], r['Store Location'],
                            r['Salesperson ID'], r['Employee Name']
                        ]);
                    });
                    batch = [];
                    process.stdout.write('.');
                }
            });

            stream.on('close', () => {
                finalize(stmt, batch);
            });

            stream.on('end', () => {
                finalize(stmt, batch);
            });

            stream.on('error', (err) => {
                console.error(err);
            });

            let finalized = false;
            function finalize(stmt, remainingBatch) {
                if (finalized) return;
                finalized = true;

                if (remainingBatch.length > 0) {
                    remainingBatch.forEach(r => {
                        stmt.run([
                            r['Transaction ID'], r['Date'], r['Customer ID'], r['Customer Name'], r['Phone Number'],
                            r['Gender'], parseInt(r['Age']) || 0, r['Customer Region'], r['Customer Type'],
                            r['Product ID'], r['Product Name'], r['Brand'], r['Product Category'], r['Tags'],
                            parseInt(r['Quantity']) || 0, parseFloat(r['Price per Unit']) || 0, parseFloat(r['Discount Percentage']) || 0,
                            parseFloat(r['Total Amount']) || 0, parseFloat(r['Final Amount']) || 0, r['Payment Method'],
                            r['Order Status'], r['Delivery Type'], r['Store ID'], r['Store Location'],
                            r['Salesperson ID'], r['Employee Name']
                        ]);
                    });
                }
                stmt.finalize();
                db.run("COMMIT", () => {
                    console.log(`\nImport Complete! Imported ${count} records.`);
                    // Indexes
                    db.run("CREATE INDEX IF NOT EXISTS idx_customer_name ON transactions(customer_name)");
                    db.run("CREATE INDEX IF NOT EXISTS idx_phone ON transactions(phone)");
                    db.run("CREATE INDEX IF NOT EXISTS idx_cat ON transactions(category)");
                    db.run("CREATE INDEX IF NOT EXISTS idx_region ON transactions(region)");
                    db.run("CREATE INDEX IF NOT EXISTS idx_date ON transactions(date)");
                });
            }
        });

    } catch (err) {
        console.error(err);
    }
}

seedDemo();
