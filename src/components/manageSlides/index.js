import React from 'react';
import ImageUploader from 'react-images-upload';
import HomeSpinner from '../homeSpinner';
import AdminModal from './modal';
import { Table, Button } from 'react-bootstrap';
import style from './style.module.css';
import axios from 'axios';
import callAPI from '../../api/api';

class ManageSlides extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [
            { name: '#' },
            { name: 'Tên' },
            { name: 'Hình ảnh' },
            { name: 'Tác vụ' }
        ];

        this.state = {
            pictures: [],
            imageId: -1,
            loading: false,
            submitting: false,
            showModal: false
        }
    }

    handleOpenModal = imageId => this.setState({ imageId, showModal: true });

    handleCloseModal = () => this.setState({ showModal: false });

    onDrop = async files => {
        if(Array.isArray(files) && files.length) {
            this.setState({
                submitting: true
            });
            try {
                await this.submitSlide(files[files.length - 1]);
                const picturesData = await this.getSlidesData();
                this.setState({
                    pictures: picturesData,
                    submitting: false
                });
            }
            catch(error) {
                this.setState({ submitting: false });
                throw error;
            }
        }
    }

    handleDeleteSlide = async imgId => {
        const { imageId } = this.state;
        this.setState({ submitting: true });

        try {
            await this.deleteSlide(imageId);
            const picturesData = await this.getSlidesData();
            this.setState({
                pictures: picturesData,
                submitting: false,
                showModal: false
            });
        }
        catch(error) {
            this.setState({
                submitting: false,
                showModal: false
            });
            throw error;
        }
    }

    deleteSlide = imageId => {
        return new Promise((resolve, reject) => {
            callAPI('admin-3/slide', 'DELETE', [imageId])
                .then(res => resolve(res.data))
                .catch(error => reject(error));
        });
    }

    submitSlide = file => {
        let formData = new FormData();
        formData.append('file', file);
        //console.log(formData.get('file'));

        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: '/admin-3/slide',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => resolve(res))
            .catch(error => reject(error));
        });
    }

    getSlidesData = () => {
        return new Promise((resolve, reject) => {
            callAPI('admin-3/slide', null, null)
                .then(res => resolve(res.data))
                .catch(error => reject(error));
        });
    }

    async componentDidMount() {
        let pictures = [];
        this.setState({ loading: true });

        try {
            const data = await this.getSlidesData();

            if(data) {
                pictures = [...data];
            }
        }
        catch(error) {
            throw error;
        }

        this.setState({ pictures, loading: false });
    }

    render() {
        const { pictures, loading, showModal, submitting } = this.state;
        return (
            <div>
                <ImageUploader
                    withIcon={true}
                    buttonText='Thêm slide'
                    onChange={this.onDrop}
                    imgExtension={['.jpg', '.png', 'jpeg']}
                    maxFileSize={5242880}
                    withLabel={false}
                    fileTypeError="file không hợp lệ"
                    singleImage={true}
                />
                {loading ? <HomeSpinner />
                 : <Table striped bordered hover size="sm" responsive>
                        <thead>
                            {this.onRenderColumns()}
                        </thead>
                        <tbody>
                            {this.onRenderPictures(pictures, submitting)}
                        </tbody>
                    </Table>
                }
                <AdminModal
                    showModal={showModal}
                    handleCloseModal={this.handleCloseModal}
                    handleDeleteSlide={this.handleDeleteSlide}
                    submitting={submitting}
                />
            </div>
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

    //to import img => put image to public path (..src/public) or use require

    onRenderPictures = (pictures, submitting) => {
        let result = null;

        if(Array.isArray(pictures) && pictures.length) {
            result = pictures.map((picture, index) =>
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{picture.image}</td>
                    <td>
                        <img
                            className={style.imgContainer}
                            // src={require(`../../assets/slides/${picture.image}`)}
                            src={process.env.PUBLIC_URL + `/assets/images/slides/${picture.image}`}
                            alt="slide"/>
                        </td>
                    <td>
                        <Button variant="danger" size="sm"
                            disabled={submitting ? 'disabled' : null}
                            onClick={() => this.handleOpenModal(picture.id)}>
                            Xóa
                        </Button>
                    </td>
                </tr>
            );
        }
        return result;
    };
}

export default ManageSlides;