
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const zipPath = path.resolve(__dirname, '../../sales_full.zip');
const outputDir = path.resolve(__dirname, '../../');
const dbPath = path.resolve(outputDir, 'sales.db');

console.log('Checking for full database zip...');

if (fs.existsSync(zipPath)) {
    console.log(`Found sales_full.zip (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(2)} MB)`);
    console.log('Extracting database using system unzip (memory efficient)...');

    try {
        // Use native CLI unzip to avoid loading file into Node.js heap (fixes OOM)
        execSync(`unzip -o "${zipPath}" -d "${outputDir}"`);
        console.log('System extraction successful.');

        if (fs.existsSync(dbPath)) {
            console.log(`Restored sales.db (${(fs.statSync(dbPath).size / 1024 / 1024).toFixed(2)} MB)`);
        } else {
            console.error('Extraction finished but sales.db not found!');
        }

    } catch (err) {
        console.error('System unzip failed (command not found or error).');
        console.error(err.message);

        console.log('Attempting fallback to adm-zip (may OOM)...');
        try {
            const AdmZip = require('adm-zip');
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(outputDir, true);
            console.log('Fallback extraction complete.');
        } catch (err2) {
            console.error('Critical: Failed to extract database.', err2);
            // Do not exit 1, maybe let it fallback to demo db if configured in logic?
            // But logic in db.js prefers sales.db if exists.
            // If we exit 1, app crashes.
            process.exit(1);
        }
    }
} else {
    console.log('sales_full.zip not found. Skipping extraction.');
}
