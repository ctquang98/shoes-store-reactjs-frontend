import React from 'react';
import { Navbar, Nav, NavDropdown, Form,
    FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actLogout } from '../../actions';
import { useState } from 'react';
import style from './style.module.css';


const Menu = (props) => {
    const [search, setSearch] = useState('');
    const [suggestions,setSuggestions] = useState([]);
    const { cart, user, logout, categoriesMen, categoriesWomen,
        categoriesUnisex, names } = props;

    const convertToKeyword = search => search.trim().split(' ').join('-');

    const handleSubmit = e => {
        e.preventDefault();
    }

    const converted = convertToKeyword(search);

    const onTextChanged = e => {
        const { value } = e.target;
        let suggestions = [];

        if(value.length > 0 && Array.isArray(names) && names.length){
            const regex = new RegExp(`^${value}`,'i');
            suggestions = names.sort().filter(v => regex.test(v));
        }

        setSearch(value);
        setSuggestions(suggestions);
    }

    const suggestionSelected = value => {
        setSearch(value);
        setSuggestions([]);
    }

    const renderSuggestions = () => {
        if(suggestions.length === 0) return null;
        return (
            <ul className={style.suggestions}>
                {
                    suggestions.map((item, i) =>
                        <li key={i} onClick={() => suggestionSelected(item)}>
                            {item}
                        </li>)
                }
            </ul>

        );


    }   

    return (
        <Navbar bg="dark" expand="lg" variant="dark" >
            <Navbar.Brand as={Link} to="/">Shoes Store</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav>
                    <NavDropdown title="Nam">
                        {onRenderCategories(categoriesMen)}
                        <NavDropdown.Item as={Link} to="/collections/NAM">
                            Xem tất cả
                        </NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Nữ">
                        {onRenderCategories(categoriesWomen)}
                        <NavDropdown.Item as={Link} to="/collections/NU">
                            Xem tất cả
                        </NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Unisex">
                        {onRenderCategories(categoriesUnisex)}
                        <NavDropdown.Item as={Link} to="/collections">
                            Xem tất cả
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <Form inline onSubmit={handleSubmit}>
                            <div className={style.suggestionContainer}>
                                <FormControl type="text" placeholder="Tìm kiếm (theo tên)"
                                    className="mr-sm-2" size="sm" value={search}
                                    onChange={onTextChanged}
                                />
                                {renderSuggestions()}
                            </div>
                            <Button variant="outline-info" size="sm"
                                as={search.length ? Link : ''}
                                to={search.length ? `/search/${converted}` : ''}
                            >
                                Tìm kiếm
                            </Button>
                        </Form>
                        <Nav.Link as={Link} to="/cart">
                            Giỏ hàng <span style={{color: 'red'}}>({cart.length})</span>
                        </Nav.Link>
                        {navbarBaseOnPermission(user, logout)}
                    </Nav>
                </Navbar.Collapse>
            </Navbar.Collapse>
        </Navbar>
    );
}

const navbarBaseOnPermission = (user, logout) => {
    let result = null;
    if(user && user.role && user.role.includes('user')) {
        const { fullName } = user.infor;
        const displayName = fullName ? fullName : user.infor.userName;
        result = (
            <NavDropdown title={`Xin chào: ${displayName}`}
                className="justify-content-end" alignRight>
                <NavDropdown.Item as={Link} to="/profile">
                    Thông tin tài khoản
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/" onClick={logout}>
                    Đăng xuất
                </NavDropdown.Item>
            </NavDropdown>
        );
    }
    else if (user && user.role && user.role.includes('admin')) {
        result = (
            <NavDropdown title="Quản trị viên" alignRight
                className="justify-content-end"
            >
                <NavDropdown.Item as={Link} to="/admin">Trang quản trị</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/" onClick={logout}>Đăng xuất</NavDropdown.Item>
            </NavDropdown>
        );
    }
    else {
        result = (
            <>
                <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
                <Nav.Link as={Link} to="/register">Đăng ký</Nav.Link>
            </>
        );
    }
    return result;
}

const onRenderCategories = (categories) => {
    let result = null;
    if(Array.isArray(categories) && categories.length) {
        result = categories.map((category, i) => (
            <NavDropdown.Item key={i} as={Link} to={`/collections/${category.code}`}>
                {category.name}
            </NavDropdown.Item>
        ));
    }
    return result;
}

const mapStateToProps = state => {
    return {
        user: state.user,
        cart: state.cart.cart,
        categoriesMen: state.app.categoriesMen,
        categoriesWomen: state.app.categoriesWomen,
        categoriesUnisex: state.app.categoriesUnisex,
        names: state.app.names
    }
}

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(actLogout())
})

export default connect(mapStateToProps, mapDispatchToProps)(Menu);