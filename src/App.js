const payload = require("../modules/readFile");
const fees = require('../modules/calculateFees');
const transaction = require('../modules/Transaction');

try {
    let filePath = process.argv.slice(2);
    payload.readFile(filePath[0])
        .then((file) => {
            runPromisesInSequance(file, fees.calculateFees);
        })
        .catch((error) => {
            throw new Error(`${error.message}`);
        });
} catch (error) {
    throw new Error(`${error.message}`);
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
                throw new Error(`${error.message}`);
            });
    }, Promise.resolve())
        .catch((error) => {
            throw new Error(`${error.message}`);
        });
}

const getTransactions = (array, index, userType, operationType, operationDate) => {
    let transactionHistory = array.slice(0, index);
    return transactionHistory.filter((element) => {
        let monday = new Date(transaction.getTransactionWeekRange(operationDate));
        let passedTransactionDate = new Date(element.date);
        let currentTransactionDate = new Date(operationDate);
        return (element.user_type === userType)
            && (element.type === operationType)
            && (passedTransactionDate >= monday && passedTransactionDate <= currentTransactionDate);
    });
}