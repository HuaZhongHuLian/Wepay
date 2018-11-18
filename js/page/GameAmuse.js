import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView,
    Linking,
}from 'react-native'
import BaseComponent, { mainColor } from './BaseComponent';
import NavigationBar from '../common/NavigationBar';
import DialogUtils from '../util/DialogUtils';
import { inject } from 'mobx-react';
import HttpUtils from '../util/HttpUtils';
import BaseUrl from '../util/BaseUrl';
import {Label, Overlay} from "teaset"
import ZhongChouRecord from "../page/number/ZhongChouRecord"


// @inject('AppStore')
export default class GameAmuse extends BaseComponent{
    constructor(props){
        super(props);
        // 变化新地址？
        // this.userInfo = this.getUserInfo();
        const { gameDatas, amuse_mining } = this.props.navigation.state.params; 
        this.gameDatas = gameDatas;
        this.amuse_mining = amuse_mining;
        console.log('初{始化');
        this.gameNames = [['大V娱乐',], ['大卫金矿',]][amuse_mining];
        this.images = [[
            require('../../res/images/bigVamuse.png'),
        ],[
            require('../../res/images/dav.png'),          
        ]][amuse_mining];

        this.btnStrings = [['开始游戏','余额兑金币','金币兑余额'], ['下载游戏','下载钱包','  换币  ']][amuse_mining];
        this.titleString = ["游戏娱乐", "大卫金矿"][amuse_mining];
        this.rightString = ["指引", "换币记录"][amuse_mining];
        this.rightNavigate = ["GameGuide", "GameMining"][amuse_mining];
        this.btnRefs = [[null, null, null],];
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

    showPopover(btn, text){
        let popoverStyle = {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 12,
        };
        btn.measure((x, y, width, height, pageX, pageY) => {
            let fromBounds = {x: pageX, y: pageY, width, height};
            let overlayView = (
            <Overlay.PopoverView
                popoverStyle={popoverStyle} 
                fromBounds={fromBounds} 
                direction={"left"} 
                align={"end"} 
                directionInsets={4} 
                showArrow={true}>
                <Label style={{color: "white"}} size='lg' text={text} />
            </Overlay.PopoverView>
            );
            Overlay.show(overlayView);
        });
    }

    getCurrency(){
        DialogUtils.showLoading('', true);
        HttpUtils.getData(BaseUrl.numberIndex(this.getUserInfo().sessionId)).then(result => {
            DialogUtils.hideLoading();
            if(result.code == 1){
                this.gameDatas[0].num = result.data.num;
                this.setState((prevState, props) => ({render : !prevState.render}));
            }else {
                DialogUtils.showToast(result.msg);
                if(result.code == 2 || result.code == 4){
                    this.goLogin(this.props.navigation);
                }
            }
        }).catch(error => DialogUtils.hideLoading())
    }

    onStartGame(index){
        if(this.amuse_mining == 1){
            Linking.openURL('https://fir.im/wep');
            return;
        }
        DialogUtils.showLoading('', true);
        Linking.canOpenURL('wepaygame1://').then(supported => {
            if (supported) {
                    Linking.openURL('wepaygame1://');
            } else {
                Linking.openURL('http://scan.1yac.com/8QaAB2');
            } 
            DialogUtils.hideLoading();
        }).catch((error) => DialogUtils.hideLoading());
    }

    onExchange(index, exchange_0_1){
        // 3 绑定钱包
        // 4 换币
        if(this.amuse_mining == 1){
            if(exchange_0_1 == 0){
                Linking.openURL("https://token.im/");
            }else if(exchange_0_1 == 1){
                DialogUtils.showLoading('', true);
                HttpUtils.getData(BaseUrl.geturl() + "/carryCoin/isCarryCoin?sessionId=" + this.getUserInfo().sessionId).then(result => {
                    DialogUtils.hideLoading();
                    if(result.code == 1){
                        this.props.navigation.navigate('GameExchange', {
                            gameId: 0,
                            exchangeIndex : result.data + 3,
                            amount : this.gameDatas[0].num,
                            onBack : ()=>{
                                this.getCurrency();
                            },
                        });
                    }else {
                        DialogUtils.showToast(result.msg);
                        if(result.code == 2 || result.code == 4){
                            this.goLogin(this.props.navigation);
                        }
                    }
                }).catch(error => DialogUtils.hideLoading())
            }
            return;
        }

        // 0 余额兑金币
        // 1 金币兑余额
        // 2 绑定
        this.props.navigation.navigate('GameExchange', {
            gameId: this.gameDatas[index].gameId,
            exchangeIndex : this.gameDatas[index].isBinding ? exchange_0_1 : 2,
            amount : exchange_0_1 == 0 ? this.getUserInfo().cangkuNum : this.gameDatas[index].gold,
            onBack : ()=>{
                DialogUtils.showLoading('', true);
                HttpUtils.postData(BaseUrl.getGameHomeUrl(), {sessionId : this.getUserInfo().sessionId}).then(result => {
                    DialogUtils.hideLoading();
                    if(result.code == 1){
                        this.gameDatas = result.data;
                        this.refreshView();
                        this.setState((prevState, props) => ({render : !prevState.render}));
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
        return(<View key = {index} style = {{backgroundColor : 'white', marginHorizontal : 10, marginTop : 15, padding : 10, borderRadius : 15, flexDirection : 'row', justifyContent : 'space-between'}}>
            <View style = {{flexDirection : 'row'}}>
                <Image style = {{width : 80, height : 80}} source = {this.images[index]} />
                <View style = {{marginLeft : 10}}>
                    <Text style = {{fontSize : 18, color : 'black'}}>{this.gameNames[index]}</Text>
                    {this.amuse_mining == 0 ? <Text style = {{color : 'gray', marginTop : 10}}>金币: {this.gameDatas[index].gold}</Text> : null}
                </View>
            </View>  
            <View>
                <TouchableHighlight ref = {r=>this.btnRefs[index][0] = r} style = {{...styleTouch, backgroundColor : mainColor}} onPress = {()=>this.onStartGame(index)}>
                    <Text style = {{color : 'white'}}>{this.btnStrings[0]}</Text>
                </TouchableHighlight>
                <TouchableHighlight ref = {r=>this.btnRefs[index][1] = r} style = {{...styleTouch, borderColor : mainColor, borderWidth :1, marginTop : 10}} onPress = {()=>this.onExchange(index, 0)}>
                    <Text style = {{color : mainColor}}>{this.btnStrings[1]}</Text>
                </TouchableHighlight>
                <TouchableHighlight ref = {r=>this.btnRefs[index][2] = r} style = {{...styleTouch, borderColor : mainColor, borderWidth :1, marginTop : 10}} onPress = {()=>this.onExchange(index, 1)}>
                    <Text style = {{color : mainColor}}>{this.btnStrings[2]}</Text>
                </TouchableHighlight>
            </View>
        </View>)
    }

    render(){
        console.log('渲染');
        return(
            <View style = {{flex : 1, backgroundColor : '#F1F1F1'}}>
                {/* <StatusBar backgroundColor = {mainColor} /> */}
                <NavigationBar title = {this.titleString} navigation = {this.props.navigation}
                rightView={NavigationBar.getRightStyle_Text(this.rightString, {
                    fontSize: 16,
                    color: (this.amuse_mining == 0) ? "red" : "white"
                }, () => this.props.navigation.navigate(this.rightNavigate))}/>
                {(this.amuse_mining == 0) ? 
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
                </View> : 
                <View style = {{backgroundColor : mainColor, alignItems : 'center', paddingBottom : 15}}>
                    <View style = {{width : '50%', justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{fontSize : 18, color : 'white'}}>{this.gameDatas[0].num}</Text>
                        <Text style = {{color : 'white'}}>{ZhongChouRecord.CurrencyNames[0]}</Text>
                    </View>
                </View>}
                <ScrollView>
                    {this.viewGames || null}
                </ScrollView>
            </View>
        );
    }
}