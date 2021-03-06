import { takeEvery, all, takeLatest } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import { 
  logoutSaga, 
  checkAuthTimeoutSaga, 
  authUserSaga, 
  authCheckStateSaga 
} from './auth';

import {
  initIngredientSaga,
} from './burgerBuilder';

import { 
  purchaseBurgerSaga,
  fetchOrdersSaga,
 } from './order';

export function* watchAuth(){
  //this approach will make the methods run concurrently
  //this can be done anywhere, not just for takeEvery. e.g two axios requests
  yield all([
    takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
    takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
    takeEvery(actionTypes.AUTH_USER, authUserSaga),
    takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga),
  ])
}

export function* watchBurgerBuilder(){
  yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientSaga);
}

export function* watchOrder(){
  // this will auto cancel any other on-going executions and run the newest one
  yield takeLatest(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga);
  yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga);
}
