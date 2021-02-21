import React from 'react';
import FormInfo from './form';
import UserOrder from './order';
import HomeSpinner from '../../components/homeSpinner';
import Title from '../../components/title';
import Pagination from '../../components/pagination';
import { connect } from 'react-redux';
import callAPI from '../../api/api';
import * as msg from '../../constants';
import style from './style.module.css';

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);

        this.sort = 'ASC';

        this.ordersPerPage = 1;

        this.state = {
            orders: {},
            currentPage: 1,
            totalPages: 0,
            userInfo: {},
            oldPassword: '',
            password: '',
            passwordConfirm: '',
            loading: false,
            changingPassword: false,
            submitting: false,
            error: '',
            success: ''
        }
    }

    onChangingPassword = () => {
        const { changingPassword } = this.state;
        this.setState({
            changingPassword: !changingPassword,
            success: ''
        });
    };

    handleChangeValue = e => this.setState({
        [e.target.name]: e.target.value,
        error: ''
    });

    handleSubmitNewPassword = async () => {
        if(this.isFormValid()) {
            const { id: userId } = this.props.user.infor;
            const { oldPassword, password } = this.state;

            if(userId !== -1) {
                this.setState({ submitting: true });
                try {
                    const data = await this.submitNewPassword(userId, oldPassword, password);
                    console.log(data);

                    if(data.message) {
                        this.setState({
                            error: data.message,
                            submitting: false
                        });
                    }
                    else {
                        this.setState({
                            oldPassword: '',
                            password: '',
                            passwordConfirm: '',
                            changingPassword: false,
                            success: 'Đổi mật khẩu thành công',
                            submitting: false
                        });
                    }
                }
                catch(error) {
                    this.setState({ submitting: false });
                    throw error;
                }
            }
        }
    }

    isFormValid = () => {
        let valid = true;
        let error = '';

        if(this.isFormEmpty(this.state)) {
            valid = false;
            error = 'Vui lòng nhập đủ thông tin';
        }
        else if(this.isSamePassword(this.state)) {
            valid = false;
            error = 'Mật khẩu mới không được giống mật khẩu cũ';
        }
        else if(!this.isPasswordConfirmValid(this.state)) {
            valid = false;
            error = 'Mật khẩu nhập lại không đúng';
        }
        else if(!this.isPasswordValid(this.state)) {
            valid = false;
            error = 'Mật khẩu phải chứa ít nhất 6 ký tự';
        }

        if(error) this.setState({ error });

        return valid;
    }

    isFormEmpty = ({ oldPassword, password, passwordConfirm }) =>
        !oldPassword || !password || !passwordConfirm;

    isSamePassword = ({ oldPassword, password }) =>
        oldPassword === password;

    isPasswordConfirmValid = ({ password, passwordConfirm }) =>
        password === passwordConfirm;

    isPasswordValid = ({ password }) => password.length > 5;

    submitNewPassword = (userId, oldPassword, password) => {
        return new Promise((resolve, reject) => {
            callAPI(`user/account/password?userid=${userId}`, 'PUT', {
                oldPass: oldPassword,
                newPass: password
            })
                .then(res => {
                    const { data } = res;
                    resolve(data);
                })
                .catch(error => reject(error));
        });
    }

    handleChangePage = async data => {
        const { id : userId } = this.props.user.infor;
        const currentPage = data.selected + 1;
        let orders = {};

        if(userId !== -1) {
            try {
                const data = await this.getOrdersData(userId, currentPage);

                if(data) {
                    orders = {...data.purchases}
                }
                this.setState({
                    orders,
                    currentPage
                });
            }
            catch(error) {
                throw error;
            }
        }
    }

    getUserData = userId => {
        return new Promise((resolve, reject) => {
            callAPI(`user/account/profile?userid=${userId}`, null, null)
                .then(res => {
                    const { data } = res;
                    resolve(data);
                })
                .catch(error => reject(error));
        });
    }

    getOrdersData = (userId, currentPage) => {
        return new Promise((resolve, reject) => {
            callAPI(`purchase?page=${currentPage}&limit=${this.ordersPerPage}&sort=${this.sort}&userid=${userId}`,
                null, null)
                .then(res => {
                    const { data } = res;
                    resolve(data);
                })
                .catch(error => reject(error));
        });
    }

    async componentDidMount() {
        const { id: userId } = this.props.user.infor;
        const currentPage = 1;
        let userInfo = {};
        let orders = {};
        let totalPages = 0;

        if(userId !== -1) {
            this.setState({ loading: true });

            try {
                const userData = await this.getUserData(userId);
                const ordersData = await this.getOrdersData(userId, currentPage);

                if(userData) {
                    userInfo = {...userData};
                }
                if(ordersData) {
                    orders = {...ordersData.purchases};
                    totalPages = ordersData.totalPage;
                }

                this.setState({
                    userInfo,
                    orders,
                    totalPages,
                    loading: false
                });
            }
            catch(error) {
                this.setState({ loading: false });
                throw error;
            }
        }
    }

    render() {
        const { orders, currentPage, totalPages, userInfo, changingPassword,
            loading, oldPassword, password, passwordConfirm,
            error, success, submitting } = this.state;
        const { id : userId } = this.props.user.infor;
        return (
            userId === -1 ? <Title title={msg.YOU_HAVE_NOT_LOGGED_IN} />
            : loading ? <HomeSpinner />
            : <div className={style.container}>
                <div className={style.infoContainer}>
                    <h5>Thông tin</h5>
                    <div className={style.info}>
                        <FormInfo
                            userInfo={userInfo}
                            oldPassword={oldPassword}
                            password={password}
                            passwordConfirm={passwordConfirm}
                            changingPassword={changingPassword}
                            error={error}
                            success={success}
                            onChangingPassword={this.onChangingPassword}
                            handleChangeValue={this.handleChangeValue}
                            handleSubmitNewPassword={this.handleSubmitNewPassword}
                            submitting={submitting}
                        />
                    </div>
                </div>
                <div className={style.ordersContainer}>
                    <h5>Đơn hàng</h5>
                    {Object.keys(orders).length ?
                      <>
                        <div className={style.orders}>
                            <UserOrder
                                orders={orders}
                            />
                        </div>
                        <div className={style.paginateContainer}>
                            <Pagination
                            currentPage={currentPage - 1}
                            totalPages={totalPages}
                            handleChangePage={this.handleChangePage}
                            />
                        </div>
                      </>
                    : null
                    }
                </div>
              </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, null)(ProfilePage);