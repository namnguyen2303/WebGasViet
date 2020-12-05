import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from "react-native";
import I18n from "../i18n/i18n.js";
import * as Theme from "../constants/Theme.js";
var screen = Dimensions.get("window");

export default class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <View style={styles.horizontal}>
          <Text style={Theme.fonts.bold18}>{I18n.t("loading")}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
    // marginTop: screen.height / 3
  },
  horizontal: {
    alignItems: "center",
    justifyContent: "center"
  }
});
