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
import ZhongChouBuy from "../page/number/ZhongChouBuy"

const c_rate = 1000;
const c_integer = 100;
const c_integer4 = 50;
const c_titles = ['余额兑金币', '金币兑余额', '绑定账号', "绑定钱包", "换币"];
const c_placeholders = [
    '请输入用于兑换的余额(' + c_integer + '的倍数)', 
    '请输入您要兑回的余额(' + c_integer + '的倍数)', 
    '请输入游戏账号',
    "请输入钱包地址",
    "请输入换币数量("+ c_integer4 + "的倍数)",
];
const c_descs = ['余额:金币 = 1:' + c_rate, '金币:余额= ' + c_rate + ':1', '', "", ""];
const c_btnTexts = ['兑换', '兑回', '绑定', "绑定", "确定"];

class MyTextInput extends Component {
    shouldComponentUpdate(nextProps) {
      const { value, defaultValue } = this.props;
      return Platform.OS !== 'ios'
      || (value === nextProps.value && !nextProps.defaultValue)
      || (defaultValue === nextProps.defaultValue && !nextProps.value);
    }
  
    render() {
      return <TextInput {...this.props} />;
    }
}
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
            amount : "",
            // 为了输入框强制更新
            flag : 0,
        };
        this.isNotBind = (exchangeIndex == 2);
        this.reg = this.isNotBind ? /[^\a-\z\A-\Z0-9]/g : /[^\d]/g;
        console.log(c_titles[exchangeIndex] + this.amount);
    }

    componentDidMount(){
        if(this.isNotBind){  
            DialogUtils.showToast('请先绑定游戏账号');
        } else if(this.exchangeIndex == 3){
            DialogUtils.showToast('请先绑定钱包地址');
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
                        keyboardType={this.isNotBind ? "default" : 'numeric'}
                        value={this.state.amount}
                        // textAlignVertical={'bottom'}
                        onChangeText={(n) => {
                            let str = n;
                            if(this.exchangeIndex != 3){
                                // 输入框里的内容
                                console.log(n);
                                str = str.replace(this.reg, '')
                                console.log(str);
                                console.log(this.state.amount);
                            }
                            this.setState({ 
                                amount: str,
                                flag: ++ZhongChouBuy.s_flag,
                             });
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
                    this.exchangeIndex == 1 ? 
                    <View style = {{paddingLeft : 20}}>
                        <Text style = {{color : '#F73636'}}>兑换说明：</Text>
                        <Text style = {{color : '#F73636'}}>1.每天有兑换限额</Text>
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
        }else if(exchangeIndex == 0 || exchangeIndex == 1){
            if(this.state.amount.length < 1){
                DialogUtils.showMsg('请输入' + c_integer + '的倍数');
                return;
            }
            let number = parseInt(this.state.amount);
            if(number < c_integer || (number % c_integer != 0)){
                DialogUtils.showMsg('请输入' + c_integer + '的倍数');
                return;
            }
            if(number > this.amount){
                DialogUtils.showMsg(exchangeIndex == 0 ? '余额不足' : '金币不足');
                return;
            }
            if(exchangeIndex == 1 && number * c_rate > this.amount){
                DialogUtils.showMsg('金币不足');
                return;
            }      
            if(exchangeIndex == 1 && number * c_rate == this.amount){
                DialogUtils.showMsg('不能兑完所有金币');
                return;
            }                
            PassWordInput.showPassWordInput((safetyPwd) => this.apply(safetyPwd));
        } else if(exchangeIndex == 3){
            if(this.state.amount.length < 1){
                DialogUtils.showMsg('请输入有效的地址');
                return;
            }
            HttpUtils.postData(BaseUrl.geturl() + "/carryCoin/addCoinAddress", {                
                sessionId: this.getUserInfo().sessionId,
                address: this.state.amount,
            }).then(result => {
                DialogUtils.hideLoading();
                if (result.code == 1) {
                    DialogUtils.showMsg(result.msg || "添加地址成功");
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
        else if (exchangeIndex == 4){
            console.log(this.state.amount);
            if(this.state.amount.length < 1){
                DialogUtils.showMsg('请输入有效数值');
                return;
            }
            // if (!(/(^[1-9]\d*$)/.test(this.state.amount))) { 
            //     DialogUtils.showMsg('请输入有效数值');
            //     return;
            // }

            let number = parseInt(this.state.amount);
            if(number < c_integer4 || (number % c_integer4 != 0)){
                DialogUtils.showMsg('请输入' + c_integer4 + '的倍数');
                return;
            }
            if(number > this.amount){
                DialogUtils.showMsg('货币不足');
                return;
            }           
            PassWordInput.showPassWordInput((safetyPwd) => this.apply(safetyPwd));           
        }
    }


    apply(safetyPwd) {
        if(this.exchangeIndex == 4){
            DialogUtils.showLoading(''. true);
            HttpUtils.postData(BaseUrl.geturl() + "/carryCoin/addCarryCoin", {                
                sessionId: this.getUserInfo().sessionId,
                count : parseInt(this.state.amount),
                safetyPwd: safetyPwd,
            }).then(result => {
                DialogUtils.hideLoading();
                if (result.code == 1) {
                    DialogUtils.showMsg(result.msg || '提交成功,等待审核');
                    this.goBack();
                } else {
                    DialogUtils.showToast(result.msg);
                    if(result.code == 2 || result.code == 4){
                        this.goLogin(this.props.navigation);
                    }
                }
            }).catch(error => {
                DialogUtils.hideLoading()
            });
            return;
        }
        DialogUtils.showLoading(''. true);
        let url = (this.exchangeIndex == 0) ? BaseUrl.getGameBalanceForGoldUrl() : BaseUrl.getGameGoldForBalanceUrl();
        HttpUtils.postData(url, {                
            sessionId: this.getUserInfo().sessionId,
            gameId: this.gameId,
            num : parseInt(this.state.amount),
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
            DialogUtils.hideLoading()
        });
    }
}