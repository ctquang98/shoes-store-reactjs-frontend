import * as types from '../constants/actionTypes';
import setAuthHeader from '../utils/setAuthHeader';
import { actSyncCartWhenLogin, actClearCartData } from './cartAction';
import { actSaveDeliveryAddress } from './deliveryAddressAction';
import { actSaveAdminRoles } from './adminRolesAction';
import { actFetchDataRequest } from './appAction';
import callAPI from '../api/api';

export const actLoginRequest = (username, password) => {
    return dispatch => {
        return callAPI('login', 'POST', {
            userName: username,
            passWord: password
        })
            .then(res => {
                const user = res.data;
                if(user) {
                    localStorage.setItem('token', user.token);
                    setAuthHeader(user.token);
                    dispatch(actSetCurrentUser(user));
                    
                    if(user.infor && user.infor.id !== -1) {
                        dispatch(actFetchDataRequest(user.infor.id));
                    }

                    if(user && user.cart && user.cart.products) { // accept []
                        dispatch(actSyncCartWhenLogin(user.cart.products));
                    }
                }
            });
    }
}

export const actLogout = () => {
    return dispatch => {
        localStorage.removeItem('token');
        setAuthHeader(false);
        dispatch(actSetCurrentUser({ infor: {id: -1} }));
        dispatch(actClearCartData());
        dispatch(actSaveDeliveryAddress({}));
        dispatch(actSaveAdminRoles([]));
    }
}

export const actSetCurrentUser = user => {
    return {
        type: types.SET_CURRENT_USER,
        payload: user
    }
}

export const actLoginWithFacebook = fbUser => {
    return dispatch => {
        return callAPI('login-facebook', 'POST', {
            userName: fbUser.userID,
            fullName: fbUser.name,
            email: fbUser.email
        })
            .then(res => {
                const user = res.data;
                if(user) {
                    localStorage.setItem('token', user.token);
                    setAuthHeader(user.token);
                    dispatch(actSetCurrentUser(user));

                    if(user && user.cart && user.cart.products) { // accept []
                        dispatch(actSyncCartWhenLogin(user.cart.products));
                    }
                }
            });
    }
}