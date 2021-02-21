import React from 'react';
import { Form, Badge, Button, Alert, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import callApi from '../../../api/api';

class AddUser extends React.Component {
    state = {
        user: {
            fullname: '',
            username: '',
            password: '',
            passwordConfirm: '',
            email: '',
            gender: '',
            phoneNumber: '',
            address: '',
            district: '',
            typeRole: ''
        },
        error: '',
        submitting: false
    }

    handleChange = event => {
        let key = event.target.name;
        let value = event.target.value;
        let { user } = this.state;
        user = {...user, [key]: value};
        this.setState({ user, error: '' });
    }    

    handleSubmit = (event) => {
        event.preventDefault();

        if(this.isFormValid()) {
            this.setState({ submitting: true });
            const { user } = this.state;
            callApi('admin-1/accounts', 'POST', {
                userName: user.username,
                passWord: user.password,
                address: user.address,
                district: user.district,
                email: user.email,
                fullName: user.fullname,
                gender: user.gender,
                phoneNumber: user.phoneNumber,
                typeRole: user.typeRole
            }).then(res => {
                console.log(res);
                this.setState({ submitting: false });
                this.props.history.goBack();
            }).catch(error => {
                console.error(error);
                this.setState({ submitting: false, error: 'Some errors have occurred' });
            });
        }
    }

    isFormValid = () => {
        let valid = true;
        const { user } = this.state;
        if(this.isFormEmpty(user)) {
            let error = 'Hãy điền đủ thông tin yêu cầu';
            valid = false;
            this.setState({ error });
        }
        else if(!this.isPasswordConfirmValid(user)) {
            let error = 'Xác nhận mật khẩu không hợp lệ';
            valid = false;
            this.setState({ error });
        }
        return valid;
    }

    isFormEmpty = ({ fullname, username, password, passwordConfirm }) => {
        return !fullname.length || !username.length || !password.length || !passwordConfirm.length;
    }

    isPasswordConfirmValid = ({ password, passwordConfirm }) =>
        password === passwordConfirm;

    showError = error => error ? <Alert variant="danger">
                                {error}</Alert> : '';

    componentDidMount() {
        const { roles } = this.props;
        const { user } = this.state;

        if(Array.isArray(roles) && roles.length) {
            this.setState({ user: {...user, typeRole: roles[0].code} });
        }
    }

    render() {
        const { user, error, submitting } = this.state;
        const { roles } = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>
                    <Badge variant="info">Thêm Người Dùng</Badge>
                </h1>
                <Form.Group>
                    <Form.Label>
                        Họ và tên <span style={{color: 'red'}}>*</span>
                    </Form.Label>
                    <Form.Control type="text" placeholder="Họ và tên"
                        size="sm" name="fullname" onChange={this.handleChange}
                        value={user.fullname}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Tài khoản <span style={{color: 'red'}}>*</span>
                    </Form.Label>
                    <Form.Control type="text" placeholder="Tên tài khoản"
                        size="sm" name="username" onChange={this.handleChange}
                        value={user.username}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Mật khẩu <span style={{color: 'red'}}>*</span>
                    </Form.Label>
                    <Form.Control type="password" placeholder="Mật khẩu" size="sm"
                        name="password" onChange={this.handleChange}
                        value={user.password}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Gõ lại mật khẩu <span style={{color: 'red'}}>*</span>
                    </Form.Label>
                    <Form.Control type="password" placeholder="Gõ lại mật khẩu"
                        size="sm" name="passwordConfirm" onChange={this.handleChange}
                        value={user.passwordConfirm}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" size="sm" name="email"
                        onChange={this.handleChange} value={user.email}/>
                </Form.Group>
                <Form.Group onChange={this.handleChange}>
                    <Form.Label>Giới tính</Form.Label>
                    <Col>
                        <Form.Check type="radio" label="Nam" name="gender" value="NAM"/>
                        <Form.Check type="radio" label="Nữ" name="gender" value="NỮ"/>
                        <Form.Check type="radio" label="Khác" name="gender" value="KHÁC"/>
                    </Col>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control as="input" type="number" placeholder="Số điện thoại"
                        min="0" max="999999999999" size="sm" name="phoneNumber"
                        onChange={this.handleChange}
                        value={user.phoneNumber}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control as="textarea" row="3" placeholder="Địa chỉ" size="sm"
                        name="address" onChange={this.handleChange} value={user.address}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Quận</Form.Label>
                    <Form.Control type="text" placeholder="Quận" size="sm"
                        name="district" onChange={this.handleChange}
                        value={user.district}/>
                </Form.Group>
                
                <Form.Group>
                    <Form.Label>Phân quyền</Form.Label>
                    <Form.Control as="select" size="sm"
                        name='typeRole'
                        value={user.typeRole}
                        onChange={this.handleChange}
                    >
                        {this.onRenderRoles(roles)}
					</Form.Control>
                </Form.Group>

                {this.showError(error)}

                <Button type="submit"
                    disabled={submitting ? 'disabled' : null}>
                        {submitting ? 'Đang xử lý...' : 'Lưu'}
                    </Button>{' '}
                <Button type="submit" variant="secondary"
                    as={Link} to="/admin/users">Hủy</Button>
            </Form>
        );
    }

    onRenderRoles = roles => {
        let result = null;

        if(Array.isArray(roles) && roles.length) {
            result = roles.map((role, i) => (
                <option key={i} value={role.code}>{role.name}</option>
            ));
        }
        return result;
    }
};

const mapStateToProps = state => ({
    roles: state.adminRoles
});

export default connect(mapStateToProps, null)(AddUser);