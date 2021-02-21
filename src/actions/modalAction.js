import * as types from '../constants/actionTypes';

export const actOpenModal = (header, content) => ({
    type: types.OPEN_MODAL,
    payload: {
        header,
        content
    }
});

export const actCloseModal = () => ({
    type: types.CLOSE_MODAL
});

export const actRemoveCartItemModal = (header, content, user, product) => ({
    type: types.CONFIRM_REMOVE_PRODUCT_MODAL,
    payload: {
        header,
        content,
        user,
        product
    }
})