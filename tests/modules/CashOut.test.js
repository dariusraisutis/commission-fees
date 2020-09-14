const cashOut = require('../../src/modules/CashOut');

describe('CashOut Tests', () => {

    it('Should throw error when user type is null', () => {
        expect(() => {
            cashOut.cashOut(null, 23, 'EUR', {}, []);
        }).toThrow('cashOut() userType is invalid. null');
    })

    it('Should throw error when cashout amount is null', () => {
        expect(() => {
            cashOut.cashOut('natural', null,'EUR', {}, []);
        }).toThrow('cashOut() Invalid operation amount. null');
    })

    it('Should throw error when cashout amount is undefined', () => {
        expect(() => {
            cashOut.cashOut('natural', undefined,'EUR', {}, []);
        }).toThrow('cashOut() Invalid operation amount. undefined');
    })

    it('Should throw error when cashout amount is 0', () => {
        expect(() => {
            cashOut.cashOut('natural', 0, {},'EUR', []);
        }).toThrow('cashOut() Invalid operation amount. 0');
    })

    it('Should throw error when cashout amount is -1', () => {
        expect(() => {
            cashOut.cashOut('natural', -1,'EUR', {}, []);
        }).toThrow('cashOut() Invalid operation amount. -1');
    })

    it('Should throw error when cashout amount is string value', () => {
        expect(() => {
            cashOut.cashOut('natural', 'hello','EUR', {}, []);
        }).toThrow('cashOut() Invalid operation amount. hello');
    })

    it('Should throw error when ApiConfig is empty', () => {
        expect(() => {
            cashOut.cashOut('natural', 23,'EUR', {}, []);
        }).toThrow('cashOut() Api Config is empty.');
    })

    it('Should throw error when transaction history is not an array', () => {
        expect(() => {
            cashOut.cashOut('natural', 23,'EUR', { 'test': 'test' }, {});
        }).toThrow('cashOut() Transaction history is invalid.');
    })

    it('Should throw error when user type is invalid', () => {
        expect(() => {
            cashOut.cashOut('test', 23,'EUR', { 'test': 'test' }, []);
        }).toThrow('cashOut() user type is invalid. User type: test');
    })

    it('Should return commission fee for natural user', () => {
        let transactionHistory = [{ operation: { amount: 500 } }];
        let apiConfig = { percents: 0.3, week_limit: { amount: 1000 } };
        let result = cashOut.cashOut('natural', 501, 'EUR', apiConfig, transactionHistory);
        expect(result).toBe('0.01');
    })

    it('Should return commission fee for juridical user', () => {
        let apiConfig = { percents: 0.3, min: { amount: 0.5 } };
        let result = cashOut.cashOut('juridical', 500,'EUR', apiConfig, []);
        expect(result).toBe('1.50');
    })

    describe('CashOutNatural', () => {
        it('Should return commission fee as 0 when transactionHistory is empty amount===1000 weekLimit===1000', () => {
            let transactionHistory = [];
            let apiConfig = { percents: 0.3, week_limit: { amount: 1000 } };
            let result = cashOut.cashOutNatural(1000,'EUR', apiConfig, transactionHistory);
            expect(result).toBe('0.00');
        })

        it('Should return commission fee as 0 when totalCashout===0 amount===1000 weeklimit===1000', () => {
            let transactionHistory = [{ operation: { amount: 0 } }];
            let apiConfig = { percents: 0.3, week_limit: { amount: 1000 } };
            let result = cashOut.cashOutNatural(1000,'EUR', apiConfig, transactionHistory);
            expect(result).toBe('0.00');
        })

        it('Should return commission fee as 0.01 when totalCashout===0 amount===1001 weeklimit===1000', () => {
            let transactionHistory = [{ operation: { amount: 0 } }];
            let apiConfig = { percents: 0.3, week_limit: { amount: 1000 } };
            let result = cashOut.cashOutNatural(1001,'EUR', apiConfig, transactionHistory);
            expect(result).toBe('0.01');
        })

        it('Should return commission fee as 0.00 when totalCashout===1 amount===999 weeklimit===1000', () => {
            let transactionHistory = [{ operation: { amount: 1 } }];
            let apiConfig = { percents: 0.3, week_limit: { amount: 1000 } };
            let result = cashOut.cashOutNatural(999,'EUR', apiConfig, transactionHistory);
            expect(result).toBe('0.00');
        })

        it('Should accumulate totalCashout from transaction history', () => {
            let transactionHistory = [
                { operation: { amount: 500 } },
                { operation: { amount: 501 } }
            ];
            let apiConfig = { percents: 0.3, week_limit: { amount: 1000 } };
            let result = cashOut.cashOutNatural(1000,'EUR', apiConfig, transactionHistory);
            expect(result).toBe('3.00');
        })

        it('Should return commission fee as 0 when totalCashout is 0 amount === 1000 weeklimit===0', () => {
            let transactionHistory = [
                { operation: { amount: 0 } }
            ];
            let apiConfig = { percents: 0.3, week_limit: { amount: 0 } };
            let result = cashOut.cashOutNatural(1000,'EUR', apiConfig, transactionHistory);
            expect(result).toBe('3.00');
        })
    })

    describe('CashOutJuridical Tests,', () => {
        it('Should return minimum amout when commission fee does exceed minimum', () => {
            let apiConfig = { percents: 0.3, min: { amount: 0.5 } };
            let result = cashOut.cashOutJuridical(10,'EUR', apiConfig);
            expect(result).toBe(apiConfig.min.amount.toFixed(2));
        })

        it('Should return commission fee', () => {
            let apiConfig = { percents: 0.3, min: { amount: 0.5 } };
            let result = cashOut.cashOutJuridical(1000,'EUR', apiConfig);
            expect(result).toBe('3.00');
        })
    })
})