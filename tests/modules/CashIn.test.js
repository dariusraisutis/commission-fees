const cashIn = require('../../src/modules/CashIn');

describe('CashIn Tests', () => {
    let apiConfig = {
        percents: 0.03,
        max: {
            amount: 5,
            currency: 'GBP'
        }
    };
    it('Should throw error when amount is null', () => {
        expect(() => {
            cashIn.cashIn(null, 'EUR', apiConfig);
        }).toThrow('cachIn() invalid operation amount. null');
    })

    it('Should throw error when amount is undefined', () => {
        expect(() => {
            cashIn.cashIn(undefined, 'EUR', apiConfig);
        }).toThrow('cachIn() invalid operation amount. undefined');
    })

    it('Should throw error when amount is 0', () => {
        expect(() => {
            cashIn.cashIn(0, 'EUR', apiConfig);
        }).toThrow('cachIn() invalid operation amount. 0');
    })

    it('Should throw error when amount is less than 0', () => {
        expect(() => {
            cashIn.cashIn(-1, 'EUR', apiConfig);
        }).toThrow('cachIn() invalid operation amount. -1');
    })

    it('Should throw error when amount string value', () => {
        expect(() => {
            cashIn.cashIn('hello','EUR', apiConfig);
        }).toThrow('cachIn() invalid operation amount. hello');
    })

    it('Should throw error when Api config is empty', () => {
        expect(() => {
            cashIn.cashIn(200,'EUR', {});
        }).toThrow('cachIn() Api Config is empty');
    })

    it('Should return max amount when cashIn amount is more than max', () => {
        let result = cashIn.cashIn(1000000, 'EUR',apiConfig);
        expect(result).toBe('5.00');
    })

    it('Should return commission fee when fee is less than max amount', () => {
        let result = cashIn.cashIn(1000,'EUR', apiConfig);
        expect(result).toBe('0.30');
    })
})