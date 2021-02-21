import React from 'react';
import { Toast } from 'react-bootstrap';
import { connect } from 'react-redux'
import { actCloseToast } from '../../actions/messageAction';
import style from './style.module.css';

const ToastInForm = ({ message, closeToast }) => {
    return (
        <Toast onClose={closeToast} className={style.toast}
            show={message.showToast} delay={500} autohide>
            <Toast.Header>
                <strong className="mr-auto">Thông báo</strong>
            </Toast.Header>
            <Toast.Body>{message.message}</Toast.Body>
        </Toast>
    );
}

const mapStateToProps = state => {
    return {
        message: state.message
    }
}

const mapDispatchToProps = dispatch => {
    return {
        closeToast: () => dispatch(actCloseToast())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToastInForm);