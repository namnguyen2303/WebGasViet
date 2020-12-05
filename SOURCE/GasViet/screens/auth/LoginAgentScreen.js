import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    TextInput,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import NavigationUtil from '../../navigation/NavigationUtil';
import * as theme from '../../constants/Theme';
import Icon from '../../components/Icon'
import I18n from '../../i18n/i18n';
import { SCREEN_ROUTER } from '../../constants/Constant';
import PrimaryButton from '../../components/PrimaryButton';
import { showConfirm, showMessages } from '../../components/Alert';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage';
import { CheckPass } from '../../constants/Api'
export class LoginAgentScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phone: "",
            password: ""
        };
    }
    async componentDidMount() {
        const rs = await AsyncStorage.getItem("customerName");
        this.setState({
            ...this.setState,
            phone: rs
        })
    }
    _checkPass = async () => {

        try {
            const rs = await CheckPass(this.state.password);
            if (rs) {
                AsyncStorage.setItem("agent", "1");
                NavigationUtil.navigate(SCREEN_ROUTER.AGENT_TAB)
            }
        } catch (error) {

        }
    }
    render() {

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                {/* <KeyboardAvoidingView behavior="position" > */}
                <ImageBackground
                    source={require('../../assets/images/splash_screen.png')}
                    style={{
                        width: '100%', height: "100%", flex: 1,
                        alignItems: 'center',
                    }} >
                    <ScrollView contentContainerStyle={{flexGrow: 1}}
                            keyboardShouldPersistTaps='handled' >
                        <View style={{ width: theme.dimension.width, alignItems: 'center' }}>
                            <Image source={require('../../assets/images/logo.png')} style={{ width: 215, height: 200, marginTop: 50 }} />
                        </View>
                        <View style={{ padding: 20 }}>
                            <Text style={{ textAlign: "center" }}>Bạn đang đăng nhập bằng tài khoản đại lý</Text>
                            <Text style={{ textAlign: "center" }}>Vui lòng nhập mật khẩu để tiếp tục.</Text>
                            <Text style={[theme.fonts.regular15, { color: theme.colors.orange, textAlign: 'center', marginTop: 10 }]}>Tài khoản: {this.state.phone}</Text>
                            <View>
                                <TextInput
                                    style={styles.textInputStyle}
                                    opacity={20}
                                    onChangeText={
                                        value => this.setState({
                                            ...this.setState,
                                            password: value
                                        })
                                    }
                                    secureTextEntry={true}
                                    placeholder={I18n.t('password')}
                                />
                                <TouchableOpacity style={{ position: 'absolute', right: 5, top: 30, }}
                                    onPress={() => {
                                        this.state.password.trim() == '' ?
                                            showMessages(I18n.t('notification'), "Vui lòng nhập mật khẩu ") :
                                            this._checkPass();
                                    }}
                                >
                                    <Icon.MaterialIcons name="arrow-forward" size={30} color={theme.colors.red} />
                                </TouchableOpacity>
                            </View>
                            {/* <PrimaryButton title={I18n.t('login')} action={() => {
                                this.state.password.trim() == '' ?
                                    showMessages(I18n.t('notification'), "Vui lòng nhập mật khẩu ") :
                                    this._checkPass();
                            }} /> */}

                            <TouchableOpacity onPress={() => {
                                AsyncStorage.clear();
                                NavigationUtil.navigate(SCREEN_ROUTER.LOGIN);
                            }
                            }>
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>Quay lại</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </ImageBackground>
                {/* </KeyboardAvoidingView> */}
            </TouchableWithoutFeedback>
        )
    }
}
const styles = StyleSheet.create({
    textInputStyle: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        marginBottom: 30,
        marginTop: 20,
        height:50,
        paddingHorizontal: 20
    }
})
const mapStateToProps = (state) => ({
    LoginState: state.loginReducer
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(LoginAgentScreen)
