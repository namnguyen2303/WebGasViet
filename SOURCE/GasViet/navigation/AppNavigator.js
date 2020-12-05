import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import { BottomTabBar } from "react-navigation-tabs";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import Main from "../navigation/MainTabNavigator";
import AgentTabNavigator from "./AgentTabNavigator";
import AuthLoadingScreen from "../screens/auth/AuthLoadingScreen";
import ForgotPassScreen from "../screens/auth/ForgotPassScreen";
import LoginAgentScreen from '../screens/auth/LoginAgentScreen'
const TabBarComponent = props => <BottomTabBar {...props} />;

const Auth = createStackNavigator(
  {
    Login: LoginScreen,
    LoginAgent: LoginAgentScreen,
    Register: RegisterScreen,
    ForgotPassword: ForgotPasswordScreen,
    ForgotPass: ForgotPassScreen

  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    AgentTabNavigator: AgentTabNavigator,
    Main: Main,
    Auth: Auth
  })
);
