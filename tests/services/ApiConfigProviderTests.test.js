jest.mock('axios');
const axios = require('axios');
const { getApiConfig } = require("../../src/services/ApiConfigProvider");

describe('ApiConfigProvider Tests', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    it('Should reject when Transaction Type is not provided', () => {
        let transactionTypeMock = undefined;
        let userTypeMock = 'natural';
        getApiConfig(transactionTypeMock, userTypeMock)
            .then((result) => {
                if (result) {
                    fail('resolved without transactionType');
                }
            })
            .catch((error) => {
                expect(error.message).toBe('getApiConfig() Transaction type was not provided. Transaction type: undefined');
            })
    })

    it('Should reject when user type is not provided', () => {
        let transactionTypeMock = 'cashIn';
        let userTypeMock = undefined;
        getApiConfig(transactionTypeMock, userTypeMock)
            .then((result) => {
                if (result) {
                    fail('resolved without userType');
                }
            })
            .catch((error) => {
                expect(error.message).toBe('getApiConfig() User type type was not provided. User type: undefined');
            })
    })

    it('Should reject when data is empty', () => {
        let transactionTypeMock = 'cashIn';
        let userTypeMock = 'natural';
        axios.get.mockResolvedValue({ data: {} });
        getApiConfig(transactionTypeMock, userTypeMock)
            .then((result) => {
                if(result){
                    fail('Resolved with empty');
                }
            })
            .catch((error) => {
                expect(error.message).toBe('getApiConfig() Could not retrieve commission fees configuration');
            })
    })

    it('Should reject axios error', () => {
        let transactionTypeMock = 'cashIn';
        let userTypeMock = 'natural';
        axios.get.mockRejectedValue(new Error('network error'));
        getApiConfig(transactionTypeMock, userTypeMock)
            .then((result) => {
                if(result){
                    fail('Resolved error');
                }
            })
            .catch((error) => {
                expect(error.message).toBe('getApiConfig() network error');
            })
    })

    it('Should resolve api config', () => {
        let transactionTypeMock = 'cashIn';
        let userTypeMock = 'natural';
        let mockData = {
            mockPercents: 0.5,
            mockMax: {
                mockAmount: 5,
                mockCurrency: "GBP"
            }
        }
        axios.get.mockResolvedValue({ data: mockData });
        getApiConfig(transactionTypeMock, userTypeMock)
            .then((result) => {
                expect(result).toStrictEqual(mockData);
            })
            .catch((error) => {
                fail(error);
            });
    })

});