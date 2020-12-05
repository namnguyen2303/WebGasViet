import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { SCREEN_ROUTER } from "../../../constants/Constant";
import GVHeader from "../../../components/GVHeader";
import * as theme from "../../../constants/Theme";
import I18n from "../../../i18n/i18n";
import NavigationUtil from "../../../navigation/NavigationUtil";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import NumberFormat from "../../../components/NumberFormat";
import * as API from "../../../constants/Api";
import PrimaryButton from "../../../components/PrimaryButton";
import Empty from "../../../components/Empty";
// import reactotron from "reactotron-react-native";
// import VNPAY from "../../../components/VNPAY";
// import PrimaryButton "../../../components/PrimaryButton";

class PaymentInfoScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const name = navigation.getParam("name", {});
    this.state = {
      name: name,
      check: false,
      data: [],
      isLoading: false,
      error: null,
      check: false,
      itemSelect: null
    };
  }

  // componentDidMount() {
  //   this._getListPackage();
  // }

  // refresh() {
  //   this._getListPackage();
  // }

  _getListPackage = async () => {
    await this.setState({
      ...this.state,
      isLoading: true
    });
    try {
      const res = await API.getListPackage();
      // reactotron.log(res, "true");
      // await showMessages(I18n.t('notification'), I18n.t('update_info_success'));
      await this.setState({
        ...this.state,
        isLoading: false,
        error: null,
        data: res.result
      });
    } catch (error) {
      // reactotron.log(error, "false");
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
    return (
      <View style={[theme.styles.containter]}>
        <GVHeader back title={I18n.t("payment_info")} />
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.defaultBg }}
        >
          {this.renderBody()}
        </SafeAreaView>
      </View>
    );
  }

  renderBody() {
    return (
      <View style={{ padding: 20 }}>
        <Text
          style={[
            theme.fonts.regular15,
            { textAlign: "center", marginBottom: 10 }
          ]}
        >
          Xin chào {this.state.name}, vui lòng thanh toán theo số tài khoản bên
          dưới để nạp thêm điểm.
        </Text>
        <Text
          style={[
            theme.fonts.bold16,
            { textAlign: "center", marginBottom: 10 }
          ]}
        >
          Thông tin chuyển khoản
        </Text>
        <Text
          style={[
            theme.fonts.regular15,
            { textAlign: "center", marginBottom: 10 }
          ]}
        >
          Ngân hàng TMCP Công Thương Việt Nam - VietinBank
        </Text>
        {/* <Text style={[theme.fonts.regular15,{textAlign:'center', marginBottom:10}]} >Chi nhánh </Text> */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={[theme.fonts.bold16]}>Số tài khoản: </Text>
          <Text
            style={[
              theme.fonts.regular15,
              { textDecorationLine: "underline", marginBottom: 10 }
            ]}
          >
            101866859775
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={[theme.fonts.bold16]}>Chủ tài khoản: </Text>
          <Text
            style={[theme.fonts.regular15, { textDecorationLine: "underline", marginBottom:20 }]}
          >
            Nguyễn Đức Biển
          </Text>
        </View>
        <Text style={{textAlign:'center'}}>Lưu ý: 1.000 VND = 1000 điểm</Text>
      </View>
    );
  }
  // renderBody() {
  //   console.log(this.state.itemSelect);

  //   const { isLoading, error, data } = this.state;
  //   reactotron.log(data);
  //   if (isLoading) return <Loading />;
  //   if (error)
  //     return (
  //       <Error
  //         onPress={() => {
  //           this.refresh();
  //         }}
  //       />
  //     );
  //   if (data.length == 0)
  //     return (
  //       <Empty
  //         onRefresh={() => this.refresh()}
  //         style={{ flex: 1 }}
  //         description={"Hiện tại chưa có gói điểm nào"}
  //       />
  //     );
  //   return (
  //     <View
  //       style={{
  //         paddingHorizontal: 10,
  //         paddingTop: 20,
  //         flex: 1,
  //         justifyContent: "center",
  //         marginBottom: 50
  //       }}
  //     >
  //       <FlatList
  //         refreshControl={
  //           <RefreshControl
  //             refreshing={isLoading}
  //             onRefresh={() => this.refresh()}
  //           />
  //         }
  //         style={{ width: "100%", alignSelf: "center" }}
  //         data={data}
  //         keyExtractor={(item, index) => index.toString()}
  //         renderItem={this.renderPoint}
  //         numColumns={3}
  //       />
  //       <PrimaryButton
  //         title={I18n.t("continue")}
  //         action={() => VNPAY(this.state.itemSelect.price)}
  //       />
  //     </View>
  //   );
  // }
  renderPoint = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          marginHorizontal: 5,
          marginVertical: 5,
          width: 108,
          height: 57,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 0.25,
          borderColor: theme.colors.black,
          borderRadius: 5,
          backgroundColor:
            this.state.itemSelect == item
              ? theme.colors.primaryButton
              : theme.colors.white
        }}
        onPress={() => {
          this.setState({
            itemSelect: item
          });
          //   VNPAY();
        }}
      >
        <Text
          style={[
            theme.fonts.medium16,
            {
              color:
                this.state.itemSelect == item
                  ? theme.colors.white
                  : theme.colors.black
            }
          ]}
        >
          {item.point}
          {I18n.t("point")}
        </Text>
        <NumberFormat
          style={[
            theme.fonts.regular14,
            {
              color:
                this.state.itemSelect == item
                  ? theme.colors.white
                  : theme.colors.black
            }
          ]}
          value={item.price}
          perfix={" đ"}
        />
      </TouchableOpacity>
    );
  };
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfoScreen);
