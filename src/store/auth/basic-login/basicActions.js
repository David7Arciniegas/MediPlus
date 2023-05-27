import {
  BASIC_LOGIN_USER,
  BASIC_LOGIN_SUCCESS,
  BASIC_LOGOUT_USER,
  BASIC_LOGOUT_USER_SUCCESS,
  BASIC_API_ERROR,
  BASIC_SOCIAL_LOGIN,
} from "./basicActionTypes";

export const loginBasicUser = (user, history) => {
  return {
    type:BASIC_LOGIN_USER,
    payload: { user, history },
  };
};

export const loginbasicSuccess = (user) => {
  return {
    type:BASIC_LOGIN_SUCCESS,
    payload: user,
  };
};

export const logoutbasicUser = (history) => {
  return {
    type:BASIC_LOGOUT_USER,
    payload: { history },
  };
};

export const logoutbasicSuccess = () => {
  return {
    type:BASIC_LOGOUT_USER_SUCCESS,
    payload: {},
  };
};

export const basicApiError = (error) => {
  return {
    type: BASIC_API_ERROR,
    payload: error,
  };
};

export const basicSocialLogin = (type, history) => {
  return {
    type: BASIC_SOCIAL_LOGIN,
    payload: { type, history },
  };
};
