import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import  Icon from '../components/Icon'
import I18n from '../i18n/i18n';
import * as Theme from '../constants/Theme'
import Block from '../components/Block';

class Error extends Component {
    render() {
        return (
            <Block center middle>
                <TouchableOpacity
                    onPress={this.props.onPress}
                >
                    <Icon.MaterialIcons name='refresh' size={45} color='orange' />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', color: Theme.colors.undoactionButtonBg }}>{I18n.t('network_err')}</Text>
            </Block>
        );
    }
}

export default Error;
