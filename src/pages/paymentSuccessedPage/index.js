import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';

const PaymentSuccessedPage = () => {
    return (
        <div className={style.container}>
            <h3 className={style.title}>
                Đặt hàng thành công,
                bấm vào <Link to='/'>đây</Link> để tiếp tục mua sắm
                hoặc <Link to='/profile'>xem lại đơn hàng</Link>
            </h3>
        </div>
    );
}

export default PaymentSuccessedPage;