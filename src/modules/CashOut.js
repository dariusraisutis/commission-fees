const utils = require("../utils/Utils");

const cashOut = (userType, amount, currency, apiConfig, transactionHistory) => {
    if (!userType) {
        throw new Error(`cashOut() userType is invalid. ${userType}`);
    }
    if (!amount || isNaN(amount) || amount < 0) {
        throw new Error(`cashOut() Invalid operation amount. ${amount}`);
    }
    if (utils.isObjectEmpty(apiConfig)) {
        throw new Error('cashOut() Api Config is empty.');
    }
    if (!Array.isArray(transactionHistory)) {
        throw new Error('cashOut() Transaction history is invalid.');
    }
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
    const { percents, week_limit: { amount: weekLimit } } = apiConfig;
    let commisionFee = 0;
    let totalCashOut = 0;
    if (transactionHistory.length !== 0) {
        transactionHistory.map(({ operation: { amount } }) => {
            totalCashOut += amount;
        });
    }
    let feesToChargeOn = getFeesToChargeOn(amount, totalCashOut, weekLimit);
    let decimalPoints = utils.getCurrencyValueByName(currency);
    if (feesToChargeOn === 0) {
        return commisionFee.toFixed(decimalPoints);
    }
    return utils.round(feesToChargeOn / 100 * percents, decimalPoints).toFixed(decimalPoints);
}

const cashOutJuridical = (amount, currency, apiConfig) => {
    const { percents, min: { amount: minAmount } } = apiConfig;
    let decimalPoints = utils.getCurrencyValueByName(currency);
    let commissionFee = amount / 100 * percents;
    return commissionFee < minAmount ? minAmount.toFixed(decimalPoints) : utils.round(commissionFee, decimalPoints).toFixed(decimalPoints);
}

const getFeesToChargeOn = (amount, totalCashout, weekLimit) => {
    if (totalCashout >= weekLimit) {
        return amount;
    } else if ((totalCashout + amount) <= weekLimit) {
        return 0;
    } else {
        return (totalCashout + amount) - weekLimit;
    }
}

module.exports = {
    cashOut,
    cashOutNatural,
    cashOutJuridical,
    getFeesToChargeOn
}