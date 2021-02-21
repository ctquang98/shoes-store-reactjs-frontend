import * as types from '../constants/actionTypes';
import callAPI from '../api/api';
import findProductIndex from '../utils/findProductIndex';
import { actCloseModal } from './modalAction';

export const actSubmittingCartData = () => ({
    type: types.SUBMITTING_CART_DATA
})

export const actFinishedSubmittingCartData = () => ({
    type: types.SUBMITTING_CART_DATA_FINISHED
})

export const actSyncCartWhenLogin = loginCart => {
    return {
        type: types.SYNC_CART_WHEN_LOGIN,
        payload: loginCart
    }
}

export const actSyncCartToServer = (user, cart) => {
    return dispatch => { // return dispatch to call api ?
        const array = cart.map(c => {
            const discountAmout = c.product.price * c.quantity * c.product.saleOff / 100;
            const total = c.product.price * c.quantity - discountAmout;
            return {
                productId: c.product.id,
                sumProducts: c.quantity,
                sumMoneys: Math.round(total)
            }
        });
        return callAPI(`synchronize?userid=${user.infor.id}`, 'POST', [...array])
                .then(res => console.log(res))
                .catch(err => console.error(err));
    }
}

export const actAddProductToCartRequest = (user, cart, product) => {
    return dispatch => {
        if (user.infor.id === -1) return dispatch(actIncreaseProduct(product));

        const index = findProductIndex(product.id, cart)
        const quantity = 1;
        const discountAmout = product.price * product.saleOff / 100;
        const total = product.price * quantity - discountAmout;
        if (index === -1 || cart[index].quantity < product.countInput) {
            return callAPI(`detail?userid=${user.infor.id}&productid=${product.id}`, 'POST', {
                sumProducts: quantity,
                sumMoneys: total
            })
            .then(res => dispatch(actIncreaseProduct(product)))
            .catch(err => {
                console.error(err);
                dispatch(actFinishedSubmittingCartData());
            });
        }
        else {
            return dispatch(actFinishedSubmittingCartData());
        }
    }
}

export const actIncreaseProductRequest = (user, cartItem) => {
    return dispatch => {
        const { product, quantity } = cartItem;
        if(user.infor.id === -1) return dispatch(actIncreaseProduct(product));

        const maxQuantity = product.countInput > (quantity+1) ? quantity+1 : product.countInput;
        const discountAmout = product.price * maxQuantity * product.saleOff / 100;
        const total = product.price * maxQuantity - discountAmout;
        return callAPI('cart', 'PUT', {
            cartId: user.cart.cart.id,
            productId: product.id,
            sumProducts: maxQuantity,
            sumMoneys: Math.round(total),
            mode: "+"
        })
        .then(res => {
            dispatch(actIncreaseProduct(product));
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export const actDecreaseProductRequest = (user, cartItem) => {
    return dispatch => {
        const { product, quantity } = cartItem;
        if(user.infor.id === -1) return dispatch(actDecreaseProduct(product));

        const minQuantity = quantity-1 > 0 ? quantity-1 : 1;
        const discountAmout = product.price * minQuantity * product.saleOff / 100;
        const total = product.price * minQuantity - discountAmout;
        return callAPI('cart', 'PUT', {
            cartId: user.cart.cart.id,
            productId: product.id,
            sumProducts: minQuantity,
            sumMoneys: Math.round(total),
            mode: "-"
        })
        .then(res => {
            dispatch(actDecreaseProduct(product));
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export const actIncreaseProduct = product => {
    return {
        type: types.INCREASE_PRODUCT_QUANTITY_IN_CART,
        payload: product
    }
}

export const actDecreaseProduct = product => {
    return {
        type: types.DECREASE_PRODUCT_QUANTITY_IN_CART,
        payload: product
    }
}

export const actRemoveProductRequest = (user, product) => {
    return dispatch => {
        if (user.infor.id === -1) {
            dispatch(actRemoveProduct(product));
            return dispatch(actCloseModal());
        }

        callAPI(`cart?productid=${product.id}&cardid=${user.cart.cart.id}`, 'DELETE', null)
            .then(res => {
                dispatch(actRemoveProduct(product));
                dispatch(actCloseModal());
            })
            .catch(err => console.error(err));
    }
}

export const actRemoveProduct = product => {
    return {
        type: types.REMOVE_PRODUCT_IN_CART,
        payload: product
    }
}

export const actClearCartData = () => ({
    type: types.CLEAR_CART_DATA
})