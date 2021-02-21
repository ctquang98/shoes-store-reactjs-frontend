import * as types from '../constants/actionTypes';
import * as msg from '../constants/cartMessages';

export const actAddProductMessage = () => {
    return {
        type: types.ADD_PRODUCT_IN_DETAILS_PAGE,
        payload: {
            message: msg.ADD_PRODUCT_SUCCSESS,
            showToast: true
        }
    }
};

export const actCloseToast = () => {
    return {
        type: types.CLOSE_TOAST
    }
}