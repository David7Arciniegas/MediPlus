import {
  PROFESSIONAL_LOGIN_USER,
  PROFESSIONAL_LOGIN_SUCCESS,
  PROFESSIONAL_LOGOUT_USER,
  PROFESSIONAL_LOGOUT_USER_SUCCESS,
  PROFESSIONAL_API_ERROR,
  PROFESSIONAL_SOCIAL_LOGIN,
} from "./professionalActionTypes";

export const loginProfessionalUser = (user, history) => {
  return {
    type: PROFESSIONAL_LOGIN_USER,
    payload: { user, history },
  };
};

export const loginProfessionalSuccess = (data, role) => {
  return {
    type: PROFESSIONAL_LOGIN_SUCCESS,
    payload: {
      data,
      role,
      }
  };
};

export const logoutProfessionalUser = (history) => {
  return {
    type: PROFESSIONAL_LOGOUT_USER,
    payload: { history },
  };
};

export const logoutProfessionalSuccess = () => {
  return {
    type: PROFESSIONAL_LOGOUT_USER_SUCCESS,
    payload: {
      user,
      role
    },
  };
};

export const professionalApiError = (error) => {
  return {
    type: PROFESSIONAL_API_ERROR,
    payload: error,
  };
};

export const professionalSocialLogin = (type, history) => {
  return {
    type: PROFESSIONAL_SOCIAL_LOGIN,
    payload: { type, history },
  };
};
