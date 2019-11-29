import * as actionTypes from './actionTypes';
import axios from 'axios';
import config from '../../config/index';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  }
};

export const authSuccess = (authData) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    authData: authData,
  }
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
};

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
           dispatch(authSuccess(response.data));
         })
         .catch(err => {
           console.log(err);
           dispatch(authFail(err));
         });
  }
}