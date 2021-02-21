import React from 'react';
import { Button } from 'react-bootstrap';

const Comment = ({ no, comment, handleOpenModal, submitting }) => {
    return(
        <tr>
            <td>{no + 1}</td>
            <td>{comment.id}</td>
            <td>{comment.createdBy}</td>
            <td>{comment.content}</td>
            <td>
                <Button variant="danger" size="sm"
                    disabled={submitting ? 'disabled' : null}
                    onClick={() => handleOpenModal(comment.id)}
                >
                    Xóa
                </Button>
            </td>
        </tr>
    );
}

export default Comment;