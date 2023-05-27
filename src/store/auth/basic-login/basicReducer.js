import {
  BASIC_LOGIN_USER,
  BASIC_LOGIN_SUCCESS,
  BASIC_LOGOUT_USER,
  BASIC_LOGOUT_USER_SUCCESS,
  BASIC_API_ERROR,
  BASIC_SOCIAL_LOGIN,
} from "./basicActionTypes";

const initialState = {
  error: "",
  loading: false,
};

const basicReducer = (state = initialState, action) => {
  switch (action.type) {
    case BASIC_LOGIN_USER:
      return {
        ...state,
        loading: true,
      };
    case BASIC_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case BASIC_LOGOUT_USER:
      return { ...state };
    case BASIC_LOGOUT_USER_SUCCESS:
      return { ...state };
    case BASIC_API_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default basicReducer;