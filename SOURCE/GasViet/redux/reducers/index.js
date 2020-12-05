import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import ListItemReducer from './ListItemReducer'
import HomeReducer from './HomeReducer'
import LoginReducer from './LoginReducer'
import ListOrderReducer from './ListOrderReducer'
import { RESET } from "../actions/type";
import listProvinceReducer from './ListProvinceReducer'
import getNotifyReducer from "./GetNotifyReducer";
import getHistoryPointReducer from "./GetHistoryPointReducer";
import listOrderReducer from "./ListOrderReducer"
import LocationSelectReducer from "./LocationSelectReducer";


appReducer = combineReducers({
  userReducer: UserReducer,
  listItemReducer: ListItemReducer,
  homeReducer: HomeReducer,
  listProvinceReducer: listProvinceReducer,
  getNotifyReducer: getNotifyReducer,
  getHistoryPointReducer: getHistoryPointReducer,
  listOrderReducer: listOrderReducer,
  loginReducer: LoginReducer,
  locationSelectReducer:LocationSelectReducer
  
});

const initialState = appReducer({}, {})

export default rootReducer = (state, action) => {
  if (action.type === RESET) {
    state = initialState
  }

  return appReducer(state, action)
}
