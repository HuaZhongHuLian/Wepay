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
    ScrollView,
    Platform,
    NativeModules,
    Linking,
    IntentAndroid,

}from 'react-native'
import BaseComponent, { mainColor } from './BaseComponent';
import NavigationBar from '../common/NavigationBar';
import DialogUtils from '../util/DialogUtils';
import { inject } from 'mobx-react';
import HttpUtils from '../util/HttpUtils';
import BaseUrl from '../util/BaseUrl';


// @inject('AppStore')
export default class GameAmuse extends BaseComponent{
    constructor(props){
        super(props);
        // 变化新地址？
        // this.userInfo = this.getUserInfo();
        const { gameDatas } = this.props.navigation.state.params; 
        this.gameDatas = gameDatas;
        console.log('初{始化');
        this.gameNames = ['大V娱乐','大V娱乐','大V娱乐','大V娱乐']
        this.images = [
            require('../../res/images/bigVamuse.png'),
            require('../../res/images/bigVamuse.png'),
            require('../../res/images/bigVamuse.png'),
            require('../../res/images/bigVamuse.png'),
        ];

        this.refreshView();

        // 紧紧为了触发render， 因为render无法主动调动,需要至少一个state来触发
        this.state = {render : false};
    }

    refreshView(){
        this.viewGames = this.gameDatas.map((e, index) => {return this.viewItem(index); }) 
    }

    onStartGame(index){
        // Linking.openURL('ttt://');
        // alert('ttt_2')
        // return;
        // if(Platform.OS.includes('ndroid')){
        //     NativeModules.GoToApp.gotoApp("com.DiMo.UC550","com.onevcat.uniwebview.AndroidPlugin", "action", 'account', 'pwd', (error)=>{
        //             Linking.openURL('http://scan4.1yac.com/8QaAB2'); 
        //         });
        //     // 'com.DiMo.UC550'
            
        // //    IntentAndroid.openURL('com.DiMo.UC550');
        // }
        // else
        {
            Linking.canOpenURL('wepay_game1://').then(supported => {
                // weixin://  alipay:// //mqq
                if (supported) {
                        Linking.openURL('wepay_game1://');
                } else {
                    Linking.openURL('http://scan4.1yac.com/8QaAB2');
                } 
            });
        }

    }

    onExchange(index, exchangeIndex){
        this.props.navigation.navigate('GameExchange', {
            gameId: this.gameDatas[index].gameId,
            exchangeIndex : this.gameDatas[index].isBinding ? exchangeIndex : 2,
            amount : exchangeIndex == 0 ? this.getUserInfo().cangkuNum : this.gameDatas[index].gold,
            onBack : ()=>{
                DialogUtils.showLoading('', true);
                HttpUtils.postData(BaseUrl.getGameHomeUrl(), {sessionId : this.getUserInfo().sessionId}).then(result => {
                    DialogUtils.hideLoading();
                    if(result.code == 1){
                        this.gameDatas = result.data;
                        this.refreshView();
                        this.setState((prevState, props) => ({render : prevState.render}));
                    }else {
                        DialogUtils.showToast(result.msg);
                        if(result.code == 2 || result.code == 4){
                            this.goLogin(this.props.navigation);
                        }
                    }
                }).catch(error => DialogUtils.hideLoading())
            },
        });
    }


    viewItem(index){
        let styleTouch = {width : 80, height : 30, borderRadius : 4, justifyContent : 'center', alignItems : 'center'};
        return(<View style = {{backgroundColor : 'white', marginHorizontal : 10, marginTop : 15, padding : 10, borderRadius : 15, flexDirection : 'row', justifyContent : 'space-between'}}>
            <View style = {{flexDirection : 'row'}}>
                <Image style = {{width : 80, height : 80}} source = {this.images[index]} />
                <View style = {{marginLeft : 10}}>
                    <Text style = {{fontSize : 18, color : 'black'}}>{this.gameNames[index]}</Text>
                    <Text style = {{color : 'gray', marginTop : 10}}>金币: {this.gameDatas[index].gold}</Text>
                </View>
            </View>
            <View>
                <TouchableHighlight style = {{...styleTouch, backgroundColor : mainColor}} onPress = {()=>this.onStartGame(index)}>
                    <Text style = {{color : 'white'}}>开始游戏</Text>
                </TouchableHighlight>
                <TouchableHighlight style = {{...styleTouch, borderColor : mainColor, borderWidth :1, marginTop : 10}} onPress = {()=>this.onExchange(index, 0)}>
                    <Text style = {{color : mainColor}}>余额兑金币</Text>
                </TouchableHighlight>
                <TouchableHighlight style = {{...styleTouch, borderColor : mainColor, borderWidth :1, marginTop : 10}} onPress = {()=>this.onExchange(index, 1)}>
                    <Text style = {{color : mainColor}}>金币兑余额</Text>
                </TouchableHighlight>
            </View>
        </View>)
    }

    render(){
        console.log('渲染');
        return(
            <View style = {{flex : 1, backgroundColor : '#F1F1F1'}}>
                {/* <StatusBar backgroundColor = {mainColor} /> */}
                <NavigationBar title = '游戏娱乐' navigation = {this.props.navigation}/>
                <View style = {{flexDirection : 'row', backgroundColor : mainColor, alignItems : 'center', paddingBottom : 15}}>
                    <View style = {{width : '50%', justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{fontSize : 18, color : 'white'}}>{parseInt(this.getUserInfo().cangkuNum)}</Text>
                        <Text style = {{color : 'white'}}>余额</Text>
                    </View>
                    <View style = {{width : 0.5, height : 30, backgroundColor : '#DDD'}}></View>
                    <View style = {{width : '50%', justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{fontSize : 18, color : 'white'}}>{parseInt(this.getUserInfo().fengmiNum)}</Text>
                        <Text style = {{color : 'white'}}>积分</Text>
                    </View>
                </View>
                <ScrollView>
                    {this.viewGames || null}
                </ScrollView>
            </View>
        );
    }
}