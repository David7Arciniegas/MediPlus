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
  user: null,
  role: null,
};

const basicReducer = (state = initialState, action) => {
  switch (action.type) {
    case BASIC_LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case BASIC_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.data,
        role: action.payload.role,
        error: null,
      };
      case BASIC_LOGOUT_USER:
        return initialState; // Reset the state to initial values
      case BASIC_LOGOUT_USER_SUCCESS:
        return initialState; 
      case BASIC_API_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default basicReducer;