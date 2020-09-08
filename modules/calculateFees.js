const axios = require('axios');
const config = require("../config/config.json")
const transaction = require('../modules/Transaction');

const calculateFees = (transactionObject, transactinHistory) => {
    if (isObjectEmpty(transactionObject)) {
        throw new Error('calculateFees() Transaction object is empty');
    }
    
    const { type: transactionType, user_type: userType, user_id, operation: {amount}, date } = transactionObject;
    return new Promise((resolve, reject) => {
        getApiConfig(transactionType, userType)
            .then((apiConfig) => {
                let userTransactionHistory = transactinHistory.filter(element => element.user_id === user_id);
                let commisionFee = transaction.transaction(transactionObject, apiConfig, userTransactionHistory);
                resolve(commisionFee);
            })
            .catch((error) => {
                reject(new Error(`calculateFees() ${error}`));
            });
    });
}

const getApiConfig = (transactionType, userType) => {
    if (transactionType === '') {
        throw new Error(`Transaction type was not provided. Transaction type: ${transactionType}`);
    }
    if (userType === '') {
        throw new Error(`User type type was not provided. User type: ${userType}`);
    }
    let requestUrl = buildApiConfigUrl(transactionType, userType);
    return new Promise((resolve, reject) => {
        axios.get(requestUrl)
            .then(({ data }) => {
                if (isObjectEmpty(data)) {
                    throw new Error('Could not retrieve commission fees configuration');
                }
                resolve(data);
            })
            .catch((error) => {
                reject(new Error(`getApiConfig() ${error.message}`));
            });
    });
}

const buildApiConfigUrl = (transactionType, userType) => {
    transactionType = transactionType.replace('_', '-');
    if (transactionType === 'cash-in') {
        return `${config.commissionFeesConfigUrl}/config/${transactionType}`;
    }
    return `${config.commissionFeesConfigUrl}/config/${transactionType}/${userType}`;
}


const isObjectEmpty = obj => Object.keys(obj).length === 0;

module.exports = {
    calculateFees
};