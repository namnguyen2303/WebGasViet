import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator, BottomTabBar } from "react-navigation-tabs";
import AuthLoadingScreen from "../screens/auth/AuthLoadingScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import PromotionScreen from "../screens/customer/home/PromotionScreen";
import HomeScreen from "../screens/customer/home/HomeScreen";
import NotificationScreen from "../screens/customer/notification/NotificationScreen";
import NotiScreen from "../screens/agent/noti/NotiScreen";
import OrderScreen from "../screens/customer/order/OrderScreen";
import ProductScreen from "../screens/customer/product/ProductScreen";
// import UserScreen from '../screens/customer/user/UserScreen'
import UserScreen from "../screens/agent/user/UserScreen";
import ProductDetailScreen from "../screens/customer/product/ProductDetailScreen";
import OrderStep1Screen from "../screens/customer/order/OrderStep1Screen";
import OrderDetailScreen from "../screens/customer/order/OrderDetailScreen";
import UpdateUserScreen from "../screens/agent/user/UpdateUserScreen";
import ChangPassScreen from "../screens/agent/user/ChangePassScreen";
import PromotionDetailScreen from '../screens/customer/home/PromotionDetailScreen'
import I18n from "../i18n/i18n";
import * as theme from "../constants/Theme";
import { Image } from "react-native";
import MapLocationScreen from "../screens/customer/order/MapLocationScreen";
const TabBarComponent = props => <BottomTabBar {...props} />;
const tabbarIcons = {
  Home: require("../assets/images/ic_cus_home.png"),
  Order: require("../assets/images/ic_cus_order.png"),
  Product: require("../assets/images/ic_cus_product.png"),
  Notification: require("../assets/images/ic_cus_noti.png"),
  User: require("../assets/images/ic_cus_user.png")
};

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  const iconSource =
    tabbarIcons[routeName] || require("../assets/images/ic_home.png");
  const iconSize = focused ? 25 : 22;
  return (
    <Image
      source={iconSource}
      fadeDuration={0}
      style={{
        tintColor: tintColor,
        width: iconSize,
        height: iconSize,
        resizeMode: "contain"
      }}
    />
  );
};

const bottomBar = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      title: I18n.t("home"),
      navigationOptions: {
        tabBarLabel: I18n.t("home")
      }
    },
    Order: {
      screen: OrderScreen,
      title: I18n.t("order"),
      navigationOptions: {
        tabBarLabel: I18n.t("order")
      }
    },
    Product: {
      screen: PromotionScreen,
      title: I18n.t("promotion"),
      navigationOptions: {
        tabBarLabel: I18n.t("promotion")
      }
    },
    Notification: {
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
      activeTintColor: theme.colors.active
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
    }
  }
);
export default createStackNavigator(
  {
    Main: {
      screen: bottomBar
    },
    Promotion: PromotionScreen,
    ProductDetail: ProductDetailScreen,
    OrderStep1: OrderStep1Screen,
    OrderDetail: OrderDetailScreen,
    MapLocation: MapLocationScreen,
    UpdateUserScreen: UpdateUserScreen,
    ChangPassScreen: ChangPassScreen,
    PromotionDetail: PromotionDetailScreen
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);
