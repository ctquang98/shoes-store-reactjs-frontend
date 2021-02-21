import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserItem = ({ no, user, handleOpenModal }) => {
    return(
        <tr>
            <td>{no + 1}</td>
            <td>{user.id}</td>
            <td>{user.userName}</td>
            <td>{user.fullName}</td>
            <td>{user.phoneNumber}</td>
            <td>{user.email}</td>
            <td>
                <Button as={Link} to={{ pathname: '/admin/users/edit', user }}
                    // no get only one product api
                    variant="primary" size="sm">Sửa</Button>{' '}
                <Button variant="danger" size="sm"
                onClick={() => handleOpenModal(user.id)}>Xóa</Button>
            </td>
        </tr>
    );
}

export default UserItem;