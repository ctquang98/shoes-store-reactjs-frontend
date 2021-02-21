import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actCloseModal } from '../../actions/modalAction';
import { actRemoveProductRequest } from '../../actions/cartAction';
import * as msg from '../../constants/cartMessages';

const ModalInform = ({ modal, closeModal, removeProductRequest }) => {
    return (
        <Modal show={modal.showing} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>{modal.header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modal.content}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Hủy
                </Button>
                {onRenderButton(modal, closeModal, removeProductRequest)}
            </Modal.Footer>
        </Modal>
    );
}

const onRenderButton = (modal, closeModal, removeProductRequest) => {
    let to = null;
    let link = null;
    let click = closeModal;
    let btnContent = 'Đồng ý';

    if(modal.content === msg.PAYMENT_REQUIREMENT) {
        link = Link;
        to = {
            pathname: '/login',
            payment: true
        };
    }
    else if (modal.content === msg.PAYMENT_NO_PRODUCT) {
        link = Link;
        to = '/';
    }
    else if (modal.content === msg.CONFIRM_DELETE_CART_ITEM) {
        click = () => removeProductRequest(modal.user, modal.product);
    }
    return <Button as={link} to={to}
                variant="primary" onClick={click}>
                {btnContent}
            </Button>
}

const mapStateToProps = state => ({
    modal: state.modal
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch(actCloseModal()),
    removeProductRequest: (user, product) => dispatch(actRemoveProductRequest(user, product))
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalInform);