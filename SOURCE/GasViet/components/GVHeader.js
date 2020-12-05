import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import NavigationUtil from "../navigation/NavigationUtil";
import Icon from '../components/Icon';
import * as theme from "../constants/Theme";
import { SCREEN_ROUTER } from "../constants/Constant";
import AsyncStorage from '@react-native-community/async-storage'
/**
 * `back`: Hiển thị nút back
 * `title`: text nằm trên thanh header
 */
export default class MainHeader extends Component {
  constructor(props){
    super(props)
    this.state={
      role: ""
    }
  }
  
  getRole = async () => {
    try {
        const role = await AsyncStorage.getItem("role");
        // console.log(role);
        this.setState({
            ...this.setState,
            role: role
        })
    } catch (error) {

    }
}
  render() {
    const title = this.props.title
    const color = this.props.color
    const {
      back,
      edit,
      onPress,
      cart,
      backColor,
      ...props
    } = this.props

    return (
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: this.state.role== 1 ?theme.colors.headerColor :theme.colors.header,
          borderBottomColor: theme.colors.header
        }}

        leftComponent={
          <View>
            {back &&
              <TouchableOpacity
                style={{
                  // flex: 1,
                  height: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: theme.colors.active
                }}
                onPress={() =>
                  NavigationUtil.goBack()
                }
              >
                <Icon.Ionicons
                  name="ios-arrow-round-back"
                  size={35}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            }
            {backColor &&
              <TouchableOpacity
                style={{
                  // flex: 1,
                  height: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: theme.colors.active
                }}
                onPress={this.props.onPress}
              >
                <Icon.Ionicons
                  name="ios-arrow-round-back"
                  size={35}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            }
          </View>
        }
        centerComponent={
          <Text style={[theme.fonts.medium20, { color: color == null ? theme.colors.white : color }]}>{title}</Text>
        }
        rightComponent={
          <View>
            {edit &&
              <TouchableOpacity
                style={{
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10
                }}
                onPress={() => {
                  NavigationUtil.navigate(SCREEN_ROUTER.USER_INFO_EDIT)
                }}
              >
                <Icon.FontAwesome
                  name={"edit"}
                  size={30}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            }
            {
              cart &&
              <TouchableOpacity onPress={cart}>
                <Icon.Entypo name='shopping-cart' size={25} color='white' />
              </TouchableOpacity>
            }
          </View>
        }
      />
    )
  }
}

