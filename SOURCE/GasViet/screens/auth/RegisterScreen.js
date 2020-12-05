import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import NavigationUtil from '../../navigation/NavigationUtil';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { TextField } from 'react-native-material-textfield';
import { connect } from "react-redux";
import * as theme from '../../constants/Theme';
import I18n from '../../i18n/i18n';
import { SCREEN_ROUTER } from '../../constants/Constant';
import PrimaryButton from '../../components/PrimaryButton';
import { requestRegister } from '../../constants/Api'
import { requestLogin } from '../../redux/actions'

class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkHide: true,
            user: "",
            passWord: "",
            rePass: ""
        };
    }


    requestRegister = async () => {
        // console.log(this.state.user);

        const result = await requestRegister({
            value: this.state.user,
            passWord: this.state.passWord
        })
        if (result) {

            result.status == "1" &&
                this.props.requestLogin({
                    value: this.state.user,
                    type: "3",
                    passWord: this.state.passWord
                })
        }
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ImageBackground source={require('../../assets/images/background.png')} resizeMode="contain" style={{
                    width: '100%', height: '100%', position: 'absolute', flex: 1,
                    alignItems: 'center'
                }} >
                    <View style={{ height: '40%', justifyContent: 'center' }}>
                        <Image source={require('../../assets/images/logo.png')} style={{ width: 215, height: 166, marginTop: 50 }} />
                    </View>
                    <View style={{ width: '85%' }}>
                        {this.renderTextInput(I18n.t('input_email'),
                            (value) => this.setState({
                                ...this.setState,
                                user: value
                            })
                        )}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {this.renderTextInput(I18n.t('password'),
                                (value) => this.setState({
                                    ...this.setState,
                                    rePass: value
                                })
                            )}
                            <TouchableOpacity onPress={() => this.setState({ checkHide: this.state.checkHide ? false : true })} style={{ position: 'absolute', marginLeft: "90%" }} >
                                <Image style={{ width: 22, height: 19, marginTop: 15 }} source={require('../../assets/images/eye-off.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {this.renderTextInput(I18n.t('re_input_password'),
                                (value) => this.setState({
                                    ...this.setState,
                                    passWord: value
                                })
                            )}
                            {/* <TouchableOpacity onPress={() => this.setState({ checkHide: this.state.checkHide ? false : true })} style={{ position: 'absolute', marginLeft: "90%" }} >
                                <Image style={{ width: 22, height: 19, marginTop: 15 }} source={require('../../assets/images/eye-off.png')} />
                            </TouchableOpacity> */}
                        </View>
                        <PrimaryButton style={{ marginTop: 58 }} title={I18n.t('register')}

                            action={() => {
                                if (this.state.passWord === this.state.rePass)
                                    this.requestRegister()
                                else {
                                    alert("Mật khẩu không giống nhau")
                                }
                            }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 18, marginBottom: 37 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[theme.fonts.regular12]}>{I18n.t('had_account')}</Text>
                                <TouchableOpacity onPress={() => NavigationUtil.navigate(SCREEN_ROUTER.LOGIN)}>
                                    <Text style={[theme.fonts.bold_italic12, { color: theme.colors.registerText }]}> {I18n.t('login_now')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableWithoutFeedback>
        );
    }
    renderTextInput(label, action) {
        return (
            <TextField
                containerStyle={{ width: '100%' }}
                labelTextStyle={[theme.fonts.regular16]}
                label={label}
                activeLineWidth={1}
                disabledLineWidth={1}
                lineWidth={1}
                keyboardType={'default'}
                secureTextEntry={label == I18n.t('input_email') ? false : this.state.checkHide}
                onChangeText={action}
            />
        )
    }
}
const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    requestLogin
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)