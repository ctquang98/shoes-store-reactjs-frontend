import { combineReducers } from 'redux';
import appReducer from './appReducer';
import userReducer from './userReducer';
import cartReducer from './cartReducer';
import messageReducer from './messageReducer';
import deliveryAddressReducer from './deliveryAddressReducer';
import modalReducer from './modalReducer';
import adminRolesReducer from './adminRolesReducer';

const appReducers = combineReducers({
    app: appReducer,
    user: userReducer,
    cart: cartReducer,
    message: messageReducer,
    deliveryAddress: deliveryAddressReducer,
    modal: modalReducer,
    adminRoles: adminRolesReducer
});

export default appReducers;