import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    ScrollView,
}from 'react-native'
import BaseComponent, { mainColor } from './BaseComponent';
import NavigationBar from '../common/NavigationBar';
import Utils from '../util/Utils';


export default class GameGuide extends BaseComponent{
    constructor(props){
        super(props);
    }


    render(){
        // <Text style = {{fontSize : 27, color : 'black'}} />
        const styleFont = {padding : 20, fontSize : 20, color : 'black'}
        const styleImage = {alignSelf : 'center', marginVertical : 10, resizeMode : 'contain', borderColor : 'black', borderWidth : 1};
        const styleImageH = {...styleImage, width : '95%', height : Utils.getWidth() * 0.95 * 0.5633};
        const styleImageV = {...styleImage, width : '90%', height : Utils.getWidth() * 0.9 / 0.5633};
        return(
            <View style = {{flex : 1, backgroundColor : '#F1F1F1'}}>
                {/* <StatusBar backgroundColor = {mainColor} /> */}
                <NavigationBar title = '游戏指引' navigation = {this.props.navigation} />
                <ScrollView>
                    <View style = {{marginTop : 20, marginBottom : 100}}>
                        <Text style = {styleFont}>      开始游戏之前,TOT会自动判断是否已经安装游戏,如果未安装,TOT会自动跳转到游戏下载地址进行在线安装:</Text>
                        <Image style = {styleImageV} source = {require('../../res/pictures/gameguide1.png')}/>
                        <Text style = {styleFont}>      第一次进入游戏之后进行账号注册:</Text>
                        <Image style = {styleImageH} source = {require('../../res/pictures/gameguide2.png')}/>
                        <Text style = {styleFont}>      TOT与游戏ID进行绑定关联:</Text>
                        <Image style = {styleImageV} source = {require('../../res/pictures/gameguide3.png')}/>
                        <Text style = {styleFont}>      关联之后就可以愉快的进行 TOT余额 与 游戏金币 的相互兑换了</Text>
                        <Image style = {styleImageV} source = {require('../../res/pictures/gameguide4.png')}/>
                        <Text style = {styleFont}>      游戏主界面,游戏ID在左上角:</Text>
                        <Image style = {styleImageH} source = {require('../../res/pictures/gameguide5.png')}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}