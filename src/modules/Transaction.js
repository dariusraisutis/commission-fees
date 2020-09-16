import { isObjectEmpty } from '../utils/Utils';
import { cashOut } from './CashOut';
import cashIn from '../modules/CashIn';

const calculateFees = (transactionObj, transactionHistory, apiConfig) => {
    if (isObjectEmpty(transactionObj)) {
        throw new Error('calculateFees() Transaction object is empty');
    }
    if (isObjectEmpty(apiConfig)) {
        throw new Error('calculateFees() ApiConfig object is empty');
    }
    const { type: transactionType, user_type: userType, operation: { amount } } = transactionObj;
    let commissionFee = 0;
    switch (transactionType) {
        case 'cash_in': {
            commissionFee = cashIn(amount, apiConfig);
            break;
        }
        case 'cash_out': {
            commissionFee = cashOut(userType, amount, apiConfig, transactionHistory);
            break;
        }
        default: {
            throw new Error(`calculateFees() invalid transaction type. Transaction type : ${transactionType}`);
        }
    }
    return commissionFee;
}

const getTransactionWeekRange = (date) => {
    const rules = [7, 1, 2, 3, 4, 5, 6];
    let transactionDate = new Date(date);
    let daysPassedInCurrentWeek = rules[transactionDate.getDay()] - 1;
    let mondayOfTheWeek = transactionDate.setDate(transactionDate.getDate() - daysPassedInCurrentWeek);
    return mondayOfTheWeek;
}

const getTransactionHistory = ({ array, date, userId, userType, type, index }) => {
    const transactionHistory = array.slice(0, index);
    return transactionHistory.filter((element) => {
        let monday = new Date(getTransactionWeekRange(date));
        let currentTransactionDate = new Date(date);
        let passedTransactionDate = new Date(element.date);
        return (element.user_type === userType)
            && (element.user_id === userId)
            && (element.type === type)
            && (passedTransactionDate >= monday && passedTransactionDate <= currentTransactionDate);
    });
}

const checkTransactionProps = (transactionProps) => {
    if (isObjectEmpty(transactionProps)) {
        throw new Error('checkTransactionProps() Transactionprops are empty');
    }
    Object.keys(transactionProps).filter((prop) => {
        if (transactionProps[prop] === ''
            || transactionProps[prop] === undefined
            || transactionProps[prop] === null
            || transactionProps[prop].length === 0
        ) {
            throw new Error(`checkTransactionProps() Property missing ${prop}.`);
        }
    });
    return true;
}


export {
    calculateFees,
    getTransactionWeekRange,
    getTransactionHistory,
    checkTransactionProps
}

