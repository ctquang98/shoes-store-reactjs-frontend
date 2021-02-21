import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actAddProductToCartRequest } from '../../actions/cartAction';
import { Slide } from 'react-reveal';
//import { TransitionGroup } from 'react-transition-group';

import formatMoney from '../../utils/formatMoney';
import style from './style.module.css';

const productPerPage = 4;

class ProductCardsPagination extends React.Component {
    state = {
        products: [],
        currentPage: 0,
        totalPage: 0
    }

    updateCurrentPage = page => {
        const { totalPage } = this.state;
        if(page < 1 || page > totalPage ) page = 1;
        //else if(page < 1) page = 1;
        this.setState({ currentPage: page });
    }

    componentDidMount() {
        const { products } = this.props;
        const totalPage = Math.ceil(products.length/4) || 0;
        
        if(Array.isArray(products) && products.length) {
            this.setState({
                products,
                currentPage: 1,
                totalPage
            });
        }
    }

    render() {
        const { user, cart, addProductToCartRequest } = this.props;
        const { products, currentPage, totalPage } = this.state;
        const visible = currentPage >= 2 ? '' : 'hidden';
        return (
                <div>
                    <div className={style.buttonContainer}>
                        <Button
                            variant="success" size="sm"
                            style={{ visibility: visible }}
                            onClick={() => this.updateCurrentPage(currentPage-1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="info" size="sm"
                            onClick={() => this.updateCurrentPage(currentPage+1)}
                        >
                            Next
                        </Button>
                    </div>
                    <Slide left spy={currentPage}>
                            <div className={style.cards}>
                                {onRenderCards(user, cart, products, addProductToCartRequest,
                                    currentPage, totalPage, productPerPage)}
                            </div>
                    </Slide>
                </div>
        );
    }
}

const onRenderCards = (user, cart, products,addProductToCartRequest,
    currentPage, totalPage, productPerPage) => {
    let result = null;
    if (currentPage && totalPage) {
        let displayedProducts = [];
        let startIndex = (currentPage - 1) * productPerPage;
        for(let j = startIndex; j < currentPage * productPerPage; j++) {
            if(j >= products.length) break; //product 41 42 43,...
            displayedProducts.push(products[j]);
        }
        if(displayedProducts.length) {
            result = displayedProducts.map((product, i) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductCardsPagination);