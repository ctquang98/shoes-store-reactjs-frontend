import axios from 'axios';

export default function callAPI(endpoint, method = 'GET', body) {
    return axios({
        method,
        // url: `${config.API_URL}/${endpoint}`,
        url: `/${endpoint}`,
        data: body
    });
};