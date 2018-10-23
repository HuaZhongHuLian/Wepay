import React, {Component} from 'react'
import {
    View,
    Text,
    StatusBar,
    RefreshControl,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    ScrollView

}from 'react-native'
import BaseComponent, { mainColor, upDataUserInfo } from './BaseComponent';
import NavigationBar from '../common/NavigationBar';
import { inject } from 'mobx-react';
import DialogUtils from '../util/DialogUtils';
import PassWordInput from '../common/PassNumInput';
import BaseUrl from '../util/BaseUrl';
import HttpUtils from '../util/HttpUtils';


const c_titles = ['余额兑金币', '金币兑余额', '绑定账号'];
const c_placeholders = ['请输入您要兑换的余额(100的倍数)', '请输入您要兑换的金币(100的倍数)', '请输入游戏账号'];
const c_descs = ['余额:金币 = 1:1000', '金币:余额= 1000:1', ''];
const c_btnTexts = ['兑换', '兑换', '绑定'];

// uptate AppStroe 用到
@inject('AppStore')
export default class GameExchange extends BaseComponent{
    constructor(props){
        super(props);
        const { gameId, exchangeIndex, amount, onBack } = this.props.navigation.state.params;
        // 0 余额兑金币 
        // 1 金币兑余额
        // 2 游戏绑定
        this.exchangeIndex = exchangeIndex;
        this.gameId = gameId;
        this.amount = parseInt(amount);
        this.onBack = onBack;
        this.title = c_titles[exchangeIndex];
        this.placeholder = c_placeholders[exchangeIndex];
        this.desc = c_descs[exchangeIndex];
        this.btnText = c_btnTexts[exchangeIndex];
        this.state = {
            amount : 0,
        };
        this.isNotBind = (exchangeIndex == 2);
        this.reg = this.isNotBind ? /[\u4e00-\u9fa5]/g : /[^\d]+/;
        console.log(c_titles[exchangeIndex] + this.amount);
    }

    componentDidMount(){
        if(this.isNotBind){  
            DialogUtils.showToast('请先绑定游戏账号');
        }
    }


    render(){
        return(
            <View style = {{flex : 1, backgroundColor : '#F1F1F1'}}>
                <NavigationBar title = {this.title} navigation = {this.props.navigation}/>
                <View style = {{backgroundColor : 'white', paddingHorizontal : 12, paddingVertical : 20}}>
                    <TextInput style = {{fontSize : 16, height : 50, borderColor : '#999', borderRadius : 5, borderWidth : 1, padding : 5}} 
                        placeholder = {this.placeholder}
                        placeholderTextColor = {'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType={'numeric'}
                        value={this.state.amount}
                        // textAlignVertical={'bottom'}
                        onChangeText={(n) => {
                            this.setState({ amount: n.replace(this.reg, '') });

                        }}
                    />
                    <Text style = {{color : '#999', marginVertical : 10}}>{this.desc}</Text>
                </View>
                <TouchableHighlight
                    style={{
                        width: '90%',
                        height: 40,
                        alignSelf: 'center',
                        backgroundColor: 'rgb(70, 180, 160)',
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 30,
                    }}
                    onPress={() => this.onClick(this.exchangeIndex)}>
                    <Text style={{ fontSize: 20, color: 'white', fontWeight: '900' }}>{this.btnText}</Text>
                </TouchableHighlight>
                {
                    this.exchangeType == 2 ? 
                    <View style = {{paddingLeft : 20}}>
                        <Text style = {{color : '#F73636'}}>兑换说明：</Text>
                        <Text style = {{color : '#F73636'}}>1.每个月只能兑换一次</Text>
                        <Text style = {{color : '#F73636'}}>2.兑换额度不超过1000000</Text>
                    </View> : null
                }
            </View>
        );
    }

    goBack(){
        this.onBack();
        this.props.navigation.goBack();
    }

    onClick(exchangeIndex){
        // alert(exchangeIndex);
        if(this.isNotBind){
            // alert(this.getUserInfo().sessionId + '   ' + this.gameId + '   ' + this.state.amount)
            DialogUtils.showLoading(''. true);
            HttpUtils.postData(BaseUrl.getGameBindingUrl(), {                
                sessionId: this.getUserInfo().sessionId,
                gameId: this.gameId,
                amount : this.state.amount,
            }).then(result => {
                DialogUtils.hideLoading();
                if (result.code == 1) {
                    DialogUtils.showMsg(result.msg || '绑定成功');
                    this.goBack();
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
        }else{
            if(this.state.amount < 100 || (this.state.amount % 100 != 0)){
                DialogUtils.showMsg('请输入100的倍数');
                return;
            }
            if(this.state.amount > this.amount){
                DialogUtils.showMsg(exchangeIndex == 0 ? '余额不足' : '金币不足');
                return;
            }
            if(exchangeIndex == 1 && this.state.amount > 1000000){
                DialogUtils.showMsg('输入数值不能超过1000000');
                return;
            }          
            PassWordInput.showPassWordInput((safetyPwd) => this.apply(safetyPwd));
        }
    }


    apply(safetyPwd) {
        DialogUtils.showLoading(''. true);
        let url = (this.exchangeIndex == 0) ? BaseUrl.getGameBalanceForGoldUrl() : BaseUrl.getGameGoldForBalanceUrl();
        HttpUtils.postData(url, {                
            sessionId: this.getUserInfo().sessionId,
            gameId: this.gameId,
            num : this.state.amount,
            safetyPwd: safetyPwd,
        }).then(result => {
            DialogUtils.hideLoading();
            if (result.code == 1) {
                DialogUtils.showMsg(result.msg || '兑换成功');
                upDataUserInfo(this.props.AppStore);
                this.goBack();
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