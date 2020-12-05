import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, Key } from 'react-native'
import GVHeader from '../../components/GVHeader'
import * as theme from '../../constants/Theme'
import I18n from '../../i18n/i18n';
import { TextField } from 'react-native-material-textfield';
// import DatePicker from 'react-native-datepicker'
// import { RadioButton } from "react-native-material-ui"
// import { Dropdown } from 'react-native-material-dropdown'
import PrimaryButton from "../../components/PrimaryButton";
import * as API from '../../constants/Api';
import { connect } from "react-redux";
// import reactotron from 'reactotron-react-native';
import { showMessages, showConfirm } from "../../components/Alert";
import NavigationUtil from '../../navigation/NavigationUtil';
import { getUserInfo } from '../../redux/actions/index'

class ForgotPassScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payload: {
                email: ''
            },
            isLoading: false,
            error: '',
        }
    }

    forgotPass = async payload => {
        await this.setState({
            ...this.state,
            isLoading: true,
        });
        try {
            const res = await API.forgotPass(payload);
            await this.setState(
                {
                    ...this.state,
                    isLoading: false,
                    error: null,
                },
                () => {
                    showMessages(I18n.t('notification'), "Vui lòng mở email để lấy lại mật khẩu");
                    NavigationUtil.goBack();
                }
            );
        } catch (error) {
            await this.setState(
                {
                    ...this.state,
                    isLoading: false,
                    error: error,
                },
                // () => showMessages(I18n.t('notification'), JSON.stringify(error.message))
            );
        }
    };

    render() {
        return (
            <View style={[theme.styles.containter]}>
                <GVHeader back title={I18n.t('forget_pass')} />
                <SafeAreaView style={theme.styles.container}>
                    {this.renderBody()}
                </SafeAreaView>
            </View>
        )
    }
    renderBody() {
        return (
            <View style={styles.body}>
                {this.renderTextField("Vui lòng nhập email", value => this.setState({
                    payload: {
                        ...this.state.payload,
                        email: value
                    }
                }))}
                <PrimaryButton style={{ marginTop: 50 }} title={"Lấy lại mật khẩu"}
                    action={() => {
                        this.forgotPass(this.state.payload);
                    }} />
            </View>
        )
    }
    renderTextField(label, onChangeText) {
        return (
            <TextField
                // tintColor={theme.colors.active}
                containerStyle={{ width: '100%' }}
                labelTextStyle={[theme.fonts.regular16]}
                label={label}
                // baseColor={theme.colors.active}
                activeLineWidth={1}
                disabledLineWidth={1}
                lineWidth={1}
                // textColor={theme.colors.active}
                keyboardType='default'
                onChangeText={onChangeText}
            // onChangeText={
            //     value => this.setState({
            //         ...this.setState,
            //         user: {
            //             ...this.state.user,
            //             value: value
            //         }
            //     })
            // }
            />
        )
    }
}

const styles = StyleSheet.create({
    body: {
        paddingTop: 0,
        paddingHorizontal: 20
    },
    InputDate: {
        width: '70%',
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.gray
    }
})

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
    getUserInfo
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPassScreen);