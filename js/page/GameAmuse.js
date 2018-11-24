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
        this.gameNames = ['TOT游戏',]
        this.images = [
            require('../../res/images/totgame.png'),
        ];

        this.refreshView();

        // 紧紧为了触发render， 因为render无法主动调动,需要至少一个state来触发
        this.state = {render : false};
    }

    refreshView(){
        this.viewGames = this.gameDatas.map((e, index) => {return this.viewItem(index); }) 
    }

    componentWillUnmount(){
        DialogUtils.hideLoading();
    }   

    onStartGame(index){
        DialogUtils.showLoading('', true);
        Linking.canOpenURL('totgame1://').then(supported => {
            if (supported) {
                    Linking.openURL('totgame1://');
            } else {
                Linking.openURL('https://copy.im/a/dHguAc');
            } 
            DialogUtils.hideLoading();
        }).catch((error) => DialogUtils.hideLoading());
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
                <NavigationBar title = '游戏娱乐' navigation = {this.props.navigation}
                rightView={NavigationBar.getRightStyle_Text('指引', {
                    fontSize: 16,
                    color: "white"
                }, () => this.props.navigation.navigate('GameGuide'))}/>
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