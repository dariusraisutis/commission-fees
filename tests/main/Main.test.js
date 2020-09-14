jest.mock('../../src/services/ReadFile');
jest.mock('../../src/services/FeesProvider');
const main = require('../../src/main/Main');
const fileReader = require('../../src/services/ReadFile');
const feesProvider = require('../../src/services/FeesProvider');

describe('Main Tests', () => {
    it('Should reject when file path was not provided', () => {
        main.run()
        .then((result) => {
            if(result){
                fail('resolved without file path')
            }
        })
        .catch((error) => {
            expect(error.message).toBe('File path was not provided')
        })
    })

    it('Should reject when fileReader rejects', () => {
        fileReader.readFile.mockRejectedValue(new Error('Could not locate file'));
        main.run('test')
        .then((result) => {
            if(result){
                fail('resolved when rejected')
            }
        })
        .catch((error) => {
           expect(error).toBe('Could not locate file')
        })
    })

    it('Should reject when getAllFees rejects', () => {
        fileReader.readFile.mockResolvedValue([{ 
            "date": "2016-01-06", 
            "user_id": 2, 
            "user_type": "juridical", 
            "type": "cash_out", 
            "operation": { 
                "amount": 100.00,
                "currency": "EUR" 
            } 
        }
    ]);

    feesProvider.getAllFees.mockRejectedValue(new Error('Could not get fees'))
        main.run('test')
        .then((result) => {
            if(result){
                fail('resolved when rejected');
            }
        })
        .catch((error) => {
           expect(error).toBe('Could not get fees');
        })
    })


    it('Should resolve fees', () => {
        fileReader.readFile.mockResolvedValue([{ 
            "date": "2016-01-06", 
            "user_id": 2, 
            "user_type": "juridical", 
            "type": "cash_out", 
            "operation": { 
                "amount": 100.00,
                "currency": "EUR" 
            } 
        }
    ]);

    let arrayToResolve =[];
    arrayToResolve.push('Resolved 1')
    arrayToResolve.push('Resolved 2')
    arrayToResolve.push('Resolved 3')

    feesProvider.getAllFees.mockResolvedValue(arrayToResolve)
        main.run('test')
        .then((result) => {
            expect(result[0]).toBe(arrayToResolve[0]);
            expect(result[1]).toBe(arrayToResolve[1]);
            expect(result[2]).toBe(arrayToResolve[2]);
        })
        .catch((error) => {
           fail(error);
        })
    })


})