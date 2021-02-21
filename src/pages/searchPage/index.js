import React from 'react';
import ProductCards from '../../components/productCards';
import style from '../collectionsPage/style.module.css';
import callAPI from '../../api/api';
import handleSplitProduct from '../../utils/handleSplitProduct';
import Title from '../../components/title';
import Pagination from '../../components/pagination';
import HomeSpinner from '../../components/homeSpinner';
import * as msg from '../../constants';
import { Badge } from 'react-bootstrap';
import { connect } from 'react-redux';

const limit = 8;

class Collections extends React.Component {
    state = {
        products: [],
        keyword: '',
        sizes: {},
        colors: {},
        sort: 'ASC-id',
        size: '',
        color: '',
        price: '',
        currentPage: 1,
        totalPages: 0,
        loading: false,
        error: ''
    }

    getUrl = (userId, name, value) => {
        const { keyword, sort, color, size, price } = this.state;
        let newSort = sort;
        const priceArray = price.length ? price.split('-') : [];
        let paramsArray = new Array(3);

        //get previous query params and put into array
        if(size.length && size !== 'all') paramsArray[0] = `size=${size}`;
        if(color.length && color !== 'all') paramsArray[1] = `color=${color}`;
        if(priceArray.length && priceArray[0] !== 'all') paramsArray[2] = `price=from-${priceArray[0]}-to-${priceArray[1]}`;
        
        //check new query params and put into array
        if (name === 'size') {
            paramsArray[0] = value !== 'all' ? `size=${value}` : null;
        }
        else if(name === 'color') {
            paramsArray[1] = value !== 'all' ? `color=${value}` : null;
        }
        else if (name === 'price') {
            const arr = value.split('-');
            paramsArray[2] = arr[0] !== 'all' ? `price=from-${arr[0]}-to-${arr[1]}` : null;
        }
        else if (name === 'sort') {
            newSort = value;
        }

        //remove null/empty value in array
        const removedEmpty = paramsArray.filter(item => item);
        const convertToString = removedEmpty.length ? removedEmpty.join('&') : '';
        const url = convertToString.length ?
                     `search?userid=${userId}&name=${keyword}&${convertToString}&page=1&limit=${limit}&sort=${newSort}`
                    : `search?userid=${userId}&name=${keyword}&page=1&limit=${limit}&sort=${newSort}`;
        return url;
    }

