import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import * as theme from '../constants/Theme'
import I18n from '../i18n/i18n';

export default class NotiItem extends Component {
    render() {
        const { item, index } = this.props;
        return (
            <TouchableOpacity style={styles.view}>
                <Image source={{uri:item.icon}} style={{height:58, width:36, marginHorizontal:20}} />
                <View style={{justifyContent:'space-around', width:'80%'}}>
                    <Text style={[theme.fonts.regular14]}>{item.content}</Text>
                    <Text style={[theme.fonts.regular14,{color:theme.colors.inactiveText}]}>{item.createdDateStr}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        width:'100%',
        backgroundColor: theme.colors.white,
        marginBottom: 5,
        paddingTop: 18,
        paddingBottom: 11,
        paddingRight: 17,
        flexDirection:'row'
    }
})
