import React, {Component} from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
}from 'react-native'
import BaseComponent, {upDataUserInfo} from './BaseComponent';
import CheckMoney from '../common/CheckMoney';
import NavigationBar from '../common/NavigationBar';
import Utils from '../util/Utils';
import BaseUrl from '../util/BaseUrl';
import HttpUtils from '../util/HttpUtils';
import PassWordInput from '../common/PassNumInput';
import DialogUtils from '../util/DialogUtils';
import { inject } from 'mobx-react';


const amounts = [100, 200];
@inject('AppStore')
export default class PhoneBill extends BaseComponent {

    constructor(props){
        super(props);
        this.userInfo = this.getUserInfo();
        this.amount = amounts[0];
        this.state = {
            phone : '',
        };
    }


    render(){
        let marLeft = 15;
        let marTop = 20;
        return (
            <View  style = {{flex : 1, backgroundColor : '#F1F1F1'}}>
                <NavigationBar title='话费充值' navigation={this.props.navigation} />
                <View style = {{backgroundColor : '#FFF', paddingLeft : marLeft, paddingTop : marTop}}>
                    <TextInput style={{ fontSize: 16 }}
                        placeholder={'请输入手机号码'}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType={'numeric'}
                        value={this.state.phone}
                        onChangeText={(n) => this.setState({phone : n.replace(/[^\d]+/, '')})}
                    /> 
                </View>
                <View style = {{backgroundColor : '#FFF', marginTop : 1, marginLeft : -5}}>
                    <CheckMoney
                        selectWidth = {120}
                        selectHeight = {50}
                        unselectedColor = {'#AAA'}
                        fontStyle = {{fontSize :20, fontWeight :'900'}}
                        fontDesc = {(t)=>{return (t + '元')}}
                        arrText={amounts}
                        onSelected={(index, value) => this.amount = value}
                        seleIndex = {0}
                        selectedValue = {amounts[0]}
                    />
                </View>
                <TouchableOpacity
                    style={{
                        width: Utils.getWidth() * 0.9,
                        height: 50,
                        alignSelf: 'center',
                        backgroundColor: 'rgb(70, 180, 160)',
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 30,
                    }}
                    onPress={() => this.onClick()}>
                    <Text style={{ fontSize: 20, color: 'white', fontWeight: '900' }}>确认</Text>
                </TouchableOpacity>                
            </View>
        );
    }


    onClick(){

       
        if(this.state.phone.length < 7){
            DialogUtils.showMsg('请输入手机号码');
            return;
        }
        // alert(this.amount);
        if(this.amount > this.props.AppStore.userInfo.cangkuNum){
            DialogUtils.showMsg('余额不足');
            return;
        }

        // alert(JSON.stringify([this.state.phone, this.amount]));
        PassWordInput.showPassWordInput((safetyPwd) => this.apply(safetyPwd));
    }


    apply(safetyPwd) {
        DialogUtils.showLoading("",true);
        let url = BaseUrl.getPhoneBillApplyUrl()
        HttpUtils.postData(url,
            {
                sessionId: this.userInfo.sessionId,
                amount: this.amount,
                safetyPwd: safetyPwd,
                phone: this.state.phone,
            }).then(result => {
                DialogUtils.hideLoading();
                if (result.code == 1) {
                    DialogUtils.showMsg("充值成功, 请耐心等待审核", "知道了", () => {
                    this.props.navigation.goBack()});
                    upDataUserInfo(this.props.AppStore);
                } else {
                    DialogUtils.showToast(result.msg);
                    if(result.code == 2 || result.code == 4){
                        this.goLogin(this.props.navigation);
                    }
                }
            }).catch(error => {
                // reject(error);
                // this.errorMsg(error)
                DialogUtils.hideLoading()
            });
    }
}