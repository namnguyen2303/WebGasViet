import { put, takeEvery, call } from "redux-saga/effects";
import AsyncStorage from '@react-native-community/async-storage';
import {
  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  REQUEST_LOGIN,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_FAIL,
  GET_LIST_ITEM,
  GET_LIST_ITEM_SUCCESS,
  GET_LIST_ITEM_FAIL,
  GET_HOME_SUCCESS,
  GET_HOME_FAIL,
  GET_HOME,
  CHANGE_AVATAR_SUCCESS,
  CHANGE_AVATAR_FAIL,
  CHANGE_AVATAR,
  GET_PROVINCE,
  GET_PROVINCE_FAIL,
  GET_PROVINCE_SUCCESS,
  GET_NOTIFICATION_FAIL,
  GET_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION,
  GET_HISTORY_POINT_SUCCESS,
  GET_HISTORY_POINT_FAIL,
  GET_HISTORY_POINT,
  REQUEST_LOGIN_FB_SUCCESS,
  REQUEST_LOGIN_FB_FAIL,
  REQUEST_LOGIN_FB,
  REQUEST_CREATE_ORDER,
  REQUEST_CREATE_ORDER_SUCCESS,
  REQUEST_CREATE_ORDER_FAIL,
  GET_LIST_ORDER,
  GET_LIST_ORDER_FAIL,
  GET_LIST_ORDER_SUCCESS,
  REQUEST_LOGIN_GG_SUCCESS,
  REQUEST_LOGIN_GG_FAIL,
  REQUEST_LOGIN_GG
  
} from "../actions/type";

import * as API from "../../constants/Api";
import NavigationUtil from "../../navigation/NavigationUtil";
import { SCREEN_ROUTER } from "../../constants/Constant";

export function* requestLogin(actions) {
  try {
    const response = yield call(API.requestLogin, actions.payload);
    // console.log(r);

    yield call(AsyncStorage.setItem, "token", response.result.token.toString());
    yield call(
      AsyncStorage.setItem,
      "role",
      response.result.role.toString()
    );
    yield call(
      AsyncStorage.setItem,
      "customerName",
      response.result.customerName.toString()
    );
    yield call(
      AsyncStorage.setItem,
      "userInfo",
      JSON.stringify(response.result)
    );
    
    yield put({ type: REQUEST_LOGIN_SUCCESS, payload: response });
    NavigationUtil.navigate(SCREEN_ROUTER.AUTH_LOADING)
  } catch (err) {
    yield put({ type: REQUEST_LOGIN_FAIL, payload: err });
  }
}

export function* requestLoginFB(actions) {
  try {
    const response = yield call(API.requestLoginFB, actions.payload);
    // console.log(r);
    
    yield call(AsyncStorage.setItem, "token", response.result.token.toString());
    yield call(
      AsyncStorage.setItem,
      "role",
      response.result.role.toString()
    );
    yield call(
      AsyncStorage.setItem,
      "customerName",
      response.result.customerName.toString()
    );

    yield call(
      AsyncStorage.setItem,
      "userInfo",
      JSON.stringify(response.result)
    );

    yield put({ type: REQUEST_LOGIN_FB_SUCCESS, payload: response });
    NavigationUtil.navigate(SCREEN_ROUTER.AUTH_LOADING)
  } catch (err) {
    yield put({ type: REQUEST_LOGIN_FB_FAIL, payload: err });
  }
}

export function* requestLoginGG(actions) {
  try {
    const response = yield call(API.requestLoginGG, actions.payload);
    // console.log(r);
    
    yield call(AsyncStorage.setItem, "token", response.result.token.toString());
    yield call(
      AsyncStorage.setItem,
      "role",
      response.result.role.toString()
    );
    yield call(
      AsyncStorage.setItem,
      "customerName",
      response.result.customerName.toString()
    );

    yield call(
      AsyncStorage.setItem,
      "userInfo",
      JSON.stringify(response.result)
    );

    yield put({ type: REQUEST_LOGIN_GG_SUCCESS, payload: response });
    NavigationUtil.navigate(SCREEN_ROUTER.AUTH_LOADING)
  } catch (err) {
    yield put({ type: REQUEST_LOGIN_GG_FAIL, payload: err });
  }
}


