const transaction = require('../modules/Transaction')
const apiConfigProvider = require('./ApiConfigProvider');
const utils = require('../utils/Utils');

const getFees = (currentTransaction, transactionHistory) => {
    return new Promise((resolve, reject) => {
        if (utils.isObjectEmpty(currentTransaction)) {
            reject(new Error('getFees() Transaction object is empty'));
        }
        const { type: transactionType, user_type: userType, operation: { currency } } = currentTransaction;
        if (!utils.isSupportedCurrency(currency)) {
            reject(new Error(`getFees() Operation currency is not supported. Currency ${currency}`));
        }
        apiConfigProvider.getApiConfig(transactionType, userType)
            .then((apiConfig) => {
                let commisionFee = transaction.calculateFees(currentTransaction, transactionHistory, apiConfig);
                resolve(commisionFee);
            })
            .catch((error) => {
                reject(new Error(`getFees() ${error}`));
            });
    });
}

const getPromises = (fileData) => {
    if (fileData.length === 0) {
        throw new Error(`getPromises() fileData is empty`);
    }
    let promiseArray = [];
    fileData.map((currentTransaction) => {
        const { user_type: userType, user_id: userId, type, date } = currentTransaction;
        let transactionProps = {
            array: fileData,
            date,
            userId,
            userType,
            type,
            index: fileData.indexOf(currentTransaction)
        };
        transaction.checkTransactionProps(transactionProps);
        let transactionHistory = transaction.getTransactionHistory(transactionProps);
        let promiseFunction = getFees(currentTransaction, transactionHistory);
        return promiseArray.push(promiseFunction);
    });
    return promiseArray;
}

const getAllFees = (arrayOfPromises) => {
    return new Promise((resolve, reject) => {
        if (arrayOfPromises.length === 0) {
            reject(new Error('getAllFees() Promise array is empty'));
        }
        Promise.all(arrayOfPromises)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    })
}

module.exports = {
    getFees,
    getPromises,
    getAllFees
};
