import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actAddProductToCartRequest } from '../../actions/cartAction';
import formatMoney from '../../utils/formatMoney';
import style from './style.module.css';

const ProductCards = (props) => {
    const { user, cart, products, addProductToCartRequest } = props;
    return (
            <div className={style.cards}>
                {onRenderCards(user, cart, products, addProductToCartRequest)}
            </div>
    );
}

const onRenderCards = (user, cart, products, addProductToCartRequest) => {
    let result = null;
    if (Array.isArray(products) && products.length) {
        result = products.map((product, i) => {
            const sale = product.saleOff ? `(-${product.saleOff}%)` : null;
            const amount = sale ? product.price * (100 - product.saleOff) / 100 : null;
            const finalAmout = amount ? `${formatMoney(Math.round(amount))}đ ` : null;
            return(
                <div className={style.wrap} key={i}>
                    <Link to={`/details/${product.id}`} className={style.link} key={i}>
                        <img alt="shoes img" className={style.img}
                            // src={require(`../../assets/${product.thumbnail}`)}
                            src={process.env.PUBLIC_URL + `/assets/images/${product.thumbnail}`}
                        />
                        <p className={style.text}>{product.name} {sale}</p>
                        <p className={style.text}>
                            {finalAmout}
                            <span className={finalAmout ? style.line : null}>
                                 {formatMoney(product.price)}đ
                            </span>
                        </p>
                    </Link>
                    <Button variant="info" size="sm"
                        className={style.btnAdd}
                        onClick={() => addProductToCartRequest(user, cart, product)}
                    >Thêm vào giỏ</Button>
                </div>
            )
        });
    }

    return result;
}

const mapStateToProps = state => ({
    user: state.user,
    cart: state.cart
})

const mapDispatchToProps = dispatch => ({
    addProductToCartRequest: (user, cart, product) =>
        dispatch(actAddProductToCartRequest(user, cart, product))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductCards);