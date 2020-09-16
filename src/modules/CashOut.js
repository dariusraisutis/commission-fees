import { isObjectEmpty } from '../utils/Utils';

const cashOut = (userType, amount, apiConfig, transactionHistory) => {
    if (!userType) {
        throw new Error(`cashOut() userType is invalid. ${userType}`);
    }
    if (!amount || isNaN(amount) || amount < 0) {
        throw new Error(`cashOut() Invalid operation amount. ${amount}`);
    }
    if (isObjectEmpty(apiConfig)) {
        throw new Error('cashOut() Api Config is empty.');
    }
    if (!Array.isArray(transactionHistory)) {
        throw new Error('cashOut() Transaction history is invalid.');
    }
    let commissionFee = 0;
    switch (userType) {
        case 'natural': {
            commissionFee = cashOutNatural(amount, apiConfig, transactionHistory);
            break;
        }
        case 'juridical': {
            commissionFee = cashOutJuridical(amount, apiConfig);
            break;
        }
        default: {
            throw new Error(`cashOut() user type is invalid. User type: ${userType}`);
        }
    }
    return commissionFee;
}

const cashOutNatural = (amount, apiConfig, transactionHistory) => {
    let totalCashOut = 0;
    if (transactionHistory.length !== 0) {
        transactionHistory.map(({ operation: { amount } }) => {
            totalCashOut += amount;
        });
    }
    const { percents, week_limit: { amount: weekLimit } } = apiConfig;
    const feesToChargeOn = getFeesToChargeOn(amount, totalCashOut, weekLimit);
    if (feesToChargeOn === 0) {
        return 0;
    }
    return feesToChargeOn / 100 * percents;
}

const cashOutJuridical = (amount, apiConfig) => {
    const { percents, min: { amount: minAmount } } = apiConfig;
    const commissionFee = amount / 100 * percents;
    return commissionFee < minAmount ? minAmount : commissionFee;
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

export {
    cashOut,
    cashOutNatural,
    cashOutJuridical,
    getFeesToChargeOn
};