import React, { Component } from 'react';
import { View, Text, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import GVHeader from '../../../components/GVHeader'
import Loading from '../../../components/Loading'
import * as theme from '../../../constants/Theme'
import I18n from '../../../i18n/i18n';
import HistoryItem from '../../../components/HistoryItem'
import { getHistoryPoint } from '../../../redux/actions/index'
import Error from "../../../components/Error";
import { connect } from 'react-redux'
import Empty from '../../../components/Empty';


class HistoryPointScreen extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //     };
    // }

    componentDidMount() {
        this.props.getHistoryPoint();
    }

    refresh() {
        this.props.getHistoryPoint();
    }

    render() {
        return (
            <View style={[theme.styles.containter]}>
                <GVHeader back title={I18n.t('history_point')} />
                <SafeAreaView style={{flex:1, backgroundColor:theme.colors.defaultBg}}>
                    {this.renderBody()}
                </SafeAreaView>
            </View>
        );
    }
    renderBody() {
        const { HistoryPointState } = this.props;
        // reactotron.log(HistoryPointState.data.length);
        if (HistoryPointState.isLoading) return <Loading />
        if (HistoryPointState.error) return <Error onPress={() => {
            this.refresh();
        }} />
        if (HistoryPointState.data.length == 0) return <Empty onRefresh={() => this.refresh()} style={{ flex: 1 }} description={"Hiện tại bạn chưa có điểm nào"} />;
        return (
            <FlatList
                style={{ width: '100%', alignSelf: 'center' }}
                refreshControl={
                    <RefreshControl onRefresh={() => this.refresh()} />
                }
                data={HistoryPointState.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem}
            />
        )
    }
    renderItem = ({ item, index }) => {
        return (
            <HistoryItem key={index} item={item} />
        )
    }
}
const mapStateToProps = (state) => ({
    HistoryPointState: state.getHistoryPointReducer
})

const mapDispatchToProps = {
    getHistoryPoint
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPointScreen)
