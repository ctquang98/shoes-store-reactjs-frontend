import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserItem from '../item';
import HomeSpinner from '../../homeSpinner';
import AdminModal from './modal';
import callAPI from '../../../api/api'
import Pagination from '../../pagination';
import Title from '../../title';
import * as msg from '../../../constants';
import style from './style.module.css';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            { name: '#' },
            { name: 'ID' },
            { name: 'Tài khoản' },
            { name: 'Họ và tên' },
            { name: 'Số điện thoại' },
            { name: 'Email' },
            { name: 'Tác vụ' }
        ];

        this.userPerPage = 10;

        this.state = {
            users: [],
            userId: null,
            sort: 'ASC',
            totalPages: 0,
            currentPage: 1,
            fetchingUser: false,
            showModal: false
        };
    }

    handleOpenModal = userId => this.setState({ userId, showModal: true });

    handleCloseModal = () => this.setState({ showModal: false });

    onRenderAddAndSortButton = sort => 
        <div className={style.btnContainer}>
            <Button as={Link} to="/admin/users/add" variant="info"
                className={style.btnAdd}>Thêm Người dùng</Button>
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
        this.setState({ fetchingUser: true });

        callAPI(
            `admin-1/user/list?page=${currentPage}&limit=${this.userPerPage}&sort=${sort}`,
            null, null)
            .then(res => {
                let { users } = res.data;
                this.setState({
                    users,
                    sort,
                    currentPage: 1,
                    fetchingUser: false
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({ fetchingUser: false });
            });
    }

    handleDeleteUser = () => {
        const { userId, users } = this.state;

        if(userId) {
            callAPI('admin-1/user', 'DELETE', [userId])
            .then(res => {
                if(res.status === 200) {
                    console.log('delete successed');
                    const updatedUsers = this.updateUsers(users, userId);

                    this.setState({
                        users: updatedUsers,
                        userId: null,
                        showModal: false
                    });
                }            
            })
            .catch(error => {
                console.error(error);
                this.setState({ userId: null, showModal: false });
            });
        }
    }

    updateUsers = (users, userId) => {
        let index = -1;
        users.forEach((user, i) => {
            if(user.id === userId) {
                index = i;
            }
        });

        if (index !== -1) {
            users.splice(index, 1);
        }
        return users;
    }

    handleChangePage = data => {
        let selectedPage = data.selected + 1;
        const { sort } = this.state;
        this.setState({ fetchingUser: true });

        callAPI(
            `admin-1/user/list?page=${selectedPage}&limit=${this.userPerPage}&sort=${sort}`,
            null, null)
            .then(res => {
                let { users } = res.data;
                this.setState({
                    users,
                    currentPage: selectedPage,
                    fetchingUser: false
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({ fetchingUser: false });
            });
    };  

    componentDidMount() {
        let { currentPage, sort } = this.state;
        this.setState({ fetchingUser: true });

        callAPI(
            `admin-1/user/list?page=${currentPage}&limit=${this.userPerPage}&sort=${sort}`,
            null, null)
            .then(res => {
                let { users, totalPage } = res.data;

                this.setState({
                    users,
                    totalPages: totalPage,
                    fetchingUser: false
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({ fetchingUser: false });
            })
    }

    render() {
        let { users, sort, currentPage, totalPages,
            fetchingUser, showModal } = this.state;
        return (
            <>
                {this.onRenderAddAndSortButton(sort)}
                {fetchingUser ? <HomeSpinner />
                : users.length ?
                  <>
                    <Table striped bordered hover size="sm"
                        responsive className={style.users}>
                        <thead>
                            {this.onRenderColumns()}
                        </thead>
                        <tbody>
                            {this.onRenderUsers(users)}
                        </tbody>
                    </Table>
                    <Pagination
                        currentPage={currentPage - 1} // WARNING: forcePage in ReactPaginate start from 0
                        totalPages={totalPages}
                        handleChangePage={this.handleChangePage}
                    />
                    <AdminModal
                        showModal={showModal}
                        handleCloseModal={this.handleCloseModal}
                        handleDeleteUser={this.handleDeleteUser}
                    />
                  </>
                : <Title title={msg.NO_USER_TO_SHOW} />
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

    onRenderUsers = users => {
        let result = null;
        if(Array.isArray(users) && users.length) {
            result = users.map((user, index) =>
                <UserItem
                    key={index}
                    no={index}
                    user={user}
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
    }
};

export default UserList;