import axios from "axios";
import { Alert } from "react-native";
import NavigationUtil from "../navigation/NavigationUtil";
import AsyncStorage from "@react-native-community/async-storage";
import I18n from "../i18n/i18n";

const key_billing = "AIzaSyCkiN4hoPdWkYCX9FRFvBTAwyjFNfionh8";

function createAxios() {
  // AsyncStorage.setItem("token", '773DE1FE9732F26F7552BC921CBE347E')
  var axiosInstant = axios.create();
  // axiosInstant.defaults.baseURL = "http://winds.hopto.org:8221/"; 
  axiosInstant.defaults.baseURL = "http://gasviet24h.winds.vn/";
  axiosInstant.defaults.timeout = 20000;
  axiosInstant.defaults.headers = { "Content-Type": "application/json" };

  axiosInstant.interceptors.request.use(
    async config => {
      config.headers.token = await AsyncStorage.getItem("token");
      // config.headers.token = 'A28012B7D3314097A9F3687F3423922D';
      return config;
    },
    error => Promise.reject(error)
  );

  axiosInstant.interceptors.response.use(response => {
    if (response.data && response.data.code == 403) {
      setTimeout(() => {
        Alert.alert("Thông báo", I18n.t("relogin"));
      }, 100);
      AsyncStorage.clear();
      AsyncStorage.setItem("token", "", () => {
        NavigationUtil.navigate("Auth");
      });
    } else if (response.data && response.data.status != 1) {
      setTimeout(() => {
        Alert.alert("Thông báo", response.data.message);
      }, 100);
    }
    return response;
  });
  return axiosInstant;
}

export const getAxios = createAxios();

/* Support function */
function handleResult(api) {
  return api.then(res => {
    if (res.data.status != 1) {
      return Promise.reject(new Error("Co loi xay ra"));
    }
    return Promise.resolve(res.data);
  });
}

export const requestLogin = payload => {
  return handleResult(
    getAxios.post("api/Service/Login", payload)
  );
};

export const CheckPass = passWord => {
  return handleResult(
    getAxios.post("api/Service/CheckPass", {
      passWord: passWord
    })
  );
};

export const requestLoginFB = payload => {
  return handleResult(
    getAxios.post("api/Service/Login", {
      value: payload.value,
      type: payload.type
    })
  );
};
export const requestLoginGG = payload => {
  return handleResult(
    getAxios.post("api/Service/Login", {
      value: payload.value,
      type: payload.type
    })
  );
};

export const requestRegister = payload => {
  return handleResult(
    getAxios.post("api/Service/Register", {
      value: payload.value,
      passWord: payload.passWord
    })
  );
};

export const requestLogout = () => {
  return handleResult(getAxios.get("api/Service/Logout"));
};

export const getUserInfo = deviceID => {
  return handleResult(
    getAxios.get(`api/Service/GetUserInfor?DeviceID=${deviceID}`)
  );
};

export const getHomeData = deviceID => {
  return handleResult(
    getAxios.get(`api/Service/GetHomeScreen?deviceID=${deviceID}`)
  );
};

export const getListItem = SearchKeys => {
  return handleResult(
    getAxios.get(`api/Service/GetListItem?SearchKey=${SearchKeys}`)
  );
};

export const requestChangeAvatar = payload => {
  return handleResult(getAxios.post(`api/Service/ChangeAvatar`, payload));
};

export const requestCreateOrder = payload => {
  return handleResult(getAxios.post(`api/Service/CreateOrder`, payload));
};
export const getProvince = () => {
  return handleResult(getAxios.get("api/Service/GetProvinceAndDistric?ProID="));
};

export const updateUserInfo = payload => {
  return handleResult(getAxios.post("api/Service/UpdateCustomer", payload));
};

export const getNotify = () => {
  return handleResult(getAxios.get("api/Service/GetNotify"));
};

export const getHistoryPoint = () => {
  return handleResult(getAxios.get("api/Service/GetPointHistory?FromDate="));
};

export const getListOrder = (status, page) => {
  return handleResult(
    getAxios.get(`api/Service/GetListOrder?status=${status}&page=${page}`)
  );
};

export const getListPackage = () => {
  return handleResult(getAxios.get("api/Service/ListServicePackage"));
};

export const changStatus = ({ orderID, status }) => {
  return handleResult(
    getAxios.get(`api/Service/ChangeStatus?orderID=${orderID}&status=${status}`)
  );
};
export const searchPlaceAutoComplete = keySearch => {
  return axios.get(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${keySearch}&key=${key_billing}&language=vi&components=country:vn`
  );
};
export const getDetailPlace = idPlace => {
  return axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${idPlace}&key=${key_billing}&language=vi`
  );
};
export const nearBySearch = (loc) => {
  return axios.get(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${loc.latitude},${loc.longitude}&key=${key_billing}&language=vi&rankby=distance`
  );
};

export const changPass = payload => {
  return handleResult(getAxios.post("api/Service/ChangePass", payload));
};

export const getOrderDetail = orderID => {
  return handleResult(
    getAxios.get(`api/Service/GetOrderDetail?orderID=${orderID}`)
  );
};

export const forgotPass = payload => {
  return handleResult(getAxios.post("api/Service/ForgotPassWord", payload));
};

export const getNewDetail = newsID => {
  return handleResult(
    getAxios.get(`api/Service/GetNewsDetail?newID=${newsID}`)
  );
};