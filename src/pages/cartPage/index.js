import React from 'react';
import Title from '../../components/title';
import ModalInform from '../../components/modal';
import CartSummary from '../../components/cartSummary';
import * as msg from '../../constants/cartMessages';
import style from './style.module.css';

const Cart = ({ user, cart, children, openModal }) => {
    const content = !cart.length ? msg.PAYMENT_NO_PRODUCT 
                    : user.infor.id === -1 ? msg.PAYMENT_REQUIREMENT
                    : '';
    return (
        <div>
            <Title title='Giỏ hàng'/>
            <div className={style.scroll}>
                <table className={style.cartTable}>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Tổng tiền</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
            {
                !cart.length ? <Title title={msg.NO_PRODUCT_IN_CART}/> : null
            }
            <CartSummary
                user={user}
                cart={cart}
                openModal={() => openModal('Lưu ý', content)}
            />
            <ModalInform />
        </div>
    );
}

export default Cart;