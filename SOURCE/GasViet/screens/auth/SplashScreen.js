import React from 'react';
import {
    Text,
    View,
    Image,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import * as theme from '../../constants/Theme';
import NavigationUtil from '../../navigation/NavigationUtil';
import { SCREEN_ROUTER } from '../../constants/Constant'
const { height, width } = Dimensions.get("window");
export default class SplashScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,

                }}>
                <Image
                    style={{
                        height: height,
                        width: width,
                        resizeMode: "stretch"
                    }}
                    source={require('../../assets/images/splash_screen.png')}
                />
            </View>
        );
    }
}
