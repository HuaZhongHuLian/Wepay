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


@inject('AppStore')
export default class GameExchange extends BaseComponent{
    constructor(props){
        super(props);
        const { exchangeType } = this.props.navigation.state.params;
        this.exchangeType = exchangeType;
        this.state = {
            remain : 0,
        };
    }


    render(){
        return(
            <View style = {{flex : 1, backgroundColor : '#F1F1F1'}}>
                <NavigationBar title = {this.exchangeType == 0 ? '余额兑金币' : '金币兑余额'} navigation = {this.props.navigation}/>
                <View style = {{backgroundColor : 'white', paddingHorizontal : 12, paddingVertical : 20}}>
                    <TextInput style = {{fontSize : 16, height : 50, borderColor : '#999', borderRadius : 5, borderWidth : 1, padding : 5}} 
                        placeholder = {'请输入您要兑换的' + (this.exchangeType == 0 ? '余额' : '金币') + '数量'}
                        placeholderTextColor = {'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType={'numeric'}
                        value={this.state.remain}
                        // textAlignVertical={'bottom'}
                        onChangeText={(n) => this.setState({ remain: n.replace(/[^\d]+/, '') })}
                    />
                    <Text style = {{color : '#999', marginVertical : 10}}>{this.exchangeType == 0 ? '余额:金币 = 1:100' : '金币:余额= 100:1'}</Text>
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
                    onPress={() => this.onClick(this.exchangeType)}>
                    <Text style={{ fontSize: 20, color: 'white', fontWeight: '900' }}>兑换</Text>
                </TouchableHighlight>
                {
                    this.exchangeType == 0 ? null : 
                    <View style = {{paddingLeft : 20}}>
                        <Text style = {{color : '#F73636'}}>兑换说明：</Text>
                        <Text style = {{color : '#F73636'}}>1.每个月只能兑换一次</Text>
                        <Text style = {{color : '#F73636'}}>2.兑换额度不超过100000</Text>
                    </View>
                }
            </View>
        );
    }


    onClick(exchangeType){
        alert(exchangeType);
        upDataUserInfo(this.props.AppStore);
        this.props.navigation.goBack();
    }
}