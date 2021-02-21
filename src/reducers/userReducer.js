import * as types from '../constants/actionTypes';

const initialState = { infor: {id: -1} };

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.SET_CURRENT_USER:
            return { ...action.payload };
        default: return {...state};
    }
}

export default userReducer;