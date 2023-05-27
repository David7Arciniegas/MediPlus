import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
} from "./internalActionTypes";

const initialState = {
  error: "",
  loading: false,
  user: null, // Initialize user as null
  role: null
};

const loginInternalReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: null,
      };
      case LOGIN_SUCCESS:
        return {
          ...state,
          loading: false,
          user: action.payload.data,
          role: action.payload.role, // Add this line to store the role
          error: null,
        };
    case LOGOUT_USER:
      return {
        ...initialState,
        loading: true,
      };
    case LOGOUT_USER_SUCCESS:
      return {
        ...initialState,
        loading: false,
      };
    case API_ERROR:
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
