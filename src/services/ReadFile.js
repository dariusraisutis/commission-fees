const fs = require('fs');
const utils = require('../utils/Utils');

const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        if (!filePath) {
            reject(new Error('readFile() Please provide file path!'));
        }
        fs.readFile(filePath, (error, data) => {
            if (error) {
                reject(new Error(`readFile() Error occured when reading file. ${error.message}`));
            }
            try {
                let file = JSON.parse(data);
                if (Array.isArray(file) && file.length === 0 || utils.isObjectEmpty(file)) {
                    reject(new Error('readFile() File contents are empty.'));
                }
                if (!Array.isArray(file) && !utils.isObjectEmpty(file)) {
                    let singleValueArray = [];
                    singleValueArray.push(file);
                    resolve(singleValueArray);
                }
                resolve(file);
            } catch (error) {
                reject(new Error(`readFile() Error occured when parsing input file. ${error.message})`));
            }
        });
    });
}

module.exports = { readFile };
