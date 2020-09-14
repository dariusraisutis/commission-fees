const feesProvider = require('../services/FeesProvider');
const fileReader = require('../services/ReadFile');

const run = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      reject(new Error('File path was not provided'));
    }
    fileReader.readFile(filePath)
      .then((result) => {
        feesProvider.getAllFees(feesProvider.getPromises(result))
          .then((fees) => {
            resolve(fees);
          })
          .catch((error) => {
            reject(error.message);
          })
      })
      .catch((error) => {
        reject(error.message);
      })
  })
}

module.exports = { run };