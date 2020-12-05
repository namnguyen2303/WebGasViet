import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  RefreshControl,
  Linking,
  Platform
} from "react-native";
import { SCREEN_ROUTER } from "../../../constants/Constant";
import NavigationUtil from "../../../navigation/NavigationUtil";
import * as theme from "../../../constants/Theme";
import Icon from "../../../components/Icon";
import I18n from "../../../i18n/i18n";
import GVHeader from "../../../components/GVHeader";
import Block from "../../../components/Block";
const { height, width } = Dimensions.get("window");
import Mockup from "../../../constants/Mockup";
import NumberFormat from "../../../components/NumberFormat";
import AsyncStorage from "@react-native-community/async-storage";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getHomeData, getUserInfo } from "../../../redux/actions";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import reactotron from "reactotron-react-native";
import OneSignal from "react-native-onesignal";
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: Mockup.homeData,
      customerName: "",
      token: ""
    };
  }
  componentDidMount() {
    // let deviceID="";
    this.getData();
    // OneSignal.getPermissionSubscriptionState((status) => {
    //     deviceID = status.userId;
    //     this.setState({
    //         ...this.setState,
    //         customerName: customerName,
    //         token: token
    //     })
    //     this.getData(deviceID);
    // });
  }
  async getData() {
    const customerName = await AsyncStorage.getItem("customerName");
    const token = await AsyncStorage.getItem("token");
    // const deviceID = await AsyncStorage.getItem("deviceID");
    // reactotron.log(deviceID," check deviceID homeScreen");
    if (token) {
      OneSignal.getPermissionSubscriptionState(status => {
        var deviceID = status.userId;
        // alert(userID);
        // reactotron.log('usser',status)
        this.props.getUserInfo(deviceID);
      });
    }
    this.props.getHomeData();
    this.setState({
      ...this.setState,
      customerName: customerName,
      token: token
    });
  }
  render() {
    const { HomeState } = this.props;
    if (HomeState.isLoading) return <Loading />;
    if (HomeState.error) return <Error onPress={() => this.getData()} />;
    return (
      // <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.defaultBg
        }}
      >
        {this._renderHeader()}
        {/* {this._renderBody()} */}
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={HomeState.isLoading}
              onRefresh={() => {
                this.getData();
              }}
            />
          }
          ListHeaderComponent={
            <View>
              <TouchableOpacity
                style={{ alignItems: "center", width: width }}
                onPress={() => NavigationUtil.navigate("Product")}
              >
                <Image
                  source={require("../../../assets/images/image.png")}
                  style={{
                    width: width * 0.95,
                    height: width / 2,
                    resizeMode: "stretch",
                    marginVertical: 10
                  }}
                />
              </TouchableOpacity>
              <Text style={[theme.fonts.bold16, styles.textTitleStyle]}>
                SẢN PHẨM
              </Text>
            </View>
          }
          // ListFooterComponent={
          //     <View>
          //         <Text style={[theme.fonts.bold16, styles.textTitleStyle]}>
          //             PHỤ KIỆN BÌNH GAS</Text>
          //         <FlatList
          //             numColumns={2}
          //             data={this.state.data}
          //             keyExtractor={(item, index) => index.toString()}
          //             renderItem={({ item, index }) => this.renderAccessoriesItem(item, index)}
          //         />
          //     </View>
          // }
          numColumns={2}
          data={HomeState.data.result.listProduct}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => this.renderItem(item, index)}
        />
      </View>
      // </SafeAreaView>
    );
  }
  _renderHeader() {
    const { HomeState } = this.props;
    return (
      <View style={{ alignItems: "flex-start" }}>
        <ImageBackground
          source={require("../../../assets/images/bg_home_cus.png")}
          style={{
            width: "100%",
            flexDirection: "column-reverse",
            height: Platform.OS == "android" ? 70 : 100
          }}
        >
          {this.state.token != null ? (
            <View
              style={{
                padding: 15,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Text style={[theme.fonts.bold16, { color: theme.colors.white }]}>
                Xin chào, {this.state.customerName}
              </Text>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.colors.orange,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                  onPress={() => {
                    Linking.openURL(`tel:0982236929`);
                  }}
                >
                  <Icon.MaterialIcons
                    name="call"
                    size={25}
                    style={{ margin: 5 }}
                    color={theme.colors.white}
                  />
                  <View style={{ alignItems: "center", marginRight: 5 }}>
                    <Text
                      style={[
                        theme.fonts.regular10,
                        { color: theme.colors.white }
                      ]}
                    >
                      HOTLINE
                    </Text>
                    <Text
                      style={[
                        theme.fonts.regular14,
                        { color: theme.colors.white }
                      ]}
                    >
                      0982.236.929
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ padding: 15, alignItems: "flex-start" }}>
              <Text style={[theme.fonts.bold16, { color: theme.colors.white }]}>
                Đăng nhập để có trải nghiệm tốt hơn
              </Text>
              <TouchableOpacity
                onPress={() => NavigationUtil.navigate("Auth")}
                style={{
                  backgroundColor: theme.colors.orange,
                  padding: 5,
                  paddingHorizontal: 12
                }}
              >
                <Text
                  style={[
                    theme.fonts.regular14,
                    { borderRadius: 3, color: theme.colors.white }
                  ]}
                >
                  {I18n.t("login")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>

        {/* <Swiper showsButtons>
                    <View >
                        <Text>Hello Swiper</Text>
                    </View>
                   
                </Swiper> */}
      </View>
    );
  }
  renderAccessoriesItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemAccessoriesStyle}
        // onPress={() => NavigationUtil.navigate(SCREEN_ROUTER.PRODUCT_DETAIL, { item: item })}
      >
        <Image source={item.img} style={styles.imgAccessoriesStyle} />
        <View style={{ flex: 1 }}>
          <Text style={theme.fonts.regular14} numberOfLines={2}>
            {item.itemName}
          </Text>
          <NumberFormat
            image
            value={item.oldPrice}
            perfix={" đ"}
            style={{
              textDecorationLine: "line-through",
              marginTop: 5,
              marginLeft: 6
            }}
          />
          <NumberFormat
            value={item.newPrice}
            perfix={" đ"}
            style={{ flex: 1, marginLeft: 20, color: theme.colors.orange }}
          />
        </View>
      </TouchableOpacity>
    );
  };
  renderItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemStyle}
        onPress={() =>
          NavigationUtil.navigate(SCREEN_ROUTER.PRODUCT_DETAIL, { item: item })
        }
      >
        <Image source={{ uri: item.imageUrl }} style={styles.imgItemStyle} />
        <View style={styles.bottomItemStyle}>
          <Text style={theme.fonts.regular14}>{item.itemName}</Text>
          {item.oldPrice != item.newPrice && 
            <View style={{ flexDirection: "row", marginTop: 10 }}>
            <NumberFormat
              image
              value={item.oldPrice}
              perfix={" đ"}
              style={{ textDecorationLine: "line-through", marginLeft: 6 }}
              fonts={theme.fonts.regular14}
            />
          </View>
          }
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <NumberFormat
              image
              value={item.newPrice}
              perfix={" đ"}
              style={{ color: theme.colors.orange, marginLeft: 6 }}
              fonts={theme.fonts.bold16}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
}
const styles = StyleSheet.create({
  itemAccessoriesStyle: {
    borderRadius: 5,
    flexDirection: "row",
    width: (width - 20) / 2,
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: theme.colors.white,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  imgAccessoriesStyle: {
    resizeMode: "center",
    height: 75,
    width: 45,
    marginRight: 20
  },
  itemStyle: {
    // backgroundColor: 'gray',
    borderRadius: 5,
    flexDirection: "column",
    width: (width - 20) / 2,
    marginHorizontal: 5,
    marginBottom: 8,
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    alignItems: "center"
  },
  imgItemStyle: {
    padding: 20,
    marginVertical: 20,
    resizeMode: "contain",
    height: 150,
    width: (width - 80) / 2
  },
  bottomItemStyle: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderTopColor,
    padding: 5,
    alignSelf: "stretch"
    // alignItems: "center",
  },
  textTitleStyle: {
    marginBottom: 5,
    color: theme.colors.gray,
    textAlign: "center"
  }
});
const mapStateToProps = state => ({
  HomeState: state.homeReducer,
  UserInfoState: state.userReducer
});

const mapDispatchToProps = {
  getHomeData,
  getUserInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
