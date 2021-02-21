export const totalAmount = cart => {
    let total = 0;
    if(Array.isArray(cart) && cart.length) {
        const provisional = provisionalAmount(cart);
        const discount = discountAmount(cart);
        total = provisional - discount;
    }
    return total;
}

export const provisionalAmount = cart => {
    let result = null;
    if(Array.isArray(cart) && cart.length) {
        for(let i = 0; i < cart.length; i++) {
            result += cart[i].quantity * cart[i].product.price;
        }
    }
    return result;
}

export const discountAmount = cart => {
    let result = null;
    if(Array.isArray(cart) && cart.length) {
        for(let i = 0; i < cart.length; i++) {
            const amountPerItem = cart[i].quantity * cart[i].product.price;
            result += amountPerItem * cart[i].product.saleOff / 100;
        }
    }
    return Math.round(result);
}