
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const zipPath = path.resolve(__dirname, '../../sales_full.zip');
const outputDir = path.resolve(__dirname, '../../');
const dbPath = path.resolve(outputDir, 'sales.db');

console.log('Checking for full database zip...');

if (fs.existsSync(zipPath)) {
    console.log(`Found sales_full.zip (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(2)} MB)`);
    console.log('Extracting database... This may take a few seconds.');

    try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(outputDir, true); // true = overwrite
        console.log('Database extraction complete!');

        if (fs.existsSync(dbPath)) {
            console.log(`Restored sales.db (${(fs.statSync(dbPath).size / 1024 / 1024).toFixed(2)} MB)`);
        } else {
            console.error('Extraction finished but sales.db not found!');
        }

    } catch (err) {
        console.error('Failed to unzip database:', err);
        process.exit(1);
    }
} else {
    console.log('sales_full.zip not found. Skipping extraction.');
}
