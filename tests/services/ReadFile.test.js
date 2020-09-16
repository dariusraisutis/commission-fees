jest.mock('fs');
const fs = require('fs');
const readFile = require('../../src/services/ReadFile');
const { fail } = require('assert');

describe('ReadFile Tests', () => {
    it('Should reject when file path is empty', () => {
        readFile.readFile()
            .then((result) => {
                if (result) {
                    fail('Resolved without file path');
                }
            })
            .catch((error) => {
                expect(error.message).toBe('readFile() Please provide file path!');
            });
    })

    it('Should reject when fs readfile return error', () => {
        fs.readFile.mockImplementation((filPath, callback) => {
            callback(new Error('failed'));
        })
        readFile.readFile('test')
            .then((result) => {
                if (result) {
                    fail('Resolved with error');
                }
            })
            .catch((error) => {
                expect(error.message).toBe('readFile() Error occured when reading file. failed');
            });
    })

    it('Should reject when file content is empty array', () => {
        fs.readFile.mockImplementation((filPath, callBack) => {
            let fileContent = Buffer.from('[]');
            callBack(null, fileContent);
        });
        readFile.readFile('test')
            .then((result) => {
                if (result) {
                    fail('Resolved with empty array');
                }
            })
            .catch((error) => {
                expect(error.message).toBe('readFile() File contents are empty.');
            });
    })

    it('Should reject when file content is empty object', () => {
        fs.readFile.mockImplementation((filPath, callBack) => {
            let fileContent = Buffer.from('{}');
            callBack(null, fileContent);
        });
        readFile.readFile('test')
            .then((result) => {
                if (result) {
                    fail('Resolved with empty object');
                }
            })
            .catch((error) => {
                expect(error.message).toBe('readFile() File contents are empty.');
            });
    })

    it('Should reject when file cannot be parsed, invalid json', () => {
        fs.readFile.mockImplementation((filPath, callBack) => {
            let fileContent = Buffer.from('{"test": "test"},');
            callBack(null, fileContent);
        });
        readFile.readFile('test')
            .then((result) => {
                if (result) {
                    fail('Resolved with invalid json');
                }
            })
            .catch((error) => {
                expect(error.message).toBe(`readFile() Error occured when parsing input file. Unexpected token , in JSON at position 16)`);
            });
    })

    it('Should resolve array with single object', () => {
        let singleValueJson = { test: 'test' };
        fs.readFile.mockImplementation((filPath, callBack) => {
            let fileContent = Buffer.from('{"test": "test"}');
            callBack(null, fileContent);
        });
        readFile.readFile('test')
            .then((result) => {
                if (result) {
                    let expected = [];
                    expected.push(singleValueJson);
                    expect(result).toStrictEqual(expected);
                }
            })
            .catch((error) => {
                fail(error);
            });
    })

    it('Should resolve array with multiple objects', () => {
        fs.readFile.mockImplementation((filPath, callBack) => {
            let fileContent = Buffer.from('[{"test": "test"}, {"test2": "test2"}]');
            callBack(null, fileContent);
        });
        readFile.readFile('test')
            .then((result) => {
                if (result) {
                    let expected = [{ "test": "test" }, { "test2": "test2" }];
                    expect(result).toStrictEqual(expected);
                }
            })
            .catch((error) => {
                fail(error);
            });
    })
})