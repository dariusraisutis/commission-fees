const payload = require("../modules/readFile");
const fees = require('../modules/calculateFees');
const transaction = require('../modules/Transaction');

try {
    let filePath = process.argv.slice(2);
    payload.readFile(filePath[0])
        .then((file) => {
            runPropmisesTemp(file, fees.calculateFees)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            })
        })
        .catch((error) => {
            throw new Error(`${error.message}`);
        });
} catch (error) {
    console.log(error);
}

const runPromisesInSequance = (array, promiseFunction) => {
    return array.reduce((prevPromise, currentItem) => {
        return prevPromise
            .then(() => {
                const { user_type: userType, type, user_id } = currentItem;
                let transactionHis = getTransactions(array, array.indexOf(currentItem), userType, type, currentItem.date);
                return promiseFunction(currentItem, transactionHis)
                    .then((result) => {
                        console.log(result);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }, Promise.resolve())
        .then((result) => {
            
        })
        .catch((error) => {
            console.log(error);
        });
}

const runPropmisesTemp = (array, promiseFunction) => {
        array.reduce((prevPromise, currentItem) => {
            return prevPromise
            .then(() => {
                const { user_type: userType, type, user_id } = currentItem;
                let transactionHis = getTransactions(array, array.indexOf(currentItem), userType, type, currentItem.date);
                return promiseFunction(currentItem, transactionHis);
            })
            .catch((error) => {
                console.log(error);
            })
        }, Promise.resolve({}));
}

const getTransactions = (array, index, userType, operationType, operationDate) => {
    let transactionHistory = array.slice(0, index);
    return transactionHistory.filter((element) => {
        let monday = new Date(transaction.getTransactionWeekRange(operationDate));
        return (element.user_type === userType) && (element.type === operationType)  && (new Date(element.date) >= monday && new Date(element.date) <= new Date(operationDate));
    });
}