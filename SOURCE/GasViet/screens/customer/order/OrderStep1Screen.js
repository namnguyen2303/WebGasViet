import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { SCREEN_ROUTER, ORDER_TYPE } from "../../../constants/Constant";
import NavigationUtil from "../../../navigation/NavigationUtil";
import * as theme from "../../../constants/Theme";
import Icon from "../../../components/Icon";
import I18n from "../../../i18n/i18n";
import GVHeader from "../../../components/GVHeader";
import Block from "../../../components/Block";
const { height, width } = Dimensions.get("window");
import Mockup from "../../../constants/Mockup";
import NumberFormat from "../../../components/NumberFormat";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-community/async-storage";
import { showConfirm, showMessages } from "../../../components/Alert";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { getListOrder, getUserInfo } from "../../../redux/actions";
// import { requestCreateOrder } from '../../../redux/actions'
import { requestCreateOrder } from "../../../constants/Api";
import { clearLocationSelect } from "../../../redux/actions";
import OneSignal from "react-native-onesignal";
import reactotron from "reactotron-react-native";
import { validatePhoneNumber } from '../../../constants/Functions'
class OrderStep1Screen extends Component {
  state = {
    modalVisible: false,
    count: 1,
    item: this.props.navigation.getParam("item"),
    buyerName: "",
    buyerPhone: "",
    note: "",
    buyerAddress: "",
    isLoading: false,
    error: false,
    resSearchPlace: [],
    deviceID: ""
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const role = await AsyncStorage.getItem("role");
    OneSignal.getPermissionSubscriptionState(status => {
      if (status)
        this.setState({
          ...this.state,
          deviceID: status.userId
        });
      else this.getData()
    });

    if (role) {
      this.props.getUserInfo();
      this.getUserInfo();
    }
  }

