import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native'
import BaseComponent from './BaseComponent';
import CheckMoney from '../common/CheckMoney';
import NavigationBar from '../common/NavigationBar';
import Utils from '../util/Utils';
import DialogUtils from '../util/DialogUtils';
import { inject } from 'mobx-react';
import BaseUrl from '../util/BaseUrl';
import HttpUtils from '../util/HttpUtils';
import PassWordInput from '../common/PassNumInput';

const amounts = [1000];
@inject('AppStore')
export default class PhoneBill extends BaseComponent {

    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo();
        this.state = {
            hadCard: true,
            cardid: '',
            // amount: '',
            address: '',
            addressId: '',
            addressName: '',
            addressPhone: '',
        }
        this.amount = amounts[0];
    }

    onStateSwitch(b) {
        this.setState({ hadCard: b });
    }


    /**
     * 选择收货地址
     */
    onAddess() {
        this.props.navigation.navigate('AddressList', {
            selectAddess: (addressData) => {
                this.setState({
                    addressId: addressData.addressId,
                    addressName: addressData.name,
                    addressPhone: addressData.telephone,
                    address: addressData.provinceId + addressData.cityId + addressData.countryId + addressData.address,
                })
            }
        })
    }

    ViewAddress(style) {
        return <TouchableOpacity onPress={() => this.onAddess()}>
            <View style={style}>
                {
                    this.state.address.length < 1 ?
                        <Text style={{ color: '#333', fontSize: 16, flex: 1 }}>请选择收货地址</Text> :
                        <View style={{ flex: 1, }} >
                            <Text style={{ color: '#333', fontSize: 16, }}>收货人: {this.state.addressName}      {this.state.addressPhone}</Text>
                            <Text style={{ color: '#555', fontSize: 14, marginTop: 8, }}>收货地址: {this.state.address} </Text>
                        </View>
                }
                <Image style={{ width: 25, height: 25 }} source={require("../../res/images/ic_tiaozhuan.png")} />
            </View>
        </TouchableOpacity>
    }

    render() {
        let marLeft = 12;
        let marTop = 20;
        let ima = (isSelected) => isSelected ? require('../../res/images/xuanze.png') : require('../../res/images/weixuanze.png');

        return (
            <View style={{ flex: 1, backgroundColor: '#F1F1F1' }}>
                <NavigationBar title='余额加油' navigation={this.props.navigation} />
                <View style={{ backgroundColor: '#FFF', paddingLeft: marLeft, paddingVertical: marTop, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color : 'black'}}>是否有加油卡：</Text>
                    <TouchableOpacity style={styles.touch} onPress={() => this.onStateSwitch(true)}>
                        <Image source={ima(this.state.hadCard)} />
                        <Text style={styles.touchFont}>有</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touch} onPress={() => this.onStateSwitch(false)}>
                        <Image source={ima(!this.state.hadCard)} />
                        <Text style={styles.touchFont}>没有</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: '#FFF', paddingHorizontal: marLeft, marginTop: 1 }}>
                    {
                        this.state.hadCard ?
                            <TextInput style={[styles.input, { marginTop : marTop}]}
                                placeholder={'请输入加油卡号'}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid='transparent'
                                keyboardType={'numeric'}
                                value={this.state.cardid}
                                textAlignVertical={'bottom'}
                                onChangeText={(n) => this.setState({ cardid: n.replace(/[^\d]+/, '') })}
                            /> :
                            this.ViewAddress({ flexDirection: 'row', marginVertical: marTop })
                    }
                    {/* <View style={{ flexDirection: 'row', alignItems:"center", marginTop: marTop}}>
                        <TextInput style={{ ...styleInput, width: Utils.getWidth() / 2}}
                            placeholder={'请输入加油金额'}
                            placeholderTextColor={'#999'}
                            underlineColorAndroid='transparent'
                            keyboardType={'numeric'}
                            value={this.state.amount}
                            maxLength = {4}
                            onChangeText={(n) => this.setState({ amount: n.replace(/[^\d]+/, '') })}
                        />
                        <Text style={{ fontSize: 16, color : 'black', marginLeft: marLeft}}>元</Text>
                    </View>
                    <Text style={{ 
                        fontSize: 20, color: 'white', fontWeight: '900',
                        width: 120,
                        height: 50,
                        textAlign : 'center',
                        textAlignVertical : 'center',
                        backgroundColor: '#48B1A3',
                        borderRadius: 4,
                        marginTop: marTop,    
                    }}>
                        1000元
                    </Text> */}
                    <CheckMoney 
                        viewStyle = {{marginLeft : -marLeft, paddingLeft : 0}}
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

                    <Text style={{fontSize : 15, marginLeft : 5, marginTop: marTop, marginBottom: marTop * 2 }}>
                        {this.state.hadCard ? '确认后将从余额扣除' : '加油卡工本费30元，确认后将一起从余额扣除，卡将按您输入的地址快递过去给您。'}
                    </Text>
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
                        marginVertical: marTop + 10,
                    }}
                    onPress={() => this.onClick()}>
                    <Text style={{ fontSize: 20, color: 'white', fontWeight: '900' }}>确认</Text>
                </TouchableOpacity>

                <Text style = {styles.desc}>加油说明：</Text>
                <Text style = {styles.desc}>1.只针对自己的ID号，不能为别人代充</Text>
                <Text style = {styles.desc}>2.每个ID号每个月最多只能充值1000元油卡</Text>
                <Text style = {styles.desc}>3.到油时间为1-3个工作日内，自己负责去油站圈存</Text>
            </View>
        );
    }

    onClick() {
        if (this.state.hadCard) {
            if(this.state.cardid.length < 10 || this.state.cardid.length > 27){
                DialogUtils.showMsg('请输入有效的加油卡号');
                return;
            }
            // alert(JSON.stringify([this.state.cardid, this.amount]));
        } else if(this.state.address.length < 1 || this.state.addressPhone.length < 1 ||  this.state.addressName.length < 1){
                DialogUtils.showMsg('请选择收货地址');
                return;
        }   
        
        // alert(this.amount);
        if(this.amount > this.props.AppStore.userInfo.cangkuNum){
            DialogUtils.showMsg('余额不足');
            return;
        }
        // alert(JSON.stringify([this.state.addressId, this.state.addressName, this.state.addressPhone, this.state.address]));
        PassWordInput.showPassWordInput((safetyPwd) => this.apply(safetyPwd));

    }


    apply(safetyPwd) {
        DialogUtils.showLoading(''. true);
        let url = BaseUrl.getFuelUpApplyUrl()
        let postPartDatas = {                
            sessionId: this.userInfo.sessionId,
            amount: this.amount,
            safetyPwd: safetyPwd,
        };
        let postData = this.state.hadCard ? {...postPartDatas, oilCard: this.state.cardid, haveCard: 1} : {...postPartDatas, addressId: this.state.addressId, haveCard: 0}
        // alert(JSON.stringify(postData));
        HttpUtils.postData(url,postData).then(result => {
        DialogUtils.hideLoading();
            if (result.code == 1) {
                DialogUtils.showMsg(this.state.hadCard ? "加油成功, 请耐心等待审核" : "申请成功, 请耐心等待", "知道了", () => {
                this.props.navigation.goBack()});
                upDataUserInfo(this.props.AppStore);14
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

const styles = StyleSheet.create({
    touch : { flexDirection: 'row', marginHorizontal: 15, alignItems: 'center' },
    touchFont : { fontSize: 16, color : 'black', marginHorizontal: 15 },
    input : { fontSize: 16, backgroundColor: '#F8F8F8', borderColor: '#F1F1F1', borderWidth: 1, borderRadius: 4, paddingTop :10, paddingLeft : 5},
    desc : {marginHorizontal : 20, color : 'rgb(245, 95, 95)'}
});