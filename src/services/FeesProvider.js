import { calculateFees, checkTransactionProps, getTransactionHistory } from '../modules/Transaction';
import { isObjectEmpty, isSupportedCurrency, round, getCurrencyValueByName } from '../utils/Utils';
import getApiConfig from '../services/ApiConfigProvider';

const getFees = (currentTransaction, transactionHistory) => {
    return new Promise((resolve, reject) => {
        if (isObjectEmpty(currentTransaction)) {
            reject(new Error('getFees() Transaction object is empty'));
        }
        const { type: transactionType, user_type: userType, operation: { currency } } = currentTransaction;
        if (!isSupportedCurrency(currency)) {
            reject(new Error(`getFees() Operation currency is not supported. Currency ${currency}`));
        }
        getApiConfig(transactionType, userType)
            .then((apiConfig) => {
                let decimalPoints = getCurrencyValueByName(currency);
                let commisionFee = calculateFees(currentTransaction, transactionHistory, apiConfig);
                resolve(round(commisionFee, decimalPoints).toFixed(decimalPoints));
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
        checkTransactionProps(transactionProps);
        let transactionHistory = getTransactionHistory(transactionProps);
        let promiseFunction = getFees(currentTransaction, transactionHistory);
        return promiseArray.push(promiseFunction);
    });
    return promiseArray;
}

const getAllFees = (file) => {
    return new Promise((resolve, reject) => {
        if (file.length === 0) {
            reject(new Error('getAllFees() Promise array is empty'));
        }
        const arrayOfPromises = getPromises(file);
        Promise.all(arrayOfPromises)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    })
}

export {
    getFees,
    getPromises,
    getAllFees
};
