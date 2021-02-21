import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from './modal';
import style from './style.module.css';

class Comments extends React.Component {
    state = {
        content: '',
        commentId: -1,
        editing: false,
        submitting: false,
        showModal: false
    }

    handleOpenModal = commentId => this.setState({ commentId, showModal: true });

    handleCloseModal = () => this.setState({ commentId: -1, showModal: false });

    handleEditComment = commentId => this.setState({ editing: true, commentId });

    handleCancelEditComment = () => this.setState({ editing: false, commentId: -1 });

    handleChangeContent = e => this.setState({ content: e.target.value });

    handleAddComment = () => {
        const { content } = this.state;
        if(!content.length) return;

        this.setState({ submitting: true });
        this.props.addComment(content);
        this.setState({ content: '', submitting: false });
    }

    handleDeleteComment = () => {
        const { commentId } = this.state;

        if(commentId !== -1) {
            this.props.deleteComment(commentId);
            this.setState({ commentId: -1, showModal: false});
        }
    }

    render() {
        const { comments, commentOfUser, user} = this.props;
        const { content, commentId, editing, submitting, showModal } = this.state;
        const btnContent = user.infor.id === -1
                           ? 'Đăng nhập để thêm nhận xét & đánh giá'
                           : 'Gửi nhận xét';
        return (
            <div className={style.container}>
                <div>
                    <p className={style.addCommentLabel}>Nhận xét</p>
                    <div className={style.addComment}>
                        <textarea rows='4' value={content}
                            placeholder='Viết nhận xét'
                            onChange={this.handleChangeContent}
                        />
                        <div>
                            <button
                                disabled={user.infor.id === -1 || submitting}
                                onClick={this.handleAddComment}
                            >
                                {btnContent}
                            </button>
                        </div>
                    </div>
                </div>
                {
                    comments.length
                    ? <div className={style.commentsContainer}>
                        {this.onRenderComments(comments, commentOfUser, commentId, editing)}
                      </div>
                    : null
                }
                <DeleteModal
                    showModal={showModal}
                    handleCloseModal={this.handleCloseModal}
                    handleDeleteComment={this.handleDeleteComment}
                />
            </div>
        );
    }

    // comment && commentOfUser => to display edit button base on user
    // comment && commentId => to identify comment that editing...

    onRenderComments = (comments, commentOfUser, commentId, editing) => {
        let result = null;

        if(Array.isArray(comments) && comments.length) {
            result = comments.map((comment, index) => {
                return (
                    <div className={style.comment} key={index}>
                        <div className={style.name}>
                            {comment.createdBy}
                        </div>
                        {this.onRenderCommentContent(comment, commentId, editing)}
                        {this.onRenderEditAndDeleteButton(comment, commentOfUser, commentId, editing)}
                    </div>
                );
            })
        }

        return result;
    }

    onRenderCommentContent = (comment, commentId, editing) => {
        let result = <div className={style.content}>{comment.content}</div>;

        if(editing && comment.id === commentId) {
            result = (
                <div className={style.content}>
                    <textarea rows="4" className={style.text}
                        defaultValue={comment.content} />
                    <div className={style.btnGroup}>
                        <button onClick={this.handleCancelEditComment}>Hủy</button>
                        <button>Chỉnh sửa</button>
                    </div>
                </div>
            )
        }
        return result;
    }

    onRenderEditAndDeleteButton = (comment, commentOfUser, commentId, editing) => {
        let result = (
            <div className={style.edit}>
                <FontAwesomeIcon
                    icon={faEdit}
                    className={style.btnEdit}
                    onClick={() => this.handleEditComment(comment.id)}
                />
                <FontAwesomeIcon
                    icon={faTrashAlt}
                    className={style.btnEdit}
                    onClick={() => this.handleOpenModal(comment.id)}
                />
            </div>
        );

        if(commentOfUser && comment.id === commentOfUser.id) {
            result = <div style={{ visibility: 'visible' }}>{result}</div>;
        }
        else {
            result = <div style={{ visibility: 'hidden' }}>{result}</div>;
        }

        if(editing && comment.id === commentId) {
            result = null;
        }

        return result;
    }
};

export default Comments;