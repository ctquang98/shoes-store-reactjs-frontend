import React from 'react';
import { Link } from 'react-router-dom';
import callAPI from '../../api/api';
import { connect } from 'react-redux';
import { actLoginRequest } from '../../actions';
import { actSyncCartToServer } from '../../actions/cartAction';
import styles from './style.module.css';

class Register extends React.Component {
    state = {
        username: '',
        fullname: '',
        gender: '',
        email: '',
        password: '',
        passwordConfirm: '',
        submitting: false,
        error: ''
    }

    genders = [
        {label: 'Nam', value: 'NAM'},
        {label: 'Nữ', value: 'NỮ'}
    ];

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value, error: '' });
    }

    handleSubmit = event => {
        event.preventDefault();

        if(this.isFormValid(this.state)){
            this.setState({ submitting: true });
            const { username, fullname, gender, email, password } = this.state;

            callAPI('register', 'POST', {
                userName: username,
                fullName: fullname,
                email,
                gender,
                passWord: password
            }).then(res => {  // call api login because api register not response user info
                this.props.login(username, password)
                .then(res => {
                    const { user, cart, syncCartToServer } = this.props;
                    syncCartToServer(user, cart);
                    this.setState({ submitting: false });

                    let url = '/';
                    const { payment } = this.props.location;

                    if (payment) {
                        url = '/delivery-address';
                    }
                    else if (user.role.includes('admin')) {
                        url = '/admin';
                    }
                    
                    this.props.history.push(url);
                })
                .catch(error => {
                    console.error(error);
                    this.setState({ submitting: false });
                });
            }).catch(error => {
                console.error(error);
                this.setState({
                    submitting: false,
                    error: 'Đã có lỗi xảy ra trong quá trình xử lý'
                });
            });
        }        
    }

    isFormValid = (user) => {
        let valid = true;
        let error = '';

        if(this.isFormEmpty(user)) {
            error = 'Vui lòng điền đầy đủ thông tin';
            valid = false;
        }        
        else if (!this.isUsernameValid(user)) {
            error = 'Tài khoản không hợp lệ';
            valid = false;
        }
        else if (!this.isEmailValid(user)) {
            error = 'Email không hợp lệ';
            valid = false;
        }
        else if(!this.isPasswordValid(user)) {
            error = 'Mật khẩu không hợp lệ';
            valid = false;
        }
        else if (!this.isPasswordConfirmValid(user)) {
            error = 'Mật khẩu gõ lại không đúng';
            valid = false;
        }
        else if (!this.isGenderValid(user)) {
            error = 'Vui lòng chọn giới tính';
            valid = false;
        }

        if (error) {
            this.setState({ error: error });
        }
        return valid;
    }

    isFormEmpty = ({ username, fullname, email, password, passwordConfirm }) =>
                    !email || !username || !password || !passwordConfirm || !fullname

    isUsernameValid = ({ username }) => username.length > 5 && username.length < 100;

    isPasswordValid = ({ password }) => password.length > 5 && password.length < 100;
    
    isPasswordConfirmValid = ({ password, passwordConfirm }) => password === passwordConfirm;

    isEmailValid = ({ email }) => email.length > 6 && email.includes('@');

    isGenderValid = ({ gender }) => gender.length !== 0;

    isFormSubmitting = submitting => submitting ? 'Chờ trong giây lát...' : 'Xác nhận';

    displayError = error => error.length ? <p className={styles.error}>{error}</p> : '';

    render() {
        const { username, password, passwordConfirm,
                email, fullname, submitting, error } = this.state;
        return (
            <div className={styles.container}>
                <div className={styles.register}>
                    <form className={styles.registerForm} onSubmit={this.handleSubmit}>
                        <h1>Đăng ký</h1>
                        <input type="text" placeholder="Tài khoản" name="username"
                            value={username} onChange={this.handleChange}
                        />
                        <input type="text" placeholder="Họ và tên" name="fullname"
                            value={fullname} onChange={this.handleChange}
                        />
                        <select name="gender" onChange={this.handleChange}>
                            <option disabled selected>Giới tính</option>
                            {onRenderGender(this.genders)}
                        </select>
                        <input type="email" placeholder="Email" name="email"
                            value={email} onChange={this.handleChange}
                        />
                        <input type="password" placeholder="Mật khẩu" name="password"
                            value={password} onChange={this.handleChange}
                        />
                        <input type="password" placeholder="Gõ lại mật khẩu" name="passwordConfirm"
                            value={passwordConfirm} onChange={this.handleChange}
                        />
                        
                        {this.displayError(error)}

                        <input type="submit"
                            value={this.isFormSubmitting(submitting)}
                            disabled={submitting ? 'disabled' : ''}
                        />
                    </form>
                    <p className={styles.login}>
                        Bạn đã có tài khoản? {' '}
                        <Link to="/login" className={styles.signIn}>
                            Đăng nhập!
                        </Link>
                    </p>
                </div>
            </div>
        );
    }
}

const onRenderGender = genders => {
    let result = null;
    if(Array.isArray(genders) && genders.length) {
        result = genders.map(gender => 
            <option value={gender.value}>{gender.label}</option>
        );
    }
    return result;
}

const mapStateToProps = state => {
    return {
        user: state.user,
        cart: state.cart.cart
    }
}

const mapDispatchToProps = dispatch => ({
    login: (username, password) =>
        dispatch(actLoginRequest(username, password)),
    syncCartToServer: (user, cart) => dispatch(actSyncCartToServer(user, cart))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register);