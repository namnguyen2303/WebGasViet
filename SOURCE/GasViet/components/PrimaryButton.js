import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import * as theme from '../constants/Theme'

export default class PrimaryButton extends Component {
    render() {
        const { title, action,style } = this.props
        return (
            <TouchableOpacity style={[styles.btnPrimary,style]} onPress={action}>
                <Text style={[theme.fonts.regular16, {color:theme.colors.white, textTransform:'uppercase'}]} >{title}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    btnPrimary:{
        width:184,
        height:46,
        backgroundColor: theme.colors.primaryButton,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    }
})
