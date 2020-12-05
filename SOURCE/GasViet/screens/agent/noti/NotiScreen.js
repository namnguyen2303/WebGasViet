import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import GVHeader from '../../../components/GVHeader'
import * as theme from '../../../constants/Theme'
import I18n from '../../../i18n/i18n';
import NotiItem from '../../../components/NotiItem'
import { getNotification } from '../../../redux/actions/index'
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { connect } from 'react-redux'
import Empty from '../../../components/Empty';
import RequsetLogin from '../../../components/RequsetLoginScreen';
import AsyncStorage from '@react-native-community/async-storage';


class NotiScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            role: "",
            token: "",
            isLoadingToken: true
        }
    }

    componentDidMount() {
        this.getRole()
    }

    refresh() {
        this.props.getNotification();
    }
    getRole = async () => {
        try {
            const role = await AsyncStorage.getItem("role");
            const token = await AsyncStorage.getItem("token");
            if (token != null) {
                this.refresh();
                this.setState({
                    ...this.setState,
                    role: role,
                    token: token,
                    isLoadingToken: false
                });
            }
            else{
                this.setState({
                    ...this.state,
                    isLoadingToken: false,
                  })
            }
        } catch (error) {
            this.setState({
                ...this.state,
                isLoadingToken: false,
              })
         }
    };
    render() {

        return (
            <View style={[theme.styles.containter]}>
                <GVHeader title={I18n.t('notification')} />
                {this.renderBody()}
            </View>
        );
    }

    renderBody() {
        const { NotiState } = this.props;
        if (NotiState.isLoading) return <Loading />
        if (NotiState.error) return <Error onPress={() => {
            this.refresh();
        }} />
        if (this.state.token == "") return <RequsetLogin />
        if (NotiState.data.length == 0) return <Empty onRefresh={() => this.refresh()} style={{ flex: 1 }} description={"Hiện tại chưa có thông báo nào"} />;
        return (
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={NotiState.isLoading} onRefresh={() => this.refresh()} />
                }
                style={{ width: '100%', alignSelf: 'center', flex: 1 }}
                data={NotiState.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
            />
        )
    }

    renderItem = ({ item, index }) => {
        return (
            <NotiItem key={index} item={item} />
        )
    }
}

const mapStateToProps = (state) => ({
    NotiState: state.getNotifyReducer
})

const mapDispatchToProps = {
    getNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(NotiScreen)