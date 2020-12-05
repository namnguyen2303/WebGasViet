import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Permission,
  PermissionsAndroid,
  RefreshControl,
  Platform,
  Linking
} from "react-native";
import ImagePicker from "react-native-image-picker";
import { SCREEN_ROUTER } from "../../../constants/Constant";
import GVHeader from "../../../components/GVHeader";
import * as theme from "../../../constants/Theme";
import I18n from "../../../i18n/i18n";
import NavigationUtil from "../../../navigation/NavigationUtil";
import { Avatar, Divider } from "react-native-elements";
import Icon from "../../../components/Icon";
import { showConfirm, showMessages } from "../../../components/Alert";
import AsyncStorage from "@react-native-community/async-storage";
import { requestLogout } from "../../../constants/Api";
import { getUserInfo } from "../../../redux/actions";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import RequsetLogin from "../../../components/RequsetLoginScreen";
import NumberFormat from "../../../components/NumberFormat";
import OneSignal from "react-native-onesignal";
const options = {
  title: "Select Avatar",
  customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changeAvatar } from "../../../redux/actions";

class UserScreen extends Component {
  // async componentDidMount() {

  // }
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      requestLoading: false,
      error: false,
      userInfo: "",
      isLoading: false,
      token: "",
      isLoadingToken: false
    };
  }

  componentDidMount() {
    this.getRole();
  }

  async getData() {
    // let deviceID = await AsyncStorage.getItem("deviceID");
    // console.log(deviceID);
    OneSignal.getPermissionSubscriptionState(status => {
     var deviceID = status.userId;
      // alert(userID);
      // reactotron.log('usser',status)
      this.props.getUserInfo(deviceID);
    });
  }

  getRole = async () => {
    try {
      const role = await AsyncStorage.getItem("role");
      const token = await AsyncStorage.getItem("token");
      // console.log(role);
      if (token != null) {
        // this.getData();
        this.setState({
          ...this.setState,
          role: role,
          token: token,
          isLoadingToken: false
        },()=> this.getData());
      }
      else
        this.setState({
          ...this.state,
          isLoadingToken: false,
        })
    } catch (error) {
      this.setState({
        ...this.state,
        isLoadingToken: false,
      })
    }
  };
  _checkPermission = async () => {
    var check = true;
    if (Platform.OS == "android")
      check = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
    // console.log(check);
    if (!check) {
      try {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        this._chooseImage();
      } catch (error) {}
    } else {
      this._chooseImage();
    }
  };
  _chooseImage() {
    ImagePicker.launchImageLibrary(options, response => {
      // reactotron.log(response);

      if (!response.didCancel) {
        const data = new FormData();
        data.append("avatar", {
          uri: response.uri.replace("file://", ""),
          type: "image/jpg", // or photo.type
          name: "testPhotoName"
        });
        this.props.changeAvatar(data);
        this.getData();
      }
    });
  }
  _Logout = async () => {
    this.setState({
      ...this.state,
      isLoading: true
    });
    try {
      const res = await requestLogout();
      AsyncStorage.clear();
      if (res) {
        this.setState({
          ...this.state,
          isLoading: false,
          error: null,
        });
        NavigationUtil.navigate("AuthLoading");
      }
    } catch (error) {
      this.setState({
        ...this.state,
          isLoading: false,
          error: error
      });
    }
  };
  render() {
    const { role, token, isLoadingToken } = this.state;
    const { UserInfoState } = this.props;
    if (token == "") return <RequsetLogin />;
    if (UserInfoState.isLoading || isLoadingToken) return <Loading />;
    if (UserInfoState.error) return <Error onPress={() => this.getData()} />;
    

    return (
      <View style={[theme.styles.containter]}>
        <ImageBackground
          source={require("../../../assets/images/backgroundUser.png")}
          style={styles.backgroundAva}
        >
          <Text style={[theme.fonts.bold18, { color: theme.colors.white }]}>
            {I18n.t("account")}
          </Text>
          <Avatar
            size="large"
            title="GV"
            rounded
            onPress={() => {
              Platform.OS = "android"
                ? this._checkPermission()
                : this._chooseImage();
            }}
            source={{ uri: UserInfoState.data.result.urlAvatar }}
            activeOpacity={0.7}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                theme.fonts.medium18,
                { color: theme.colors.white, marginRight: 10 }
              ]}
            >
              {UserInfoState.data.result.customerName}
            </Text>
            <TouchableOpacity
              onPress={() => {
                NavigationUtil.navigate(SCREEN_ROUTER.UPDATE, {
                  item: UserInfoState.data.result
                });
              }}
            >
              <Icon.SimpleLineIcons
                name="note"
                size={19}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* {role != 1 &&
                        <View style={styles.info} >
                            {this.renderInfo(I18n.t('accumulation_point'), 18000 + I18n.t('point'))}
                        </View>}
                    <View style={styles.info} >
                        {this.renderInfo(I18n.t('account'), UserInfoState.data.result.customerName)} */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl onRefresh={() => this.getData()} />}
        >
          {role != 0 && (
            <View
              style={[
                styles.info,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }
              ]}
            >
              {/* {this.renderInfo(I18n.t('accumulation_point'), 18000 + I18n.t('point'))} */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../../../assets/images/ic_wallet.png")}
                  style={{ width: 19, height: 18, marginRight: 10 }}
                />
                <View>
                  <Text style={[theme.fonts.regular14, { marginBottom: 5 }]}>
                    {I18n.t("accumulation_point")}
                  </Text>
                  <NumberFormat
                    value={UserInfoState.data.result.point}
                    perfix={I18n.t("point")}
                    color={theme.colors.orange}
                    fonts={[theme.fonts.bold14]}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  NavigationUtil.navigate(SCREEN_ROUTER.PAYMENT_INFO, {name: UserInfoState.data.result.customerName ? UserInfoState.data.result.customerName : "" });
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Text
                  style={[
                    theme.fonts.regular14,
                    { color: theme.colors.primaryButton }
                  ]}
                >
                  {I18n.t("accumulation_point")}
                </Text>
                <Icon.AntDesign
                  name="right"
                  style={{
                    width: 8,
                    height: 12,
                    color: theme.colors.primaryButton
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.info}>
            {this.renderInfo(
              I18n.t("account"),
              UserInfoState.data.result.email
                ? UserInfoState.data.result.email
                : I18n.t("no_update")
            )}
            <Divider style={{ height: 1, marginVertical: 13 }} />
            {this.renderInfo(
              I18n.t("phone_number"),
              UserInfoState.data.result.phone
                ? UserInfoState.data.result.phone
                : I18n.t("no_update")
            )}
            <Divider style={{ height: 1, marginVertical: 13 }} />
            {this.renderInfo(
              I18n.t("address"),
              (UserInfoState.data.result.address
                ? UserInfoState.data.result.address + ", "
                : " ") +
                UserInfoState.data.result.districtName +
                ", " +
                UserInfoState.data.result.provinceName
            )}
          </View>

          {/* {role != 1 &&
                            (this.renderInfo(null, I18n.t('history_point'), require('../../../assets/images/ic_lock.png')),
                                <Divider style={{ height: 1, marginVertical: 13 }} />)}
                        {this.renderInfo(null, I18n.t('change_password'), require('../../../assets/images/ic_lock.png'))} */}

          <View style={styles.info}>
            {role != 0 && (
              <View>
                {this.renderInfo(
                  null,
                  I18n.t("history_point"),
                  require("../../../assets/images/ic_timer.png"),
                  () => {
                    NavigationUtil.navigate(SCREEN_ROUTER.HISTORY_POINT);
                  }
                )}
                <Divider style={{ height: 1, marginVertical: 13 }} />
              </View>
            )}
            {role != 0 &&
              this.renderInfo(
                null,
                I18n.t("change_password"),
                require("../../../assets/images/ic_lock.png"),
                () => {
                  NavigationUtil.navigate(SCREEN_ROUTER.CHANGE_PASS);
                }
              )}
            {role != 0 && <Divider style={{ height: 1, marginVertical: 13 }} />}
            {this.renderInfo(
              null,
              I18n.t("logout"),
              require("../../../assets/images/ic_logout.png"),
              () => {
                showConfirm(
                  I18n.t("notification"),
                  "Bạn có chắc chắn muốn đăng xuất?",
                  () => {
                    this._Logout();
                  }
                );
              }
            )}
          </View>
          <TouchableOpacity
            style={{
              width: "100%",
              paddingVertical: 51,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => Linking.openURL(`tel:${"0982236929"}`)}
          >
            <Image
              style={{ width: 37, height: 37, marginRight: 10 }}
              source={require("../../../assets/images/ic_hotline.png")}
            />
            <Text style={[theme.fonts.regular18, { color: theme.colors.red }]}>
              HOTLINE: 0982.236.929
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
  renderInfo(label, content, icon, action) {
    return (
      <View>
        {label ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}
          >
            <Text style={[theme.fonts.regular14]}>{label}</Text>
            <Text
              style={[
                theme.fonts.regular14,
                { width: "65%", textAlign: "right" }
              ]}
            >
              {content}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={action}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Image
              source={icon}
              style={{
                height: 20,
                width: content == I18n.t("history_point") ? 21 : 14
              }}
            />
            <Text style={[theme.fonts.regular14, { width: "90%" }]}>
              {content}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundAva: {
    width: "100%",
    height: 220,
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 40,
    paddingVertical: 24
  },
  info: {
    width: "100%",
    paddingHorizontal: 22,
    paddingVertical: 15,
    marginBottom: 5,
    backgroundColor: theme.colors.white
  }
});

const mapStateToProps = state => ({
  UserInfoState: state.userReducer
});

const mapDispatchToProps = {
  getUserInfo,
  changeAvatar
};

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
