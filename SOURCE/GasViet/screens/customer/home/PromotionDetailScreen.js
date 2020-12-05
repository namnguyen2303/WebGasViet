import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import { SCREEN_ROUTER } from "../../../constants/Constant";
import NavigationUtil from "../../../navigation/NavigationUtil";
import * as theme from "../../../constants/Theme";
import Icon from "../../../components/Icon";
import I18n from "../../../i18n/i18n";
import GVHeader from "../../../components/GVHeader";
import Block from "../../../components/Block";
// const { height, width } = Dimensions.get("window");
import Mockup from "../../../constants/Mockup";
import NumberFormat from "../../../components/NumberFormat";
import HTML from "react-native-render-html";
import * as API from "../../../constants/Api";
import { getListOrder, getHomeData } from "../../../redux/actions/index";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { connect } from 'react-redux'

class PromotionDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsID: this.props.navigation.getParam("newsID"),
      isLoading: false,
      error: null,
      item: ""
    };
  }

  getNewDetail = async payload => {
    await this.setState({
      ...this.state,
      isLoading: true,
      error:null,
      item: ""
    });
    try {
      const res = await API.getNewDetail(payload);
      await this.setState(
        {
          ...this.state,
          isLoading: false,
          error: null,
          item: res.result
        },
        () => {
          this.props.getHomeData();
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

  componentDidMount() {
    this.getNewDetail(this.state.newsID);
  }

  render() {
    // console.log(this.state.item);

    return (
      <View style={theme.styles.containter}>
        <GVHeader title="Khuyến mãi" back />
        {this._renderBody()}
      </View>
    );
  }
  _renderBody() {
    if (this.state.isLoading) return <Loading />;
    if (this.state.error)
      return (
        <Error
          onPress={() => {
            this.getNewDetail(this.state.newsID);
          }}
        />
      );
    const { item } = this.state;
    let date =[];
    if (item != "") {
       date = item.createDate.split("T");
    }
    return (
      <View>
        <Image
          source={{ uri: item.urlImage }}
          style={{
            width: "100%",
            height: theme.dimension.height / 4,
            resizeMode: "center"
          }}
        />
        <Text style={[theme.fonts.bold15, { margin: 10 }]}>{item.title}</Text>
        <Text
          style={[
            theme.fonts.regular12,
            { color: theme.colors.active, marginHorizontal: 10 }
          ]}
        >
          {" "}
          {date[0]}
        </Text>
        <HTML html={item.content} containerStyle={{ padding: 10 }} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  itemStyle: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: theme.colors.white,
    margin: 3
  }
});

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
    getHomeData
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetailScreen)
