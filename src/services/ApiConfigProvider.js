import axios from 'axios';
import { isObjectEmpty, buildApiConfigUrl } from '../utils/Utils';

const getApiConfig = async(transactionType, userType) => {
        if (!transactionType) {
            reject(new Error(`getApiConfig() Transaction type was not provided. Transaction type: ${transactionType}`));
        }
        if (!userType) {
            reject(new Error(`getApiConfig() User type type was not provided. User type: ${userType}`));
        }
        try {
            const requestUrl = buildApiConfigUrl(transactionType, userType);
            const { data } = await axios.get(requestUrl);
            if (isObjectEmpty(data)) {
                throw new Error('getApiConfig() Could not retrieve commission fees configuration');
            }
            return data;
        } catch(error){
            throw new Error(`getApiConfig() ${error.message}`);
        }
}

export default getApiConfig;