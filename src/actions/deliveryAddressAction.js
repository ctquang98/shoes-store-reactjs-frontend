import * as types from '../constants/actionTypes';

export const actSaveDeliveryAddress = (obj) => {
    return {
        type: types.SAVE_DELIVERY_ADDRESS,
        payload: obj
    }
}