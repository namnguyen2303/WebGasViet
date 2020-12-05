import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Platform,
  Linking,
  Vibration,
  TouchableWithoutFeedback,
  NativeModules,
  AppState
} from "react-native";
import { SCREEN_ROUTER, ORDER_TYPE } from "../../../constants/Constant";
import * as theme from "../../../constants/Theme";
import I18n from "../../../i18n/i18n";
import NavigationUtil from "../../../navigation/NavigationUtil";
import { Divider } from "react-native-elements";
import GVHeader from "../../../components/GVHeader";
import PrimaryButton from "../../../components/PrimaryButton";
import NumberFormat from "../../../components/NumberFormat";
import * as API from "../../../constants/Api";
import { showMessages, showConfirm } from "../../../components/Alert";
import { getListOrder } from "../../../redux/actions/index";
import { connect } from "react-redux";
import Icon from "../../../components/Icon";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import Sound from "react-native-sound";
import reactotron from "reactotron-react-native";

var whoosh;
var orderIDTime;
class NotifyScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const type_order = navigation.getParam("type_order", {});
    // const data = navigation.getParam("data", {});
    const data = navigation.state.params.data;
    const item = navigation.getParam("item", {});
    this.state = {
      type: type_order,
      data: data,
      item: item,
      dataOrder: "",
      isLoading: false,
      error: "",
      timeCountDown: data ? data.timeWait : 60,
      isFocus: true,
      isBack: false
    };
  }

  playSound() {
    Sound.setCategory("Playback");
    whoosh = new Sound("gasviet2.wav", Sound.MAIN_BUNDLE, error => {
      whoosh.play();
    });
  }
  isRealValue(obj) {
    return obj && obj !== "null" && obj !== "undefined";
  }

  componentDidMount() {    
    // console.log(this.state.item.orderID);
    if (this.state.data) {
      reactotron.log(this.state.data, "debug data noti ");
      this.playSound();

      Vibration.vibrate(
        [
          0,
          500,
          110,
          500,
          110,
          450,
          110,
          200,
          110,
          170,
          40,
          450,
          110,
          200,
          110,
          170,
          40,
          500
        ],
        true
      );
      if (this.state.data.orderID) {
        // reactotron.log( "log orderId ");
        this.orderDetail();
      }
    }
  }

  refresh() {
    if (this.state.data ? this.state.data.orderID : item.orderID)
      this.orderDetail();
  }

  componentWillUnmount() {
    Vibration.cancel();
    if (whoosh) whoosh.stop();
    Sound.setActive(false);
  }

  stopSound() {
    Vibration.cancel();
    if (whoosh) whoosh.stop();
    Sound.setActive(false);
  }

  orderDetail = async () => {
    await this.setState({
      ...this.state,
      isLoading: true
    });
    try {
      const res = await API.getOrderDetail(
        this.state.data ? this.state.data.orderID : item.orderID
      );
      // reactotron.log("true");
      await this.setState(
        {
          ...this.state,
          isLoading: false,
          error: null,
          dataOrder: res.result
        },
        () => {
          this.props.getListOrder(ORDER_TYPE.processing, 1);
          this.props.getListOrder(ORDER_TYPE.completed, 1);
        }
      );
    } catch (error) {
      // reactotron.log("false");
      await this.setState(
        {
          ...this.state,
          isLoading: false,
          error: error
        }
        // () => showMessages(I18n.t('notification'), JSON.stringify(res.message))
      );
    }
  };

  changStatus = async payload => {
    await this.setState({
      ...this.state,
      isLoading: true,
      item: ""
    });
    try {
      const res = await API.changStatus(payload);
      reactotron.log(res, "test res");
      await this.setState(
        {
          ...this.state,
          isLoading: false,
          error: null,
          type: payload.status,
          dataOrder: res.result
        },
        () => {
          if (res.code == 7749) {
            showMessages(I18n.t("notification"), res.message);
            NavigationUtil.goBack();
          }
          this.props.getListOrder(ORDER_TYPE.processing, 1);
          this.props.getListOrder(ORDER_TYPE.completed, 1);
          // reactotron.log(payload.status, "test status");
          switch (payload.status) {
            case ORDER_TYPE.completed:
              showMessages(I18n.t("notification"), I18n.t("delivery_success"));
              break;
            // case ORDER_TYPE.processing:
            //   showMessages(
            //     I18n.t("notification"),
            //     I18n.t("confirm_order_success")
            //   );
            //   break;
            case ORDER_TYPE.pending: {
              showMessages(
                I18n.t("notification"),
                I18n.t("cancel_order_success")
              );
              NavigationUtil.goBack();
              break;
            }
            case ORDER_TYPE.cancel: {
              NavigationUtil.goBack();
            }
          }

          // NavigationUtil.goBack();
        }
      );
    } catch (error) {
      await this.setState(
        {
          ...this.state,
          isLoading: false,
          error: error
        }
        // () => showMessages(I18n.t('notification'), JSON.stringify(res.message))
      );
    }
  };

  render() {
    // reactotron.log(this.props.navigation);
    this.props.navigation.addListener("didFocus", e => {
      this.setState({
        isFocus: true
      });
    });
    this.props.navigation.addListener("didBlur", e => {
      this.setState({
        isFocus: false
      });
    });
    if (this.state.isBack && this.state.isFocus) NavigationUtil.goBack(true);
    if (this.state.type == 0) {
      setTimeout(() => {
        if (this.state.timeCountDown > 0)
          this.setState({
            timeCountDown:
              this.state.data.timeWait -
              parseInt(new Date().getTime() / 1000) +
              this.state.data.timeSend
          });
        else
          this.setState({
            isBack: true
          });
      }, 1000);
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.stopSound();
        }}
        accessible={false}
      >
        <View style={[theme.styles.containter]}>
          <GVHeader
            back
            title={
              this.state.type == 1
                ? I18n.t("confirm_order")
                : I18n.t("order_detail")
            }
          />
          {this.renderBody()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
  renderBody() {
    const { item } = this.state;
    if (this.state.isLoading) return <Loading />;
    if (this.state.error)
      return (
        <Error
          onPress={() => {
            this.refresh();
          }}
        />
      );
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {this.state.type == ORDER_TYPE.pending && (
            <View>
              <View
                style={{
                  marginBottom: 6,
                  backgroundColor: theme.colors.white,
                  alignItems: "center",
                  paddingTop: 10
                }}
              >
                <Text style={[theme.fonts.regular14]}>
                  {I18n.t("accept_order")}
                </Text>
                <Text
                  style={[theme.fonts.bold20, { color: theme.colors.orange }]}
                >
                  {this.state.dataOrder.discount}
                  {I18n.t("point")}
                </Text>
              </View>
              <View
                style={{
                  height: 174,
                  backgroundColor: theme.colors.white,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 6
                }}
              >
                <Text style={[theme.fonts.regular17]}>
                  Xác nhận đơn hàng trong
                </Text>
                <ImageBackground
                  style={{
                    height: 110,
                    width: 110,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  source={require("../../../assets/images/bg_countdown.png")}
                >
                  <Text
                    style={[
                      theme.fonts.regular47,
                      { color: theme.colors.white }
                    ]}
                  >
                    {this.state.timeCountDown}
                  </Text>
                  <Text
                    style={[
                      theme.fonts.regular24,
                      { color: theme.colors.white }
                    ]}
                  >
                    s
                  </Text>
                </ImageBackground>
              </View>
              <View style={{ marginBottom: 6 }}>
                {this.renderLabelInfo(
                  require("../../../assets/images/ic_distance.png"),
                  I18n.t("distance"),
                  this.state.dataOrder.distance + ""
                )}
              </View>
            </View>
          )}
          {this.state.type != ORDER_TYPE.pending &&
            this.renderOrderCode(
              this.state.dataOrder.code ? this.state.dataOrder.code : item.code,
              this.state.type
            )}
          {this.state.type == ORDER_TYPE.processing &&
            this.renderInfoOrder(
              require("../../../assets/images/ic_order_user.png"),
              I18n.t("info_order"),
              I18n.t("user") +
                ": " +
                (this.state.dataOrder.buyerName
                  ? this.state.dataOrder.buyerName
                  : item.buyerName),
              I18n.t("phone_number") +
                ": " +
                (this.state.dataOrder.buyerPhone
                  ? this.state.dataOrder.buyerPhone
                  : item.buyerPhone),
              I18n.t("address") +
                ": " +
                (this.state.dataOrder.buyerAddress
                  ? this.state.dataOrder.buyerAddress
                  : item.buyerAddress)
            )}
          {this.state.type == ORDER_TYPE.processing &&
            this.renderBtnCall(
              this.state.dataOrder.buyerPhone
                ? this.state.dataOrder.buyerPhone
                : item.buyerPhone
            )}
          {/* {this.state.type == ORDER_TYPE.processing && this.renderBtnFindWay()} */}
          {this.state.type == ORDER_TYPE.completed && (
            <View>
              <View
                style={{
                  marginBottom: 6,
                  backgroundColor: theme.colors.white,
                  paddingVertical: 13
                }}
              >
                {this.renderTimeInfo(
                  I18n.t("time_order"),
                  this.state.dataOrder.date
                    ? this.state.dataOrder.date
                    : item.date
                )}
                {this.renderTimeInfo(
                  I18n.t("time_confirm"),
                  this.state.dataOrder.confirmDateStr
                    ? this.state.dataOrder.confirmDateStr
                    : item.confirmDateStr
                )}
                {this.renderTimeInfo(
                  I18n.t("time_payment"),
                  this.state.dataOrder.completionDateStr
                    ? this.state.dataOrder.completionDateStr
                    : item.completionDateStr
                )}
              </View>
              {/* {this.renderInfoOrder(
                require("../../../assets/images/ic_info_agent.png"),
                I18n.t("agent_info"),
                "Dai ly Gas Viet",
                "0123456789",
                "Nga tu so, Ha Noi"
              )} */}
            </View>
          )}
          <View
            style={{ marginBottom: 6, backgroundColor: theme.colors.white }}
          >
            {this.renderLabelInfo(
              require("../../../assets/images/ic_order_info.png"),
              I18n.t("order_info")
            )}
            {item.listOrderItem &&
              item.listOrderItem.map((item, index) => {
                return (
                  <View>
                    <Divider style={{ height: 1, marginHorizontal: 11 }} />
                    {this.renderOrderItem(
                      item.uri,
                      item.itemName,
                      item.qty,
                      item.itemPrice,
                      item.agentPrice
                    )}
                  </View>
                );
              })}
            {this.state.dataOrder.listOrderItem &&
              this.state.dataOrder.listOrderItem.map((item, index) => {
                return (
                  <View>
                    <Divider style={{ height: 1, marginHorizontal: 11 }} />
                    {this.renderOrderItem(
                      item.uri,
                      item.itemName,
                      item.qty,
                      item.itemPrice,
                      item.agentPrice
                    )}
                  </View>
                );
              })}
          </View>
          <View
            style={{ marginBottom: 6, backgroundColor: theme.colors.white }}
          >
            {this.renderLabelInfo(
              require("../../../assets/images/ic_note.png"),
              I18n.t("order_note")
            )}
            <Divider style={{ height: 1, marginHorizontal: 11 }} />
            <Text
              style={[
                theme.fonts.light14i,
                { marginHorizontal: 11, paddingVertical: 10 }
              ]}
            >
              {this.state.dataOrder.note
                ? this.state.dataOrder.note
                : item.note}
            </Text>
          </View>
          <View
            style={{ marginBottom: 6, backgroundColor: theme.colors.white }}
          >
            {this.renderLabelInfo(
              require("../../../assets/images/ic_money.png"),
              I18n.t("info_payment")
            )}
            <Divider style={{ height: 1, marginHorizontal: 11 }} />
            <View style={{ paddingHorizontal: 19, paddingVertical: 10 }}>
              {/* {this.renderPaymentInfo(I18n.t('promotion_code'), 'KMGASVIET1')} */}
              {/* {this.renderPaymentInfo(
                I18n.t("order_value"),
                this.state.dataOrder.basePrice
                  ? this.state.dataOrder.basePrice
                  : item.basePrice
              )} */}
              {this.renderPaymentInfo(
                I18n.t("total_money"),
                this.state.dataOrder.totalPrice
                  ? this.state.dataOrder.totalPrice
                  : item.totalPrice
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.btnView}>
          {this.state.type == ORDER_TYPE.pending &&
            this.renderBtn(
              theme.colors.primaryButton,
              I18n.t("accept_order"),
              () => {
                showConfirm(
                  I18n.t("notification"),
                  "Bạn sẽ bị trừ " +
                    this.state.dataOrder.discount +
                    " điểm sau khi nhận đơn",
                  () => {
                    this.stopSound();
                    this.changStatus({
                      orderID: this.state.data
                        ? this.state.data.orderID
                        : item.orderID,
                      status: ORDER_TYPE.processing
                    });
                  }
                );
              }
            )}
          {this.state.type == ORDER_TYPE.pending &&
            this.renderBtn(theme.colors.orange, I18n.t("cancel_order"), () => {
              showConfirm(
                I18n.t("notification"),
                "Bạn chắc chắn muốn hủy đơn chứ ?",
                () => {
                  this.stopSound();
                  this.changStatus({
                    orderID: this.state.data
                      ? this.state.data.orderID
                      : item.orderID,
                    status: ORDER_TYPE.cancel
                  });
                }
              );
            })}
          {this.state.type == ORDER_TYPE.processing && (
            <PrimaryButton
              title={I18n.t("deliveried")}
              action={() => {
                showConfirm(
                  I18n.t("notification"),
                  "Bạn chắc chẵn là đã giao hàng chứ ?",
                  () => {
                    this.changStatus({
                      orderID: this.state.data
                        ? this.state.data.orderID
                        : item.orderID,
                      status: ORDER_TYPE.completed
                    });
                  }
                );
              }}
            />
          )}
        </View>
      </View>
    );
  }
  renderBtnCall = numberPhone => {
    return (
      <TouchableOpacity
        style={{
          height: 46,
          backgroundColor: theme.colors.lightBlue,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingHorizontal: 13,
          marginBottom: 6
        }}
        onPress={() => Linking.openURL(`tel:${numberPhone}`)}
      >
        <Text>Liên hệ khách hàng</Text>
        <Icon.MaterialIcons
          name="call"
          size={20}
          style={{
            padding: 5,
            backgroundColor: theme.colors.active,
            borderRadius: 25,
            marginLeft: 10
          }}
          color={theme.colors.white}
        />
      </TouchableOpacity>
    );
  };
  // renderBtnFindWay() {
  //   return (
  //     <TouchableOpacity
  //       style={{
  //         height: 46,
  //         backgroundColor: theme.colors.lightBlue,
  //         flexDirection: "row",
  //         justifyContent: "flex-end",
  //         alignItems: "center",
  //         paddingHorizontal: 13,
  //         marginBottom: 6
  //       }}
  //     >
  //       <Text style={[theme.fonts.regular14]}>{I18n.t("find_way_in_map")}</Text>
  //       <Image
  //         style={{ height: 30, width: 30, marginLeft: 10 }}
  //         source={require("../../../assets/images/ic_way.png")}
  //       />
  //     </TouchableOpacity>
  //   );
  // }
  renderTimeInfo(label, time) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: 5
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

  renderBtnFindWay() {
    var item = this.state.dataOrder ? this.state.dataOrder : this.state.item;

    reactotron.log(this.state.item, "debug info listorder");
    // reactotron.log(item, "log item");
    // reactotron.log(item);
    var lng = item.lon ? item.lon : "",
      lat = item.lat ? item.lat : "";
    return (
      <TouchableOpacity
        style={{
          height: 46,
          backgroundColor: theme.colors.lightBlue,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingHorizontal: 13,
          marginBottom: 6
        }}
        onPress={() =>
          Platform.OS == "ios"
            ? Linking.openURL(
                `http://maps.apple.com/?address=:${lat},${lng}`
                // "maps:20.9950334,105.7948219?q="
                // "maps://app?saddr=20.9977287+105.7952399&daddr=20.9950334+105.7948219"
              )
            : Linking.openURL(`google.navigation:q=${lat}+${lng}`)
        }
      >
        <Text style={[theme.fonts.regular14]}>{I18n.t("find_way_in_map")}</Text>
        <Image
          style={{ height: 30, width: 30, marginLeft: 10 }}
          source={require("../../../assets/images/ic_way.png")}
        />
      </TouchableOpacity>
    );
  }

  renderInfoOrder(source, label, name, phone, address) {
    return (
      <View style={{ marginBottom: 6, backgroundColor: theme.colors.white }}>
        {this.renderLabelInfo(source, label)}
        <Divider style={{ height: 1, marginHorizontal: 11 }} />
        <Text
          style={{
            marginHorizontal: 11,
            color: theme.colors.inactiveText,
            paddingVertical: 5
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            marginHorizontal: 11,
            color: theme.colors.inactiveText,
            paddingVertical: 5
          }}
        >
          {phone}
        </Text>
        <Text
          style={{
            marginHorizontal: 11,
            color: theme.colors.inactiveText,
            paddingVertical: 5
          }}
        >
          {address}
        </Text>
      </View>
    );
  }

  renderOrderCode(code, textType) {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
          backgroundColor: theme.colors.white
        }}
      >
        <Text style={[theme.fonts.regular14]}>
          {I18n.t("order_code")}: {code}
        </Text>
        {textType == ORDER_TYPE.processing && (
          <Text
            style={[
              theme.fonts.regular14,
              { color: theme.colors.primaryButton }
            ]}
          >
            {I18n.t("processing")}
          </Text>
        )}
        {textType == ORDER_TYPE.completed && (
          <Text style={[theme.fonts.regular14, { color: theme.colors.green }]}>
            {I18n.t("completed")}
          </Text>
        )}
      </View>
    );
  }

  renderPaymentInfo(label, content) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 10
        }}
      >
        <Text style={[theme.fonts.regular14]}>{label}</Text>
        {label == I18n.t("promotion_code") ? (
          <Text style={[theme.fonts.medium16, { color: theme.colors.red }]}>
            {content}
          </Text>
        ) : (
          <NumberFormat
            value={content}
            perfix={"đ"}
            color={theme.colors.red}
            fonts={[theme.fonts.medium16]}
          />
        )}
      </View>
    );
  }

  renderOrderItem(source, label, quantity, price, oldPrice) {
    return (
      <View
        style={{
          paddingHorizontal: 23,
          paddingTop: 15,
          paddingBottom: 20,
          justifyContent: "space-around",
          flexDirection: "row"
        }}
      >
        <Image source={{ uri: source }} style={{ height: 84, width: 52 }} />
        <View style={{ justifyContent: "space-around" }}>
          <Text style={[theme.fonts.regular14]}>{label}</Text>
          <Text style={[theme.fonts.regular14]}>x{quantity}</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            {oldPrice != price && (
              <NumberFormat
                image
                value={oldPrice * quantity}
                perfix={" đ"}
                style={{ textDecorationLine: "line-through", marginLeft: 6 }}
                fonts={theme.fonts.regular14}
              />
            )}
            <NumberFormat
              value={price}
              perfix={"đ"}
              color={theme.colors.red}
              fonts={[theme.fonts.medium16]}
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>
      </View>
    );
  }

  renderItem(source, label, quantity, price) {
    return (
      <View
        style={{
          paddingHorizontal: 23,
          paddingTop: 15,
          paddingBottom: 20,
          justifyContent: "space-around",
          flexDirection: "row"
        }}
      >
        <Image source={source} style={{ height: 84, width: 52 }} />
        <View style={{ justifyContent: "space-around" }}>
          <Text style={[theme.fonts.regular14]}>{label}</Text>
          <Text style={[theme.fonts.regular14]}>x{quantity}</Text>
          <NumberFormat
            value={price}
            perfix={"đ"}
            color={theme.colors.red}
            fonts={[theme.fonts.medium16]}
          />
        </View>
      </View>
    );
  }

  renderLabelInfo(source, label, distance) {
    return (
      <View style={styles.labelInfo}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image style={{ height: 19, width: 19 }} source={source} />
          <Text style={[theme.fonts.regular14, { marginLeft: 7 }]}>
            {label}
          </Text>
        </View>
        {distance && <Text style={[theme.fonts.regular14]}>{distance} km</Text>}
      </View>
    );
  }

  renderBtn(color, title, action) {
    return (
      <TouchableOpacity
        onPress={action}
        style={[styles.btn, { backgroundColor: color }]}
      >
        <Text
          style={[
            theme.fonts.regular16,
            { color: theme.colors.white, textTransform: "uppercase" }
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btnView: {
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  btn: {
    width: "45%",
    height: 46,
    backgroundColor: theme.colors.primaryButton,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    bottom: 0
  },
  labelInfo: {
    paddingLeft: 11,
    paddingVertical: 14,
    paddingRight: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.white
  }
});

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  getListOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(NotifyScreen);
