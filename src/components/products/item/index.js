import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import formatMoney from '../../../utils/formatMoney';

const ProductItem = ({ no, product, handleOpenModal }) => {
    return(
        <tr>
            <td>{no + 1}</td>
            <td>{product.id}</td>
            <td>{product.productCode}</td>
            <td>{product.name}</td>
            <td>{formatMoney(product.price)} đ</td>
            <td>{product.countInput}</td>
            <td>
                <Button as={Link} to={{ pathname: `/admin/products/edit`, product }}
                    // no get only one product api
                    variant="primary" size="sm">Sửa</Button>{' '}
                <Button variant="danger" size="sm"
                    onClick={() => handleOpenModal(product.id)}>Xóa</Button>
            </td>
        </tr>
    );
}

export default ProductItem;