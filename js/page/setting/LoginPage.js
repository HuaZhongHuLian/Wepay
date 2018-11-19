import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image, 
    Linking,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import HttpUtils from '../../util/HttpUtils';
import BaseUrl from '../../util/BaseUrl';
import DialogUtils from '../../util/DialogUtils';
import AsySorUtils from "../../dao/AsySorUtils"
import { inject, observer } from 'mobx-react';
import UserInfo from '../../model/UserInfo';
import SplashScreen from "react-native-splash-screen"
import Colors from '../../util/Colors';
import Utils from "../../util/Utils";
import codePush from "react-native-code-push";
// import You, { isAndroid, vsSize } from '../../util/You'
import {Overlay, Button, Input} from "teaset"
import { Net } from '../../utils/Component';
import { Build } from '../../utils/Build';
/**
 * 登陆页面
 */
@inject('AppStore')
export default class LoginPage extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            pwd: '',
            // appVersion:"1.2.9"
        }
        console.log("登录界面");
    }

    static s_version = "";
    static s_url = "";
    static s_1w = 0;
    static s_1h = 0;
    static s_1 = 0;
    static s_url_ver_ref = null;

    componentDidMount() {
        SplashScreen.hide();
        AsySorUtils.getAccountPwd((result)=>{
            if(result){
                this.setState({
                    text:result[0],
                    pwd: result[1],
                })
            }
        })

        //热更新后添加这个代码 不然貌似热更新会自动回滚
        // codePush.sync()
        // Platform.OS ==="ios"? {}:codePush.sync()

        if(DialogUtils.hadUpdate == -1){
            console.log('检测更新');
            codePush.checkForUpdate()
            .then((update) => {
                if(update){
                    DialogUtils.hadUpdate = 1;
                    console.log('有更新');
                    let cb = ()=>DialogUtils.showMsg("请->设置->版本检测->点击更新")
                    DialogUtils.showPop("检测到新版本,是否更新?", DialogUtils.checkUpdate, null, "更新", "稍后", true);
                } else {
                    DialogUtils.hadUpdate = 0;
                    console.log('无更新');
                }
            })
            .catch(err=>{})
        }
    }

    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: mainColor }]}>
                <NavigationBar
                    title={"Wepay用户登录"}
                    navigation={this.props.navigation}
                    leftView = {
                    <TouchableOpacity
                        style={[{ paddingRight: 20,paddingTop:10,paddingBottom:10},styles.leftContainer]}
                        onLongPress={LoginPage.showUrl}>
                        <Image source={require('../../../res/images/fanhui.png')}/>
                    </TouchableOpacity>}
                />
                <TouchableOpacity style={{height:150,justifyContent:"center",alignItems:"center"}}  
                    onPress = {()=>console.log(Build.desc)}
                    activeOpacity = {1}
                >
                <Image source={require('../../../res/images/logo-d.png')}/>
                    {/*<Text style={{*/}
                        {/*fontSize: 15,*/}
                        {/*color: "#fff",*/}
                        {/*marginTop:8,*/}
                    {/*}}>版本号:{this.state.appVersion}</Text>*/}
                </TouchableOpacity>

                <View style={styles.itemView}>
                <Image style={{height:30,width:30,resizeMode:"stretch",marginRight:10}} 
                       source={require('../../../res/images/user.png')}/>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={"请输入手机号 / UID"}
                        defaultValue={this.state.text ? this.state.text : undefined}
                        placeholderTextColor={'#fff'}
                        underlineColorAndroid='transparent'
                        keyboardType={"numeric"}
                        onChangeText={(text) => this.setState({ text: text })} />
                </View>

                <View style={styles.itemView}>
                <Image style={{height:30,width:30,resizeMode:"contain",marginRight:10}} 
                       source={require('../../../res/images/password.png')}/>
                    <TextInput
                        style={styles.itemTextInput}
                        placeholder={'请输入密码'}
                        placeholderTextColor={'#fff'}
                        defaultValue={this.state.pwd ? this.state.pwd : undefined}
                        underlineColorAndroid='transparent'
                        secureTextEntry={true}
                        keyboardType={"default"}
                        onChangeText={(pwd) => this.setState({ pwd: pwd })} />
                </View>
                <View style={{ flexDirection: "row", }}>
                    <TouchableOpacity 
                    onPress={() => this.onClicks(1)} 
                    onLongPress={()=>{LoginPage.s_1 = 0;++LoginPage.s_1h; }}
                    style={{ height: 50, justifyContent: 'center' }}>
                        <Text style={{
                            fontSize: 15,
                            color: "#f82929",
                            marginLeft:25,
                        }}>忘记密码?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => this.onClicks(0)} 
                        onLongPress={()=>{LoginPage.s_1 = 0;++LoginPage.s_1w; }}
                        style={{ flex: 1, height: 50, justifyContent:"center",alignItems:"flex-end" }}>
                        <Text style={{
                            fontSize: 15,
                            color: "#fff",
                            marginRight: 20
                        }}>注 册</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        height: 45,
                        marginTop: 40,
                        marginLeft: 15,
                        marginRight: 15,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.blue1,
                    }}
                    onPress={() => this.onClicks(2)}
                >
                    <Text style={{
                        alignSelf: "center",
                        color: '#FFF',
                        fontSize: 20,
                        fontWeight:"900",
                    }}>登 录</Text>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     *  点击事件 
     * @param {*} type 
     */
    onClicks(type) {
        switch (type) {
            case 0://注册
                // LoginPage.s_1 = 0;
                // ++LoginPage.s_1h; 
                // DialogUtils.showLoading(LoginPage.s_1h, true);
                // DialogUtils.showLoading("   " + (LoginPage.s_1h + 1), true);
                // DialogUtils.showLoading("        " + (LoginPage.s_1h + 2), true);
                // DialogUtils.showLoading("             " + (LoginPage.s_1h + 3), true);
                // setInterval(()=>{DialogUtils.hideLoading(); DialogUtils.showToast(Math.random() * 1000000)}, 2000);
                // break;
                this.props.navigation.navigate('RegisterPage', {
                    userName: this.state.nickname,
                });
                break 
            case 1://忘记密码
                // LoginPage.s_1 = 0;
                // ++LoginPage.s_1w; 
                this.props.navigation.navigate('ForgetPassWord', {
                    type: 0
                })
                break
            case 2://登陆
                // PassWordInput.showPassWordInput((safetyPwd) => alert(safetyPwd),"支付描述内容",100)
                // PassWordInput.showPassWordInput((safetyPwd) => alert(safetyPwd))
                // DialogUtils.showPay()
                // alert(Utils.formatNumbers("116.00",3);
                if(this.state.text.length<1){
                    DialogUtils.showMsg("请输入UID或者手机号")
                }else if(this.state.text.length<1){
                    DialogUtils.showMsg("请输入密码")
                }else{
                    this.loginByPwd();
                 }
                break
        }
    }

    static showUrl(){
        // if(LoginPage.s_1w < 1 || LoginPage.s_1h < 1 || (++LoginPage.s_1 % 5) != 4){
        //     return;
        // }
        let view = <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}
                modal={true}//点击任意区域消失
                ref={r => LoginPage.s_url_ver_ref = r}>
                <Input style = {{margin : 20}} Size = {"lg"} onChangeText = {str=>LoginPage.s_url = str}/>
                <Button style = {{width : 100, margin : 20}} title = {"???"} Size = {"xl"} 
                    onPress = {()=>{BaseUrl.seturl(LoginPage.s_url); LoginPage.s_url_ver_ref.close()}}/>
                <Input style = {{margin : 20}} Size = {"lg"} onChangeText = {str=>LoginPage.s_version = str}/>
                <Button style = {{width : 100, margin : 20}} title = {"???"} Size = {"xl"} 
                    onPress = {()=>{LoginPage.s_url_ver_ref.close()}}/>
            </Overlay.PopView>;
        Overlay.show(view);
    }
  
    /**
     * 登陆
     */
    loginByPwd()   {
        DialogUtils.showLoading("", true);
        let url = BaseUrl.loginUrl()
        let obj = {
            account:this.state.text,
            password:this.state.pwd,
            appVersion: LoginPage.s_version.length > 0 ? LoginPage.s_version : Build.versionName, //this.state.appVersion,
        };
        console.log(JSON.stringify(obj));
        HttpUtils.postData(url,obj)
        // HttpUtils.getData(url)
            .then(result => {
                DialogUtils.hideLoading()
                if (result.code === 1) {
                    //alert(JSON.stringify(result))
                    //Mobx保存方式
                    this.props.AppStore.setUserInfo(result.data)
                    //全局保存，    
                    UserInfo.userInfo = result.data
                   
                    DialogUtils.showToast("登陆成功")
                    //异步保存到本地文件  
                    AsySorUtils.saveAccountPwd([this.state.text, this.state.pwd, UserInfo.userInfo.sessionId])
                   // this.props.navigation.goBack()
                   // this.props.navigation.navigate('HomePage');
                    this.goHome(this.props.navigation)
                   // this.props.navigator.push({name: HomePage,reset:true});
                   Net.loadUser(UserInfo.userInfo.sessionId);
                   
                } else  if (result.code === 21){
                    //DialogUtils.showToast(result.msg)
                    DialogUtils.showPop("发现新版本，请及时下载，否则无法正常使用",()=>{
                        contactBaidu(result.msg)
                    },()=>{},"下载新版本","取消")
                }else{
                    DialogUtils.showToast(result.msg)
                }
            }).catch(err=>{DialogUtils.hideLoading()})
    }

}

//调用本地浏览器打开网页
export const contactBaidu = (url) => {
    Linking.canOpenURL(url).then(supported => {
        if (!supported) {
            DialogUtils.showToast("An error occurred:" + url)
        } else {
            return Linking.openURL(url);
        }
    }).catch(err => console.error('An error occurred', url));
}
export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#469c92",
        borderRadius: 3,
        borderColor: "#fff",
        paddingLeft: 15,
        paddingRight: 15,
        height: 50,
        borderWidth: 1,
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
    },
    itemTextInput: {
        flex: 1,
        fontSize: 15,
        color: '#fff',
    }
});