import React from 'react';
import ProductCards from '../../components/productCards';
import style from './style.module.css';
import callAPI from '../../api/api';
import handleSplitProduct from '../../utils/handleSplitProduct';
import Title from '../../components/title';
import Pagination from '../../components/pagination';
import HomeSpinner from '../../components/homeSpinner';
import * as msg from '../../constants';
import { Badge } from 'react-bootstrap';

const categories = [
    { name: 'UNISEX', title: 'Bộ sưu tập unisex'},
    { name: 'NAM', title: 'Bộ sưu tập giày nam'},
    { name: 'NU', title: 'Bộ sưu tập giày nữ'},
    { name: 'CAO-GOT', title: 'Bộ sưu tập giày cao gót'},
    { name: 'THE-THAO', title: 'Bộ sưu tập giày thể thao'},
    { name: 'SANDAL', title: 'Bộ sưu tập giày sandal'},
    { name: 'BUP-BE', title: 'Bộ sưu tập giày búp bê'},
    { name: 'MOI', title: 'Bộ sưu tập giày mọi'},
    { name: 'LUOI', title: 'Bộ sưu tập giày lười'},
    { name: 'BOOT', title: 'Bộ sưu tập giày boot'},
    { name: 'SLIPON', title: 'Bộ sưu tập giày slipon'}
];

const limit = 16;

class Collections extends React.Component {
    state = {
        products: [],
        genderParam: '',
        category: '',
        sizes: {},
        colors: {},
        sort: 'ASC-id',
        size: '',
        color: '',
        price: '',
        title: '',
        currentPage: 1,
        totalPages: 0,
        submitting: false,
        error: ''
    }

    getUrl = (name, value) => {
        const { sort, color, size, price, genderParam, category } = this.state;
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
                     `collections?${genderParam}=${category}&${convertToString}&page=1&limit=${limit}&sort=${newSort}`
                    : `collections?${genderParam}=${category}&page=1&limit=${limit}&sort=${newSort}`;
        return url;
    }

    handleChangeValue = e => {
        const { name, value } = e.target;
        const url = this.getUrl(name, value);

        this.setState({ submitting: true });
        callAPI(url,null, null)
            .then(res => {
            this.setState({
                products: res.data.products,
                [name]: value,
                totalPages: res.data.totalPage,
                currentPage: 1,
                submitting: false
            });
        })
            .catch(err => {
                console.error(err);
                this.setState({ submitting: false });
            });
    }

    handleChangePage = data => {
        let url = this.getUrl(null, null);
        let selectedPage = data.selected + 1;

        const array = url.split('&');
        array.forEach((item, i) => {
            if(item.includes('page=')) {
                array[i] = `page=${selectedPage}`;
            };
        });
        url = array.join('&');

        this.setState({ submitting: true });
        callAPI(url, null, null)
            .then(res => {
                this.setState({
                    products: res.data.products,
                    currentPage: selectedPage,
                    submitting: false
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({ submitting: false });
            });            
    };

    handleCheckingCategory = category => {
        let result = {};
        let categoriesFilter = categories.filter(cate => cate.name === category);
        if (categoriesFilter.length)
            result = {...categoriesFilter[0]};
        return result;
    }

    componentDidMount() {
        let category = {};
        let genderParam = 'categorygender';
        const { category : categoryCode  } = this.props.match.params;
        this.setState({ submitting: true });

        if(categoryCode) {
            category = this.handleCheckingCategory(categoryCode);
            if(category.name !== 'NAM' && category.name !== 'NU')
                genderParam = 'category';
        }
        else {
            category = {...categories[0]};
        }
        
        callAPI(
            `collections?${genderParam}=${category.name}&page=1&limit=${limit}&sort=ASC-id`,
            null, null)
            .then(res => {
                const products = res.data.products;
                const sizes = products.length ? handleSplitProduct(products, 'size') : {};
                const colors = products.length ? handleSplitProduct(products, 'color') : {};
                this.setState({
                    products,
                    genderParam,
                    category: category.name,
                    sizes,
                    colors,
                    title: category.title,
                    totalPages: res.data.totalPage,
                    submitting: false
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: 'Some errors have occurred',
                    submitting: false
                });
            });
    }

    componentWillUnmount() {
        this.setState({
            products: [],
            submitting: false,
        });
    }

    UNSAFE_componentWillUpdate(nextProps) {
        const { category : currentCategoryCode } = nextProps.match.params;
        const { category : oldCategoryCode } = this.props.match.params;

        if(currentCategoryCode !== oldCategoryCode) {
            let category = {};
            let genderParam = 'categorygender';
            this.setState({ submitting: true });

            category = this.handleCheckingCategory(currentCategoryCode);
            if(category.name !== 'NAM' && category.name !== 'NU')
                genderParam = 'category';
            
            callAPI(
                `collections?${genderParam}=${category.name}&page=1&limit=${limit}&sort=ASC-id`,
                null, null)
                .then(res => {
                    const products = res.data.products;
                    const sizes = handleSplitProduct(products, 'size');
                    const colors = handleSplitProduct(products, 'color');
                    this.setState({
                        products,
                        genderParam,
                        category: category.name,
                        sizes,
                        colors,
                        sort: '',
                        color: '',
                        size: '',
                        price: '',
                        title: category.title,
                        totalPages: res.data.totalPage,
                        currentPage: 1,
                        submitting: false
                    });
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        error: 'Some errors have occurred',
                        submitting: false
                    });
                });
        }
    }

    render() {
        const { products, title, currentPage, totalPages, sizes, colors, sort,
            size, color, price, submitting } = this.state;
        const productTitle = products.length ? title : msg.NO_PRODUCT_TO_SHOW;
        return (            
            <div className={style.container}>
                <Title title={productTitle} />
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
                {submitting ? <HomeSpinner /> :
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
        const colorsArr = colors ? Object.keys(colors) : null;
        if(Array.isArray(colorsArr) && colorsArr.length) {
            result = colorsArr.map((color, i) => (
                <option key={i} value={color}>{color}</option>
            ));
        }
        return result;
    }

    onRenderSize = sizes => {
        let result = null;
        const sizesArr = sizes ? Object.keys(sizes) : null;
        if(Array.isArray(sizesArr) && sizesArr.length) {
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

export default Collections;