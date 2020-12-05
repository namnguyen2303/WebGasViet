import React, { Component } from 'react'
import { 
    Text, 
    View ,
    TouchableOpacity,Image
} from 'react-native'
import {SCREEN_ROUTER} from '../constants/Constant'
import NavigationUtil from '../navigation/NavigationUtil'
import * as Theme from '../constants/Theme'
import I18n from '../i18n/i18n'

export default class RequsetLoginScreen extends Component {
    render() {
        return (
            <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          style={{
            width: 80,
            height: 80,
            // tintColor:Theme.colors.yellow
          }}
          source={require("../assets/images/locked.png")}
        />

        <Text
          style={{
            color: "#000",
            opacity: 0.7,
            paddingVertical: 15,
            marginTop: 5,
            textAlign:'center'
          }}
        >
          {I18n.t("please_login_to_continue")}
        </Text>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: Theme.colors.active,
            padding: 10,
            width: width * 0.8,
            alignSelf: "center"
          }}
          onPress={() => {
            NavigationUtil.navigate("Login");
          }}
        >
          <Text style={{ color: Theme.colors.active, textAlign: "center" ,fontSize:16}}>
            ĐĂNG NHẬP/ĐĂNG KÍ TÀI KHOẢN
          </Text>
        </TouchableOpacity>
      </View>
        )
    }
}
