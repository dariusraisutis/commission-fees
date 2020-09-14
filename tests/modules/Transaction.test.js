const transaction = require('../../src/modules/Transaction');
const cashIn = require('../../src/modules/CashIn');
const cashOut = require('../../src/modules/CashOut');

describe('Transaction module Tests', () => {
    let transactionPayLoad = [
        { "date": "2020-09-01", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
        { "date": "2020-09-02", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
        { "date": "2020-09-02", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } },
        { "date": "2020-09-03", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
        { "date": "2020-09-03", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
        { "date": "2020-09-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
        { "date": "2020-09-06", "user_id": 2, "user_type": "juridical", "type": "cash_in", "operation": { "amount": 1000000.00, "currency": "EUR" } },
        { "date": "2020-09-06", "user_id": 3, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
        { "date": "2020-09-10", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } }
    ];
    let cashInSpy;
    let cashOutSpy;
    beforeEach(() => {
        cashInSpy = jest.spyOn(cashIn, 'cashIn');
        cashOutSpy = jest.spyOn(cashOut, 'cashOut');
    })

    afterEach(() => {
        cashInSpy.mockRestore();
        cashOutSpy.mockRestore();
    })
    it('Should throw error when transaction object is empty', () => {
        expect(() => {
            transaction.calculateFees({}, {}, {});
        }).toThrow('calculateFees() Transaction object is empty');
    })

    it('Should throw error when api config object is empty', () => {
        let transactiobObject = {
            date: '2016-08-01',
            type: 'cash_in'
        };
        expect(() => {
            transaction.calculateFees(transactiobObject, {}, {});
        }).toThrow('calculateFees() ApiConfig object is empty');
    })

    it('Should throw error when transactionType is invalid', () => {
        let transactiobObject = {
            date: '2016-08-01',
            type: 'invalid',
            operation: {
                amount: 200,
                currency: 'EUR'
            }
        };
        let apiConfig = {
            percents: 0.5,
            max: {
                amount: 200,
                currency: 'GBP'
            }
        };
        expect(() => {
            transaction.calculateFees(transactiobObject, {}, apiConfig);
        }).toThrow(`calculateFees() invalid transaction type. Transaction type : ${transactiobObject.type}`);
    })

    it('Should call cashIn() when transaction type is cash_in', () => {
        let transactiobObject = {
            date: '2016-08-01',
            type: 'cash_in',
            user_type: 'natural',
            operation: {
                amount: 200,
                currency: 'EUR'
            }
        };
        let apiConfig = {
            percents: 0.03,
            max: {
                amount: 5,
                currency: 'GBP'
            }
        };
        transaction.calculateFees(transactiobObject, [], apiConfig);
        expect(cashInSpy).toHaveBeenCalledTimes(1);
    })

    it('Should call cashOut() when transaction type is cash_out', () => {
        let transactiobObject = {
            date: '2016-08-01',
            type: 'cash_out',
            user_type: 'natural',
            operation: {
                amount: 200,
                currency: 'EUR'
            }
        };
        let apiConfig = {
            percents: 0.03,
            week_limit: {
                max: 1000,
                currency: 'GBP'
            }
        };
        transaction.calculateFees(transactiobObject, [], apiConfig);
        expect(cashOutSpy).toHaveBeenCalledTimes(1);
    })

    it('Should get the start of the week date when date is sunday', () => {
        let date = '2020-09-13';
        let expected = '2020-09-07'
        let monday = transaction.getTransactionWeekRange(date);
        expect(new Date(monday)).toStrictEqual(new Date(expected));
    })

    it('Should get the start of the week date when date is monday', () => {
        let date = '2020-09-07';
        let expected = '2020-09-07'
        let monday = transaction.getTransactionWeekRange(date);
        expect(new Date(monday)).toStrictEqual(new Date(expected));
    })

    it('Should get the start of the week date when date is friday', () => {
        let date = '2020-09-11';
        let expected = '2020-09-07'
        let monday = transaction.getTransactionWeekRange(date);
        expect(new Date(monday)).toStrictEqual(new Date(expected));
    })

    it('Should get transaction history as empty array for the current week, starting from monday, user_id: 1, operation type: cash_out, current index: 2', () => {
        let expected = [];
        let currentTransaction = {
            "date": "2020-09-02",
            "user_id": 1,
            "user_type": "natural",
            "type": "cash_out",
            "operation": {
                "amount": 30000,
                "currency": "EUR"
            }
        };

        let transactionProps = {
            array: transactionPayLoad,
            date: currentTransaction.date,
            userId: currentTransaction.user_id,
            userType: currentTransaction.user_type,
            type: currentTransaction.type,
            index: 2
        }

        let result = transaction.getTransactionHistory(transactionProps);
        expect(result).toStrictEqual(expected);

    })

    it('Should get transaction history as array with one item for the current week, starting from monday, user_id: 1, operation type: cash_out, current index: 3', () => {
        let expected = [{
            "date": "2020-09-02",
            "user_id": 1,
            "user_type": "natural",
            "type": "cash_out",
            "operation": {
                "amount": 30000,
                "currency": "EUR"
            }
        }];
        let currentTransaction = {
            "date": "2020-09-03",
            "user_id": 1,
            "user_type": "natural",
            "type": "cash_out",
            "operation": {
                "amount": 1000.00,
                "currency": "EUR"
            }
        };
        let transactionProps = {
            array: transactionPayLoad,
            date: currentTransaction.date,
            userId: currentTransaction.user_id,
            userType: currentTransaction.user_type,
            type: currentTransaction.type,
            index: 3
        }

        let result = transaction.getTransactionHistory(transactionProps);
        expect(result).toStrictEqual(expected);
    })

    it('Should get transaction history as array with 3 items for the current week, starting from monday, user_id: 1, operation type: cash_out, current index: 5', () => {
        let expected = [
            { "date": "2020-09-02", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } },
            { "date": "2020-09-03", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
            { "date": "2020-09-03", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
        ];
        let currentTransaction = {
            "date": "2020-09-06",
            "user_id": 1, "user_type":
                "natural", "type": "cash_out",
            "operation": {
                "amount": 100.00,
                "currency": "EUR"
            }
        };
        let transactionProps = {
            array: transactionPayLoad,
            date: currentTransaction.date,
            userId: currentTransaction.user_id,
            userType: currentTransaction.user_type,
            type: currentTransaction.type,
            index: 5
        }

        let result = transaction.getTransactionHistory(transactionProps);
        expect(result).toStrictEqual(expected);
    })

    it('Should get transaction history as empty array for the current week, starting from monday, user_id: 1, operation type: cash_out, current index: 8', () => {
        let expected = [];
        let currentTransaction = {
            "date": "2020-09-10",
            "user_id": 1,
            "user_type": "natural",
            "type": "cash_out",
            "operation": {
                "amount": 300.00,
                "currency": "EUR"
            }
        };
        let transactionProps = {
            array: transactionPayLoad,
            date: currentTransaction.date,
            userId: currentTransaction.user_id,
            userType: currentTransaction.user_type,
            type: currentTransaction.type,
            index: 8
        };

        let result = transaction.getTransactionHistory(transactionProps);
        expect(result).toStrictEqual(expected);
    })

    it('Should throw error when transaction props are empty', () => {
        expect(() => {
            transaction.checkTransactionProps({});
        }).toThrow('checkTransactionProps() Transactionprops are empty');
    })

    it('Should throw error when array os empty', () => {
        let transactionProps = {
            array: [],
            date: '2020-09-01',
            userId: 5,
            userType: 'natural',
            type: 'cash_in',
            index: 1
          };
        expect(() => {
            transaction.checkTransactionProps(transactionProps);
        }).toThrow('checkTransactionProps() Property missing array.');
    })

    it('Should throw error when date null', () => {
        let transactionProps = {
            array: [{'test': 'test'}],
            date: null,
            userId: 5,
            userType: 'natural',
            type: 'cash_in',
            index: 1
          };
        expect(() => {
            transaction.checkTransactionProps(transactionProps);
        }).toThrow('checkTransactionProps() Property missing date.');
    })

    it('Should throw error when userId undefined', () => {
        let transactionProps = {
            array: [{'test': 'test'}],
            date: '2020-09-01',
            userId: undefined,
            userType: 'natural',
            type: 'cash_in',
            index: 1
          };
        expect(() => {
            transaction.checkTransactionProps(transactionProps);
        }).toThrow('checkTransactionProps() Property missing userId.');
    })

    it('Should throw error when userType is empty string', () => {
        let transactionProps = {
            array: [{'test': 'test'}],
            date: '2020-09-01',
            userId: 5,
            userType: '',
            type: 'cash_in',
            index: 1
          };
        expect(() => {
            transaction.checkTransactionProps(transactionProps);
        }).toThrow('checkTransactionProps() Property missing userType.');
    })

    it('Should return true when validation passes', () => {
        let transactionProps = {
            array: [{'test': 'test'}],
            date: '2020-09-01',
            userId: 5,
            userType: 'natural',
            type: 'cash_in',
            index: 1
          };

        let result = transaction.checkTransactionProps(transactionProps);
        expect(result).toBe(true);
    })
})