  componentWillUnmount() {
    this.props.clearLocationSelect();
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  changeProduct = a => {
    if (a == 1) {
      this.setState({
        ...this.setState,
        count: this.state.count + 1
      });
    } else if (this.state.count != 1) {
      this.setState({
        ...this.setState,
        count: this.state.count - 1
      });
    }
  };
  getUserInfo = async () => {
    const user = await AsyncStorage.getItem("userInfo");
    const { UserInfoState } = this.props;
    // console.log(JSON.parse(user).agentName)
    this.setState({
      ...this.setState,
      buyerName: UserInfoState.data.result.customerName,
      buyerPhone: UserInfoState.data.result.phone,
      //   buyerAddress:
      //     (UserInfoState.data.result.address
      //       ? UserInfoState.data.result.address + ", "
      //       : "") +
      //     UserInfoState.data.result.districtName +
      //     ", " +
      //     UserInfoState.data.result.provinceName
    });
  };
  _createOrder = async () => {
    const role = await AsyncStorage.getItem("role");
    // let deviceID="";
    const {
      buyerPhone,
      buyerName,
      count,
      note,
      item,
      buyerAddress,
      deviceID
    } = this.state;
    var data = {
      buyerName: buyerName,
      buyerAddress: this.props.locationSelect.name
        ? this.props.locationSelect.name
        : buyerAddress,
      buyerPhone: buyerPhone,
      note: note,
      lon: this.props.locationSelect.lng,
      lat: this.props.locationSelect.lat,
      listOrderItem: [
        {
          itemID: item.itemID,
          qty: count
        }
      ],
      deviceID: deviceID
    };

    this.setState({
      ...this.setState,
      isLoading: true,
      error: false
    });

    try {
      // reactotron.log(data);
      const res = await requestCreateOrder(data);
      if (res) {
        this.setState({
          ...this.setState,
          isLoading: false,
          error: false
        });
        if (role) {
          if (res.status == 1) {
            this.props.getListOrder(ORDER_TYPE.pending, "1");
            // this.setModalVisible(true);
            NavigationUtil.navigate(SCREEN_ROUTER.ORDER_CUS_SCREEN);
          }
        } else {
          NavigationUtil.navigate(SCREEN_ROUTER.MAIN_TAB);
        }
      }
    } catch (error) {
      this.setState({
        ...this.setState,
        isLoading: false,
        error: true
      });
    }
  };

  showDialog() {
    return (
      <Modal
        animationType="slide"
        visible={this.state.modalVisible}
        hasBackdrop={true}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={styles.modalStyle}>
            <Image
              source={require("../../../assets/images/ic_check.png")}
              style={{ height: 35, width: 35 }}
            />
            <Text style={{ marginBottom: 30 }}>Tạo đơn hàng thành công</Text>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
                NavigationUtil.navigate(SCREEN_ROUTER.ORDER_CUS_SCREEN);
              }}
            >
              <Text>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  render() {
    return (
      <View style={[theme.styles.containter]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
            <GVHeader title={I18n.t("order")} back />
            <SafeAreaView style={{ flex: 1 }}>
              {this.showDialog()}
              {this._renderBody()}
            </SafeAreaView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  _renderFooter() {
    const { item, buyerName, buyerPhone, buyerAddress } = this.state;
    return (
      <View style={styles.footerStyle}>
        <View style={{ flex: 1 }}>
          <Text style={theme.fonts.regular12}>Tổng thanh toán:</Text>
          <NumberFormat
            value={item.newPrice * this.state.count}
            perfix={" đ"}
            style={[
              theme.fonts.bold18,
              {
                color: theme.colors.orange,
                marginTop: 10
              }
            ]}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            // console.log(this.props.locationSelect)
            if (buyerName == null || buyerName.trim() == "")
              showMessages(
                I18n.t("notification"),
                "Vui lòng nhập tên người nhận."
              );
            else if (buyerPhone == null || buyerPhone.trim() == "")

              showMessages(
                I18n.t("notification"),
                "Vui lòng nhập số điện thoại."
              );
            else if (!validatePhoneNumber(buyerPhone))
              showMessages(
                I18n.t("notification"),
                "Số điện thoại nhập không đúng."
              );
            else if (this.props.locationSelect.name == "" && buyerAddress.trim() == "")
              showMessages(I18n.t("notification"), "Vui lòng chọn địa chỉ.");
            else
              showConfirm("Xác nhận", "Xác nhận đặt hàng", () =>
                this._createOrder()
              );
          }}
          style={styles.buttonStyle}
        >
          <Text
            style={[
              theme.fonts.bold16,
              { textAlign: "center", color: theme.colors.white }
            ]}
          >
            ĐẶT GAS
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  _renderBody() {
    const { item, isLoading, error } = this.state;
    if (isLoading) return <Loading />;
    if (error) return <Error />;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.bodyContainerStyle}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.imageStyle}>
              <Image
                source={{ uri: item.imageUrl }}
                style={{ height: 80, width: 80, resizeMode: "contain" }}
              />
            </View>
            <View style={{ flexDirection: "column", flex: 1, marginLeft: 20 }}>
              <Text>{item.itemName}</Text>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {item.oldPrice != item.newPrice &&
                  <NumberFormat
                    image
                    value={item.oldPrice}
                    perfix={" đ"}
                    style={{ textDecorationLine: "line-through", marginLeft: 6 }}
                  />
                }
                <NumberFormat
                  value={item.newPrice}
                  perfix={" đ"}
                  style={{ marginLeft: 20, color: theme.colors.orange }}
                />
              </View>
              <View style={styles.changeProduct}>
                <TouchableOpacity
                  style={styles.sub_addstyle}
                  onPress={() => this.changeProduct(0)}
                >
                  <Text>-</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    paddingHorizontal: 15,
                    borderLeftWidth: 0.5,
                    borderRightWidth: 0.5,
                    alignSelf: "stretch",
                    borderColor: theme.colors.borderTopColor
                  }}
                >
                  {this.state.count}
                </Text>
                <TouchableOpacity
                  style={styles.sub_addstyle}
                  onPress={() => this.changeProduct(1)}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {this._renderInfo()}
        </ScrollView>
        {this._renderFooter()}
      </View>
    );
  }
  _renderInfo() {
    const { buyerName, buyerPhone, buyerAddress, note } = this.state;
    const { UserInfoState } = this.props;
    // console.log(user+number);
    return (
      <View style={{ flexDirection: "column", marginTop: 50 }}>
        {this._renderInfoItem("Người nhận:", buyerName, value =>
          this.setState({
            ...this.setState,
            buyerName: value
          })
        )}
        {this._renderInfoItem("Số điện thoại:", buyerPhone, value =>
          this.setState({
            ...this.setState,
            buyerPhone: value
          })
        )}
        {this._renderInfoItem("Địa chỉ:", buyerAddress, value =>
          this.setState({
            ...this.setState,
            buyerAddress: value
          })
        )}

        {this._renderInfoItem("Ghi chú:", note, value =>
          this.setState({
            ...this.setState,
            note: value
          })
        )}
      </View>
    );
  }
  _renderInfoItem(title, value, action) {
    const address = "Địa chỉ:";
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={[
            theme.fonts.regular14,
            {
              flex: 2,
              marginVertical: 20
            }
          ]}
        >
          {title}
        </Text>
        <TextInput
          style={{
            textAlign: "right",
            flex: 5,
            borderBottomWidth: 0.5,
            borderColor: theme.colors.borderTopColor,
            alignSelf: "center",
            paddingVertical: 0
          }}
          keyboardType={title == "Số điện thoại:" ? "phone-pad" : "default"}
          onTouchEnd={
            title == address
              ? () => {
                this.props.clearLocationSelect();
                NavigationUtil.navigate(SCREEN_ROUTER.MAP_LOCATION_SCREEN);
              }
              : () => { }
          }
          placeholder={title == address ? "Nhấn để chọn vị trí của bạn" : ""}
          value={
            title == address
              ? this.props.locationSelect.name
                ? this.props.locationSelect.name
                : value
              : value
          }
          onChangeText={action}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  footerStyle: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderTopColor,
    padding: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3

    // alignSelf: 'center',
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: theme.colors.orange,
    paddingVertical: 10
  },
  modalStyle: {
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 60
  },
  bodyContainerStyle: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  imageStyle: {
    // height: 80,
    // width: 80,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    backgroundColor: theme.colors.white,
    borderRadius: 3
  },
  changeProduct: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    alignSelf: "flex-start",
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: theme.colors.borderTopColor
  },
  sub_addstyle: {
    paddingHorizontal: 5
  }
});

const mapStateToProps = state => ({
  locationSelect: state.locationSelectReducer,
  UserInfoState: state.userReducer
});

const mapDispatchToProps = {
  clearLocationSelect,
  getUserInfo,
  // requestCreateOrder
  getListOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderStep1Screen);
