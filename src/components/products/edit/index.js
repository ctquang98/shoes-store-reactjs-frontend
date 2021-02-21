import React from 'react';
//import callApi from '../../../api/api';
import { Form, Badge, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

class EditProduct extends React.Component {
    state = {
        product: {
            id: -1,
            name: '',
            productCode: '',
            title: '',
            thumbnail: [],
            images: [],
            shortDescription: '',
            content: '',
            color: '',
            size: -1,
            price: -1,
            countInput: -1,
            saleOff: -1,
            status: -1,
            category: ''
        },
        selectedCategory: {},
        error: '',
        submitting: false
    }

    handleChange = event => {
        let key = event.target.name;
        let value = event.target.value;
        let { product } = this.state;
        product = {...product, [key]: value};
        this.setState({ product, error: '' });
    }

    handleChangeCategory = e => {
        this.setState({
            selectedCategory: JSON.parse(e.target.value)
        });
    }

    handleSelectedThumbnail = event => {
        let { product } = this.state;
        const { files } = event.target;

        if(files.length) {
            product = {...product, thumbnail: [...files]};
            this.setState({ product, error: '' });
        }        
    }

    handleSelectedImages = event => {
        let { product } = this.state;
        const { files } = event.target;

        if (files.length) {
            product = {...product, images: [...files]};
            this.setState({ product, error: '' });
        }    
    }

    appendProductToFormData = (product, selectedCategory) => {
        let formData = new FormData();
        formData.append('name', product.name);
        formData.append('productCode', product.productCode);
        formData.append('title', product.title);
        formData.append('thumbnailImage', product.thumbnail[0]);
        formData.append('shortDescription', product.shortDescription);
        formData.append('content', product.content);
        formData.append('color', product.color);
        formData.append('size', product.size);
        formData.append('price', product.price);
        formData.append('countInput', product.countInput);
        formData.append('saleOff', product.saleOff);
        formData.append('category', selectedCategory.code);
        formData.append('status', product.status);

        for(let i = 0; i < product.images.length; ++i) {
            formData.append('file', product.images[i]);
        }
        return formData;
    }

    handleSubmitProduct = (product, selectedCategory) => {
        let formData = this.appendProductToFormData(product, selectedCategory);
        return new Promise((resolve, reject) => {
            axios({
                method: 'PUT',
                url: `/admin-3/product?productid=${product.id}`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => resolve(res))
            .catch(error => reject(error));
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if(this.isFormValid()) {
            this.setState({ submitting: true });
            const { product, selectedCategory } = this.state;
            
            try {
                const data = await this.handleSubmitProduct(product, selectedCategory);
                if(data) {
                    this.setState({ submitting: false });
                    this.props.history.goBack();
                }
            }
            catch(error) {
                console.error(error, 'may be wrong category');
                this.setState({
                    submitting: false,
                    error: 'Đã có lỗi xảy ra trong quá trình xử lý'
                });
            }
        }
    }

    isFormValid = () => {
        let valid = true;
        if(this.isFormEmpty()) {
            let error = 'Hãy điền đủ thông tin và chắc chắn rằng bạn đã chọn ảnh hiển thị';
            valid = false;
            this.setState({ error });
        }
        return valid;
    }

    isFormEmpty = () => {
        const { product } = this.state;
        for(let key in product) {
            if(key !== 'images' && key !== 'category') {
                if (typeof product[key] === 'number' && product[key] === -1)
                    return true;
                else if(typeof product[key] === 'string' && !product[key].length)
                    return true;
                else if (Array.isArray(product[key]) && !product[key].length)
                    return true;
            }
        }
        return false;
    }

    showError = error => error ? <Alert variant="danger">
                                {error}</Alert> : '';

    componentDidMount() { //not exist api for get product
        let product = {};
        const { location, allCategories } = this.props;

        if(location.product) {
            let productParams = location.product;
            let selectedCateArray = allCategories.filter(item => 
                    item.name === productParams.category);

            product = {
                id: productParams.id,
                name: productParams.name,
                productCode: productParams.productCode,
                title: productParams.title,
                shortDescription: productParams.shortDescription,
                content: productParams.content,
                color: productParams.color,
                size: productParams.size,
                price: productParams.price,
                countInput: productParams.countInput,
                saleOff: productParams.saleOff,
                category: selectedCateArray[0].code,
                status: productParams.status,
                thumbnail: [],
                images: []
            };

            this.setState({
                product,
                selectedCategory: selectedCateArray[0]
            });
        }
    }

    render() {
        const { product, error, submitting, selectedCategory } = this.state;
        const { allCategories } = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>
                    <Badge variant="info">Chỉnh Sửa Thông Tin</Badge>
                </h1>
                <Form.Group>
                    <Form.Label>
                        Tên Sản Phẩm <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control type="text" placeholder="Tên sản phẩm"
                        size="sm" name="name" onChange={this.handleChange}
                        value={product.name}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Mã Sản Phẩm <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control type="text" placeholder="Mã sản phẩm"
                        size="sm" name="productCode" onChange={this.handleChange}
                        value={product.productCode}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Tiêu Đề <span style={{ color: 'red' }}>*</span>    
                    </Form.Label>
                    <Form.Control type="text" placeholder="Tiêu đề" size="sm"
                        name="title" onChange={this.handleChange}
                        value={product.title}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Ảnh Hiển Thị <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.File.Input name="thumbnail"
                        onChange={this.handleSelectedThumbnail}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Ảnh Khác
                    </Form.Label>
                    <Form.File.Input name="images"
                        onChange={this.handleSelectedImages} multiple/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Mô Tả Ngắn <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control type="text" placeholder="Mô tả ngắn"
                        size="sm" name="shortDescription" onChange={this.handleChange}
                        value={product.shortDescription}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Nội Dung <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control as="textarea" row="3" placeholder="Nội dung"
                        size="sm" name="content" onChange={this.handleChange}
                        value={product.content}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Màu Sắc <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control type="text" placeholder="Màu sắc" size="sm"
                        name="color" onChange={this.handleChange}
                        value={product.color}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Kích Cỡ <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control as="input" type="number" placeholder="Kích cỡ" min="0"
                        max="50" size="sm" name="size" onChange={this.handleChange}
                        value={product.size}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Giá <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control as="input" type="number" placeholder="Giá" min="0"
                        max="100000000" size="sm" name="price" onChange={this.handleChange}
                        value={product.price}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Số Lượng <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control as="input" type="number" placeholder="Số lượng" min="0"
                        max="10000" size="sm" name="countInput" onChange={this.handleChange}
                        value={product.countInput}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Giảm Giá (%) <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control as="input" type="number" placeholder="Giảm giá" min="0"
                        max="100" size="sm" name="saleOff" onChange={this.handleChange}
                        value={product.saleOff}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Danh Mục <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control as="select" size="sm"
                        value={JSON.stringify(selectedCategory)}
                        name='selectedCategory'
                        onChange={this.handleChangeCategory}
                    >
                        {this.onRenderCategories(allCategories)}
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Trạng Thái <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Form.Control type="number" placeholder="Trạng thái" size="sm" min="0"
                        max="10" name="Status" onChange={this.handleChange}
                        value={product.status}/>
                </Form.Group>
                
                {this.showError(error)}

                <Button type="submit"
                    disabled={submitting ? 'disabled' : ''}
                >
                    {submitting ? 'Đang xử lý...' : 'Lưu'}
                </Button>{' '}
                <Button type="submit" variant="secondary"
                    disabled={submitting ? 'disabled' : ''}
                    as={Link} to="/admin/products">Hủy</Button>
            </Form>
        );
    }

    onRenderCategories = categories => {
        let result = null;
        
        if(Array.isArray(categories) && categories.length) {
            result = categories.map((cate, i) =>
                <option key={i} value={JSON.stringify(cate)}>{cate.name}</option>
            )
        }
        return result;
    }
};

const mapStateToProps = state => ({
    allCategories: state.app.allCategories
})

export default connect(mapStateToProps, null)(EditProduct);