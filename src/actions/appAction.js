import * as types from '../constants/actionTypes';
import callAPI from '../api/api';

export const actFetchDataRequest = id => {
    return dispatch => {
        return callAPI(`trang-chu?userid=${id}`)
            .then(res => {
                console.log(res.data);
                dispatch(actFetchData(res.data));
            });
    }
}

export const actFetchData = data => {
    return {
        type: types.GET_HOME_PAGE_DATA,
        payload: data
    }
};