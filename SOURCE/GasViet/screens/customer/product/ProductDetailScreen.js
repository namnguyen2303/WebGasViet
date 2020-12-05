import React, { Component } from 'react'
import {
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { SCREEN_ROUTER } from '../../../constants/Constant';
import NavigationUtil from '../../../navigation/NavigationUtil';
import * as theme from '../../../constants/Theme'
import Icon from '../../../components/Icon'
import I18n from '../../../i18n/i18n'
import GVHeader from '../../../components/GVHeader'
import Block from '../../../components/Block';
import Mockup from '../../../constants/Mockup'
import NumberFormat from '../../../components/NumberFormat';
const { height, width } = Dimensions.get("window");
export default class ProductDetailScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item: this.props.navigation.getParam('item')
        }
    }

    render() {
        // console.log(this.state.item);
        const { item } = this.state;
        return (
            <View style={[theme.styles.containter,{backgroundColor:theme.colors.white}]}>
                <GVHeader title={I18n.t("product_detail")} back />

                <SafeAreaView style={{ flex: 1 }}>

                    <ScrollView>
                        <Image source={{ uri: item.imageUrl }}
                            style={{ width: "100%", height: height / 3, resizeMode: 'contain', marginBottom: 20 }} />
                        {this._renderBody()}
                    </ScrollView>
                    <View>
                        <TouchableOpacity
                            onPress={() => NavigationUtil.navigate(SCREEN_ROUTER.ORDER_STEP1_SCREEN, { item: item })}
                            style={styles.buttonStyle}>
                            <Text style={[theme.fonts.bold16, { textAlign: 'center', color: theme.colors.white }]}>ĐẶT GAS</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
    _renderBody() {
        const { item } = this.state;
        return (
            <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>

                <Text style={theme.fonts.regular16}>{item.itemName}</Text>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={[theme.fonts.regular14, { marginVertical: 2 }]}>Giá: </Text>
                    {item.oldPrice != item.newPrice && <NumberFormat value={item.oldPrice} perfix={" đ"}
                        style={[theme.fonts.regular14, { marginLeft: 10, textDecorationLine: 'line-through', color: theme.colors.gray }]} />}
                    <NumberFormat value={item.newPrice} perfix={" đ"}
                        style={[theme.fonts.regular14, { marginLeft: 10, color: theme.colors.orange }]} />
                </View>
                <Text style={[theme.fonts.regular14, { marginVertical: 2 }]}>
                    <Text style={theme.fonts.bold14}>Thương hiệu: </Text>{item.brand}</Text>
                <Text style={[theme.fonts.regular14, { marginVertical: 2 }]}>
                    <Text style={theme.fonts.bold14}>Bảo hành: </Text>{item.warranty}</Text>
                <Text style={[theme.fonts.regular14, { marginVertical: 2 }]}>
                    <Text style={theme.fonts.bold14}>Xuất xứ: </Text>{item.madeIn}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 19, marginBottom: 15 }}>
                    <View style={{ borderWidth: 0.5, borderColor: theme.colors.border, width: '40%', height: 0.25 }}></View>
                    <Text style={[theme.fonts.regular14]} >Giới thiệu</Text>
                    <View style={{ borderWidth: 0.5, borderColor: theme.colors.border, width: '40%', height: 0.25 }}></View>
                </View>
                <Text style={{ color: theme.colors.border }}>{item.description}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    buttonStyle: {
        padding: 15,
        paddingHorizontal: 50,
        backgroundColor: theme.colors.orange,
        alignSelf: 'center',
        marginBottom: 10,
        borderRadius: 5
    }
})