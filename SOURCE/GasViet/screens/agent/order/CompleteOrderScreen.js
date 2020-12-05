import React, { Component } from 'react'
import { Text, StyleSheet, View, FlatList, RefreshControl, Platform } from 'react-native'
import OrderItem from '../../../components/OrderItem'
import * as theme from '../../../constants/Theme'
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { connect } from 'react-redux'
import { getListOrder } from '../../../redux/actions/index'
import Empty from '../../../components/Empty';
import AsyncStorage from '@react-native-community/async-storage'
import RequsetLoginScreen from "../../../components/RequsetLoginScreen";

class CompleteOrderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            status: 2,
            page: 1
        };
    }

    componentDidMount() {
        this._getToken();
    }

    async _getToken() {
        var token = await AsyncStorage.getItem("token");
        this.setState({
            token: token
        });
        if (token != null) {
            this.props.getListOrder(this.state.status, this.state.page);
        }
    }

    _loadMore(page) {
        this.props.getListOrder(this.state.status, page);
    }

    refresh() {
        this._getToken();
        this.props.getListOrder(this.state.status, this.state.page);
    }

    render() {
        const { listOrderState } = this.props;
        // reactotron.log(this.state.token);
        if (listOrderState.isLoading) return <Loading />
        if (listOrderState.error && this.state.token == null) return <RequsetLoginScreen />
        if (listOrderState.error) return <Error onPress={() => {
            this.refresh()
        }} />
        if (listOrderState.data.length == 0) return <Empty onRefresh={() => this.refresh()} style={{ flex: 1 }} description={"Hiện tại chưa có đơn hàng nào"} />
        return (
            <View style={[theme.styles.containter]}>
                <FlatList
                    style={{ width: '100%', alignSelf: 'center', flex: 1, backgroundColor: '#F9F9F9', paddingTop: Platform.OS == 'android' ? 30 : 10 }}
                    contentContainerStyle={{paddingBottom:50}} 
                    data={listOrderState.data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    refreshControl={
                        <RefreshControl refreshing={listOrderState.isLoading} onRefresh={() => this.refresh()} />
                    }
                    onEndReached={() => {
                        if (listOrderState.page < listOrderState.lastPage) {
                            this._loadMore(listOrderState.page + 1)
                        }
                    }}
                    onEndReachedThreshold={1}
                    data={listOrderState.data}
                />
            </View>
        )
    }
    renderItem = ({ item, index }) => {
        return (
            <OrderItem key={index} item={item} type_order={2} />
        )
    }
}


const styles = StyleSheet.create({})

const mapStateToProps = (state) => ({
    listOrderState: state.listOrderReducer.completed,
})

const mapDispatchToProps = {
    getListOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(CompleteOrderScreen)

