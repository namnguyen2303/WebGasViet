import React, { Component } from 'react'
import {
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native'
import { SCREEN_ROUTER } from '../../../constants/Constant';
import NavigationUtil from '../../../navigation/NavigationUtil';
import * as theme from '../../../constants/Theme'
import Icon from '../../../components/Icon'
import I18n from '../../../i18n/i18n'
import GVHeader from '../../../components/GVHeader'
import Block from '../../../components/Block';
// const { height, width } = Dimensions.get("window");
import Mockup from '../../../constants/Mockup'
import NumberFormat from '../../../components/NumberFormat';
export default class PromotionScreen extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        data: Mockup.notification
    };

    render() {
        return (
            <View style={theme.styles.containter}>
                <GVHeader title={I18n.t("notification")} />
                {this._renderBody()}
            </View>
        )
    }
    _renderBody() {
        return (
            <FlatList
                contentContainerStyle={{ padding: 5 }}
                data={this.state.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => this._renderItem(item, index)}
            />
        )
    }
    _renderItem = (item, index) => {
        // console.log(item);

        return (
            <TouchableOpacity style={styles.itemStyle}>
                <Image source={item.img}
                    style={{ width: 50, height: 50, resizeMode: 'center' }} />
                <View style={{ flexDirection: "column", flex: 1, marginLeft: 15 }}>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={2}
                            style={theme.fonts.bold15}>{item.title}
                        </Text>
                    </View>

                    <Text numberOfLines={2}
                        style={[theme.fonts.regular12, { textAlign: 'left' }]}>{item.date}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    itemStyle: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: theme.colors.white,
        margin: 3
    }
})