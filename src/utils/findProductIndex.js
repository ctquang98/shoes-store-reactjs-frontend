export default function (id, cart) {
    let finalIndex = -1;
    if(cart.length) {
        for(let i = 0; i < cart.length; i++) {
            if(id === cart[i].product.id) {
                finalIndex = i;
                return finalIndex;
            }
        }
    }
    return finalIndex;
}