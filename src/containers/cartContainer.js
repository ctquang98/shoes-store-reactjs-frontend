import React from 'react';
import Cart from '../pages/cartPage';
import CartItem from '../components/cartItem';
import { connect } from 'react-redux';
import { actIncreaseProductRequest, actDecreaseProductRequest } 
    from '../actions/cartAction';
import { actOpenModal, actRemoveCartItemModal } from '../actions/modalAction';

class CartContainer extends React.Component {
    render() {
        const { user, cart, openModal } = this.props;
        return (
            <Cart
                user={user}
                cart={cart}
                openModal={openModal}
            >
                {this.onRenderDataRow(cart)}
            </Cart>
        );
    }

    onRenderDataRow = (cart) => {
        let result = null;
        const { user, increaseProductRequest, decreaseProductRequest,
            removeCartItemModal } = this.props;

        if (cart.length) {
            result = cart.map((item, i) => (
                <CartItem key={i}
                    user={user}
                    cartItem={item}
                    increaseProductRequest={increaseProductRequest}
                    decreaseProductRequest={decreaseProductRequest}
                    removeCartItemModal={removeCartItemModal}
                />
            ));
        }
        return result;
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        cart: state.cart.cart,
        message: state.message
    }
}

const mapDispatchToProps = dispatch => {
    return {
        increaseProductRequest: (user, cartItem) =>
            dispatch(actIncreaseProductRequest(user, cartItem)),
        decreaseProductRequest: (user, cartItem) =>
            dispatch(actDecreaseProductRequest(user, cartItem)),
        openModal: (header, content) => dispatch(actOpenModal(header, content)),
        removeCartItemModal: (header, content, user, product) =>
            dispatch(actRemoveCartItemModal(header, content, user, product))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartContainer);