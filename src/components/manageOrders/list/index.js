import React from 'react';
import { Table, Button } from 'react-bootstrap';
import Order from '../order';
import Pagination from '../../pagination';
import HomeSpinner from '../../homeSpinner';
import callAPI from '../../../api/api';
import Title from '../../title';
import * as msg from '../../../constants';
import style from './style.module.css';

class ManageOrders extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            { name: '#' },
            { name: 'ID' },
            { name: 'Mã Đơn Hàng' },
            { name: 'Tên Người Nhận' },
            { name: 'Địa Chỉ' },
            { name: 'Phương Thức Giao Hàng' },
            { name: 'Tổng Tiền' },
            { name: 'Trạng Thái' },
            { name: 'Tác Vụ' }
        ];

        this.ordersPerPage = 10;

        this.state = {
            orders: [],
            orderId: null,
            sort: 'ASC',
            totalPages: 0,
            currentPage: 1,
            fetching: false,
            submitting: false
        };
    }

    displaySortButton = sort =>
        <div className={style.btnContainer}>
            <Button variant="success" className={style.sortLabel}>Sắp xếp</Button>
            <select className={style.sortItem}
                onChange={this.handleChangeSort}
                name="sort" value={sort}
            >
                {this.onRenderSortItems()}
            </select>
        </div>

    approveOrder = orderId => {
        return new Promise((resolve, reject) => {
            callAPI(`admin-2/purchase?purchaseid=${orderId}`, 'PUT', null)
                .then(res => {
                    console.log('purchase successed...');
                    resolve(res.data);
                })
                .catch(error => reject(error));
        });
    }

    getOrdersList = (currentPage, sort) => {
        return new Promise((resolve, reject) => {
            callAPI(
                `admin-2/purchase?page=${currentPage}&limit=${this.ordersPerPage}&sort=${sort}`,
                null, null)
                .then(res => {
                    console.log('get orders successed...');
                    resolve(res.data);
                })
                .catch(error => reject(error));
        });
    }

    handleChangeSort = async e => {
        const sort = e.target.value;
        const { currentPage } = this.state;
        this.setState({ fetching: true });

        try {
            const data = await this.getOrdersList(currentPage, sort);
            this.setState({
                orders: data.purchases,
                sort,
                fetching: false
            });
        }
        catch(error) {
            console.log(error);
            this.setState({ fetching: false });
        }
    }

    handleChangePage = async data => {
        let selectedPage = data.selected + 1;
        const { sort } = this.state;
        this.setState({ fetchingProduct: true });

        try {
            const data = await this.getOrdersList(selectedPage, sort);
            this.setState({
                orders: data.purchases,
                currentPage: selectedPage,
                fetching: false
            });
        }
        catch(error) {
            console.log(error);
            this.setState({ fetching: false });
        }
    };
    
    handleApproveOrder = async orderId => {
        try {
            this.setState({ submitting: true });
            const data = await this.approveOrder(orderId);

            if(data) {
                const currentPage = 1;
                const { sort } = this.state;

                const data2 = await this.getOrdersList(currentPage, sort);

                this.setState({
                    orders: data2.purchases,
                    orderId: null,
                    totalPages: data2.totalPage,
                    currentPage,
                    submitting: false
                });
            }
        }
        catch(error) {
            console.error(error);
            this.setState({ submitting: false });
        }
    }

    async componentDidMount() {
        const { currentPage, sort } = this.state;
        this.setState({ fetching: true });
        
        try {
            const data = await this.getOrdersList(currentPage, sort);
            let { purchases, totalPage } = data;
            this.setState({
                orders: purchases,
                totalPages: totalPage,
                fetching: false
            });
        }
        catch(error) {
            console.log(error);
            this.setState({ fetching: false });
        }
    }

    render() {
        let { orders, currentPage, totalPages, fetching, sort, submitting } = this.state;
        return (
            <>
                {this.displaySortButton(sort)}
                {fetching ? <HomeSpinner />
                : orders.length ?
                <>
                    <Table striped bordered hover size="sm"
                        responsive className={style.orders}>
                        <thead>
                            {this.onRenderColumns()}
                        </thead>
                        <tbody>
                            {this.onRenderOrders(orders, submitting)}
                        </tbody>
                    </Table>
                    <Pagination
                        currentPage={currentPage - 1} // WARNING: forcePage in ReactPaginate start from 0
                        totalPages={totalPages}
                        handleChangePage={this.handleChangePage}/>
                </>
                : <Title title={msg.NO_ORDER_TO_SHOW} />
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

    onRenderOrders = (orders, submitting) => {
        let result = null;
        if(Array.isArray(orders) && orders.length) {
            result = orders.map((order, index) =>
                <Order
                    key={index}
                    no={index}
                    order={order}
                    handleApproveOrder={this.handleApproveOrder}
                    submitting={submitting}
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

export default ManageOrders;