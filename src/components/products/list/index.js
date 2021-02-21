import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ProductItem from '../item';
import Pagination from '../../pagination';
import HomeSpinner from '../../homeSpinner';
import AdminModal from './modal';
import callAPI from '../../../api/api';
import Title from '../../title';
import * as msg from '../../../constants'
import style from './style.module.css';

class ProductsListAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            { name: '#' },
            { name: 'ID' },
            { name: 'Mã giày' },
            { name: 'Tên' },
            { name: 'Giá' },
            { name: 'Số lượng' },
            { name: 'Tác vụ' }
        ];

        this.productPerPage = 10

        this.state = {
            products: [],
            productId: null,
            sort: 'ASC',
            totalPages: 0,
            currentPage: 1,
            fetchingProduct: false,
            showModal: false
        }
    }

    handleOpenModal = productId => this.setState({ productId, showModal: true });

    handleCloseModal = () => this.setState({ showModal: false });

    displayAddAndSortButton = sort =>
        <div className={style.btnContainer}>
            <Button as={Link} to="/admin/products/add"
                variant="info" className={style.btnAdd}>
                Thêm Sản Phẩm
            </Button>
            <div>
                <Button variant="success">Sắp xếp</Button>
                <select className={style.sortItem}
                    onChange={this.handleChangeSort}
                    name="sort" value={sort}
                >
                    {this.onRenderSortItems()}
                </select>
            </div>
        </div>

    handleChangeSort = e => {
        const sort = e.target.value;
        const { currentPage } = this.state;
        this.setState({ fetchingProduct: true });

        callAPI(
            `admin-3/product?page=${currentPage}&limit=${this.productPerPage}&sort=${sort}`,
            null, null)
            .then(res => {
                let { products } = res.data;
                this.setState({
                    products,
                    sort,
                    fetchingProduct: false
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({ fetchingProduct: false });
            });
    }

    handleDeleteProduct = () => {
        let { products, productId } = this.state;

        if(productId) {
            callAPI('admin-3/product', 'DELETE', [productId])
            .then(res => {
                if(res.status === 200) {
                    console.log('delete successed');
                    const updatedProducts = this.updateProducts(products, productId);
                    this.setState({
                        products: updatedProducts,
                        productId: null,
                        showModal: false
                    })
                }            
            })
            .catch(error => {
                console.error(error);
                this.setState({ productId: null, showModal: false });
            });
        }
    }

    updateProducts = (products, productId) => {
        let index = -1;
        products.forEach((product, i) => {
            if(product.id === productId) {
                index = i;
            }
        });

        if (index !== -1) {
            products.splice(index, 1);
        }
        return products;
    }

    handleChangePage = data => {
        let selectedPage = data.selected + 1;
        const { sort } = this.state;
        this.setState({ fetchingProduct: true });

        callAPI(
            `admin-3/product?page=${selectedPage}&limit=${this.productPerPage}&sort=${sort}`,
            null, null)
            .then(res => {
                let { products } = res.data;
                this.setState({
                    products,
                    currentPage: selectedPage,
                    fetchingProduct: false
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({ fetchingProduct: false });
            });
    };    

    componentDidMount() {
        this.setState({ fetchingProduct: true });
        let { sort, currentPage } = this.state;
        callAPI(
            `admin-3/product?page=${currentPage}&limit=${this.productPerPage}&sort=${sort}`,
            null, null)
            .then(res => {
                let { products, totalPage } = res.data;
                this.setState({
                    products,
                    totalPages: totalPage,
                    fetchingProduct: false
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({ fetchingProduct: false });
            });
    }

    render() {
        let { products, currentPage, totalPages, fetchingProduct,
            showModal, sort } = this.state;
        return (
            <>
                {this.displayAddAndSortButton(sort)}
                {fetchingProduct ? <HomeSpinner />
                 : products.length ?
                   <>
                     <Table striped bordered hover size="sm"
                         responsive className={style.products}>
                         <thead>
                             {this.onRenderColumns()}
                         </thead>
                         <tbody>
                             {this.onRenderProducts(products)}
                         </tbody>
                     </Table>
                     <Pagination
                         currentPage={currentPage - 1} // WARNING: forcePage in ReactPaginate start from 0
                         totalPages={totalPages}
                         handleChangePage={this.handleChangePage}/>
                     <AdminModal
                         showModal={showModal}
                         handleCloseModal={this.handleCloseModal}
                         handleDeleteProduct={this.handleDeleteProduct}
                     />
                   </>
                 : <Title title={msg.NO_PRODUCT_TO_SHOW} />
                }
            </>
        );
    }

    onRenderColumns = () => {
        let columns = this.columns;
        let result = null;

        if(Array.isArray(columns) && columns.length) {
            result = columns.map((column, index) =>
                <th key={index}>{column.name}</th>
            );
        }

        return <tr>{result}</tr>;
    }

    onRenderProducts = products => {
        let result = null;
        if(Array.isArray(products) && products.length) {
            result = products.map((product, index) =>
                <ProductItem
                    key={index}
                    no={index}
                    product={product}
                    handleOpenModal={this.handleOpenModal}
                />
            );
        }
        return result;
    };

    onRenderSortItems = () => {
        let arr = [
            { value: 'ASC', name: 'ID: Tăng dần' },
            { value: 'DESC', name: 'ID: Giảm dần' }
        ];
        return arr.map((item, i) => (
            <option key={i} value={item.value}>{item.name}</option>
        ));
    };
};

const mapStateToProps = state => ({
    products: state.products
})

export default connect(mapStateToProps, null)(ProductsListAdmin);