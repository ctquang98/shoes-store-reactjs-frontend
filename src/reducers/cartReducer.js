import * as types from '../constants/actionTypes';
import findProductIndex from '../utils/findProductIndex';
import handleSplitProduct from '../utils/handleSplitProduct';

const initialState = {
    cart: [],
    submitting: false
};

const cartReducer = (state = initialState, action) => {
    const { payload } = action;
    let { cart } = state;
    let index = -1;
    switch(action.type) {
        case types.SUBMITTING_CART_DATA:
            return {...state, submitting: true};
        case types.SUBMITTING_CART_DATA_FINISHED:
            return {...state, submitting: false};
        case types.SYNC_CART_WHEN_LOGIN:
            if (!payload.length) return {...state};

            const convertedPayload = payload.map(p => ({
                product: p.product,
                quantity: p.sumProducts
            }));
            if (!cart.length) return {...state, cart: [...convertedPayload]};

            const sumCart = [...cart, ...convertedPayload];
            // => {id:..., product:..., quantity:...}
            const sumCartById = sumCart.map(i => Object.assign({id: i.product.id}, i));
            const splitCartById = handleSplitProduct(sumCartById, 'id');
            const idProps = Object.keys(splitCartById);
            //splitCartById[p]: [{id:..., product:..., quantity:....},...]
            const finalCart = idProps.map(p => {
                const synchronizedQuantity = splitCartById[p].reduce((a, b) => ({
                    quantity: a.quantity + b.quantity
                }));
                const { product } = splitCartById[p][0];
                const quantity = synchronizedQuantity.quantity > product.countInput ?
                                 product.countInput : synchronizedQuantity.quantity;
                return { product, quantity };
            });

            return {...state, cart: [...finalCart]};
        case types.INCREASE_PRODUCT_QUANTITY_IN_CART:
            index = findProductIndex(payload.id, cart);

            if(index === -1) cart.push({product: payload, quantity: 1});
            else {
                let {quantity : check} = cart[index];
                cart[index].quantity = check < payload.countInput ? ++check : check;
            }

            return { cart, submitting: false };
        case types.DECREASE_PRODUCT_QUANTITY_IN_CART:
            index = findProductIndex(payload.id, cart);

            if(index !== -1) {
                let { quantity : check } = cart[index];
                cart[index].quantity = check > 1 ? --check : check;
            }

            return { ...state, cart };
        case types.REMOVE_PRODUCT_IN_CART:
            index = findProductIndex(payload.id, cart);
            if(index !== -1) cart.splice(index, 1);

            return {...state, cart};
        case types.CLEAR_CART_DATA:
            return {cart: [], submitting: false}
        default: return {...state};
    }
}

export default cartReducer;