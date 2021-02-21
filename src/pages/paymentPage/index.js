import React from 'react';
import Title from '../../components/title';
import Orders from '../../components/orders';
import OrdersAddress from '../../components/orders/ordersAddress';
import HomeSpinner from '../../components/homeSpinner';
import * as msg from '../../constants';
import callAPI from '../../api/api';
import { connect } from 'react-redux';
import { actClearCartData } from '../../actions/cartAction';
import { Button } from 'react-bootstrap';
import formatMoney from '../../utils/formatMoney';
import style from './style.module.css';

class PaymentPage extends React.Component {
    state = {
        cart: {},
        ships: [],
        delivery: {},
        payment: 'cash',
        loading: false,
        submitting: false
    }

    handleChange = e => this.setState({ [e.target.name]: JSON.parse(e.target.value) });

    handleSubmit = () => {
        const { user, deliveryAddress } = this.props;
        const { cart: cartFromServer, delivery } = this.state;
        const sumMoney = cartFromServer.sumMoneys - parseInt(delivery.shipMoney);

        if(user.infor.id !== -1) {
            this.setState({ submitting: true });
            callAPI(`order?userid=${user.infor.id}`, 'POST', {
                fullName: deliveryAddress.fullname,
                phoneNumber: deliveryAddress.phoneNumber,
                email: '',
                address: deliveryAddress.address,
                district: deliveryAddress.selectedDistrict.name,
                provincial: deliveryAddress.selectedProvince.name,
                ward: deliveryAddress.selectedWard.name,
                sumMoney,
                shipCode: delivery.code
            }).then(res => {
                console.log('payment successed...');
                console.log(res);

                this.props.clearCartData();
                this.setState({ submitting: false });
                this.props.history.push('/payment-successed');
            })
              .catch(err => {
                console.error(err)
                this.setState({ submitting: false });
              });
        }
    }

    componentDidMount() {
        const { user } = this.props;
        let cart = {};
        let ships = [];

        if(user.infor.id !== -1) {
            this.setState({ loading: true });
            callAPI(`order?userid=${user.infor.id}`, null, null)
            .then(res => {
                cart = {...res.data.cart};
                ships = [...res.data.ships];

                const delivery = ships.length ? ships[0] : {};
                this.setState({ cart, ships, delivery, loading: false });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
        }
    }
    
    render() {
        const { ships, delivery, loading, submitting } = this.state;
        const { user, cart, deliveryAddress } = this.props;
        const loggedIn = user.infor.id === -1 ? false : true;
        const title = loggedIn ? msg.PAYMENT_TITLE : msg.YOU_HAVE_NOT_LOGGED_IN;
        const deliveryMoney = Object.keys(delivery).length ? `${delivery.shipMoney}` : '';
        return (
            <div>
                <Title title={title} />

                {!loggedIn || !cart.length ? null
                 : loading ? <HomeSpinner />
                 : <div className={style.container}>
                    <div className={style.paymentContainer}>

                        <p className={style.menuItem}>1. Chọn hình thức giao hàng</p>
                        <div className={style.delivery}>
                            {this.onRenderDeliveryMethod(ships, deliveryMoney)}
                        </div>

                        <p className={style.menuItem}>2. Chọn hình thức thanh toán</p>
                        <div className={style.payment}>
                            <div>
                                <input type="radio" name="payment"
                                value="cash" defaultChecked />
                                <label>Thanh toán tiền mặt khi nhận hàng</label>
                            </div>
                        </div>
                        <Button variant="danger" size="lg"
                            className={style.btnAdd}
                            disabled={submitting}
                            onClick={this.handleSubmit}
                        >
                            {submitting ? 'Đang xử lý...' : 'Đặt mua'}
                        </Button>
                    </div>
                    <div className={style.infoContainer}>
                        <Orders cart={cart} delivery={deliveryMoney} />
                        <OrdersAddress deliveryAddress={deliveryAddress}/>
                    </div>
                  </div>
                }
            </div>
        );
    }

    onRenderDeliveryMethod = (ships, deliveryMoney) => {
        let result = null;
        if(ships.length) {
            result = ships.map((ship, i) => {
                const selected = ship.shipMoney === parseInt(deliveryMoney) ? true : false
                const deliveryAmount = ship.shipMoney ? formatMoney(ship.shipMoney) : 0;
                return <div key={i}>
                            <input type="radio" name="delivery" value={JSON.stringify(ship)}
                                onChange={this.handleChange} defaultChecked={selected}/>
                            <label>{ship.name} - {deliveryAmount}đ</label>
                        </div>
            })
        }
        return result;
    }
}

const mapStateToProps = state => ({
    user: state.user,
    cart: state.cart.cart,
    deliveryAddress: state.deliveryAddress
});

const mapDispatchToProps = dispatch => ({
    clearCartData: () => dispatch(actClearCartData())
})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage);