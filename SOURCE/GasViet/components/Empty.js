import React, { Component } from 'react';
import { View, Text, Image, ScrollView, RefreshControl } from 'react-native';
import * as theme from '../constants/Theme';
import Icon from '../components/Icon'

class Empty extends Component {
    render() {
        const { title, description, urlImage, onRefresh } = this.props

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{
                        backgroundColor: theme.colors.defaultBg,
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={onRefresh}
                        />}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: '5%'
                    }}>
                        <Image
                            source={require('../assets/images/empty_box.png')}
                            style={{
                                resizeMode: 'contain',
                                width: theme.dimension.width / 2,
                                height: theme.dimension.width / 2,
                                // tintColor:theme.colors.gray
                            }} />
                        <Text style={[
                            theme.fonts.bold18,
                            {
                                marginTop: 8,
                                color: theme.colors.gray
                            }
                        ]}>{title}</Text>
                        <Text style={[
                            theme.fonts.light18,
                            {
                                marginTop: 10,
                                marginBottom: 10,
                                color: theme.colors.black2,
                                textAlign: 'center',
                            }
                        ]}>{description}</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default Empty;
