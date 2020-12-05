import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import * as theme from '../constants/Theme'
import I18n from '../i18n/i18n';
import NumberFormat from './NumberFormat';
import { SCREEN_ROUTER, ORDER_TYPE } from '../constants/Constant';
import NavigationUtil from '../navigation/NavigationUtil';

export default class OrderItem extends Component {
    render() {
        const { item, index , type_order} = this.props;
        const date = item.date.split(" ");
        return (
            <TouchableOpacity style={styles.view} onPress={() => {
                NavigationUtil.navigate(SCREEN_ROUTER.NOTIFY, { type_order: type_order,item : item })
            }}>
                <Image source={{uri: item.uri}} style={{ height: 100, width: 62, marginRight: 25 }} />
                <View style={{ justifyContent: 'space-between' }}>
                    <View>
                        <Text style={[theme.fonts.medium15]}>Mã đơn: {item.code}</Text>
                        <Text style={[theme.fonts.regular13, { color: theme.colors.inactiveText }]}>{I18n.t('quantity')}{item.qty}</Text>
                        <Text style={[theme.fonts.regular13, { color: theme.colors.gray }]}>Giờ tạo: {date[0]}</Text>
                        <Text style={[theme.fonts.regular13, { color: theme.colors.gray }]}>Ngày tạo: {date[1]}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[theme.fonts.regular16]}>{I18n.t('total_money')} </Text>
                        <NumberFormat value={item.totalPrice} perfix={'đ'} color={theme.colors.orange} fonts={[theme.fonts.regular16]} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: theme.colors.white,
        width: '95%',
        marginBottom: 7,
        paddingTop: 17,
        paddingBottom: 14,
        paddingStart: 33,
        paddingEnd: 17,
        flexDirection: 'row',
        alignSelf: 'center',
        borderRadius: 5,
        borderWidth: 0.25,
        borderColor: theme.colors.border,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,

    }
})
