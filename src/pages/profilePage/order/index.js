import React from 'react';
import { Form } from 'react-bootstrap';
import formatMoney from '../../../utils/formatMoney';

const UserOrder = (props) => {
    const { orders } = props;
    const amount = Object.keys(orders).length ? `${formatMoney(orders[0].sumMoney)} đ` : null;
    return (
        Object.keys(orders).length
        ? <Form>
            <Form.Group>
                <Form.Label>Mã đơn hàng</Form.Label>
                <Form.Control plaintext readOnly
                    placeholder={orders[0].purchaseCode} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Tên người nhận</Form.Label>
                <Form.Control plaintext readOnly
                    placeholder={orders[0].fullName} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control plaintext readOnly
                    placeholder={orders[0].phoneNumber} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control as="textarea" rows="2" readOnly
                    style={{ backgroundColor: '#fff' }}
                    value={`${orders[0].address}, ${orders[0].ward}, ${orders[0].district}, ${orders[0].provincial}`}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Tổng tiền</Form.Label>
                <Form.Control plaintext readOnly
                    placeholder={amount}/>
            </Form.Group>
          </Form>
        : null
    );
}

export default UserOrder;