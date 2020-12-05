import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { LoginButton, AccessToken, LoginManager } from "react-native-fbsdk";
import NavigationUtil from "../../navigation/NavigationUtil";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";
import { TextField } from "react-native-material-textfield";
import { connect } from "react-redux";
import * as theme from "../../constants/Theme";
import Icon from "../../components/Icon";
import I18n from "../../i18n/i18n";
import { SCREEN_ROUTER } from "../../constants/Constant";
import PrimaryButton from "../../components/PrimaryButton";
import PropTypes from "prop-types";
import {
  requestLogin,
  requestLoginFB,
  requestLoginGG
} from "../../redux/actions";
import { showConfirm, showMessages } from "../../components/Alert";
import OneSignal from "react-native-onesignal";
import { validatePhoneNumber } from "../../constants/Functions";
import reactotron from "reactotron-react-native";
GoogleSignin.configure();

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkHide: true,
      user: {
        value: "",
        type: "3"
      }
    };
  }
  // Somewhere in your code

  _ggLogin = async requestLoginGG => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokenInfo = await GoogleSignin.getTokens();
      this.setState({ userInfo });
      // console.log(tokenInfo)
      requestLoginGG({
        value: tokenInfo.accessToken,
        type: "2"
      });
    } catch (error) {
      //   console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  _fbLogin(requestLoginFB) {
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        if (result.isCancelled) {
          //   console.log("Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            requestLoginFB({
              value: data.accessToken.toString(),
              type: "1"
            });
            // console.log(data.accessToken.toString())
          });
        }
      },
      function(error) {
        // console.log("Login fail with error: " + error);
      }
    );
  }
  requestLoginFB(accessToken) {
    // console.log(this.state.user);
    // this.props.requestLoginFB({
    //     value: accessToken,
    //     type: "1"
    // });
  }
  requestLogin() {
    // console.log(this.state.user);
    OneSignal.getPermissionSubscriptionState(status => {
      reactotron.log("login".status);
      if (status && status.userId)
        this.props.requestLogin({
          value: this.state.user.value,
          type: this.state.user.type,
          deviceID: status.userId
        });
      else this.requestLogin();
    });
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled>
          <ImageBackground
            source={require("../../assets/images/splash_screen.png")}
            style={{
              width: "100%",
              height: theme.dimension.height,
              position: "absolute",
              flex: 1,
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => NavigationUtil.navigate(SCREEN_ROUTER.MAIN_TAB)}
            >
              <Icon.MaterialIcons
                name="close"
                size={40}
                color={theme.colors.red}
              />
            </TouchableOpacity>
            <View style={{ height: "40%", justifyContent: "center" }}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={{ width: 215, height: 200, marginTop: 50 }}
              />
            </View>
            <Text style={[theme.fonts.regular14, { marginBottom: 10 }]}>
              {I18n.t("login")}
            </Text>
            <View style={{ width: "85%" }}>
              <View>
                <TextInput
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    marginBottom: 50,
                    height: 50,
                    paddingHorizontal: 20
                  }}
                  keyboardType="phone-pad"
                  opacity={20}
                  onChangeText={value =>
                    this.setState({
                      ...this.setState,
                      user: {
                        ...this.state.user,
                        value: value
                      }
                    })
                  }
                  placeholderTextColor={theme.colors.black}
                  placeholder={I18n.t("phone_number")}
                />
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 37 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[theme.fonts.regular12]}>{I18n.t('yet_account')}</Text>
                                    <TouchableOpacity onPress={() => NavigationUtil.navigate(SCREEN_ROUTER.REGISTER)}>
                                        <Text style={[theme.fonts.bold_italic12, { color: theme.colors.registerText }]}> {I18n.t('register')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    NavigationUtil.navigate(SCREEN_ROUTER.FORGOT_PASS)
                                }}>
                                    <Text style={[theme.fonts.regular12]}>{I18n.t('forget_pass')}</Text>
                                </TouchableOpacity>
                            </View> */}
                <TouchableOpacity
                  style={{ position: "absolute", right: 5, top: 10 }}
                  onPress={() => {
                    console.log(validatePhoneNumber(this.state.user.value));
                    if (this.state.user.value == "")
                      showMessages(
                        I18n.t("notification"),
                        "Vui lòng nhập số điện thoại"
                      );
                    else if (!validatePhoneNumber(this.state.user.value)) {
                      showMessages(
                        I18n.t("notification"),
                        "Số điện thoại vừa nhập không đúng định dạng"
                      );
                    } else this.requestLogin();
                    // this.state.user.value == ""
                    //   ? showMessages(
                    //       I18n.t("notification"),
                    //       "Vui lòng nhập số điện thoại"
                    //     )
                    //   :
                    //   this.requestLogin();
                  }}
                >
                  <Icon.MaterialIcons
                    name="arrow-forward"
                    size={30}
                    color={theme.colors.red}
                  />
                </TouchableOpacity>
                {/* <PrimaryButton title={I18n.t('login')} action={() => {
                                    this.state.user.value == '' ?
                                        showMessages(I18n.t('notification'), "Vui lòng nhập số điện thoại") :
                                        this.requestLogin()
                                }} /> */}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 19,
                  marginBottom: 15
                }}
              >
                <View
                  style={{
                    borderWidth: 0.25,
                    borderColor: theme.colors.border,
                    width: "40%",
                    height: 0.25
                  }}
                ></View>
                <Text style={[theme.fonts.bold_italic16]}>
                  {I18n.t("suport")}
                </Text>
                <View
                  style={{
                    borderWidth: 0.25,
                    borderColor: theme.colors.border,
                    width: "40%",
                    height: 0.25
                  }}
                ></View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={[theme.fonts.regular24, { color: theme.colors.red }]}
                >
                  0965 630 621
                </Text>
                {/* <TouchableOpacity
                                    onPress={() => {
                                        this._fbLogin(this.props.requestLoginFB)
                                    }}>
                                    <Image source={require('../../assets/images/logo_fb.png')} style={styles.btnLogin} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        marginLeft: 20
                                    }}
                                    onPress={() => {
                                        this._ggLogin(this.props.requestLoginGG)
                                    }}>
                                    <Image source={require('../../assets/images/logo_gg.png')} style={styles.btnLogin} />
                                </TouchableOpacity> */}
              </View>
              {/* <TouchableOpacity
                            onPress={() => {
                                NavigationUtil.navigate("AgentTabNavigator");
                            }}>
                            <Text>Agent</Text>
                        </TouchableOpacity><TouchableOpacity
                            onPress={() => {
                                NavigationUtil.navigate("Main");
                            }}>
                            <Text>Customer</Text>
                        </TouchableOpacity> */}
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  btnLogin: {
    height: 47,
    width: 46,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65

    // elevation: 6,
  },
  closeButton: {
    position: "absolute",
    top: 25,
    right: 10
  }
});

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  requestLogin,
  requestLoginFB,
  requestLoginGG
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
