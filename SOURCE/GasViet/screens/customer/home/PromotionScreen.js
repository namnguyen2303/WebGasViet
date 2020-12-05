import React, { Component } from 'react'
import {
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    RefreshControl
} from 'react-native'
import { SCREEN_ROUTER } from '../../../constants/Constant';
import NavigationUtil from '../../../navigation/NavigationUtil';
import * as theme from '../../../constants/Theme'
import Icon from '../../../components/Icon'
import I18n from '../../../i18n/i18n'
import GVHeader from '../../../components/GVHeader'
import Block from '../../../components/Block';
// const { height, width } = Dimensions.get("window");
import Mockup from '../../../constants/Mockup'
import NumberFormat from '../../../components/NumberFormat';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getHomeData } from '../../../redux/actions';
import HTML from 'react-native-render-html';
class PromotionScreen extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        data: Mockup.promotion,
        // list: this.props.navigation.getParam('list')
    };


    getData() {
        this.props.getHomeData();
    }


    render() {
        // console.log(this.state.list)

        return (
            <View style={theme.styles.containter}>
                <GVHeader title={I18n.t('promotion')} />
                {this._renderBody()}
            </View>
        )
    }
    _renderBody() {
        const { HomeState } = this.props;

        return (
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={HomeState.isLoading}
                        onRefresh={() => {
                            this.getData();
                        }}
                    />
                }
                contentContainerStyle={{ padding: 5 }}
                data={this.props.HomeState.data.result.listNews}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => this._renderItem(item, index)}
            />
        )
    }
    _renderItem = (item, index) => {
        // console.log(item);
        const date = item.createDate.split("T00:00:00");
        return (

            <TouchableOpacity style={styles.itemStyle}
                onPress={() => NavigationUtil.navigate("PromotionDetail", { newsID: item.newsID })}
            >
                <Image source={{ uri: item.urlImage }}
                    style={{ width: "100%", height: 110, resizeMode: 'stretch', marginBottom: 10 }} />
                <View style={{ flexDirection: "column", flex: 1, marginLeft: 15, marginRight:10 }}>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={2}
                            style={theme.fonts.bold15}>{item.title}
                        </Text>
                        {/* <Text numberOfLines={2}
                            style={theme.fonts.regular12}>{item.content}
                        </Text> */}
                    </View>
                    <Text numberOfLines={2}
                        style={[theme.fonts.regular12, { textAlign: 'right', margin: 5 }]}>{date[0]}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    itemStyle: {
        flexDirection: 'column',
        // padding: 10,
        backgroundColor: theme.colors.white,
        margin: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        marginBottom: 10,
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        borderRadius: 5
    }
})
const mapStateToProps = (state) => ({
    HomeState: state.homeReducer
})

const mapDispatchToProps = {
    getHomeData
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionScreen)