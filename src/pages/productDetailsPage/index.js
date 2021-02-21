import React from 'react';
import Title from '../../components/title';
import HomeSpinner from '../../components/homeSpinner';
import ToastInform from '../../components/toastInform';
import Comments from '../../components/comments';
import Rating from '../../components/rating';
import callAPI from '../../api/api';
import ProductCardsPagination from '../../components/productCardsPagination';

import { connect } from 'react-redux';
import { actAddProductToCartRequest, actSubmittingCartData } from '../../actions/cartAction';
import { actAddProductMessage } from '../../actions/messageAction';

import * as msg from '../../constants/cartMessages';
import handleSplitProduct from '../../utils/handleSplitProduct';
import formatMoney from '../../utils/formatMoney';
import style from './style.module.css';

class ProductDetails extends React.Component {
    state = {
        products: [],
        splitedProducts: {},
        selectedColor: '',
        selectedSize: null,
        selectedProduct: {},
        comments: [],
        commentOfUser: {},
        loading: false,
        disabled: false,
        rateDetail: {
            avgRating: 0,
            sumRating: 0
        },
        productsRelated: []
    }

    handleChangeColor = color => {
        const { products, splitedProducts } = this.state;
        const selectedSize = this.setDefaultSelectedSize(color, splitedProducts);
        const selectedProduct = this.setSelectedProduct(selectedSize, color, products)
        const disabled = selectedProduct.countInput ? false : true;
        this.setState({
            selectedColor: color,
            selectedSize,
            selectedProduct,
            disabled
        });        
    };

    handleChangeSize = size => {
        const { products, selectedColor } = this.state;
        const selectedProduct = this.setSelectedProduct(size, selectedColor, products);
        const disabled = selectedProduct.countInput ? false : true;
        this.setState({
            selectedSize: size,
            selectedProduct,
            disabled
        })
    };

    setDefaultSelectedColor = splitedProducts => {
        let result = null;

        if(splitedProducts) {
            const colors = Object.keys(splitedProducts);
            if(colors.length) {
                result = colors[0];
            }
        }

        return result;
    }

    setDefaultSelectedSize = (selectedColor, splitedProducts) => { // choose size follow color
        let result = null;

        if(splitedProducts) {
            const colors = Object.keys(splitedProducts);
            if(colors.length && selectedColor.length) {
                result = splitedProducts[selectedColor][0].size;
            }
        }

        return result;
    }

    setSelectedProduct = (size, color, products) => {
        let result = null;
        if(products.length && size && color.length) {
            let arr = products.filter(product =>
                product.size === size && product.color === color
            );
            result = arr[0];
        }
        return result;
    }

    handleQuantityCheck = disabled => disabled ? msg.OUT_OF_STOCK : msg.BUY_NOW;

    handleAddProduct = (user, cart, product) => {
        const { submittingCartData, addProductRequest} = this.props;
        submittingCartData();
        addProductRequest(user, cart, product);
    }

    handleAddComment = async content => {
        const { id: userId } = this.props.user.infor;
        const { id: productId } = this.props.match.params;

        try {
            await this.addComment(userId, productId, content);
            const data = await this.getProductDetails(productId, userId);
            if(data) {
                this.setState({
                    comments: data.comment.comments,
                    commentOfUser: data.comment.commentOfUser
                });
            }
        }
        catch(error) {
            throw error;
        }
    }

    handleDeleteComment = async commentId => {
        const { id: userId } = this.props.user.infor;
        const { id: productId } = this.props.match.params;

        try {
            await this.deleteComment(userId, productId, commentId);
            const data = await this.getProductDetails(productId, userId);
            if(data) {
                this.setState({
                    comments: data.comment.comments,
                    commentOfUser: data.comment.commentOfUser
                });
            }
        }
        catch(error) {
            throw error;
        }
    }

    handleSubmitRating = async rating => {
        const { id: userId } = this.props.user.infor;
        const { id: productId } = this.props.match.params;

        try {
            await this.submitRating(userId, productId, rating);
            const data = await this.getProductDetails(productId, userId);
            if(data) {
                this.setState({
                    rateDetail: data.rateDetail
                });
            }
        }
        catch(error) {
            throw error;
        }
    }

