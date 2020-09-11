const config = require("../config/config.json");

const buildApiConfigUrl = (transactionType, userType) => {
    transactionType = transactionType.replace('_', '-');
    if (transactionType === 'cash-in') {
        return `${config.commissionFeesConfigUrl}/config/${transactionType}`;
    }
    return `${config.commissionFeesConfigUrl}/config/${transactionType}/${userType}`;
}

const isObjectEmpty = obj => Object.keys(obj).length === 0;
const round = (value, decimalPlaces) => Math.ceil(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

module.exports = {
    buildApiConfigUrl,
    isObjectEmpty,
    round
};