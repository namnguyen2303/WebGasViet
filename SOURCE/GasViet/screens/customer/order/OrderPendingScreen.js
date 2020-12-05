import React, { Component } from 'react'
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
    RefreshControl
} from 'react-native'
import { SCREEN_ROUTER, ORDER_TYPE } from '../../../constants/Constant';
import NavigationUtil from '../../../navigation/NavigationUtil';
import * as theme from '../../../constants/Theme'
import Icon from '../../../components/Icon'
import I18n from '../../../i18n/i18n'
import GVHeader from '../../../components/GVHeader'
import Block from '../../../components/Block';
const { height, width } = Dimensions.get("window");
import Mockup from '../../../constants/Mockup'
import NumberFormat from '../../../components/NumberFormat';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getListOrder } from '../../../redux/actions'
import Loading from '../../../components/Loading'
import Error from '../../../components/Error'
import Empty from '../../../components/Empty'
import reactotron from 'reactotron-react-native';
class OrderPendingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Mockup.buy,
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.props.getListOrder(this.props.orderType, "1")
    }


    render() {

        // reactotron.log(this.props.ListOrderState.pending.data);
        const { ListOrderState, orderType } = this.props;
        let page = orderType == ORDER_TYPE.pending ? ListOrderState.pending.page : (orderType == ORDER_TYPE.processing ?
            ListOrderState.processing.page : ListOrderState.completed.page)
        let lastPage = orderType == ORDER_TYPE.pending ? ListOrderState.pending.lastPage : (orderType == ORDER_TYPE.processing ?
            ListOrderState.processing.lastPage : ListOrderState.completed.lastPage)
        var data = orderType == ORDER_TYPE.pending ? ListOrderState.pending.data : (orderType == ORDER_TYPE.processing ?
            ListOrderState.processing.data : ListOrderState.completed.data)
        if (ListOrderState.pending.isLoading || ListOrderState.completed.isLoading || ListOrderState.processing.isLoading) return <Loading />
        if (ListOrderState.pending.error || ListOrderState.completed.isLoading || ListOrderState.processing.isLoading) return <Error onPress={() => this.getData()} />
        if (data.length == 0) return <Empty title="Không có đơn hàng nào"
            onRefresh={() => {
                this.getData();
            }} />
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={ListOrderState.isLoading}
                            onRefresh={() => {
                                this.getData();
                            }}
                        />
                    }
                    onEndReached={() => {
                        if (page < lastPage) {
                            this._loadMore(page + 1)
                        }
                    }}
                    onEndReachedThreshold={1}
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    contentContainerStyle={{ paddingBottom: 50 }}
                />

            </View>
        )
    }
    _loadMore(page) {
        this.props.getListOrder(this.props.orderType, page);
    }
    renderItem = (item, index) => {
        const date = item.date.split(" ");
        return (
            <TouchableOpacity style={styles.itemStyle}
                onPress={() => NavigationUtil.navigate(SCREEN_ROUTER.ORDER_DETAIL_SCREEN, {
                    orderType: this.props.orderType,
                    item: item
                })}
            >
                <Image source={{ uri: item.uri }}
                    style={styles.imgItemStyle} />
                <View style={{ flex: 1 }}>
                    {item.listOrderItem.length != 0 &&
                        <View style={{ flex: 1 }}>
                            <Text style={theme.fonts.regular14}>Mã đơn: {item.code}</Text>
                            <Text style={[theme.fonts.regular14, { color: theme.colors.gray }]}>Số lượng: {item.listOrderItem[0].qty}</Text>
                            <Text style={[theme.fonts.regular14, { color: theme.colors.gray }]}>Giờ tạo: {date[0]}</Text>
                            <Text style={[theme.fonts.regular14, { color: theme.colors.gray }]}>Ngày tạo: {date[1]}</Text>
                        </View>
                    }
                    <NumberFormat value={item.totalPrice} perfix={" đ"} style={{ flex: 1, color: theme.colors.orange }} />
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    itemStyle: {
        borderRadius: 5,
        flexDirection: 'row',
        margin: 3,
        backgroundColor: theme.colors.white,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    imgItemStyle: {
        resizeMode: 'contain',
        height: 100,
        width: 60,
        marginHorizontal: 30,
    }
})

const mapStateToProps = (state) => ({
    ListOrderState: state.listOrderReducer
})

const mapDispatchToProps = {
    getListOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPendingScreen)
