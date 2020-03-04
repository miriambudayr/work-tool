import {
  REGISTER_SUCCESSFUL,
  REGISTER_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED,
  LOGOUT
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

function auth(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: data
      };
    case REGISTER_SUCCESSFUL:
    case LOGIN_SUCCESSFUL:
      localStorage.setItem('token', data.token);
      return {
        ...state,
        ...data,
        isAuthenticated: true,
        loading: false
      };
    case LOGOUT:
    case AUTH_ERROR:
    case REGISTER_FAILED:
    case LOGIN_FAILED:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    default:
      return state;
  }
}

export default auth;
