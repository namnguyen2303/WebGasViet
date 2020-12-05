/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import AppNavigator from "./navigation/AppNavigator";
import NavigationUtil from "./navigation/NavigationUtil";
import { Provider } from "react-redux";
import store from "./redux/store";
import OneSignal from "react-native-onesignal"; // Import package from node modules
import codePush from "react-native-code-push";
import {
  SCREEN_ROUTER,
  USER_TYPE,
  ORDER_TYPE,
  NOTI_TYPE
} from "./constants/Constant";
import AsyncStorage from "@react-native-community/async-storage";
import { AppState, Vibration, Platform, NativeModules } from "react-native";
import reactotron from "reactotron-react-native";

// var notify = null;
class App extends Component {
  render() {
    console.disableYellowBox = true;
    return (
      <Provider store={store}>
        <AppNavigator
          ref={navigatorRef =>
            NavigationUtil.setTopLevelNavigator(navigatorRef)
          }
        />
      </Provider>
    );
  }

  constructor(props) {
    super(props);
    OneSignal.init("68dd1942-66ba-4300-81eb-e68fbe59181b"); // ios
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", this.onIds);
    OneSignal.inFocusDisplaying(2);
    AppState.addEventListener("change", async state => {
      console.log(state);
      if (state == "active") {
        const type = await AsyncStorage.getItem("type");
        if (type && parseInt(type) < 4)
          NativeModules.GVNativeModule.dimissAllNoti();
      }
    });
    this.checkNotiWhenAppInActive();
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("received");
    OneSignal.removeEventListener("opened");
    OneSignal.removeEventListener("ids");
  }
  checkNotiWhenAppInActive = async () => {
    NativeModules.GVNativeModule.GetNotiData(res => {
      if (res) {
        const data = JSON.parse(res).a;
        switch (data.type) {
          case USER_TYPE.general_agent:
            NavigationUtil.push(SCREEN_ROUTER.NOTIFY, {
              type_order: ORDER_TYPE.processing,
              data: data
            });
            break;
          case USER_TYPE.agent:
            NavigationUtil.push(SCREEN_ROUTER.NOTIFY, {
              type_order: ORDER_TYPE.pending,
              data: data
            });
            break;
          case USER_TYPE.customer:
            NavigationUtil.push(SCREEN_ROUTER.ORDER_DETAIL_SCREEN, {
              orderID: data.orderID
            });
            break;
        }
      }
    });
  };

  async onReceived(notification) {
    reactotron.log(notification, "log noti Recei");
    const data = notification.payload.additionalData;
    await AsyncStorage.setItem("type", data.type.toString());
    if (AppState.currentState != "inactive") {
      switch (data.type) {
        case USER_TYPE.general_agent:
          NavigationUtil.push(SCREEN_ROUTER.NOTIFY, {
            type_order: ORDER_TYPE.processing,
            data: data
          });
          break;
        case USER_TYPE.agent:
          NavigationUtil.push(SCREEN_ROUTER.NOTIFY, {
            type_order: ORDER_TYPE.pending,
            data: data
          });
          break;
        case USER_TYPE.customer:
          NavigationUtil.push(SCREEN_ROUTER.ORDER_DETAIL_SCREEN, {
            orderID: data.orderID
          });
          break;
        // case NOTI_TYPE.news:
        //   NavigationUtil.push("PromotionDetail", {
        //     newsID: data.orderID
        //   });
        //   break;
      }
    }
  }

  onOpened(openResult) {
    reactotron.log(openResult, "data in openResult");
    if(openResult.notification.payload.additionalData.type== NOTI_TYPE.news){
      NavigationUtil.navigate("PromotionDetail", {
        newsID: openResult.notification.payload.additionalData.orderID
      });
    }
    if (AppState.currentState != "active" && Platform.OS == "ios") {
      switch (openResult.notification.payload.additionalData.type) {
        case USER_TYPE.general_agent:
          NavigationUtil.push(SCREEN_ROUTER.NOTIFY, {
            type_order: ORDER_TYPE.processing,
            data: openResult.notification.payload.additionalData
          });
          break;
        case USER_TYPE.agent:
          NavigationUtil.push(SCREEN_ROUTER.NOTIFY, {
            type_order: ORDER_TYPE.pending,
            data: openResult.notification.payload.additionalData
          });
          break;
        case USER_TYPE.customer:
          NavigationUtil.push(SCREEN_ROUTER.ORDER_DETAIL_SCREEN, {
            orderID: openResult.notification.payload.additionalData.orderID
          });
          break;
        // case NOTI_TYPE.news:
        //   NavigationUtil.push("PromotionDetail", {
        //     newsID: openResult.notification.payload.additionalData.orderID
        //   });
        //   break;
      }
    }
    // });
  }

  onIds(device) {
    console.log(device);
  }
}

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };

MyApp = codePush(codePushOptions)(App);

//appcenter codepush release-react -a Apps-Windsoft/GasViet_Android -d prod
//appcenter codepush release-react -a Apps-Windsoft/GasViet_IOS -d prod

export default MyApp;
