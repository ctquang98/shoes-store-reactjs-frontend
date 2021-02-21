import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AdminModal = ({ showModal, handleCloseModal, handleDeleteComment,submitting }) => {
    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>Xác nhận</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc chắn muốn xóa bình luận này?</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
            </Button>
            <Button
                variant="primary"
                disabled={submitting ? 'disabled' : null}
                onClick={handleDeleteComment}
            >
                Đồng ý
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdminModal;