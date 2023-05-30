import {
  INTERNAL_LOGIN_USER,
  INTERNAL_LOGIN_SUCCESS,
  INTERNAL_LOGOUT_USER,
  INTERNAL_LOGOUT_USER_SUCCESS,
  INTERNAL_API_ERROR,
  INTERNAL_SOCIAL_LOGIN,
} from "./internalActionTypes";

export const loginInternalUser = (user, history) => {
  return {
    type: INTERNAL_LOGIN_USER,
    payload: {
      user,
      history,
    },
  };
};

export const loginInternalSuccess = (data, role) => {
  //console.log(role)
  return {
    type: INTERNAL_LOGIN_SUCCESS,
    payload: {
      data,
      role,
    },
  };
};

export const logoutInternalUser = (history) => {
  return {
    type: INTERNAL_LOGOUT_USER,
    payload: { history },
  };
};

export const logoutInternalSuccess = (user, role) => {
  return {
    type: INTERNAL_LOGOUT_USER_SUCCESS,
    payload: {
      user,
      role,
    },
  };
};

export const internalApiError = (error) => {
  return {
    type: INTERNAL_API_ERROR,
    payload: error,
  };
};

export const internalSocialLogin = (type, history) => {
  return {
    type: INTERNAL_SOCIAL_LOGIN,
    payload: { type, history },
  };
};
