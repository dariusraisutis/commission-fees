const config = require('../../src/config/config.json');
const utils = require('../../src/utils/Utils');

describe('Utils Tests', () => {
    describe('BuildApiConfigUrl tests', () => {
        it('Should return url for cashIn', () => {
            let type = 'cash_in';
            let expected = `${config.commissionFeesConfigUrl}/config/cash-in`;
            let result = utils.buildApiConfigUrl(type, undefined);
            expect(result).toBe(expected);
        })

        it('Should return url for cashout natural', () => {
            let userType = 'natural';
            let type = 'cash_out';
            let expected = `${config.commissionFeesConfigUrl}/config/cash-out/natural`;
            let result = utils.buildApiConfigUrl(type, userType);
            expect(result).toBe(expected);
        })

        it('Should return url for cashout juridical', () => {
            let userType = 'juridical';
            let type = 'cash_out';
            let expected = `${config.commissionFeesConfigUrl}/config/cash-out/juridical`;
            let result = utils.buildApiConfigUrl(type, userType);
            expect(result).toBe(expected);
        })
    })

    describe('IsObjectEmpty Tests', () => {
        it('Should return true when object is empty', () => {
            let result = utils.isObjectEmpty({});
            expect(result).toBe(true);
        })

        it('Should return false when object is not empty', () => {
            let result = utils.isObjectEmpty({test: 'test'});
            expect(result).toBe(false);
        })
    })

    describe('Round Tests', () => {
        it('Should round number to 2 decimal places to nearest ceiled integer', () => {
            let result = utils.round(1.23658, 2);
            expect(result).toBe(1.24);
        })

        it('Should round number to 1 decimal place to nearest ceiled integer', () => {
            let result = utils.round(0.991, 2);
            expect(result).toBe(1);
        })
        
        it('Should round number to 5 decimal places to nearest ceiled integer', () => {
            let result = utils.round(56.365481, 5);
            expect(result).toBe(56.36549);
        })
    })

    describe('Supported Currencies Tests', () => {
        it('Should isSupportedCurrency throw when currency is not provided', () => {
            expect(() => {
                utils.isSupportedCurrency('');
            }).toThrow('isSupportedCurrency() currency is empty');
        })

        it('Should return false when currency is not supported', () => {
            let notSupported = utils.isSupportedCurrency('gbp');
            expect(notSupported).toBe(false);
        })

        it('Should return true when currency is supported', () => {
            let notSupported = utils.isSupportedCurrency('EUR');
            expect(notSupported).toBe(true);
        })

        it('Should throw error when currency is not provided', () => {
            expect(() => {
                utils.getCurrencyDecimalPlaces();
            }).toThrow('getCurrencyDecimalPlaces() currency is empty');
        })

        it('Should throw error when currency is not null', () => {
            expect(() => {
                utils.getCurrencyDecimalPlaces(null);
            }).toThrow('getCurrencyDecimalPlaces() currency is empty');
        })

        it('Should throw error when currency is not undefined', () => {
            expect(() => {
                utils.getCurrencyDecimalPlaces(undefined);
            }).toThrow('getCurrencyDecimalPlaces() currency is empty');
        })

        it('Should throw error when currency is not a number', () => {
            expect(() => {
                utils.getCurrencyDecimalPlaces('hello');
            }).toThrow('getCurrencyDecimalPlaces() currency is empty');
        })

        it('Should get decimal places of the currency', () => {
            let desicalPlaces = utils.getCurrencyDecimalPlaces('0.00');
            expect(desicalPlaces).toBe(2);
        })

        it('Should get decimal places as 0 when there is no decimal places', () => {
            let desicalPlaces = utils.getCurrencyDecimalPlaces('0');
            expect(desicalPlaces).toBe(0);
        })

        it('Should getCurrencyValueByName throw error when currency is not supported', () => {
            expect(() => {
                utils.getCurrencyValueByName('RUS');
            }).toThrow('getCurrencyValueDecimalPlaces() currency is not supported. Currency RUS');
        })
        it('Should get decimal place for the currency provided', () => {
            let result = utils.getCurrencyValueByName('EUR');
            expect(result).toBe(2);
        })
    })
})