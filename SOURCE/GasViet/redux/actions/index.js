import {
  GET_USER,
  REQUEST_LOGIN,
  GET_LIST_ITEM,
  GET_HOME,
  CHANGE_AVATAR,
  GET_PROVINCE,
  GET_NOTIFICATION,
  GET_HISTORY_POINT,
  REQUEST_LOGIN_FB,
  REQUEST_CREATE_ORDER,
  GET_LIST_ORDER,
  SEND_LOCATION_SELECT,
  CLEAR_LOCATION_SELECT,
  REQUEST_LOGIN_GG
} from "./type";

export const getUserInfo = deviceID => ({
  type: GET_USER,
  payload: {
    deviceID: deviceID
  }
});

export const requestLogin = payload => ({
  type: REQUEST_LOGIN,
  payload: payload
});

export const requestLoginFB = payload => ({
  type: REQUEST_LOGIN_FB,
  payload: {
    value: payload.value,
    type: payload.type
  }
});
export const requestLoginGG = payload => ({
  type: REQUEST_LOGIN_GG,
  payload: {
    value: payload.value,
    type: payload.type
  }
});

export const getListItem = SearchKeys => ({
  type: GET_LIST_ITEM,
  payload: {
    SearchKeys: SearchKeys
  }
});

export const getHomeData = deviceID => ({
  type: GET_HOME,
  payload: {
    deviceID: deviceID
  }
});

export const changeAvatar = data => ({
  type: CHANGE_AVATAR,
  payload: data
});

export const requestCreateOrder = payload => ({
  type: REQUEST_CREATE_ORDER,
  payload: {
    buyerName: payload.buyerName,
    buyerPhone: payload.buyerPhone,
    buyerAddress: payload.buyerAddress,
    note: payload.note,
    listOrderItem: payload.listOrderItem
  }
});

export const getProvince = () => ({
  type: GET_PROVINCE,
  payload: {}
});

export const getNotification = () => ({
  type: GET_NOTIFICATION,
  payload: {}
});

export const getHistoryPoint = () => ({
  type: GET_HISTORY_POINT,
  payload: {}
});

export const getListOrder = (status, page) => ({
  type: GET_LIST_ORDER,
  payload: {
    status: status,
    page: page
  }
});

export const sendLocationSelect = (location, name) => ({
  type: SEND_LOCATION_SELECT,
  payload: {
    location: location,
    name: name
  }
});
export const clearLocationSelect = () => ({
  type: CLEAR_LOCATION_SELECT,
  payload: {}
});
