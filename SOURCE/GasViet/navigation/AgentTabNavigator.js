import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
// import MainTabNavigator from './MainTabNavigator';
import LoginScreen from "../screens/auth/LoginScreen";
import { createBottomTabNavigator, BottomTabBar } from "react-navigation-tabs";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import OrderScreen from "../screens/agent/order/OrderScreen";
import UserScreen from "../screens/agent/user/UserScreen";
import NotiScreen from "../screens/agent/noti/NotiScreen";
import AuthLoadingScreen from "../screens/auth/AuthLoadingScreen";
import I18n from "../i18n/i18n";
import * as theme from "../constants/Theme";
import { Image } from "react-native";
import UpdateUserScreen from "../screens/agent/user/UpdateUserScreen";
import HistoryPointScreen from "../screens/agent/user/HistoryPointScreen";
import NotifyScreen from "../screens/agent/order/NotifyScreen";
import ChangPassScreen from "../screens/agent/user/ChangePassScreen";
import PaymentInfoScreen from "../screens/agent/user/PaymentInfoScreen";
import VNPayScreen from "../screens/agent/user/VNPayScreen";
import LoginAgentScreen from '../screens/auth/LoginAgentScreen';
// import OrderDetailScreen from "../screens/customer/order/OrderDetailScreen";

const TabBarComponent = props => <BottomTabBar {...props} />;

const tabbarIcons = {
  Home: require("../assets/images/ic_order.png"),
  Noti: require("../assets/images/ic_noti.png"),
  User: require("../assets/images/ic_user.png")
};

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  const iconSource =
    tabbarIcons[routeName] || require("../assets/images/ic_home.png");
  const iconSize = focused ? 35 : 32;
  return (
    <Image
      source={iconSource}
      fadeDuration={0}
      style={{ tintColor: tintColor, width: iconSize, height: iconSize }}
    />
  );
};

const Main = createBottomTabNavigator(
  {
    Home: {
      screen: OrderScreen,
      title: I18n.t("order"),
      navigationOptions: {
        tabBarLabel: I18n.t("order")
      }
    },
    Noti: {
      screen: NotiScreen,
      title: I18n.t("notification"),
      navigationOptions: {
        tabBarLabel: I18n.t("notification")
      }
    },
    User: {
      screen: UserScreen,
      title: I18n.t("user"),
      navigationOptions: {
        tabBarLabel: I18n.t("user")
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor)
    }),
    tabBarOptions: {
      activeBackgroundColor: theme.colors.bottombarBg,
      inactiveBackgroundColor: theme.colors.bottombarBg,
      inactiveTintColor: theme.colors.inactive,
      activeTintColor: theme.colors.orange
    },
    tabBarComponent: props => {
      return (
        <TabBarComponent
          {...props}
          onTabPress={props.onTabPress}
          style={{
            borderTopColor: theme.colors.borderTopColor,
            backgroundColor: theme.colors.white,
            height: 58
          }}
        />
      );
    },
    initialRouteName: "Home"
  }
);

export default createStackNavigator(
  {
    Main: {
      screen: Main
    },
    UpdateUserScreen: UpdateUserScreen,
    HistoryPointScreen: HistoryPointScreen,
    ChangPassScreen: ChangPassScreen,
    NotifyScreen: NotifyScreen,
    PaymentInfoScreen: PaymentInfoScreen,
    VNPAYScreen: VNPayScreen,
    // OrderDetail: OrderDetailScreen
    // LoginAgent: LoginAgentScreen
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);
