import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actLoginRequest } from '../../actions';
import { actSyncCartToServer } from '../../actions/cartAction';
import styles from './style.module.css';
import Facebook from "../../components/facebookLogin";
class Login extends React.Component {
    state = {
        username: '',
        password: '',
        submitting: false,
        error: ''
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value, error: '' });
    }
    handleSubmit = event => {
        event.preventDefault();

        if(this.isFormValid(this.state)){
            this.setState({ submitting: true });
            const { username, password } = this.state;

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
                    this.setState({ submitting: false, error: 'Tài khoản hoặc mật khẩu không chính xác' });
                });
        }        
    }

    isFormValid = ({ username, password }) => {
        let valid = true;
        let error = '';

        if (!username.length && !password.length) {
            valid = false;
            error = 'Tài khoản & Mật khẩu không thể để trống';
        }
        else if (!username.length) {
            valid = false;
            error = 'Tài khoản không thể để trống';
        }
        else if (!password) {
            valid = false;
            error = 'Mật khẩu không thể để trống';
        }

        if (error) {
            this.setState({ error: error });
        }        
        return valid;
    }

    isFormSubmitting = submitting => submitting ? 'Chờ giây lát...' : 'Xác nhận';

    displayError = error => error.length ? <p className={styles.error}>{error}</p> : '';

    render() {
        const { username, password, submitting, error } = this.state;
        return (
            <div className={styles.container}>
                <div className={styles.login}>

                    <form className={styles.loginForm} onSubmit={this.handleSubmit}>
                        <h1>Đăng nhập</h1>
                        <input type="text" placeholder="Tài khoản" name="username"
                            value={username} onChange={this.handleChange}
                        />
                        <input type="password" placeholder="Mật khẩu" name="password"
                            value={password} onChange={this.handleChange}
                        />

                        {this.displayError(error)}

                        <input type="submit"
                            value={this.isFormSubmitting(submitting)}
                            disabled={submitting ? 'disabled' : ''}
                        />
                    </form>
                    <p className={styles.register}>
                        Bạn không có tài khoản? {' '}
                        <Link to="/register" className={styles.signUp}>
                            Đăng ký!
                        </Link>
                    </p>
                    <Facebook
                        history={this.props.history}
                        location={this.props.location}
                    />
                </div>
            </div>
        );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);