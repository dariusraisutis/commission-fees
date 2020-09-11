const transaction = require('../modules/Transaction');
const apiConfigProvider = require('./ApiConfigProvider');
const utils = require('../utils/Utils');

const getFees = (currentTransaction, transactionHistory) => {
    return new Promise((resolve, reject) => {
        if (utils.isObjectEmpty(currentTransaction)) {
            reject(new Error('calculateFees() Transaction object is empty'));
        }
        const { type: transactionType, user_type: userType } = currentTransaction;
        apiConfigProvider.getApiConfig(transactionType, userType)
            .then((apiConfig) => {
                let commisionFee = transaction.calculateFees(currentTransaction, transactionHistory, apiConfig);
                resolve(commisionFee);
            })
            .catch((error) => {
                reject(new Error(`calculateFees() ${error}`));
            });
    });
}

module.exports = { getFees };
