import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import NavigationUtil from "../../navigation/NavigationUtil";
import { SCREEN_ROUTER } from "../../constants/Constant";
import AsyncStorage from "@react-native-community/async-storage";
import codePush from "react-native-code-push";
import reactotron from 'reactotron-react-native';

// import SplashScreen from "./SplashScreen";
// import { connect } from 'react-redux'

export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: false,
      isNewVersion: false,
    };
  }

  componentDidMount(){
    this._bootstrapAsync()
  }

  handleNavigator(role, agent) {
    reactotron.log('role, agnet', role, agent)
    if (role) {
      role == 0
        ? NavigationUtil.navigate(SCREEN_ROUTER.MAIN_TAB)
        : agent == 1
        ? NavigationUtil.navigate(SCREEN_ROUTER.AGENT_TAB)
        : NavigationUtil.navigate(SCREEN_ROUTER.LOGIN_AGENT);
    } else NavigationUtil.navigate(SCREEN_ROUTER.MAIN_TAB);
  }

  async _checkUpdate() {
    const role = await AsyncStorage.getItem("role");
    const token = await AsyncStorage.getItem("token");
    const agent = await AsyncStorage.getItem("agent");
    if (__DEV__) {
      this.handleNavigator(role, agent)
    } else {
      this.setState(
        {
          ...this.state,
          update: true
        },
        async () => {
          codePush
            .checkForUpdate()
            .then(update => {
              reactotron.log(update);
              this.setState({
                ...this.state,
                update: false
              });
              if (!update) {
                this.setState({ update: false }, () => {
                  this.handleNavigator(role, agent)
                });
              } else {
                codePush.notifyAppReady();
                codePush.sync(
                  {
                    updateDialog: null,
                    installMode: codePush.InstallMode.IMMEDIATE
                  },
                  status => {
                    reactotron.log(status);
                    if (
                      status == codePush.SyncStatus.DOWNLOADING_PACKAGE ||
                      status == codePush.SyncStatus.CHECKING_FOR_UPDATE ||
                      status == codePush.SyncStatus.SYNC_IN_PROGRESS ||
                      status == codePush.SyncStatus.INSTALLING_UPDATE
                    ) {
                      this.setState({
                        ...this.state,
                        update: true
                      });
                    } else {
                      this.setState({
                        ...this.state,
                        update: false
                      });
                    }
                  },
                  progress => {
                    reactotron.log(progress);
                  }
                );
              }
            })
            .then(res=>{
              this.handleNavigator(role, agent);
            })
            .catch(err => {
              // console.log(err, "oke");
              this.setState({ update: false }, () => {
                this.handleNavigator(role, agent)
              });
            });
        }
      );
      codePush.notifyAppReady();
    }
  }


  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <View>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  _bootstrapAsync = () => {
    // const role = await AsyncStorage.getItem("role");
    // const token = await AsyncStorage.getItem("token");
    // const agent = await AsyncStorage.getItem("agent");

    // if (role) {
    //   role == 0
    //     ? NavigationUtil.navigate(SCREEN_ROUTER.MAIN_TAB)
    //     : agent == 1
    //     ? NavigationUtil.navigate(SCREEN_ROUTER.AGENT_TAB)
    //     : NavigationUtil.navigate(SCREEN_ROUTER.LOGIN_AGENT);
    // } else {
    //   NavigationUtil.navigate(SCREEN_ROUTER.MAIN_TAB);
    // }
    this._checkUpdate()
  };
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)
