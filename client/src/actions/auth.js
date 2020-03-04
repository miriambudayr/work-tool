import {
  REGISTER_SUCCESSFUL,
  REGISTER_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED,
  LOGOUT
} from './types';
import { setAuthToken } from '../utils';
import { getBoards } from './boards';
import { setAlert } from './alert';
import axios from 'axios';

// Login user
export function login({ email, password }) {
  return async dispatch => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post('api/login', body, config);
      dispatch({ type: LOGIN_SUCCESSFUL, data: res.data });
      dispatch(loadUser());
      dispatch(getBoards());
    } catch (error) {
      const errors = error.response.data.errors;

      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.message, 'danger')));
      }

      dispatch({ type: LOGIN_FAILED });
    }
  };
}

// Log out user
export function logout() {
  return async dispatch => {
    if (localStorage.token) {
      dispatch({ type: LOGOUT });
    }
  };
}

// Load user
export function loadUser() {
  return async dispatch => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/login');
      dispatch({ type: USER_LOADED, data: res.data });
    } catch (error) {
      dispatch({ type: AUTH_ERROR });
    }
  };
}

// Register a user.
export function register({ name, email, password }) {
  return async dispatch => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post('api/user', body, config);
      dispatch({ type: REGISTER_SUCCESSFUL, data: res.data });
      dispatch(loadUser());
      dispatch(getBoards());
    } catch (error) {
      const errors = error.response.data.errors;

      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({ type: REGISTER_FAILED });
    }
  };
}
