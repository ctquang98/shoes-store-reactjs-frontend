import * as types from '../constants/actionTypes';

const initialState = {
    showing: false,
    header: 'Lưu ý',
    content: '',
    user: {},
    product: {}
}

const modalReducer = (state = initialState, action) => {
    const { payload } = action;
    switch(action.type) {
        case types.OPEN_MODAL:
            return {
                ...state,
                showing: true,
                header: payload.header,
                content: payload.content
            }
        case types.CLOSE_MODAL:
            return {
                showing: false,
                header: 'Lưu ý',
                content: '',
                user: {},
                product: {}
            }
        case types.CONFIRM_REMOVE_PRODUCT_MODAL:
            return {
                showing: true,
                header: payload.header,
                content: payload.content,
                user: payload.user,
                product: payload.product
            }
        default: return {...state};
    }
}

export default modalReducer;