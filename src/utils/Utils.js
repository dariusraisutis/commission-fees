import config from '../config/config.json';

const buildApiConfigUrl = (transactionType, userType) => {
    transactionType = transactionType.replace('_', '-');
    if (transactionType === 'cash-in') {
        return `${config.commissionFeesConfigUrl}/config/${transactionType}`;
    }
    return `${config.commissionFeesConfigUrl}/config/${transactionType}/${userType}`;
}

const getCurrencyDecimalPlaces = (currency) => {
    if(currency === null || currency === undefined || currency === '' || isNaN(currency)) {
        throw new Error('getCurrencyDecimalPlaces() currency is empty');
    }
    return currency.indexOf('.') === -1 ? 0 : currency.toString().split('.')[1].length
}

const isSupportedCurrency = (currency) => {
    if(!currency) {
        throw new Error('isSupportedCurrency() currency is empty');
    }
    const currencies = config.supportedCurrencies;
    return currencies.some(element => element.name === currency);
}

const getCurrencyValueByName = (currency) => {
    if(!isSupportedCurrency(currency)){
        throw new Error(`getCurrencyValueDecimalPlaces() currency is not supported. Currency ${currency}`);
    }
    const supportedCurrencies = config.supportedCurrencies;
    const { value } = supportedCurrencies.find(element => element.name === currency);
    return getCurrencyDecimalPlaces(value);
}

const isObjectEmpty = obj => Object.keys(obj).length === 0;

const round = (value, decimalPlaces) => Math.ceil(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

export {
    buildApiConfigUrl,
    isObjectEmpty,
    round,
    isSupportedCurrency,
    getCurrencyDecimalPlaces,
    getCurrencyValueByName
}