const utils = require('../utils/Utils');
const calculateFees = (transactionObj, transactionHistory, apiConfig) => {
    if (utils.isObjectEmpty(transactionObj)) {
        throw new Error('transaction() Transaction object is empty');
    }
    const { type: transactionType, user_type: userType, operation: { amount, currency } } = transactionObj || {};
    let commissionFee = 0;
    switch (transactionType) {
        case 'cash_in': {
            commissionFee = cashIn(amount, currency, apiConfig);
            break;
        }
        case 'cash_out': {
            commissionFee = cashOut(userType, amount, currency, apiConfig, transactionHistory);
            break;
        }
        default: {
            throw new Error(`transaction() invalid transaction type. Transaction type : ${transactionType}`);
        }
    }
    return commissionFee;
}

const cashIn = (amount, currency, apiConfig) => {
    let commissionFee = 0;
    if (!amount) {
        throw new Error(`cachIn() operation amount is empty. ${amount}`);
    }
    const { max: { amount: maxAmount }, percents } = apiConfig;
    commissionFee = utils.round(amount / 100 * percents, 2).toFixed(2);
    return commissionFee <= maxAmount ? commissionFee : maxAmount.toFixed(2);
}

const cashOut = (userType, amount, currency, apiConfig, transactionHistory) => {
    let commissionFee = 0;
    switch (userType) {
        case 'natural': {
            commissionFee = cashOutNatural(amount, currency, apiConfig, transactionHistory);
            break;
        }
        case 'juridical': {
            commissionFee = cashOutJuridical(amount, currency, apiConfig);
            break;
        }
        default: {
            throw new Error(`cashOut() user type is invalid. User type: ${userType}`);
        }
    }
    return commissionFee;
}

const cashOutNatural = (amount, currency, apiConfig, transactionHistory) => {
    const { percents, week_limit: { amount: weekLimit } } = apiConfig || {};
    let commisionFee = 0;
    let totalCashOut = 0;
    if (transactionHistory.length != 0) {
        transactionHistory.map(({ operation: { amount } }) => {
            totalCashOut += amount;
        });
    }
    let feesToChargeOn = getFeesToChargeOn(amount, totalCashOut, weekLimit);
    if (feesToChargeOn === 0) {
        return commisionFee.toFixed(2);
    }
    return utils.round(feesToChargeOn / 100 * percents, 2).toFixed(2);
}

const cashOutJuridical = (amount, currency, apiConfig) => {
    const { percents, min: { amount: minAmount } } = apiConfig || {};
    let commissionFee = 0;
    commissionFee = amount / 100 * percents;
    return commissionFee < minAmount ? minAmount : utils.round(commissionFee, 2).toFixed();
}


const getFeesToChargeOn = (amount, totalCashout, weekLimit) => {
    if (totalCashout >= weekLimit) {
        return amount;
    }
    if (weekLimit < totalCashout) {
        weekLimit = utils.round(weekLimit -= totalCashout, 2);
    }
    return amount <= weekLimit ? 0 : amount - weekLimit; 
}

const getTransactionWeekRange = (date) => {
    const rules = [7, 1, 2, 3, 4, 5, 6];
    let transactionDate = new Date(date);
    let daysPassedInCurrentWeek = rules[transactionDate.getDay()] - 1;
    let mondayOfTheWeek = transactionDate.setDate(transactionDate.getDate() - daysPassedInCurrentWeek);
    return mondayOfTheWeek;
}

const getTransactionHistory = ({ array, date, userId, userType, type, index }) => {
    const transactionHistory = array.slice(0, index);
    return transactionHistory.filter((element) => {
        let monday = new Date(getTransactionWeekRange(date));
        let currentTransactionDate = new Date(date);
        let passedTransactionDate = new Date(element.date);
        return (element.user_type === userType)
            && (element.user_id === userId)
            && (element.type === type)
            && (passedTransactionDate >= monday && passedTransactionDate <= currentTransactionDate);
    });
}

module.exports = {
    calculateFees,
    getTransactionWeekRange,
    getTransactionHistory
}

