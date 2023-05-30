import {
  INTERNAL_LOGIN_USER,
  INTERNAL_LOGIN_SUCCESS,
  INTERNAL_LOGOUT_USER,
  INTERNAL_LOGOUT_USER_SUCCESS,
  INTERNAL_API_ERROR,
  INTERNAL_SOCIAL_LOGIN,
} from "./internalActionTypes";

const initialState = {
  error: "",
  loading: false,
  user: null,
  role: null,
};

const loginInternalReducer = (state = initialState, action) => {
  switch (action.type) {
    case INTERNAL_LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: null
      };
    case INTERNAL_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.data,
        role: action.payload.role,
        error: null,
      };
    case INTERNAL_LOGOUT_USER:
      return initialState; // Reset the state to initial values
    case INTERNAL_LOGOUT_USER_SUCCESS:
      return initialState; 
    case INTERNAL_API_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default loginInternalReducer;
