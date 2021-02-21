import React from 'react';
import Title from '../../components/title';
import HomeSpinner from '../../components/homeSpinner';
import { Switch, Route, Link } from 'react-router-dom';
import RouteWithSubRoutes from '../../components/routeWithSubRoutes';
import { connect } from 'react-redux';
import { actSaveAdminRoles } from '../../actions/adminRolesAction';
import callAPI from '../../api/api';
import * as title from '../../constants';
import style from './style.module.css';

const links = [
    {
        name: 'Trang Quản trị',
        to: '/admin',
        exact: true,
        role: 'admin'
    },
    {
        name: 'Quản Lý Bình Luận',
        to: '/admin/comments',
        exact: false,
        role: '[ROLE_admin-1]'
    },
    {
        name: 'Quản lý Người Dùng',
        to: '/admin/users',
        exact: false,
        role: '[ROLE_admin-1]'
    },
    {
        name: 'Quản Lý Hóa Đơn',
        to: '/admin/orders',
        exact: false,
        role: '[ROLE_admin-2]'
    },
    {
        name: 'Quản Lý Sản Phẩm',
        to: '/admin/products',
        exact: false,
        role: '[ROLE_admin-3]'
    },
    {
        name: 'Quản Lý Slide',
        to: '/admin/slides',
        exact: false,
        role: '[ROLE_admin-3]'
    },
    {
        name: 'Amazone Personalize',
        to: '/admin/amazone-personalize',
        exact: false,
        role: 'admin'
    }
];

class Admin extends React.Component {
    state = {
        roles: [],
        role: '',
        loading: false
    }

    componentDidMount() {
        const { user } = this.props;

        if(user.infor.id !== -1) {
            let role = user.role;

            if(role === '[ROLE_admin]' || role === '[ROLE_admin-1]') {
                let roles = [];
                this.setState({ loading: true });

                callAPI('admin-1', null, null)
                    .then(res => {
                        roles = res.data;
                        this.props.saveAdminRoles(roles);

                        this.setState({
                            roles,
                            role,
                            loading: false
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({ loading: false });
                    });
            }
            else {
                this.setState({ role });
            }
        }
    }

    render() {
        const { loading, role } = this.state;
        const { routes, user } = this.props;
        return (
            loading ? <HomeSpinner />
            : user.infor.id !== -1 && user.role.includes('admin')
            ? <div className={style.container}>
                <ul className={style.sidebar}>
                    {this.onRenderLinks(links, role)}
                </ul>
                <div className={style.content}>
                    {this.onShowPages(routes)}
                </div>
              </div>
            : <Title title={title.NOT_LOGGED_AS_ADMIN}/>
        );
    }

    onRenderLinks = (links, role) => {
        let sidebarLinks = null;

        if(Array.isArray(links) && links.length && role.length) {
            let filteredLinks = links;

            if (role !== '[ROLE_admin]') {
                filteredLinks = links.filter(link => {
                    return link.role === role || link.role === 'admin';
                });
            }
            sidebarLinks = filteredLinks.map((link, index) => {
                return (
                    <Route
                        key={index}
                        path={link.to}
                        exact={link.exact}
                        children={({ match }) => (
                            <li>
                                <Link
                                    to={link.to}
                                    className={[style.link, match ? style.active : ''].join(' ')}
                                >{link.name}</Link>
                            </li>
                        )}
                    />
                );
            });
        }

        return sidebarLinks;
    }

    onShowPages = routes => {
        let pages = null;
        if(routes) {
            pages = routes.map((route, index) =>
                <RouteWithSubRoutes key={index} {...route}/>
            );
        }
        return <Switch>{pages}</Switch>;
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    saveAdminRoles: roles => dispatch(actSaveAdminRoles(roles))
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);