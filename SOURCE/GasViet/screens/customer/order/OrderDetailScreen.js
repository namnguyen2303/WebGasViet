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
  TextInput,
  Vibration
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
import { showConfirm, showMessages } from "../../../components/Alert";
import { changStatus } from "../../../constants/Api";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getListOrder } from "../../../redux/actions";
import { getOrderDetail } from "../../../constants/Api";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Sound from "react-native-sound";

var whoosh;

class OrderDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderType: this.props.navigation.getParam("orderType"),
      item: this.props.navigation.getParam("item"),
      orderID: this.props.navigation.getParam("orderID"),
      isLoading: false,
      error: false,
      token: ""
    };
  }

  componentWillUnmount() {
    Vibration.cancel();
    if (whoosh) whoosh.stop();
    Sound.setActive(false);
  }

  playSound() {
    Sound.setCategory("Playback");
    whoosh = new Sound("ringtone_customer.wav", Sound.MAIN_BUNDLE, error => {
      whoosh.play();
    });
  }

  componentDidMount() {
    if (this.state.orderID != null) {
      this.playSound();
      this._getOrderDetail();
      Vibration.vibrate(2000);
    }
  }

  _getOrderDetail = async () => {
    this.setState({
      ...this.state,
      isLoading: true,
      error: false
    });
    try {
      const rs = await getOrderDetail(this.state.orderID);
      const token = await AsyncStorage.getItem("token");
      this.setState(
        {
          ...this.state,
          item: rs.result,
          orderType: rs.result.status,
          isLoading: false,
          error: false
        },
        () => {
          if (token != "") {
            this.props.getListOrder(ORDER_TYPE.pending, "1");
            this.props.getListOrder(ORDER_TYPE.completed, "1");
            this.props.getListOrder(ORDER_TYPE.processing, "1");
          }
        }
      );
    } catch (error) {
      // console.log(error, "error");
      this.setState({
        ...this.state,
        isLoading: false,
        error: true
      });
    }
  };
  _cancelOrder = async orderID => {
    try {
      var data = {
        orderID: orderID,
        status: 3
      };
      const res = await changStatus(data);
      if (res) {
        showMessages(
          "Thông báo",
          "Huỷ đơn hàng thành công",
          () => (
            this.props.getListOrder(ORDER_TYPE.pending, "1"),
            NavigationUtil.navigate(SCREEN_ROUTER.ORDER_CUS_SCREEN)
          )
        );
      }
    } catch (error) {}
  };
  render() {
    const { orderType, item, isLoading, error } = this.state;
    // console.log(this.state.item);
    if (isLoading || item == null) return <Loading />;
    if (error) return <Error />;
    return (
      <View style={theme.styles.containter}>
        <GVHeader title={I18n.t("order_detail")} back />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: theme.colors.white,
                padding: 15
              }}
            >
              <Text style={{ flex: 2 }}>Mã đơn hàng: {item.code}</Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  color:
                    orderType == ORDER_TYPE.pending
                      ? theme.colors.gray
                      : orderType == ORDER_TYPE.processing
                      ? theme.colors.active
                      : theme.colors.green
                }}
              >
                {orderType == ORDER_TYPE.pending
                  ? "Chờ xác nhận"
                  : orderType == ORDER_TYPE.processing
                  ? "Đang thực hiện"
                  : "Đã hoàn thành"}
              </Text>
            </View>
            {this._renderBody()}
          </ScrollView>
          {this.state.orderType == ORDER_TYPE.pending && (
            <View>
              <TouchableOpacity
                style={styles.cancelStyle}
                onPress={() =>
                  showConfirm("Xác nhận", "Xác nhận huỷ đơn hàng?", () =>
                    this._cancelOrder(item.orderID)
                  )
                }
              >
                <Text
                  style={[theme.fonts.bold16, { color: theme.colors.white }]}
                >
                  HUỶ ĐƠN
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }
  _renderBody() {
    const { orderType, item } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {orderType == ORDER_TYPE.completed && (
          <View style={{ backgroundColor: theme.colors.white, marginTop: 10 }}>
            {this.renderTimeInfo(I18n.t("time_order"), item.date)}
            {this.renderTimeInfo(I18n.t("time_confirm"), item.confirmDateStr)}
            {this.renderTimeInfo(
              I18n.t("time_payment"),
              item.completionDateStr
            )}
          </View>
        )}
        {orderType != ORDER_TYPE.pending &&
          this._renderInfoAgent(
            item.shopName,
            item.shopPhone,
            item.shopAddress
          )}
        {this._renderInfoCustomer(
          item.buyerName,
          item.buyerPhone,
          item.buyerAddress
        )}
        {this._renderInfoOrder(item.listOrderItem[0])}
        {this._renderNote(item.note)}
        {this._renderPurchaseInfo(item.basePrice, item.totalPrice)}
      </View>
    );
  }
  renderTimeInfo(label, time) {
    let createDate = time.split("T");
    // let createTime = item.createDate.substr(11, 12)
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between"
          //   paddingBottom: 5
        }}
      >
        <Text
          style={{
            marginHorizontal: 11,
            color: theme.colors.inactiveText,
            paddingVertical: 5
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            marginHorizontal: 11,
            color: theme.colors.inactiveText,
            paddingVertical: 5
          }}
        >
          {time}
        </Text>
      </View>
    );
  }
  _renderPurchaseInfo(basePrice, totalPrice) {
    return (
      <View style={styles.itemStyle}>
        {this._rendertitle(
          "Thông tin đơn hàng",
          require("../../../assets/images/ic_money.png")
        )}
        {/* <View style={{ flexDirection: "row" }}>
                    <Text style={{ flex: 1, }}>Giá trị đơn hàng: </Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <NumberFormat value={basePrice} perfix={" đ"} style={{ color: theme.colors.red }} />
                    </View>
                </View> */}
        <View style={{ flexDirection: "row", marginVertical: 20 }}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Tổng tiền: </Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <NumberFormat
              value={totalPrice}
              perfix={" đ"}
              style={{ color: theme.colors.red, fontWeight: "bold" }}
            />
          </View>
        </View>
      </View>
    );
  }
  _renderNote(note) {
    return (
      <View style={styles.itemStyle}>
        {this._rendertitle(
          "Ghi chú đơn hàng",
          require("../../../assets/images/ic_note.png")
        )}
        <Text style={{ fontStyle: "italic" }}>
          {note != "" ? note : "Không có ghi chú nào"}
        </Text>
      </View>
    );
  }

  _renderInfoOrder(item) {
    // console.log(item);

    return (
      <View style={styles.itemStyle}>
        {this._rendertitle(
          "Thông tin thanh toán",
          require("../../../assets/images/ic_order_info.png")
        )}
        <View style={{ flexDirection: "row" }}>
          <Image source={{ uri: item.uri }} style={styles.imgItemStyle} />
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Text style={theme.fonts.regular14}>{item.itemName}</Text>
              <Text
                style={[theme.fonts.regular14, { color: theme.colors.gray }]}
              >
                x{item.qty}
              </Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                justifyContent: "flex-end"
              }}
            >
              {item.agentPrice != item.itemPrice &&
                <NumberFormat
                image
                value={item.agentPrice * item.qty}
                perfix={" đ"}
                style={{
                  // flex: 1,
                  color: theme.colors.black,
                  textDecorationLine: "line-through"
                }}
              />
              }
              <NumberFormat
                value={item.itemPrice}
                perfix={" đ"}
                style={{
                  // flex: 1,
                  color: theme.colors.orange,
                  marginLeft: 10
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
  _renderInfoAgent(name, phone, address) {
    return (
      <View style={styles.itemStyle}>
        {this._rendertitle(
          "Thông tin đại lý",
          require("../../../assets/images/ic_agency.png")
        )}
        <Text style={styles.textStyle}>{name}</Text>
        <Text style={styles.textStyle}>{phone}</Text>
        <Text style={styles.textStyle}>{address}</Text>
      </View>
    );
  }
  _renderInfoCustomer(name, phone, address) {
    return (
      <View style={styles.itemStyle}>
        {this._rendertitle(
          "Thông tin đặt hàng",
          require("../../../assets/images/ic_info.png")
        )}
        <Text style={styles.textStyle}>{name}</Text>
        <Text style={styles.textStyle}>{phone}</Text>
        <Text style={styles.textStyle}>{address}</Text>
      </View>
    );
  }
  _rendertitle(title, img) {
    return (
      <View style={styles.titleStyle}>
        <Image source={img} style={{ width: 20, height: 20, marginRight: 5 }} />
        <Text>{title}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textStyle: {
    color: theme.colors.gray,
    fontSize: 14
  },
  titleStyle: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: theme.colors.borderTopColor,
    paddingBottom: 5,
    marginBottom: 10
  },
  itemStyle: {
    flexDirection: "column",
    marginTop: 10,
    backgroundColor: theme.colors.white,
    padding: 15
  },
  imgItemStyle: {
    resizeMode: "contain",
    height: 100,
    width: 60,
    marginHorizontal: 30
  },
  cancelStyle: {
    backgroundColor: theme.colors.orange,
    alignSelf: "center",
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 5
  }
});

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  getListOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailScreen);
