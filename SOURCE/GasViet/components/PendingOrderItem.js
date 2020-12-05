import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import * as theme from '../constants/Theme'
import I18n from '../i18n/i18n';
import { SCREEN_ROUTER,ORDER_TYPE } from '../constants/Constant';
import NavigationUtil from '../navigation/NavigationUtil';

export default class PendingOrderItem extends Component {
    render() {
        const { item, index } = this.props;
        return (
            <TouchableOpacity style={styles.view} onPress={()=>{
                NavigationUtil.navigate(SCREEN_ROUTER.ORDER_DETAIL,{ type_order : ORDER_TYPE.pending  })
            }}>
                {this.renderInfo(require('../assets/images/ic_location.png'),22,22,'Số lượng: 1',8,'15:30')}
                {this.renderInfo(require('../assets/images/ic_gas.png'),25,15,'Khoảng cách 3km',12)}
                {this.renderInfo(require('../assets/images/ic_quantity.png'),19,19,'Số lượng: 1',10)}
            </TouchableOpacity>
        )
    }
    renderInfo(source, height, width, content,margin, time) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={source} style={{ height: height, width: width,marginHorizontal:margin  }} />
                    <Text style={[theme.fonts.regular14]}>{content}</Text>
                </View>
                {time&&<Text style={[theme.fonts.regular14]}>15:30</Text>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: theme.colors.white,
        height: 121,
        marginBottom: 5,
        paddingTop: 18,
        paddingBottom: 22,
        paddingStart: 14,
        paddingEnd: 17,
        justifyContent:'space-between'

    }
})
