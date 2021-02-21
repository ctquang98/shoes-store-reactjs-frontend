import NotMatch from './pages/notMatchPage';
import Login from './pages/loginPage';
import Register from './pages/registerPage';

import Admin from './pages/adminPage';
import Welcome from './components/welcome';
import ProductsListAdmin from './components/products/list';
import AddProduct from './components/products/add';
import EditProduct from './components/products/edit';
import UserList from './components/users/list';
import AddUser from './components/users/add';
import EditUser from './components/users/edit';
import ManageComments from './components/manageComments/list';
import ManageOrders from './components/manageOrders/list';
import ManageSlides from './components/manageSlides';
import ManageAmazonePersonalize from './components/manageAmazonPersonalize';

import HomePage from './pages/homePage';
import Collections from'./pages/collectionsPage';
import ProductDetails from './pages/productDetailsPage';
import SearchPage from './pages/searchPage';

import CartContainer from './containers/cartContainer';
import DeliveryAddressPage from './pages/deliveryAddressPage';
import PaymentPage from './pages/paymentPage';
import PaymentSuccessedPage from './pages/paymentSuccessedPage';

import ProfilePage from './pages/profilePage';

const routes = [
    {
        path: '/',
        exact: true,
        component: HomePage
    },
    {
        path: '/collections',
        exact: true,
        component: Collections
    },
    {
        path: '/collections/:category',
        exact: false,
        component: Collections
    },
    {
        path: '/search/:keyword',
        exact: false,
        component: SearchPage
    },
    {
        path: '/details/:id',
        exact: false,
        component: ProductDetails
    },
    {
        path: '/cart',
        exact: false,
        component: CartContainer
    },
    {
        path: '/delivery-address',
        exact: false,
        component: DeliveryAddressPage
    },
    {
        path: '/payment',
        exact: false,
        component: PaymentPage
    },
    {
        path: '/payment-successed',
        exact: false,
        component: PaymentSuccessedPage
    },
    {
        path: '/profile',
        exact: false,
        component: ProfilePage
    },
    {
        path: '/admin',
        exact: false,
        component: Admin,
        routes: [
            {
                path: '/admin',
                exact: true,
                component: Welcome
            },
            {
                path: '/admin/products',
                exact: true,
                component: ProductsListAdmin
            },
            {
                path: '/admin/products/add',
                exact: false,
                component: AddProduct
            },
            {
                path: '/admin/products/edit',
                exact: false,
                component: EditProduct
            },
            {
                path: '/admin/users',
                exact: true,
                component: UserList
            },
            {
                path: '/admin/users/add',
                exact: false,
                component: AddUser
            },
            {
                path: '/admin/users/edit',
                exact: false,
                component: EditUser
            },
            {
                path: '/admin/comments',
                exact: false,
                component: ManageComments
            },
            {
                path: '/admin/orders',
                exact: false,
                component: ManageOrders
            },
            {
                path: '/admin/slides',
                exact: false,
                component: ManageSlides
            },
            {
                path: '/admin/amazone-personalize',
                exact: false,
                component: ManageAmazonePersonalize
            }
        ]
    },
    {
        path: '/login',
        exact: false,
        component: Login
    },
    {
        path: '/register',
        exact: false,
        component: Register
    },
    {
        path: '*',
        exact: false,
        component: NotMatch
    }
    
];

export default routes;