    addComment = (userId, productId, content) => {
        return new Promise((resolve, reject) => {
            callAPI(`comment?userid=${userId}&productid=${productId}`, 'POST', { content })
                .then(res => {
                    resolve(res);
                })
                .catch(error => reject(error));
        });
    }

    deleteComment = (userId, productId, commentId) => {
        return new Promise((resolve, reject) => {
            callAPI(`comment?userid=${userId}&productid=${productId}&commentid=${commentId}`,
            'DELETE', null)
                .then(res => {
                    resolve(res);
                })
                .catch(error => reject(error));
        });
    }

    submitRating = (userId, productId, rating) => {
        return new Promise((resolve, reject) => {
            callAPI(`rate?userid=${userId}&productid=${productId}`, 'POST', {
                numRating: rating
            })
                .then(res => {
                    resolve(res);
                })
                .catch(error => reject(error));
        });
    }

    getProductDetails = (productId, userId) => {
        return new Promise((resolve, reject) => {
            callAPI(`detail?productid=${productId}&userid=${userId}`, null, null)
                .then(res => {
                    const { data } = res;
                    resolve(data);
                })
                .catch(error => reject(error));
        });
    }

    UNSAFE_componentWillUpdate(nextProps) {
        //console.log('next props', nextProps);
    }
    async componentDidUpdate(prevProps) {
        // console.log('prevProps', prevProps.match);
        // console.log('props', this.props.match);
        const { id : prevProductId } = prevProps.match.params;
        const { id : productId } = this.props.match.params;

        if(prevProductId !== productId) {
            const { id : userId } = this.props.user.infor;
            this.setState({ loading: true });

            try {
                const data = await this.getProductDetails(productId, userId);
                if(data) {
                    const { products } = data;
                    const splitedProducts = handleSplitProduct(products, 'color');
                    const selectedColor = this.setDefaultSelectedColor(splitedProducts);
                    const selectedSize = this.setDefaultSelectedSize(selectedColor, splitedProducts);
                    const selectedProduct = this.setSelectedProduct(selectedSize, selectedColor, products);
                    const disabled = selectedProduct && selectedProduct.countInput ?
                                        false : true;
                    const { comments } = data.comment;
                    const { commentOfUser } = data.comment;
                    const { rateDetail, productsRelated } = data;
                    console.log('product detail didUpdate', data);
                    this.setState({
                        products,
                        splitedProducts,
                        selectedColor,
                        selectedSize,
                        selectedProduct,
                        comments,
                        commentOfUser,
                        loading: false,
                        disabled,
                        rateDetail,
                        productsRelated
                    });
                }
                else this.setState({ loading: false });
            }
            catch(error) {
                console.error(error);
                this.setState({ loading: false });
            }
        }
    }

    async componentDidMount() {
        const { id : userId } = this.props.user.infor;
        const { id : productId } = this.props.match.params;
        this.setState({ loading: true });

        try {
            const data = await this.getProductDetails(productId, userId);
            if(data) {
                const { products } = data;
                const splitedProducts = handleSplitProduct(products, 'color');
                const selectedColor = this.setDefaultSelectedColor(splitedProducts);
                const selectedSize = this.setDefaultSelectedSize(selectedColor, splitedProducts);
                const selectedProduct = this.setSelectedProduct(selectedSize, selectedColor, products);
                const disabled = selectedProduct && selectedProduct.countInput ?
                                    false : true;
                const { comments } = data.comment;
                const { commentOfUser } = data.comment;
                const { rateDetail, productsRelated } = data;
                console.log('product detail didmount', data);
                this.setState({
                    products,
                    splitedProducts,
                    selectedColor,
                    selectedSize,
                    selectedProduct,
                    comments,
                    commentOfUser,
                    loading: false,
                    disabled,
                    rateDetail,
                    productsRelated
                });
            }
            else this.setState({ loading: false });
        }
        catch(error) {
            console.error(error);
            this.setState({ loading: false });
        }
    }

