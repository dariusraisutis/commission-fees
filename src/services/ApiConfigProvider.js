import axios from 'axios';
import { isObjectEmpty, buildApiConfigUrl } from '../utils/Utils';

const getApiConfig = (transactionType, userType) => {
    return new Promise((resolve, reject) => {
        if (!transactionType) {
            reject(new Error(`getApiConfig() Transaction type was not provided. Transaction type: ${transactionType}`));
        }
        if (!userType) {
            reject(new Error(`getApiConfig() User type type was not provided. User type: ${userType}`));
        }
        let requestUrl = buildApiConfigUrl(transactionType, userType);
        axios.get(requestUrl)
            .then(({ data }) => {
                if (isObjectEmpty(data)) {
                    reject(new Error('getApiConfig() Could not retrieve commission fees configuration'));
                }
                resolve(data);
            })
            .catch((error) => {
                reject(new Error(`getApiConfig() ${error.message}`));
            });
    });
}

export default getApiConfig;