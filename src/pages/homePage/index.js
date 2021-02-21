import React from 'react';
import style from './style.module.css';
import SlideShow from '../../components/slideShow';
import CategoryGenderBox from '../../components/cateroryGenderBox';
import ProductCards from '../../components/productCards';
import ProductCardsPagination from '../../components/productCardsPagination';
// import { Link } from 'react-router-dom';
// import { Button} from 'react-bootstrap';
import { connect } from 'react-redux';

const onRenderNewProducts = products =>
    Array.isArray(products) && products.length
    ? <div>
        <div className={style.description}>
                <h2>Sản phẩm mới nhất</h2>
            </div>
        <ProductCards products={products} />
      </div>
    : null;

const onRenderRecommendProducts = products =>
    Array.isArray(products) && products.length
    ? <div>
        <div className={style.description}>
            <h2>Sản phẩm đề xuất</h2>
        </div>
        <ProductCardsPagination products={products} />
      </div>
    : null;

const onRenderPopularProducts = products =>
    Array.isArray(products) && products.length
    ? <div>
        <div className={style.description}>
            <h2>Sản phẩm phổ biến</h2>
        </div>
        <ProductCardsPagination products={products} />
      </div>
    : null
const HomePage = (props) => {
    return (
        <div className={style.container}>
            <SlideShow />
            <CategoryGenderBox />
            {onRenderNewProducts(props.products)}
            {onRenderRecommendProducts(props.recommendProducts)}
            {onRenderPopularProducts(props.popularProducts)}
            
            {/* <Button variant="secondary" as={Link} to="/"
                className={style.btnAllProducts}>
                Tất cả sản phẩm
            </Button> */}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        products: state.app.products,
        recommendProducts: state.app.recommendProducts,
        popularProducts: state.app.popularProducts
    }
}

export default connect(mapStateToProps, null)(HomePage);