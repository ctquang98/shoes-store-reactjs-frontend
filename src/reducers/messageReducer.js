import * as types from '../constants/actionTypes';
import * as msg from '../constants/cartMessages';

const initialState = {
    message: msg.NO_PRODUCT_IN_CART,
    showToast: false
};

const messageReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.ADD_PRODUCT_IN_DETAILS_PAGE:
            state = action.payload;
            return state;
        case types.CLOSE_TOAST:
            return {...state, showToast: false}
        default: return state;
    }
}

export default messageReducer;