import * as types from '../constants/actionTypes';

export const actSaveAdminRoles = roles => ({
    type: types.SAVE_ADMIN_ROLES,
    payload: roles
})