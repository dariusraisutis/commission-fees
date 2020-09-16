import { calculateFees, checkTransactionProps, getTransactionHistory } from '../modules/Transaction';
import { isObjectEmpty, isSupportedCurrency, round, getCurrencyValueByName } from '../utils/Utils';
import getApiConfig from '../services/ApiConfigProvider';

const getFees = async(currentTransaction, transactionHistory) => {
        if (isObjectEmpty(currentTransaction)) {
            throw new Error('getFees() Transaction object is empty');
        }
        const { type: transactionType, user_type: userType, operation: { currency } } = currentTransaction;
        if (!isSupportedCurrency(currency)) {
            new Error(`getFees() Operation currency is not supported. Currency ${currency}`);
        }
        try {
            const apiConfig = await getApiConfig(transactionType, userType);
            const decimalPoints = getCurrencyValueByName(currency);
            const commisionFee = calculateFees(currentTransaction, transactionHistory, apiConfig);
            return round(commisionFee, decimalPoints).toFixed(decimalPoints);
        } catch(error){
           throw new Error(`getFees() ${error.message}`);
        }
}

const getPromises = (fileData) => {
    if (fileData.length === 0) {
        throw new Error(`getPromises() fileData is empty`);
    }
    const promiseArray = [];
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

const getAllFees = async(file) => {
    if (file.length === 0) {
        throw new Error('getAllFees() Promise array is empty');
    }
    try {
        const arrayOfPromises = getPromises(file);
        return await Promise.all(arrayOfPromises);
    } catch(error){
        throw new Error(`getAllFees() ${error.message}`);
    }
}

export {
    getFees,
    getPromises,
    getAllFees
};
