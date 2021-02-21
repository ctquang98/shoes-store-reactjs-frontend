import React from 'react';
import * as handleAmount from '../../utils/handleTotalAmount';
import formatMoney from '../../utils/formatMoney';
import { Link } from 'react-router-dom';
import style from './style.module.css';

const Orders = ({ cart, delivery }) => {
    const productsAmount = cart && cart.length ? cart.length : 0;
    const totalAmount = onRenderTotalAmout(cart, delivery);
    const format = formatMoney(totalAmount) ? formatMoney(totalAmount) : 0;
    return (
        <div className={style.container}>
            <p>
                Đơn hàng ({productsAmount} sản phẩm - <Link to='/cart'>Sửa</Link>)
            </p>
            {onRenderItem(cart)}
            {onRenderDeliveryMethod(delivery)}
            <div className={style.total}>
                <p className={style.totalHeader}>Thành tiền: </p>
                <p>{format}đ</p>
            </div>
        </div>
    )
}

const onRenderItem = cart => {
    let result = null;
    if(Array.isArray(cart) && cart.length) {
        result = cart.map((item, i) => {
            const totalPrices = item.quantity * item.product.price * (100 - item.product.saleOff) / 100;
            return (
                <div className={style.item} key={i}>
                    <p>
                        {item.quantity} x {item.product.name} (Màu: {item.product.color},
                        Kích cỡ: {item.product.size})
                    </p>
                    <p>
                        {formatMoney(Math.round(totalPrices))}đ
                    </p>
                </div>
            )
        });
    }
    return result;
}

const onRenderDeliveryMethod = delivery => {
    let result = null;
    if(delivery && delivery.length) {
        const deliveryAmount = parseInt(delivery);
        const format = formatMoney(deliveryAmount) ? formatMoney(deliveryAmount) : 0;
        result = <div className={style.delivery}>
                    <p>Phí vận chuyển: </p>
                    <p>{format}đ</p>
                </div>
    }

    return result;
}

const onRenderTotalAmout = (cart, delivery) => {
    let result = 0;
    if(Array.isArray(cart) && cart.length) {
        const total = handleAmount.totalAmount(cart);
        result = delivery && delivery.length ? total - parseInt(delivery) : total;
    }

    return result;
}

export default Orders;