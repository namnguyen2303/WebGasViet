import AsyncStorage from "@react-native-community/async-storage";

getDifferenceBetweenTime = async item => {
  try {
    oldDate = await AsyncStorage.getItem(item);
    return oldDate;
  } catch (error) {
    return "loi game";
  }
};
getDifferenceBetweenTimeFromParam = async param => {
  oldDate = Math.floor(parseInt(param));
  currentDate = Math.floor(new Date() / 1000);
  return Math.floor(currentDate / 60 - oldDate / 60);
};

setTimeStorage = (item, timeCountDown)=> {
  AsyncStorage.setItem(item, timeCountDown.toString());
};

clearTimeStorage = item => {
  AsyncStorage.setItem(item, "");
};
export default {
  getDifferenceBetweenTime,
  setTimeStorage,
  clearTimeStorage,
  getDifferenceBetweenTimeFromParam
};

