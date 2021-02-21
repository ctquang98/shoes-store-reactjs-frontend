import React from 'react';
import style from '../../pages/cartPage/style.module.css';
import * as handleAmount from '../../utils/handleTotalAmount';
import { Link } from 'react-router-dom';
import formatMoney from '../../utils/formatMoney';

const CartSummary = ({ user, cart, openModal }) => {
    const loggedIn = user.infor.id === -1 ? false : true;
    const provisional = handleAmount.provisionalAmount(cart);
    const discount = handleAmount.discountAmount(cart);
    const total = handleAmount.totalAmount(cart);
    return (
		<div className={style.summary}>
            <div className={style.info}>
                <table>
                    <thead>
                        <tr><th colSpan="2">Thông tin</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tạm tính:</td>
                            <td>{provisional ? formatMoney(provisional) : 0}đ</td>
                        </tr>
                        <tr>
                            <td>Giảm giá:</td>
                            <td>{discount ? formatMoney(discount) : 0}đ</td>
                        </tr>
                        <tr>
                            <td>Thành tiền:</td>
                            <td style={{color: '#ff424e'}}>
                                {total ? formatMoney(total) : 0}đ
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {
                loggedIn && cart.length ?
                  <Link to='/delivery-address'
                    className={style.btnFinish}>
                        Đặt hàng
                  </Link>
                : <button
                    className={style.btnFinish}
                    onClick={openModal}>
                        Đặt hàng
                  </button>
            }
        </div>
	);
};

export default CartSummary;