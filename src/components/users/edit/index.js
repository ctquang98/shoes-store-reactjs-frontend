import React from 'react';
import { Form, Badge, Button, Alert, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import callApi from '../../../api/api';

class EditUser extends React.Component {
    state = {
        user: {
            id: '',
            fullname: '',
            username: '',
            email: '',
            gender: '',
            phoneNumber: '',
            address: '',
            district: ''
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

            callApi(`admin-1/user?userid=${user.id}`, 'PUT', {
                userName: user.username,
                address: user.address,
                district: user.district,
                email: user.email,
                fullName: user.fullname,
                gender: user.gender,
                phoneNumber: user.phoneNumber
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
        if(this.isFormEmpty()) {
            let error = 'Hãy nhập đủ thông tin yêu cầu';
            valid = false;
            this.setState({ error });
        }       
        return valid;
    }

    isFormEmpty = () => {
        const { user } = this.state;
        if(!user.username.length || !user.fullname.length)
            return true;
        return false;
    }    

    showError = error => error ? <Alert variant="danger">
                                {error}</Alert> : '';

    componentDidMount() {
        const { user } = this.props.location;

        if(user) {
            let userParams = {
                id: user.id,
                fullname: user.fullName ? user.fullName : '',
                username: user.userName,
                email: user.email ? user.email : '',
                gender: user.gender ? user.gender : '',
                phoneNumber: user.phoneNumber ? user.phoneNumber : '',
                address: user.address ? user.address : '',
                district: user.district ? user.district : ''
            };
            this.setState({ user: userParams });
        }
    }

    render() {
        const { user, error, submitting } = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>
                    <Badge variant="info">Chỉnh Sửa Thông Tin</Badge>
                </h1>
                <Form.Group>
                    <Form.Label>
                        Họ và Tên <span style={{color: 'red'}}>*</span>
                    </Form.Label>
                    <Form.Control type="text" placeholder="Họ và Tên"
                        size="sm" name="fullname" onChange={this.handleChange}
                        value={user.fullname}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Tài khoản <span style={{color: 'red'}}>*</span></Form.Label>
                    <Form.Control type="text" placeholder="Tài khoản"
                        size="sm" name="username" onChange={this.handleChange}
                        value={user.username}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" size="sm" name="email"
                        onChange={this.handleChange} value={user.email}/>
                </Form.Group>

                <Form.Group onChange={this.handleChange}>
                    <Form.Label>Giới tính</Form.Label>
                    <Col>
                        {/* <Form.Check type="radio" label="Male" name="gender"
                            checked={user.gender === 'NAM'} value="NAM"/>
                        <Form.Check type="radio" label="Female" name="gender"
                            checked={user.gender === 'NỮ'} value="NỮ"/>
                        <Form.Check type="radio" label="Other" name="gender"
                            checked={user.gender === 'KHÁC'} value="KHÁC"/> */}
                        {this.onRenderRadioGroup(user)}
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
                
                {this.showError(error)}

                <Button type="submit"
                    disabled={submitting ? 'disabled' : ''}>
                        {submitting ? 'Đang xử lý...' : 'Lưu'}
                    </Button>{' '}
                <Button type="submit" variant="secondary"
                    as={Link} to="/admin/users">Hủy</Button>
            </Form>
        );
    }
    
    onRenderRadioGroup = ({ gender }) => {
        let radioGroup = [
            {
                label: 'Nam',
                name: 'gender',
                value: 'NAM'
            },
            {                
                label: 'Nữ',
                name: 'gender',
                value: 'NỮ'
            },
            {                
                label: 'Khác',
                name: 'gender',
                value: 'KHÁC'
            }
        ];
        let result = radioGroup.map((item, i) => {
            if(item.value === gender) {
                return <Form.Check key={i} type="radio" label={item.label}
                    name={item.name} defaultChecked value={item.value}/>
            }
            else {
                return <Form.Check key={i} type="radio" label={item.label}
                    name={item.name} value={item.value}/>
            }
        });
        return result;
    }
};

export default EditUser;