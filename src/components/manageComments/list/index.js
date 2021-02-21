import React from 'react';
import { Table, Button } from 'react-bootstrap';
import Comment from '../comment';
import Pagination from '../../pagination';
import HomeSpinner from '../../homeSpinner';
import AdminModal from './modal';
import callAPI from '../../../api/api'
import Title from '../../title';
import * as msg from '../../../constants';
import style from './style.module.css';

class ManageComments extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            { name: '#' },
            { name: 'ID' },
            { name: 'Tạo Bởi' },
            { name: 'Nội Dung' },
            { name: 'Tác vụ' }
        ];

        this.commentsPerPage = 10;

        this.state = {
            comments: [],
            commentId: null,
            sort: 'ASC',
            totalPages: 0,
            currentPage: 1,
            fetching: false,
            submitting: false,
            showModal: false
        };
    }

    handleOpenModal = commentId => this.setState({ commentId, showModal: true });

    handleCloseModal = () => this.setState({ showModal: false });

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

    getCommentsList = (currentPage, sort) => {
        return new Promise((resolve, reject) => {
            callAPI(
                `admin-1/comment?page=${currentPage}&limit=${this.commentsPerPage}&sort=${sort}`,
                null, null)
                .then(res => {
                    const { data } = res;
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    deleteComment = commentId => {
        return new Promise((resolve, reject) => {
            callAPI(
                `admin-1/comment`, 'DELETE', [commentId])
                .then(res => {
                    const { data } = res;
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    handleChangeSort = async e => {
        const sort = e.target.value;
        const { currentPage } = this.state;
        this.setState({ fetching: true });

        try {
            const data = await this.getCommentsList(currentPage, sort);
            if(data) {
                let { comments } = data;
                this.setState({
                    comments,
                    sort,
                    fetching: false
                });
            }
        }
        catch(error) {
            console.error(error);
            this.setState({ fetching: false });
        }
    }

    handleDeleteComment = async () => {
        const { commentId, sort } = this.state;
        const currentPage = 1;

        if(commentId) {
            try {
                this.setState({ submitting: true });
                await this.deleteComment(commentId);

                const data2 = await this.getCommentsList(currentPage, sort);
                this.setState({
                    comments: data2.comments,
                    commentId: null,
                    totalPages: data2.totalPage,
                    currentPage,
                    showModal: false,
                    submitting: false
                });
            }
            catch(error) {
                console.error(error);
                this.setState({
                    commentId: null,
                    showModal: false,
                    submitting: false
                });
            };
        }
    }

    handleChangePage = async data => {
        let selectedPage = data.selected + 1;
        const { sort } = this.state;
        this.setState({ fetching: true });

        try {
            const data = await this.getCommentsList(selectedPage, sort);
            if(data) {
                let { comments } = data;
                this.setState({
                    comments,
                    currentPage: selectedPage,
                    fetching: false
                });
            }
        }
        catch(error) {
            console.error(error);
            this.setState({ fetching: false });
        }
    };    

    async componentDidMount() {
        const { sort, currentPage } = this.state;
        this.setState({ fetching: true });
        
        try {
            const data = await this.getCommentsList(currentPage, sort);
            if(data) {
                this.setState({
                    comments: data.comments,
                    totalPages: data.totalPage,
                    fetching: false
                });
            }
        }
        catch(error) {
            console.error(error);
            this.setState({ fetching: false });
        }
    }

    render() {
        let { comments, currentPage, totalPages, fetching,
            showModal, sort, submitting } = this.state;
        return (
            <>
                {this.displaySortButton(sort)}
                {fetching ? <HomeSpinner />
                : comments.length ?
                <>
                    <Table striped bordered hover size="sm"
                        responsive className={style.products}>
                        <thead>
                            {this.onRenderColumns()}
                        </thead>
                        <tbody>
                            {this.onRenderComments(comments, submitting)}
                        </tbody>
                    </Table>
                    <Pagination
                        currentPage={currentPage - 1} // WARNING: forcePage in ReactPaginate start from 0
                        totalPages={totalPages}
                        handleChangePage={this.handleChangePage}/>
                    <AdminModal
                        showModal={showModal}
                        handleCloseModal={this.handleCloseModal}
                        handleDeleteComment={this.handleDeleteComment}
                        submitting={submitting}
                    />
                </>
                : <Title title={msg.NO_COMMENT_TO_SHOW} />
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

    onRenderComments = (comments, submitting) => {
        let result = null;
        if(Array.isArray(comments) && comments.length) {
            result = comments.map((comment, index) =>
                <Comment
                    key={index}
                    no={index}
                    comment={comment}
                    handleOpenModal={this.handleOpenModal}
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

export default ManageComments;