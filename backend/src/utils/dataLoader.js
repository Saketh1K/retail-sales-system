const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const DATA_PATH = 'D:\\truestate\\truestate_assignment_dataset.csv';

let salesData = [];

const loadData = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(DATA_PATH)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        salesData = results;
        console.log(`Data loaded successfully. Total records: ${salesData.length}`);
        resolve(salesData);
      })
      .on('error', (error) => {
        console.error('Error loading CSV data:', error);
        reject(error);
      });
  });
};

const getData = () => salesData;

module.exports = { loadData, getData };
