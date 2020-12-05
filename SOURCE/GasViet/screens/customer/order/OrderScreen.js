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
    SafeAreaView
} from 'react-native'
import { SCREEN_ROUTER, ORDER_TYPE } from '../../../constants/Constant';
import NavigationUtil from '../../../navigation/NavigationUtil';
import * as theme from '../../../constants/Theme'
import Icon from '../../../components/Icon'
import I18n from '../../../i18n/i18n'
import GVHeader from '../../../components/GVHeader'
import Block from '../../../components/Block';
// const { height, width } = Dimensions.get("window");
import Mockup from '../../../constants/Mockup'
import NumberFormat from '../../../components/NumberFormat';
import ScrollableTabView, {
    DefaultTabBar, ScrollableTabBar
} from "react-native-scrollable-tab-view";
import OrderPendingScreen from './OrderPendingScreen'
import AsyncStorage from '@react-native-community/async-storage';
import RequsetLogin from '../../../components/RequsetLoginScreen'
export default class OrderScreen extends Component {
    constructor(props) {
        super(props);
        // this.getRole();
    }
    state = {
        role: "",
        token: "",
        isLoadingToken: true,
    }

    componentDidMount() {
        this.getRole()
    }
    getRole = async () => {
        try {
            const role = await AsyncStorage.getItem("role");
            const token = await AsyncStorage.getItem("token");
            if (token != null)
                this.setState({
                    ...this.setState,
                    role: role,
                    token: token,
                    isLoadingToken: false,
                });
            else
                this.setState({
                    ...this.state,
                    isLoadingToken: false,
                })
        } catch (error) {
            this.setState({
                ...this.state,
                isLoadingToken: false,
            })
        }
    };

    render() {
        // if(this.state.role == "") return  <RequsetLogin />
        return (
            <View style={theme.styles.containter}>
                <GVHeader title={I18n.t("order")} />
                {this.state.token == "" ? <RequsetLogin /> :
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
                        initialPage={0}
                    >
                        <OrderPendingScreen
                            key={0}
                            tabLabel={I18n.t("pendding_confirm")}
                            orderType={ORDER_TYPE.pending}
                        />
                        <OrderPendingScreen
                            key={1}
                            tabLabel={I18n.t("processing")}
                            orderType={ORDER_TYPE.processing}
                        />
                        <OrderPendingScreen
                            key={2}
                            tabLabel={I18n.t("completed")}
                            orderType={ORDER_TYPE.completed}
                        />
                    </ScrollableTabView>}
            </View>
        )
    }
}
