import React from 'react';
import formatMoney from '../../utils/formatMoney';
import * as msg from '../../constants/cartMessages';
import style from '../../pages/cartPage/style.module.css';

const CartItem = (props) => {
    const { user, cartItem, removeCartItemModal } = props;
    const { product, quantity } = cartItem;
    return (
		<tr>
            <td className={style.product}>
                {/* <img src={require(`../../assets/${product.thumbnail}`)} alt="product img" /> */}
                <img src={process.env.PUBLIC_URL + `/assets/images/${product.thumbnail}`} alt="product img" />
                <span>
                    {`${product.name} (Màu: ${product.color}, Kích cỡ: ${product.size})`}
                </span>
            </td>
            <td>{formatMoney(product.price)}đ</td>
            <td >
                <div className={style.quantity}>
                    <button onClick={() => props.decreaseProductRequest(user, cartItem)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => props.increaseProductRequest(user, cartItem)}>+</button>
                </div>
            </td>
            <td>{formatMoney(product.price * quantity)}đ</td>
            <td className={style.remove}>
                <button
                    onClick={() =>
                    removeCartItemModal('Lưu ý', msg.CONFIRM_DELETE_CART_ITEM, user, product)}
                >
                    x
                </button>
            </td>
        </tr>
	);
};

// () => props.removeProductRequest(user, product)

export default CartItem;