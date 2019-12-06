import * as actionTypes from './actionTypes';
import axios from 'axios';
import config from '../../config/index';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  }
};

export const authSuccess = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: idToken,
    userId: userId,
  }
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
};

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout( () => {
      dispatch(logout());
    }, expirationTime * 1000);
  }
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true,
    }

    const apiKey = config.firebaseConfig.apiKey;

    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + apiKey;
    if(!isSignup){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apiKey
    }
    
    axios.post(url, authData)
         .then(response => {
           console.log(response);
           dispatch(authSuccess(response.data.idToken, response.data.localId));
           dispatch(checkAuthTimeout(response.data.expiresIn));
         })
         .catch(err => {
           dispatch(authFail(err.response.data.error));
         });
  }
}