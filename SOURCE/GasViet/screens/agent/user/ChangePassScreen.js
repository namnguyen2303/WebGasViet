import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, Key } from 'react-native'
import GVHeader from '../../../components/GVHeader'
import * as theme from '../../../constants/Theme'
import I18n from '../../../i18n/i18n';
import { TextField } from 'react-native-material-textfield';
import PrimaryButton from "../../../components/PrimaryButton";
import * as API from '../../../constants/Api';
import { connect } from "react-redux";
import { showMessages, showConfirm } from "../../../components/Alert";
import NavigationUtil from '../../../navigation/NavigationUtil';
import { getUserInfo } from '../../../redux/actions/index'

class ChangePassScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirm_new_password: '',
            isLoading: false,
            error: '',
            payload: {
                oldPass: '',
                newPass: ''
            }
        }
    }

    changePass = async payload => {
        await this.setState({
            ...this.state,
            isLoading: true,
        });
        try {
            const res = await API.changPass(payload);
            await this.setState(
                {
                    ...this.state,
                    isLoading: false,
                    error: null,
                },
                () => {
                    this.props.getUserInfo();
                    showMessages(I18n.t('notification'), I18n.t('update_pass_success'));
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
                <GVHeader back title={I18n.t('change_password')} />
                <SafeAreaView style={theme.styles.container}>
                    {this.renderBody()}
                </SafeAreaView>
            </View>
        )
    }
    renderBody() {
        return (
            <View style={styles.body}>
                {this.renderTextField(I18n.t('old_password'), value => this.setState({
                    payload: {
                        ...this.state.payload,
                        oldPass: value
                    }
                }))}
                {this.renderTextField(I18n.t('new_password'), value => this.setState({
                    payload: {
                        ...this.state.payload,
                        newPass: value
                    }
                }
                ))}
                {this.renderTextField(I18n.t('confirm_new_password'), value => this.setState({
                        confirm_new_password: value
                }))}
                <PrimaryButton style={{ marginTop: 50 }} title={I18n.t('update')}
                    action={() => {
                        this.state.confirm_new_password != this.state.payload.newPass ?
                            showMessages(I18n.t('notification'), "Mật khẩu xác nhận không trùng khớp")
                            :
                            showConfirm(I18n.t('notification'), "Bạn chắc chẵn muốn đổi mật khẩu chứ ?", () => {
                                this.changePass(this.state.payload);
                            })
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
                secureTextEntry={true}
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
)(ChangePassScreen);