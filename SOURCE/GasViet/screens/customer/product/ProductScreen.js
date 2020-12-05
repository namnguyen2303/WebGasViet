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
import { SCREEN_ROUTER } from '../../../constants/Constant';
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
import { getListItem } from '../../../redux/actions'
import Loading from '../../../components/Loading'
import Error from '../../../components/Error'
class ProductScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: Mockup.homeData,
            searchKey: ""
        };
    }
    componentDidMount() {
        this.getData("");
    }

    getData(searchKey) {
        this.props.getListItem(searchKey)
    }

    render() {
        // console.log(this.props.ListItemState);

        return (
            <View style={theme.styles.containter}>
                <GVHeader title={I18n.t("product")} />
                <TextInput
                    placeholder="Tìm kiếm sản phẩm"
                    style={[theme.fonts.regular16, styles.textInputStyle]}
                    onChangeText={
                        value => {
                            this.setState({
                                ...this.setState,
                                searchKey: value
                            }),
                            this.getData(value)
                        }
                    }
                />
                {this._renderBody()}
            </View>
        )
    }
    _renderBody() {
        const { ListItemState } = this.props;
        if (ListItemState.isLoading) return <Loading />
        if (ListItemState.error) return <Error />
        return (
            <Block>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={ListItemState.isLoading}
                            onRefresh={() => {
                                this.getData("");
                            }}
                        />
                    }
                    numColumns={2}
                    data={ListItemState.data.result}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                />
            </Block>
        )
    }
    renderItem = (item, index) => {
        // var discount = Number.parseInt(item.oldPrice, 10) - Number.parseInt(item.newPrice, 10)
        return (
            <TouchableOpacity style={styles.itemStyle}
                onPress={() => NavigationUtil.navigate(SCREEN_ROUTER.PRODUCT_DETAIL, { item: item })}
            >
                <Image source={{ uri: item.imageUrl }}
                    style={styles.imgItemStyle} />
                <View style={styles.bottomItemStyle}>
                    <Text style={theme.fonts.regular14}>{item.itemName}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10, }}>
                        <NumberFormat image value={item.oldPrice} perfix={" đ"}
                            style={{ textDecorationLine: 'line-through', marginLeft: 6, }} />
                        <NumberFormat value={item.newPrice} perfix={" đ"}
                            style={{ marginLeft: 20, color: theme.colors.orange }} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    itemStyle: {
        // backgroundColor: 'gray',
        borderRadius: 5,
        flexDirection: 'column',
        width: (width - 20) / 2,
        marginHorizontal: 5,
        marginBottom: 8,
        backgroundColor: theme.colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        alignItems: 'center'
    },
    imgItemStyle: {
        padding: 20,
        marginVertical: 20,
        resizeMode: 'contain',
        height: 150,
        width: (width - 80) / 2,
    },
    bottomItemStyle: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderTopColor,
        paddingVertical: 10,
        alignSelf: 'stretch',
        alignItems: "center",

    },
    textInputStyle: {
        padding: 5,
        backgroundColor: theme.colors.white,
        paddingHorizontal: 15,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        borderRadius: 5
    }
})

const mapStateToProps = (state) => ({
    ListItemState: state.listItemReducer
})

const mapDispatchToProps = {
    getListItem
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen)
