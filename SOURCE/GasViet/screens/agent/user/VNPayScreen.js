import React, { Component } from "react";
import { View, ActivityIndicator, StatusBar, StyleSheet } from "react-native";
import GVHeader from "../../../components/GVHeader";
import * as theme from "../../../constants/Theme";
import I18n from "../../../i18n/i18n";
import { WebView } from "react-native-webview";
import { showMessages } from "../../../components/Alert";
import NavigationUtil from "../../../navigation/NavigationUtil";

export default class VNPayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }
  hideSpinner() {
    this.setState({ ...this.state, visible: false });
  }
  render() {
    const { navigation } = this.props;
    var uri = navigation.getParam("uri");
    return (
      <View style={styles.container}>
        <GVHeader back title={I18n.t("vn_pay")} />
        <StatusBar hidden />
        <WebView
          useWebKit={true}
          scalesPageToFit={true}
          startInLoadingState={true}
          onLoad={event => {
            if (event.nativeEvent.url.includes("vnp_ResponseCode=00")) {
              NavigationUtil.goBack();
              NavigationUtil.goBack();
              showMessages("Thanh toán VNPay", "Thanh toán thành công");
            }
          }}
          renderLoading={() => (
            <ActivityIndicator
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%"
              }}
              size="large"
            />
          )}
          //   style={{ opacity: 0.99 }}
          source={{
            uri: uri
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.defaultBg
  }
});
