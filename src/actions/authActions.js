import axios from 'axios';
import { returnErrors } from './errorActions';

import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from './types';

//Check token and load user
export const loadUser = () => (dispatch, getState) => {
    
    //User loading
    dispatch({ type: USER_LOADING });

    axios.get('http://localhost:5000/api/auth/user', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        })
}

// Register user
export const register = ({enrollmentNum, password, role}) => dispatch => {
    //Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    //Request body
    const body = JSON.stringify({enrollmentNum, password, role});
    axios.post('http://localhost:5000/api/users', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
            dispatch({
                type: REGISTER_FAIL
            });
        })
}

//Logout User
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    };
};

//Setup config/headers and token
export const tokenConfig = getState => {

      //Get token from localstorage
      const token = getState().auth.token;

      //Headers
      const config = {
          headers: {
              "Content-type": "application/json"
          }
      };
  
      //If token, add to header
      if(token){
          config.headers['x-auth-token'] = token;
      }

      return config;
}