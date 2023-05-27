import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
} from "./internalActionTypes";

export const loginInternalUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: {
      user,
      history,
    },
  };
};

export const loginInternalSuccess = (data, role) => {
  //console.log(role)
  return {
    type: LOGIN_SUCCESS,
    payload: {
      data,
      role,
    },
  };
};

export const logoutInternalUser = (history) => {
  return {
    
    type: LOGOUT_USER,
    payload: { history },
  };
};

export const logoutInternalSuccess = (user, role) => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {
      user,
      role,
    },
  };
};

export const internalApiError = (error) => {
  return {
    type: API_ERROR,
    payload: error,
  };
};

export const internalSocialLogin = (type, history) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { type, history },
  };
};