    handleChangeValue = e => {
        const { name, value } = e.target;
        const {id : userId} = this.props.user.infor;
        const url = this.getUrl(userId, name, value);

        this.setState({ loading: true });
        callAPI(url, null, null)
            .then(res => {
                this.setState({
                    products: res.data.products,
                    totalPages: res.data.totalPage,
                    currentPage: 1,
                    [name]: value,
                    loading: false
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    }

    handleChangePage = data => {
        const { id: userId } = this.props.user.infor;
        let url = this.getUrl(userId, null, null);
        let selectedPage = data.selected + 1;

        const array = url.split('&');
        array.forEach((item, i) => {
            if(item.includes('page=')) {
                array[i] = `page=${selectedPage}`;
            };
        });
        url = array.join('&');
        console.log(url);

        this.setState({ loading: true });
        callAPI(url, null, null)
            .then(res => {
                this.setState({ 
                    products: res.data.products,
                    currentPage: selectedPage,
                    loading: false
                 });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            })
    };

    convertKeyword = keyword => keyword.split('-').join(' ');

    componentDidMount() {
        const { keyword } = this.props.match.params;
        const { id: userId } = this.props.user.infor;
        const url = `search?userid=${userId}&name=${keyword}&page=1&limit=${limit}`;
        this.setState({ loading: true });

        callAPI(url, null, null)
            .then(res => {
                const { products } = res.data;
                const sizes = products.length ? handleSplitProduct(products, 'size') : {};
                const colors = products.length ? handleSplitProduct(products, 'color') : {};
                this.setState({
                    products,
                    keyword,
                    sizes,
                    colors,
                    totalPages: res.data.totalPage,
                    loading: false
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    }

    UNSAFE_componentWillUpdate(nextProps) {
        const { keyword : newKeyword } = nextProps.match.params;
        const { keyword } = this.props.match.params;
        const {id : userId} = this.props.user.infor;

        if(newKeyword !== keyword) {
            const url = `search?userid=${userId}&name=${newKeyword}&page=1&limit=${limit}`;
            this.setState({ loading: true });
            callAPI(url, null, null)
                .then(res => {
                    const { products } = res.data;
                    const sizes = products.length ? handleSplitProduct(products, 'size') : {};
                    const colors = products.length ? handleSplitProduct(products, 'color') : {};
                    this.setState({
                        products,
                        keyword: newKeyword,
                        sizes,
                        colors,
                        sort: '',
                        color: '',
                        size: '',
                        price: '',
                        totalPages: res.data.totalPage,
                        currentPage: 1,
                        loading: false
                    });
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ loading: false });
                });
        }
    }

    render() {
        const { products, keyword, currentPage, totalPages, sizes, colors,
            loading, sort, size, color, price } = this.state;
        const title = products.length ?
                      msg.SEARCH_RESULT + this.convertKeyword(keyword)
                    : msg.NO_PRODUCT_TO_SHOW;
        return (            
            <div className={style.container}>
                <Title title={title} />
                {/* sort and filter pannel */}
                <div className={style.sortAndFilter}>
                    <div className={style.filterContainer}>
                        <h3 className={style.filterHeader}>
                            <Badge variant="primary">Bộ lọc</Badge>
                        </h3>
                        <select className={style.sortItem}
                            style={{backgroundColor: '#9b78b1'}}
                            onChange={this.handleChangeValue}
                            name="size" value={size}
                        >
                            <option value="all">Kích cỡ: Tất cả</option>
                            {this.onRenderSize(sizes)}
                        </select>
                        <select className={style.sortItem}
                            style={{backgroundColor: '#28a745'}}
                            onChange={this.handleChangeValue}
                            name="color" value={color}
                        >
                            <option value="all">Màu: Tất cả</option>
                            {this.onRenderColor(colors)}
                        </select>
                        <select className={style.sortItem}
                            style={{backgroundColor: '#dc3545'}}
                            onChange={this.handleChangeValue}
                            name="price" value={price}
                        >
                            {this.onRenderPrice()}
                        </select>
                    </div>
                    <div className={style.sortContainer}>
                        <h3 className={style.filterHeader}>
                            <Badge variant="primary">Sắp xếp</Badge>
                        </h3>
                        <select className={style.sortItem}
                            onChange={this.handleChangeValue}
                            name="sort" value={sort}
                        >
                            {this.onRenderSortItems()}
                        </select>
                    </div>
                </div>
                {/* Products list and paginate */}
                {loading ? <HomeSpinner /> :
                <div>
                    <ProductCards products={products} />
                    <div className={style.paginate}>
                        <Pagination
                            currentPage={currentPage - 1} // WARNING: forcePage in ReactPaginate start from 0
                            totalPages={totalPages}
                            handleChangePage={this.handleChangePage}
                        />
                    </div>
                </div>
                }
            </div>
        );
    }    

    onRenderColor = colors => {
        let result = null;
        const colorsArr = Object.keys(colors);
        if(colorsArr.length) {
            result = colorsArr.map((color, i) => (
                <option key={i} value={color}>{color}</option>
            ));
        }
        return result;
    }

    onRenderSize = sizes => {
        let result = null;
        const sizesArr = Object.keys(sizes);
        if(sizesArr.length) {
            sizesArr.sort((a, b) => a-b);
            result = sizesArr.map((size, i) => (
                <option key={i} value={size}>{size}</option>
            ));
        }
        return result;
    }

    onRenderPrice = () => {
        let arr = [
            { value: 'all-all', name: 'Giá: Tất cả' },
            { value: '0-500000', name: 'Dưới 500.000đ' },
            { value: '500000-1000000', name: '500.000đ - 1.000.000đ' }
            // { value: '1000000-10000000', name: 'Trên 1.000.000đ' }
        ];
        return arr.map((price, i) => (
            <option value={price.value} key={i}>{price.name}</option>
        ));
    }

    onRenderSortItems = () => {
        let arr = [
            { value: 'ASC-id', name: 'Tùy chọn' },
            { value: 'ASC-name', name: 'Tên: A -> Z' },
            { value: 'DESC-name', name: 'Tên: Z -> A' },
            { value: 'ASC-price', name: 'Giá: Tăng dần' },
            { value: 'DESC-price', name: 'Giá: Giảm dần' }
        ];
        return arr.map((item, i) => (
            <option key={i} value={item.value}>{item.name}</option>
        ));
    }
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps, null)(Collections);