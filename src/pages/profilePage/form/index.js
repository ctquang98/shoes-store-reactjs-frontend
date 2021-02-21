import React from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import style from '../style.module.css';

const FormInfo = (props) => {
    const { userInfo, changingPassword, oldPassword, submitting,
        password, passwordConfirm, error, success } = props;
    return (
        Object.keys(userInfo).length
        ? <Form>
            <Form.Group as={Row}>
                <Form.Label column sm="3" size="sm">
                    Tài khoản
                </Form.Label>
                <Col sm="9">
                    <Form.Control plaintext readOnly
                        placeholder={userInfo.userName}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm="3">
                    Họ và tên
                </Form.Label>
                <Col sm="9">
                    <Form.Control plaintext readOnly
                        placeholder={userInfo.fullName} />
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm="3">
                    Số điện thoại
                </Form.Label>
                <Col sm="9">
                    <Form.Control plaintext readOnly
                        placeholder={userInfo.phoneNumber} />
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm="3">
                    Email
                </Form.Label>
                <Col sm="9">
                    <Form.Control plaintext readOnly
                        placeholder={userInfo.email} />
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm="3">
                    Địa chỉ
                </Form.Label>
                <Col sm="9">
                    <Form.Control plaintext readOnly
                        placeholder={userInfo.address} />
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm="3">
                    Giới tính
                </Form.Label>
                <Col sm="9">
                    <Form.Control plaintext readOnly
                        placeholder={userInfo.gender} />
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm="3"
                    onClick={props.onChangingPassword}
                    className={style.changePassLabel}
                >
                    Đổi mật khẩu?
                </Form.Label>
                {changingPassword ?
                  <Col sm="9">
                    <Form.Group>
                        <Form.Label>Mật khẩu cũ</Form.Label>
                        <Form.Control type="password" size="sm" 
                            name="oldPassword" value={oldPassword}
                            onChange={props.handleChangeValue}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Mật khẩu mới</Form.Label>
                        <Form.Control type="password" size="sm"
                            name="password" value={password}
                            onChange={props.handleChangeValue}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                        <Form.Control type="password" size="sm"
                            name="passwordConfirm" value={passwordConfirm}
                            onChange={props.handleChangeValue}
                        />
                    </Form.Group>

                    {error ? <Alert variant="danger" size="sm">{error}</Alert> : null}
                    
                    <Form.Group>
                        <Button variant="primary" size="sm"
                            onClick={props.handleSubmitNewPassword}
                            disabled={submitting ? 'disabled' : null}
                        >
                            Gửi
                        </Button>
                    </Form.Group>
                  </Col>
                : null
                }
            </Form.Group>

            {success ? <Alert variant="success" size="sm">{success}</Alert> : null}
          </Form>
        : null
    );
}

export default FormInfo;