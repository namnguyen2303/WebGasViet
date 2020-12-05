import I18n from "../i18n/i18n";
import React, { Component } from "react";
import { Alert } from "react-native";

export const showConfirm = (title, content, action) => {
  Alert.alert(
    title,
    content,
    [
      {
        text: I18n.t("action_title_cancel"),
        style: "cancel"
      },
      {
        text: I18n.t("confirm"),
        onPress: action
      }
    ],
    { cancelable: false }
  );
};

export const showMessages = (title, content, action) => {
  setTimeout(() => {
    Alert.alert(
      title,
      content,
      [
        {
          text: "OK",
          onPress: action
        }
      ],
      { cancelable: false }
    );
  }, 100);
};
