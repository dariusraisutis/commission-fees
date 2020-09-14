jest.mock('../../src/services/ApiConfigProvider');
jest.mock('../../src/modules//Transaction');
const { getApiConfig } = require("../../src/services/ApiConfigProvider");
const transaction = require('../../src/modules/Transaction');
const feesProvider = require("../../src/services/FeesProvider");


describe('GetFees Tests', () => {
    let checkTransactionPropsSpy;
    let getTransactionHoistorySpy;

    beforeEach(() => {
        checkTransactionPropsSpy = jest.spyOn(transaction, 'checkTransactionProps');
        getTransactionHoistorySpy = jest.spyOn(transaction, 'getTransactionHistory');
    });

    afterEach(() => {
        checkTransactionPropsSpy.mockRestore();
        getTransactionHoistorySpy.mockRestore();
    })
    it('Should reject when currentTransaction is not provided', () => {
        let currentTransaction = {};
        let transactionHistory = [{ mockDate: '2016-05-06', mocktUserType: 'natural' }];
        feesProvider.getFees(currentTransaction, transactionHistory)
            .then((result) => {
                if (result) {
                    fail('resolved without currentTransaction');
                }
            })
            .catch((error) => {
                expect(error.message).toBe('getFees() Transaction object is empty');
            });
    })

    it('Should reject when apiConfig returns error', () => {
        getApiConfig.mockImplementation(() => {
            return Promise.reject(new Error('Failed to get api config'));
        });
        let currentTransaction = { mockDate: '2016-05-06', mocktUserType: 'natural', operation: {currency: 'EUR'} };
        let transactionHistory = [{ mockDate: '2016-05-06', mocktUserType: 'natural' }];
        feesProvider.getFees(currentTransaction, transactionHistory)
            .then((result) => {
                if (result) {
                    fail('Resolved when apigConfig rejected');
                }
            })
            .catch((error) => {
                expect(error.message).toBe('getFees() Error: Failed to get api config');
            });
    })

    it('Should reject when currency is not supported', () => {
        let mockData = {
            percents: 0.5,
            max: {
                amount: 5,
                currency: "GBP"
            }
        }
        getApiConfig.mockImplementation(() => {
            return Promise.resolve(mockData);
        });
        let currentTransaction = { mockDate: '2016-05-06', mocktUserType: 'natural', operation: { currency: 'GBP'} };
        let transactionHistory = [{ mockDate: '2016-05-06', mocktUserType: 'natural' }];
        feesProvider.getFees(currentTransaction, transactionHistory)
            .then((result) => {
                fail('Resolved with invalid currency')
            })
            .catch((error) => {
                expect(error.message).toBe('getFees() Operation currency is not supported. Currency GBP');
            });
    })

    it('Should resolve commission fee', () => {
        transaction.calculateFees.mockImplementation(() => {
            return 25;
        })
        let mockData = {
            percents: 0.5,
            max: {
                amount: 5,
                currency: "GBP"
            }
        }
        getApiConfig.mockImplementation(() => {
            return Promise.resolve(mockData);
        });
        let currentTransaction = { mockDate: '2016-05-06', mocktUserType: 'natural', operation: {currency: 'EUR'} };
        let transactionHistory = [{ mockDate: '2016-05-06', mocktUserType: 'natural' }];
        feesProvider.getFees(currentTransaction, transactionHistory)
            .then((result) => {
                expect(result).toBe(25);
            })
            .catch((error) => {
                fail(error.message)
            });
    })

    it('Should throw error when dataFile is empty', () => {
        expect(() => {
            feesProvider.getPromises([]);
        }).toThrow('getPromises() fileData is empty');
    })

    it('Should return array of Promises', () => {
        let expected = [];
        let currentTransaction = { 
            "date": "2016-01-06", 
            "user_type": "juridical", 
            "type": "cash_out", 
            "operation": { 
                "amount": 100.00,
                "currency": "EUR" 
            } 
        };
        expected.push(feesProvider.getFees(currentTransaction, []));
        let fileData = [currentTransaction];
        let result = feesProvider.getPromises(fileData);
        expect(checkTransactionPropsSpy).toHaveBeenCalled();
        expect(getTransactionHoistorySpy).toHaveBeenCalled();
        expect(result).toStrictEqual(expected)
    })

    it('Should reject when when array of Promises is empty', () => {
        feesProvider.getAllFees([])
        .then((result) => {
            if(result){
                fail('resolved with empty array');
            }
        })
        .catch((error) => {
            expect(error.message).toBe('getAllFees() Promise array is empty');
        })
    })

    it('Should reject when one of the promises fails', () => {
        let arrayOfPromises = [];
        let promise1 = Promise.resolve('Resolving');
        let promise2 = Promise.reject(new Error('Rejecting'));
        arrayOfPromises.push(promise1);
        arrayOfPromises.push(promise2)
        feesProvider.getAllFees(arrayOfPromises)
        .then((result) => {
            if(result){
                fail('Resolved with a rejected promise');
            }
        })
        .catch((error) => {
           expect(error.message).toBe('Rejecting');
        })
    })

    it('Should resolve promise array', () => {
        let arrayOfPromises = [];
        let promise1 = Promise.resolve('Resolving 1');
        let promise2 = Promise.resolve('Resolving 2');
        let promise3 = Promise.resolve('Resolving 3');
        arrayOfPromises.push(promise1);
        arrayOfPromises.push(promise2);
        arrayOfPromises.push(promise3);
        feesProvider.getAllFees(arrayOfPromises)
        .then((result) => {
            if(result){
                expect(result[0]).toBe('Resolving 1');
                expect(result[1]).toBe('Resolving 2');
                expect(result[2]).toBe('Resolving 3');
            }
        })
        .catch((error) => {
           fail(error.message);
        })
    })

});