export function* getUserInfor(actions) {
  try {
    const response = yield call(API.getUserInfo, actions.payload.deviceID);
    yield put({ type: GET_USER_SUCCESS, payload: response });
  } catch (err) {
    yield put({ type: GET_USER_FAIL, payload: err });
  }
}

export function* getListItem(actions) {
  try {
    const response = yield call(API.getListItem, actions.payload.SearchKeys);
    yield put({ type: GET_LIST_ITEM_SUCCESS, payload: response });
  } catch (err) {
    yield put({ type: GET_LIST_ITEM_FAIL, payload: err });
  }
}
export function* getHomeData(actions) {
  try {
    const response = yield call(API.getHomeData, actions.payload.deviceID);
    yield put({ type: GET_HOME_SUCCESS, payload: response });
  } catch (err) {
    yield put({ type: GET_HOME_FAIL, payload: err });
  }
}
export function* requestChangeAvatar(actions) {
  try {
    const response = yield call(API.requestChangeAvatar, actions.payload);
    yield put({ type: CHANGE_AVATAR_SUCCESS, payload: response });
  } catch (err) {
    yield put({ type: CHANGE_AVATAR_FAIL, payload: err });
  }
}

export function* requestCreateOrder(actions) {
  try {
    const response = yield call(API.requestCreateOrder, actions.payload);
    yield put({ type: REQUEST_CREATE_ORDER_SUCCESS, payload: response });
  } catch (err) {
    yield put({ type: REQUEST_CREATE_ORDER_FAIL, payload: err });
  }
}


export function* getProvince(action) {
  // reactotron.log(action, 'province')
  try {
    const response = yield call(API.getProvince, action.payload);
    yield put({ type: GET_PROVINCE_SUCCESS, payload: response.result });
  } catch (err) {
    yield put({ type: GET_PROVINCE_FAIL, payload: err });
  }
}

export function* getNotify(action) {
  // reactotron.log(action, 'province')
  try {
    const response = yield call(API.getNotify, action.payload);
    yield put({ type: GET_NOTIFICATION_SUCCESS, payload: response.result });
  } catch (err) {
    yield put({ type: GET_NOTIFICATION_FAIL, payload: err });
  }
}

export function* getHistoryPoint(action) {
  // reactotron.log(action, 'province')
  try {
    const response = yield call(API.getHistoryPoint, action.payload);
    yield put({ type: GET_HISTORY_POINT_SUCCESS, payload: response.result });
  } catch (err) {
    yield put({ type: GET_HISTORY_POINT_FAIL, payload: err });
  }
}

export function* getListOrder(action) {
  try {
    const response = yield call(API.getListOrder, action.payload.status, action.payload.page);
    // reactotron.log("success");
    yield put({ type: GET_LIST_ORDER_SUCCESS, payload: { data: response.result, status: action.payload.status } });
  } catch (err) {
    // reactotron.log(err,"fail");
    yield put({ type: GET_LIST_ORDER_FAIL, payload: { err: err, status: action.payload.status } });
  }
}

export const watchGetUser = takeEvery(GET_USER, getUserInfor);
export const watchRequestLogin = takeEvery(REQUEST_LOGIN, requestLogin);
export const watchRequestLoginFB = takeEvery(REQUEST_LOGIN_FB, requestLoginFB);
export const watchRequestLoginGG = takeEvery(REQUEST_LOGIN_GG, requestLoginGG);
export const watchGetListItem = takeEvery(GET_LIST_ITEM, getListItem);
export const watchGetHomeData = takeEvery(GET_HOME, getHomeData);
export const watchChangeAvatar = takeEvery(CHANGE_AVATAR, requestChangeAvatar);
export const watchCreateOrder = takeEvery(REQUEST_CREATE_ORDER, requestCreateOrder);
export const watchGetProvince = takeEvery(GET_PROVINCE, getProvince);
export const watchGetNotify = takeEvery(GET_NOTIFICATION, getNotify);
export const watchGetHistoryPoint = takeEvery(GET_HISTORY_POINT, getHistoryPoint);
export const watchGetListOrder = takeEvery(GET_LIST_ORDER, getListOrder);

