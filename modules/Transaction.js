const transaction = (transactionObj, apiConfig, transactionHistory) => {
    if (Object.keys(transactionObj).length === 0) {
        throw new Error('transaction() Transaction object is empty');
    }
    const {type: transactionType, user_type: userType, operation: {amount, currency}} = transactionObj;

    let commissionFee = 0;
    switch(transactionType){
        case 'cash_in':{
            commissionFee = cashIn(amount, currency, apiConfig);
            break;
        }
        case 'cash_out':{
            commissionFee = cashOut(userType, amount, currency, apiConfig, transactionHistory);
            break;
        }
        default: {
            throw new Error(`transaction() invalid transaction type. Transaction type : ${transactionType}`);
        }
    }

    return commissionFee;
}

const cashIn = (amount, currency, apiConfig) => {
    if(!amount){
        throw new Error(`cachIn() operation amount is empty. ${amount}`);
    }
    let amountAsFloat = parseFloat(amount);

    if(!amountAsFloat){
        throw new Error(`cashIn() operation amount could not be parsed. Operation amount: ${amount}`);
    }

    let commissionFee = 0;
    let maxAmount = apiConfig.max.amount;
    commissionFee = amountAsFloat / 100 * apiConfig.percents;
    commissionFee = round(commissionFee, 2).toFixed(2);
    return commissionFee <= maxAmount ? commissionFee : maxAmount.toFixed(2);

}

const cashOut = (userType, amount, currency, apiConfig, transactionHistory) => {
    let commissionFee = 0;
    switch(userType){
        case 'natural':{
            commissionFee = cashOutNatural(amount, currency, apiConfig, transactionHistory);
            break;
        }
        case 'juridical':{
            commissionFee = cashOutLegal(amount, currency, apiConfig);
            break;
        }
        default:{
            throw new Error(`cashOut() user type is invalid. User type: ${userType}`);
        }
    }

    return commissionFee;
}

const cashOutNatural = (amount, currency, apiConfig, transactionHistory) => {
    const {percents, week_limit: {amount: weekLimit}} = apiConfig;
    let commisionFee = 0;
    let totalCashOut = 0;
    if(transactionHistory.length != 0){
        transactionHistory.map((transaction) => {
            totalCashOut += transaction.operation.amount;
            //console.log(transaction.date)
        });
    }
    //console.log(transactionHistory)
    let feesToChargeOn = getFeesToChargeOn(amount, totalCashOut, weekLimit);
    if(feesToChargeOn === 0) {
        return commisionFee.toFixed(2);
    }
    commisionFee = feesToChargeOn / 100 * percents;
    commisionFee = round(commisionFee, 2).toFixed(2);

    return commisionFee;
}

const cashOutLegal = (amount, currency, apiConfig) => {
    const {percents, min: {amount: minAmount}} = apiConfig;
    let commissionFee = 0;
    amount = parseFloat(amount);
    commissionFee = amount / 100 * percents;
    let test = commissionFee < minAmount ? minAmount : commissionFee;
    test = round(test, 2).toFixed(2);
    return test;
}

const getTransactionWeekRange = (date) => {
    let rules = [7, 1, 2, 3, 4, 5, 6];
    let transactionDate = new Date(date);
    let dayOfWeek = transactionDate.getDay();
    let daysPassedInCurrentWeek = rules[dayOfWeek] - 1;
    let mondayDateOfTheWeek = transactionDate.setDate(transactionDate.getDate() - daysPassedInCurrentWeek);
    return mondayDateOfTheWeek;
}

const getFeesToChargeOn = (amount, totalCashout, weekLimit) => {
	if(totalCashout < weekLimit) {
		weekLimit -= totalCashout
	}
	if(totalCashout >= weekLimit){
		return amount;
	}
	if(amount <= weekLimit){
        return 0; 
    }
	return amount - weekLimit
}

const round = (value, decimalPlaces) => Math.ceil(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

module.exports = {
    transaction,
    getTransactionWeekRange
}

