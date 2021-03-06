import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
    Platform,
} from 'react-native';
import BaseComponent, { BaseStyles, integralRelease, upDataUserInfo } from "./BaseComponent";
import ViewUtils from "../util/ViewUtils";
import { Carousel } from 'teaset';
import Utils from "../util/Utils";
import DialogUtils from '../util/DialogUtils';
import AsySorUtils from '../dao/AsySorUtils';
import BaseUrl from '../util/BaseUrl';
import HttpUtils from '../util/HttpUtils';
import UserInfo from '../model/UserInfo';
import SplashScreen from "react-native-splash-screen"
import { observer, inject } from 'mobx-react';
import gcj02towgs84 from "../util/location"
import codePush from "react-native-code-push";
import AdView from "../common/AdView";
import StoreCash from './setting/StoreCash';
// import { Navigator, Login, Jx } from '../utils/_component';


const screen_width = Utils.getWidth();

@inject('AppStore') @observer
export default class HomePage extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            bannerArray: [],
            isRefresh: false,
            // isAutoLogined : false,
        }

        //this.props.AppStore.userInfo = this.props.AppStore.userInfo
        // Navigator.push(this.props.navigation);
        // Login.setAutoLogin(this.onAutoLogin.bind(this));
        // Login.setPageLogin(this.onPageLogin.bind(this));
        // const {params} = this.props.navigation.state;
        // this.isFromLogin = (Jx.isUndefined(params) || Jx.isUndefined(params.isFromLogin)) ? false : isFromLogin;
        // this.isRedPackShown = false;
    }

    // onPageLogin(){
    //     Navigator.renavigate(this.props.navigation, "LoginPage");
    // }

    // onAutoLogin(user){
    //     this.props.AppStore.setUserInfo(user);
    //     UserInfo.userInfo = user;
    //     this.setState({isAutoLogined : true})
    //     if(!this.isRedPackShown){
    //         SplashScreen.hide();
    //         this.showRedPacket();
    //         this.isRedPackShown = true;
    //     }       
    // }


    componentDidMount() {
        SplashScreen.hide();
        this.showRedPacket();
        // if(this.isFromLogin){
        //     SplashScreen.hide();
        //     this.showRedPacket();
        //     this.isRedPackShown = true;
        // }else if(this.state.isAutoLogined && !this.isRedPackShown){
        //     SplashScreen.hide();
        //     this.showRedPacket();
        //     this.isRedPackShown = true;
        // }
    }

    _itemView(callback, img, text) {
        return <TouchableOpacity

            activeOpacity={0.8}
            onPress={callback}
        >
            <View style={[BaseStyles.container_column,
            {
                width: screen_width / 3 - 1,
                height: screen_width / 5  - 1,
            }, styles.itemView]}>
                <Image source={img}
                    style={styles.itemImage} />
                <Text style={{ fontSize: 13, color: '#333', marginTop: 5 }}>{text}</Text>
            </View>
        </TouchableOpacity>
    }
    _StatusBar(statusBarColor) {
        return <View style={{ height: 20, backgroundColor: statusBarColor }}>
            <StatusBar
                animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
                hidden={false}  //是否隐藏状态栏。
                backgroundColor={statusBarColor} //状态栏的背景色
                translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
                barStyle={'light-content'} // enum('default', 'light-content', 'dark-content')
            />
        </View>
    }
    /**
     * 下拉刷新
     */
    onRefreshs() {
        this.setState({ isRefresh: true })
        let url = BaseUrl.getUserInfoBy(this.props.AppStore.userInfo.sessionId)
        HttpUtils.getData(url)
            .then(result => {
                // alert(JSON.stringify(result))
                this.setState({ isRefresh: false })
                if (result.code === 1) {
                    //Mobx保存方式
                    this.props.AppStore.setUserInfo(result.data)
                    //全局保存
                    UserInfo.userInfo = result.data
                    //刷新红包数据
                    this.showRedPacket()
                } else {
                    DialogUtils.showToast(result.msg)
                }
            }).catch(error => {
                this.setState({ isRefresh: false })
            })

    }

    /**
     * 显示红包
     */
    showRedPacket() {
        if (this.props.AppStore.userInfo.isReward === 0 && this.props.AppStore.userInfo.todayReleas > 0) {
            DialogUtils.redPacket(this.props.AppStore.userInfo.todayReleas,
                () => integralRelease(this.props.AppStore))
        }
    }
    render() {
        return (
            <View style={BaseStyles.container_column}>
                {this._StatusBar("#48b1a3")}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            //Android下只有一个 colors 是转圈的颜色
                            colors={['#d11', '#000']}
                            //ios 下 可以设置标题，转圈颜色，标题颜色
                            title={'Loading...'}
                            tintColor={'#d11'}
                            titleColor={'#d11'}
                            //刷新状态 false:隐藏，true:显示
                            refreshing={this.state.isRefresh}
                            //刷新触发的后执行的方法
                            onRefresh={() => this.onRefreshs()}
                        />
                    }
                    //onScroll={this._onScroll.bind(this)}
                    scrollEventThrottle={50}
                >
                    <View style={BaseStyles.container_column}>

                        <View style={styles.container_top}>
                            {/*顶部 用户信息布局*/}
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.onClicks(101)}
                            >
                                <View
                                    style={[BaseStyles.container_row, { alignItems: 'center' }]}
                                >


                                    <Image source={{ uri: this.getImgUrl(this.props.AppStore.userInfo.imgHead) }}
                                        style={styles.headImg} />
                                    <View style={{ flex: 1, marginLeft: 10 }}>

                                        <View style={{ flexDirection: "row" }}>
                                            <Text
                                                onPress={() => alert("uid:" + this.props.AppStore.userInfo.userid)}
                                                style={styles.text}>
                                                UID:{this.props.AppStore.userInfo.userid}

                                            </Text>
                                            {this.props.AppStore.userInfo.useGrade === 3 ? <Image source={require("../../res/images/huangguan.png")}
                                                style={{ height: 15, width: 15, marginLeft: 5 }} /> : null}
                                        </View>

                                        {ViewUtils.getCreditView(this.props.AppStore.userInfo.userCredit, 16, 15, "#fff")}
                                    </View>
                                    <Image style={{ width: 25, height: 25, borderRadius: 13 }}
                                        source={require('../../res/images/shezhi.png')}
                                    />
                                </View></TouchableOpacity>

                            {/*扫描二维码布局*/}
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.onClicks(102)}
                            ><View
                                style={[BaseStyles.container_column, {
                                    height: 160,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }]}>
                                    <Image
                                        style={{ width: 100, height: 100, marginLeft: 2 }}
                                        source={require('../../res/images/saoma.png')}
                                    />
                                    <Text style={{ fontSize: 18, color: '#fff', marginTop: 10 }}>扫 码 支 付</Text>
                                </View></TouchableOpacity>

                            {/* 余额积分布局*/}
                            <View style={[BaseStyles.container_row, {
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                padding: 10
                            }]}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => this.onClicks(103)}
                                >
                                    <View style={{ flexDirection: 'column', alignItems: "center" }}>
                                        <Text style={{ fontSize: 16, color: '#fff' }}>余额</Text>
                                        <Text style={{ fontSize: 16, color: '#fff' }}>￥{this.props.AppStore.userInfo.cangkuNum}</Text>
                                    </View></TouchableOpacity>
                                <View style={{ height: 30, width: 0.5, backgroundColor: '#fff' }} />
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => this.onClicks(14)}
                                >
                                    <View style={{ flexDirection: 'column', alignItems: "center" }}>
                                        <Text style={{ fontSize: 16, color: '#fff' }}>积分</Text>
                                        <Text style={{ fontSize: 16, color: '#fff' }}>￥{this.props.AppStore.userInfo.fengmiNum}</Text>
                                    </View></TouchableOpacity>
                            </View>
                        </View>
                        <AdView
                            {...this.props}
                            action={"home"}
                            height={Utils.getWidth() / 4}/>
                        {/*<Carousel*/}
                            {/*style={{ width: screen_width, height: screen_width / 4 }}*/}
                            {/*control={() => { return <Carousel.Control /> }}*/}
                        {/*>*/}
                            {/*{this.setImgToBanner(this.state.bannerArray)}*/}
                        {/*</Carousel>*/}
                        <View style={[BaseStyles.container_row, { flexWrap: 'wrap', }]}>
                            {this._itemView(() => this.onClicks(1), require('../../res/images/zhuanchu.png'), "余额转出")}
                            {this._itemView(() => this.onClicks(2), require('../../res/images/zhuanru.png'), "余额转入")}
                            {this._itemView(() => this.onClicks(3), require('../../res/images/mairu.png'), "余额买入")}
                            {this._itemView(() => this.onClicks(4), require('../../res/images/maichu.png'), "余额卖出")}
                            {this._itemView(() => this.onClicks(5), require('../../res/images/shuzi.png'), "数字资产")}
                            {this._itemView(() => this.onClicks(6), require('../../res/images/shangcheng.png'), "超级商城")}
                            {this._itemView(() => this.onClicks(7), require('../../res/images/gongyi.png'), "爱心公益")}
                            {this._itemView(() => this.onClicks(8), require('../../res/images/youxi.png'), "游戏娱乐")}
                            {this._itemView(() => this.onClicks(9), require('../../res/images/hudong.png'), "大卫金矿")}
                            {this._itemView(() => this.onClicks(10), require('../../res/images/duixian.png'), "商家兑现")}
                            {this._itemView(() => this.onClicks(11), require('../../res/images/huafei.png'), "话费充值")}
                            {this._itemView(() => this.onClicks(12), require('../../res/images/jiayou.png'), "余额加油")}

                        </View>
                    </View>
                </ScrollView></View>
        );
    }

    onClicks(type) {
        switch (type) {
            case 101:
                this.props.navigation.navigate('SettingView');
                break;
            case 102:
                this.props.navigation.navigate('SaoSaoView');
                break;
            case 103:
                this.props.navigation.navigate('YueOrIntegralRecord', { type: 0 });
                break;
            case 14:
                this.props.navigation.navigate('YueOrIntegralRecord', { type: 1 });
                break;
            case 1:
                this.props.navigation.navigate('ZhuanChu');
                break;
            case 2:
                this.props.navigation.navigate('ZhuanRu');
                break;
            case 3:
                this.props.navigation.navigate('BuyPage');
                break;
            case 4:
                this.props.navigation.navigate('SellPage');
                break;
            case 5://数字资产
                 this.props.navigation.navigate('NumberHome');
                //DialogUtils.showToast("此模块正在升级中...")
                break;
            case 6://商城
                this.props.navigation.navigate('StoreMall');
                break;
            case 7://爱心公益
                DialogUtils.showToast("此模块正在升级中...")
                break;
            case 8://游戏娱乐
                this.gotoGame(0);
                // DialogUtils.showToast("此模块正在升级中...")
                break;
            case 9://群员互动
                this.gotoGame(1);
                // DialogUtils.showToast("此模块正在升级中...")
                break;
            case 10://商家兑现
                DialogUtils.showToast("此模块正在升级中...")
                // this.gotoStroe()
                break;
            case 11: //手机充值
                DialogUtils.showToast("此模块正在升级中...")
               // this.props.navigation.navigate('PhoneBill');
                break;
            case 12://余额加油
                DialogUtils.showToast("此模块正在升级中...")
               // this.props.navigation.navigate('FuelUp');
                break;
            default://
                break
        }
    }

    gotoStroe(){
        let url = BaseUrl.getStoreCashInfo(this.props.AppStore.userInfo.sessionId)
        DialogUtils.showLoading('', true);
        HttpUtils.getData(url)
            .then(result => {
                DialogUtils.hideLoading();
                if (result.code == 1) {
                    StoreCash.userData = result.data;
                    this.props.navigation.navigate('StoreCash', {requireData : result.data});
                }else{
                    DialogUtils.showToast(result.msg)
                    if(result.code == 2 || result.code == 4){
                        this.goLogin(this.props.navigation)
                    }
                }
            }).catch(error => DialogUtils.hideLoading())
    }

    gotoGame(amuse_mining){
        DialogUtils.showLoading('', true);
        let fet = (amuse_mining == 0) ? 
            HttpUtils.postData(BaseUrl.getGameHomeUrl(), {sessionId : this.props.AppStore.userInfo.sessionId}) :
            HttpUtils.getData(BaseUrl.numberIndex(this.getUserInfo().sessionId));
        fet.then(result=>{
            if(this.isNotLogin(result)){
                this.props.navigation.navigate('GameAmuse', {gameDatas : amuse_mining == 0 ? result.data : [result.data], amuse_mining : amuse_mining});
            }
        }).catch(DialogUtils.hideLoading)
        return;
        let htp = amuse_mining == 0 ? 
        HttpUtils.postData(BaseUrl.getGameHomeUrl(),{sessionId : this.props.AppStore.userInfo.sessionId}) : 
        HttpUtils.getData(BaseUrl.numberIndex(this.getUserInfo().sessionId));
        htp.then(result => {
            DialogUtils.hideLoading();
            if(result.code == 1){
                // alert(JSON.stringify(result.data));
                this.props.navigation.navigate('GameAmuse', {gameDatas : amuse_mining == 0 ? result.data : [result.data], amuse_mining : amuse_mining});
            }else {
                DialogUtils.showToast(result.msg);
                if(result.code == 2 || result.code == 4){
                    this.goLogin(this.props.navigation);
                }
            }
        }).catch(error => DialogUtils.hideLoading())
    }

}
const styles = StyleSheet.create({
    container_top: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#48b1a3",
        padding: 10,
    },
    text: {
        color: "#fff",
        fontSize: 16,
    },
    headImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: '#fff',
        borderWidth: 1
    },
    itemView: {
        flexWrap: 'wrap',
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0.5,
        marginTop: 0.5,
    },
    itemImage: {
        width: 30,
        height: 30,
        backgroundColor: '#fff',
        borderColor: "#fff"
    },
});
