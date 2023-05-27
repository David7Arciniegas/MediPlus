import {
  PROFESSIONAL_LOGIN_USER,
  PROFESSIONAL_LOGIN_SUCCESS,
  PROFESSIONAL_LOGOUT_USER,
  PROFESSIONAL_LOGOUT_USER_SUCCESS,
  PROFESSIONAL_API_ERROR,
  PROFESSIONAL_SOCIAL_LOGIN,
} from "./professionalActionTypes";

const initialState = {
  error: "",
  loading: false,
};

const professionalReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFESSIONAL_LOGIN_USER:
      return {
        ...state,
        loading: true,
      };
    case PROFESSIONAL_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case PROFESSIONAL_LOGOUT_USER:
      return { ...state };
    case PROFESSIONAL_LOGOUT_USER_SUCCESS:
      return { ...state };
    case PROFESSIONAL_API_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default professionalReducer;