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
import BaseComponent, { mainColor } from './BaseComponent';
import NavigationBar from '../common/NavigationBar';



export default class GameAmuse extends BaseComponent{
    constructor(props){
        super(props);

        this.state = {
            remain : 0,
            score : 0,
        };

        this.userInfo = this.getUserInfo();
    }

    onStartGame(index){
        alert('开始游戏: ' + index);
    }

    onRemain2Gold(index){
        this.props.navigation.navigate('GameExchange', {exchangeType : 0});
    }

    onGold2Remain(index){
        this.props.navigation.navigate('GameExchange', {exchangeType : 1});
    }



    viewItem(index, gameName, gameScore){
        let styleTouch = {width : 80, height : 30, borderRadius : 4, justifyContent : 'center', alignItems : 'center'};
        return(<View style = {{backgroundColor : 'white', marginHorizontal : 15, marginTop : 15, padding : 15, borderRadius : 15, flexDirection : 'row', justifyContent : 'space-between'}}>
            <View style = {{flexDirection : 'row'}}>
                {/* <Image style = {{width :50, height : 50}} /> */}
                <View style = {{width : 60, height : 60, borderWidth : 1}}/>
                <View style = {{marginLeft : 10}}>
                    <Text style = {{fontSize : 18, color : 'black'}}>{gameName}</Text>
                    <Text style = {{color : 'gray', marginTop : 10}}>我的金币: {gameScore}</Text>
                </View>
            </View>
            <View>
                <TouchableHighlight style = {{...styleTouch, backgroundColor : mainColor}} onPress = {()=>this.onStartGame(index)}>
                    <Text style = {{color : 'white'}}>开始游戏</Text>
                </TouchableHighlight>
                <TouchableHighlight style = {{...styleTouch, borderColor : mainColor, borderWidth :1, marginTop : 10}} onPress = {()=>this.onRemain2Gold(index)}>
                    <Text style = {{color : mainColor}}>余额兑金币</Text>
                </TouchableHighlight>
                <TouchableHighlight style = {{...styleTouch, borderColor : mainColor, borderWidth :1, marginTop : 10}} onPress = {()=>this.onGold2Remain(index)}>
                    <Text style = {{color : mainColor}}>金币兑余额</Text>
                </TouchableHighlight>
            </View>
        </View>)
    }

    render(){
        return(
            <View style = {{flex : 1, backgroundColor : '#F1F1F1'}}>
                {/* <StatusBar backgroundColor = {mainColor} /> */}
                <NavigationBar title = '游戏娱乐' navigation = {this.props.navigation}/>
                <View style = {{flexDirection : 'row', backgroundColor : mainColor, alignItems : 'center', paddingBottom : 15}}>
                    <View style = {{width : '50%', justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{fontSize : 18, color : 'white'}}>{parseInt(this.userInfo.cangkuNum)}</Text>
                        <Text style = {{color : 'white'}}>余额</Text>
                    </View>
                    <View style = {{width : 0.5, height : 30, backgroundColor : '#DDD'}}></View>
                    <View style = {{width : '50%', justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{fontSize : 18, color : 'white'}}>{parseInt(this.userInfo.fengmiNum)}</Text>
                        <Text style = {{color : 'white'}}>积分</Text>
                    </View>
                </View>
                <ScrollView>
                    <View>
                        {this.viewItem(0, 'WePay游戏1', 200)}
                        {this.viewItem(1, 'WePay游戏2', 300)}
                    </View>
                </ScrollView>
            </View>
        );
    }
}