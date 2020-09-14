const utils = require("../utils/Utils");

const cashIn = (amount, currency, apiConfig) => {
    if (!amount || isNaN(amount) || amount < 0) {
        throw new Error(`cachIn() invalid operation amount. ${amount}`);
    }
    if(utils.isObjectEmpty(apiConfig)){
        throw new Error('cachIn() Api Config is empty');
    }
    const { max: { amount: maxAmount }, percents } = apiConfig;
    let commissionFee = 0;
    let decimalPlace = utils.getCurrencyValueByName(currency);
    commissionFee = utils.round(amount / 100 * percents, decimalPlace).toFixed(decimalPlace);
    return commissionFee <= maxAmount ? commissionFee : maxAmount.toFixed(decimalPlace);
}

module.exports = { cashIn };