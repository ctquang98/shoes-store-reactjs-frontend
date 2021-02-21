import * as types from '../constants/actionTypes';

const initialState = [];

const adminRolesReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.SAVE_ADMIN_ROLES:
            return [...action.payload];
        default: return [...state];
    }
}

export default adminRolesReducer;