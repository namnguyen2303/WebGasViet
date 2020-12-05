import React, { Component } from 'react';
import { View, Text } from 'react-native';
import GVHeader from '../../../components/GVHeader'
import Loading from '../../../components/Error'
import * as theme from '../../../constants/Theme'
import I18n from '../../../i18n/i18n';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import CompleteOrderScreen from './CompleteOrderScreen';
import PendingOrderScreen from './PendingOrderScreen';
import ProcessingOrderScreen from './ProcessingOrderScreen';

export default class OrderScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={[theme.styles.containter]}>
                <GVHeader title={I18n.t('order')} />
                <ScrollableTabView
                    style={{
                        borderColor: theme.colors.border
                    }}
                    tabBarBackgroundColor={theme.colors.white}
                    tabBarPosition='top'
                    tabBarActiveTextColor={theme.colors.orange}
                    tabBarInactiveTextColor={theme.colors.inactiveText}
                    tabBarUnderlineStyle={{
                        height: 2,
                        backgroundColor: theme.colors.orange
                    }}
                    renderTabBar={() => <ScrollableTabBar />}
                    tabBarTextStyle={theme.fonts.regular16}
                >
                    {/* {listProductState.data.map((item, index) => {
                        return (
                            this.renderTab(item.childName, item.listProduct, index.toString())
                        )
                    })} */}
                    {/* <PendingOrderScreen tabLabel={I18n.t('pending')} /> */}
                    <ProcessingOrderScreen tabLabel={I18n.t('processing')} />
                    <CompleteOrderScreen tabLabel={I18n.t('completed')} />
                </ScrollableTabView>
            </View>
        );
    }
}
