import React from 'react';
import { Button } from 'react-bootstrap';
import style from './style.module.css';
import formatMoney from '../../../utils/formatMoney';

const Order = ({ no, order, handleApproveOrder, submitting }) => {
    const finalAddress = `${order.address}, ${order.ward}, ${order.district}, ${order.provincial}`;
    return(
        <tr>
            <td>{no + 1}</td>
            <td>{order.id}</td>
            <td>{order.purchaseCode}</td>
            <td>{order.fullName}</td>
            <td>{finalAddress}</td>
            <td>{order.shipCode}</td>
            <td>{formatMoney(order.sumMoney)}đ</td>
            <td>
                <span className={style.process}
                    style={ order.status ? { backgroundColor: '#efcd3b' }
                            : { backgroundColor: 'red' } }>
                    { order.status ? 'Đang chờ' : 'Đã xử lý' }
                </span>
            </td>
            <td>
                {order.status === 1 ?
                 <Button variant="primary" size="sm"
                    onClick={() => handleApproveOrder(order.id)}
                    disabled={submitting ? 'disabled' : null}
                 >
                     Duyệt
                 </Button>
                 : null
                }
            </td>
        </tr>
    );
}

export default Order;