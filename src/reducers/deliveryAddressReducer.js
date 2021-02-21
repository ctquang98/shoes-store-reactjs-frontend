import * as types from '../constants/actionTypes';

const initialState = {};

const deliveryAddressReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.SAVE_DELIVERY_ADDRESS:
            return {...action.payload};
        default: return {...state};
    }
};

export default deliveryAddressReducer;