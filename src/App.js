const { getFees } = require('./services/GetFees');
const transaction = require('./modules/Transaction');
const fileReader = require('../src/modules/ReadFile');

const main = async () => {
  try {
    let filePath = process.argv.slice(2);
    let file = await fileReader.readFile(filePath[0]);
    let result = await Promise.all(runPromises(file));
    result.map(commissionFee => { console.log(commissionFee) });
  } catch (error) {
    console.log(`Error has occured: ${error.message}`);
  }
}

const runPromises = (array) => {
  if(array.length === 0) {
    throw new Error(`runPromises() array is empty`);
  }
  let promiseArray = [];
  array.map((currentTransaction) => {
    const { user_type: userType, user_id: userId, type, date } = currentTransaction || {};
    let transactionProps = {
      array,
      date,
      userId,
      userType,
      type,
      index: array.indexOf(currentTransaction)
    };
    checkTransactionProps(transactionProps);
    let transactionHistory = transaction.getTransactionHistory(transactionProps);
    let promiseFunction = getFees(currentTransaction, transactionHistory);
    return promiseArray.push(promiseFunction);
  });
  return promiseArray;
}

main();

const checkTransactionProps = (transactionProps) => {
  Object.keys(transactionProps).filter((prop) => {
    if (transactionProps[prop] === ''
        || transactionProps[prop] === undefined
        || transactionProps[prop] === null
        || transactionProps[prop].length === 0
      ) {
        throw new Error(`throwErrorWhenPropertiesAreMissing() Property missing ${prop}.`);
      }
      return true;
  });
}