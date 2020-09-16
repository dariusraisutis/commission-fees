import { isObjectEmpty } from "../utils/Utils";

const cashIn = (amount, apiConfig) => {
    if (!amount || isNaN(amount) || amount < 0) {
        throw new Error(`cachIn() invalid operation amount. ${amount}`);
    }
    if (isObjectEmpty(apiConfig)) {
        throw new Error('cachIn() Api Config is empty');
    }
    const { max: { amount: maxAmount }, percents } = apiConfig;
    let commissionFee = amount / 100 * percents;
    return commissionFee <= maxAmount ? commissionFee : maxAmount;
}

export default cashIn;