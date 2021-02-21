import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';

const OrdersAddress = ({ deliveryAddress }) => {
    let address = null;
    if(Object.keys(deliveryAddress).length) {
        address = `${deliveryAddress.address}, ${deliveryAddress.selectedWard.name}, 
        ${deliveryAddress.selectedDistrict.name}, ${deliveryAddress.selectedProvince.name}`;
    }
    return (
        <div className={style.container}>
            <p>
                Địa chỉ giao hàng (<Link to='/delivery-address'>Sửa</Link>)
            </p>
            <div className={style.addressContainer}>
                <p>
                    { deliveryAddress.hasOwnProperty('fullname')
                      ? deliveryAddress.fullname
                      : null }
                </p>
                <p className={style.address}>
                    Địa chỉ: {address}
                </p>
                <p className={style.phone}>
                    Điện thoại: { deliveryAddress.hasOwnProperty('phoneNumber')
                                  ? deliveryAddress.phoneNumber
                                  : null }
                </p>
            </div>
        </div>
    )
}

export default OrdersAddress;