    render () {
        const { splitedProducts, selectedProduct, selectedColor, selectedSize,
            loading, disabled, comments, commentOfUser, rateDetail, productsRelated } = this.state;
        const { id : productId } = this.props.match.params;
        const { user, cart, submitting } = this.props;
        return (
            loading ? <HomeSpinner /> :
            <div>
                <Title title='Chi tiết sản phẩm'/>
                {Object.keys(selectedProduct).length ?
                <div className={style.container}>
                    <div className={style.imgContainer}>
                        <img alt="shoes img"
                            // src={require(`../../assets/${selectedProduct.thumbnail}`)}
                            src={process.env.PUBLIC_URL + `/assets/images/${selectedProduct.thumbnail}`}
                        />
                    </div>
                    <div className={style.contents}>
                        <div className={style.title}>
                            <h3>{selectedProduct.name}</h3>
                            <div>
                                <Rating
                                    avgRating={rateDetail.avgRating ? rateDetail.avgRating : 0}
                                    disabledRating={true}
                                />
                                <p>({rateDetail.sumRating ? rateDetail.sumRating : 0})</p>
                            </div>
                            <p>{selectedProduct.category}</p>
                        </div>
                        <div className={style.description}>
                            <p>Thông tin</p>
                            <p>{selectedProduct.content}</p>
                        </div>
                        <div className={style.color}>
                            <p>Màu sắc</p>
                            <div className={style.colorContainer}>
                                {this.onRenderColor(selectedColor, splitedProducts)}
                            </div>
                        </div>
                        <div className={style.size}>
                            <p>Kích cỡ</p>
                            <div className={style.sizeContainer}>
                                {this.onRenderSize(selectedSize, selectedColor, splitedProducts)}
                            </div>
                        </div>
                        <div className={style.price}>
                            <div
                                disabled={disabled || submitting}
                                onClick={() => this.handleAddProduct(user, cart, selectedProduct)}
                            >
                                {this.handleQuantityCheck(disabled)}
                            </div>
                            <h3>{this.onRenderPrice(selectedProduct)}đ</h3>
                        </div>
                    </div>
                    <ToastInform />
                </div>
                : null
                }

                <div className={style.ratingContainer}>
                    <p>Đánh giá </p>
                    <Rating
                        avgRating={0}
                        disabledRating={user.infor.id === -1 ? true : false}
                        handleSubmitRating={this.handleSubmitRating}
                    />
                </div>

                <Comments
                    comments={comments}
                    commentOfUser={commentOfUser}
                    user={user}
                    productId={productId}
                    addComment={this.handleAddComment}
                    deleteComment={this.handleDeleteComment}
                />

                <div className={style.productRelatedContainer}>
                    <div className={style.description2}>
                        <h3>Sản phẩm liên quan</h3>
                    </div>
                    <ProductCardsPagination products={productsRelated} />
                </div>

            </div>
        );
    }

    onRenderColor = (selectedColor, splitedProducts) => {
        let result = null;
        const colors = Object.keys(splitedProducts); //array color
        if(colors.length) {
            result = colors.map((color, i) => (
                <div key={i} className={selectedColor === color ? style.active : null}
                    onClick={() => this.handleChangeColor(color, splitedProducts)}
                >
                    {color}
                </div>
            ));
        }
        return result;
    }

    onRenderSize = (selectedSize, selectedColor, splitedProducts) => { // for active size and size follow collor
        let result = null;
        const productsByColor = splitedProducts[selectedColor];
        if(productsByColor.length) {
            result = productsByColor.map((product, i) => (
                <div key={i}
                    className={selectedSize === product.size ? style.active : null}
                    onClick={() => this.handleChangeSize(product.size)}>
                    {product.size}
                </div>
            ));
        }
        return result;
    }

    onRenderPrice = product => {
        let result = 0;
        if(product && Object.keys(product).length) {
            let price1 = product.price * (100 - product.saleOff) / 100;
            result = formatMoney(Math.round(price1));

        }
        return result;
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        cart: state.cart.cart,
        submitting: state.cart.submitting
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addProductRequest: (user, cart, product) => {
            dispatch(actAddProductToCartRequest(user, cart, product));
            dispatch(actAddProductMessage());
        },
        submittingCartData: () => dispatch(actSubmittingCartData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);