import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, Key, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import GVHeader from '../../../components/GVHeader'
import * as theme from '../../../constants/Theme'
import I18n from '../../../i18n/i18n';
import { TextField } from 'react-native-material-textfield';
import DatePicker from 'react-native-datepicker'
import { RadioButton } from "react-native-material-ui"
import { Dropdown } from 'react-native-material-dropdown'
import PrimaryButton from "../../../components/PrimaryButton";
import { getProvince, getUserInfo } from '../../../redux/actions/index'
import * as API from '../../../constants/Api';
import Loading from '../../../components/Loading';
import Error from '../../../components/Error';
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage'
import { showMessages } from "../../../components/Alert";
import NavigationUtil from '../../../navigation/NavigationUtil';

var d = new Date();
 
var date = d.getDate();
var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getFullYear();
 
var dateStr = date + "/" + month + "/" + year;

class UpdateUserScreen extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const item = navigation.getParam('item', {});
        this.state = {
            token: '',
            isLoading: false,
            error: '',
            provinceName: item.provinceName,
            districtName: item.districtName,
            payload: {
                customerName: item.customerName,
                phone: item.phone,
                email: item.email,
                dobStr: item.dobStr,
                address: item.address,
                provinceID: item.provinceID,
                districtID: item.districtID,
                sex: item.sex,
                role: item.role
            }
        }
    }

    componentDidMount() {
        this._getToken();
    }

    async _getToken() {
        var token = await AsyncStorage.getItem('token');

        this.setState({
            token: token
        });
        if (token != "" && token != null) {
            this.props.getUserInfo();
            this.props.getProvince();
        }
    }

    refresh() {
        this._getToken();
    }

    filterListDistrict = (proId) => {
        const { provinceState } = this.props
        var result = provinceState.data.listDistrict.filter(district => {
            return (district.provinceID == proId)
        })
        this.setState({
            ...this.state,
            districtName: result[0].districtName,
            payload: {
                ...this.state.payload,
                districtID: result[0].districtID,
            }


        })
    }

    _updateInfoUser = async payload => {
        await this.setState({
            ...this.state,
            isLoading: true,
        });
        try {
            const res = await API.updateUserInfo(payload);
            await this.setState(
                {
                    ...this.state,
                    isLoading: false,
                    error: null,
                },
                () => {
                    this.props.getUserInfo();
                    showMessages(I18n.t('notification'), I18n.t('update_info_success'));
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
                // () => showMessages(I18n.t('notification'), JSON.stringify(res.message))
            );
        }
    };


    render() {
        return (
            <View style={[theme.styles.containter]}>
                <GVHeader back title={I18n.t('update_info')} />
                <SafeAreaView style={{flex:1, backgroundColor:theme.colors.defaultBg}}>
                    {this.renderBody()}
                </SafeAreaView>
            </View>
        )
    }
    renderBody() {
        const { districState, provinceState, userState } = this.props;
        const { isLoading, error } = this.state;
        if (provinceState.isLoading && isLoading) return <Loading />;
        if (provinceState.error && this.state.token == null) return <RequsetLoginScreen />
        if (provinceState.error) return <Error onPress={() => this.refresh()} />
        return (
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : ""} enabled>
                <ScrollView style={styles.body}>
                    {this.renderTextField(this.state.payload.role==0 ? I18n.t('full_name') : I18n.t('agent_name'), this.state.payload.customerName, value => this.setState({
                        payload: {
                            ...this.state.payload,
                            customerName: value
                        }
                    }))}
                    {this.renderTextField(I18n.t('phone_number'), this.state.payload.phone, value => this.setState({
                        payload: {
                            ...this.state.payload,
                            phone: value
                        }
                    }))}
                    {this.renderTextField('Email', this.state.payload.email, value => this.setState({
                        payload: {
                            ...this.state.payload,
                            email: value
                        }
                    }))}
                    {/* {this.renderTextField(I18n.t('agent_name'), this.state.payload.full_name, value => this.setState({
                    payload: {
                        ...this.state.payload,
                        agent_name: value
                    }
                }))} */}
                    {this.state.payload.role==0 && this.renderTextFieldDOB()}
                    {this.state.payload.role==0 && this.renderGender()}
                    {this.renderProvince()}
                    {this.renderDistrict()}
                    {this.renderTextField(I18n.t('detail_address'), this.state.payload.address, value => this.setState({
                        payload: {
                            ...this.state.payload,
                            address: value
                        }
                    }))}

                    <PrimaryButton style={{ marginTop: 50 }} title={I18n.t('update')} action={() => {
                        this._updateInfoUser(this.state.payload)
                    }} />
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
    renderTextField(label, value, onChangeText) {
        return (
            <TextField
                tintColor={theme.colors.gray}
                containerStyle={{ width: '100%' }}
                labelTextStyle={[theme.fonts.regular16]}
                label={label}
                value={value}
                // baseColor={theme.colors.active}
                activeLineWidth={1}
                disabledLineWidth={1}
                lineWidth={1}
    
                // textColor={theme.colors.active}
                keyboardType={label == I18n.t('phone_number') ? "number-pad" : 'default'}
                onChangeText={onChangeText}
                editable={label==I18n.t('phone_number')  ? false : true}
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
    renderTextFieldDOB() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 17 }}>
                <Text style={[theme.fonts.regular16, { color: theme.colors.gray }]} >{I18n.t('date_of_birth')}</Text>
                <DatePicker
                    style={styles.InputDate}
                    date={this.state.payload.dobStr}
                    mode="date"
                    placeholder="select date"
                    format="DD/MM/YYYY"
                    minDate="11/11/1980"
                    maxDate={dateStr}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    androidMode="spinner"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 5,
                            top: 8,
                            marginLeft: 0,
                            marginRight: 15,
                            borderWidth: 0,
                            height: 25,
                            width: 25
                        },
                        dateInput: {
                            borderWidth: 0,

                        },
                        // ... You can check the source to find the other keys.
                    }}
                    onDateChange={date => {
                        this.setState({
                            payload: {
                                ...this.state.payload,
                                dobStr: date,
                            },
                        })
                    }}
                />
            </View>
        )
    }
    renderGender() {
        return (
            <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 10 }}>
                <Text style={[theme.fonts.regular16, { color: theme.colors.gray }]}>{I18n.t('gender')} :</Text>
                <RadioButton
                    value={this.state.payload.sex}
                    label={I18n.t('man')}
                    checked={this.state.payload.sex == 0 ? true : false}
                    onSelect={() =>
                        this.setState({
                            payload: {
                                ...this.state.payload,
                                sex: 0
                            }

                        })
                    }
                />
                <RadioButton
                    value={this.state.payload.sex}
                    label={I18n.t('woman')}
                    checked={this.state.payload.sex == 1 ? true : false}
                    onSelect={() =>
                        this.setState({
                            payload: {
                                ...this.state.payload,
                                sex: 1
                            }

                        })
                    }
                />
            </View>
        )
    }
    renderProvince() {
        return (
            <View style={styles.InputDropdown}>
                <Dropdown
                    containerStyle={{ paddingVertical: 0, marginTop: -25 }}
                    inputContainerStyle={{
                        borderBottomColor: 'transparent',
                    }}
                    label='Tỉnh/Thành phố'
                    data={this.props.provinceState.data.province}
                    value={this.state.provinceName}
                    labelExtractor={item => item.provinceName}
                    keyExtractor={item => item.provinceID}
                    onChangeText={async (value, index, data) => {
                        await this.setState({
                            payload: {
                                ...this.state.payload,
                                provinceID: data[index].provinceID,
                            },
                        }, () => this.filterListDistrict(data[index].provinceID));
                        await this.setState({
                            ...this.state,
                            provinceName: data[index].provinceName
                        });
                    }}
                />
            </View>
        )
    }
    renderDistrict() {
        return (
            <View style={styles.InputDropdown}>
                <Dropdown
                    itemCount={5}
                    containerStyle={{ paddingVertical: 0, marginTop: -25 }}
                    inputContainerStyle={{
                        borderBottomColor: 'transparent',
                    }}
                    label='Quận/Huyện'
                    data={this.props.provinceState.data.listDistrict.filter(
                        district => {
                            return (
                                district.provinceID == this.state.payload.provinceID
                            );
                        })}
                    value={this.state.districtName}
                    labelExtractor={item => item.districtName}
                    keyExtractor={item => item.districtID}
                    onChangeText={(value, index, data) => {
                        this.setState({
                            ...this.state,
                            districtName: data[index].districtName,
                            payload: {
                                ...this.state.payload,
                                districtID: data[index].districtID,
                            }
                        });

                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        paddingTop: 0,
        paddingHorizontal: 20,
        flexGrow:1
    },
    InputDate: {
        width: '70%',
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.gray
    },
    InputDropdown: {
        height: 42,
        paddingHorizontal: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.black,
        marginTop: 20,
        borderRadius: 8
    },
})

const mapStateToProps = (state) => ({
    provinceState: state.listProvinceReducer,
    userState: state.userReducer
});

const mapDispatchToProps = {
    getProvince,
    getUserInfo
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UpdateUserScreen);