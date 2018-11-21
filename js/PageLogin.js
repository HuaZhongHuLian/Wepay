import React from 'react';
import {View, ScrollView} from 'react-native';
import { Icons, Layout, Color, Label, Touch, StateBar, NavBar, Button1, Button, Net, renavigate } from "./utils/_component";
import {NavComponent} from "./NavComponent"
import { Build } from './utils/Build';


export default class PageLogin extends NavComponent {
// export default class PageLogin extends React.Component {
    constructor(props){
        super(props);
        this.state = {text : "", };
        this._url = "http://wp.wepay168.com/wepay";
        this.text = "";
        setInterval(()=>{(this.state.text != this.text) && this.setState({text : this.text})}, 33)

        this.func = Object.freeze({func:function(){return 2}});
        Icons
    }

    setText(text){text=(typeof(text)==="string")?text:JSON.stringify(text);this.text += "\n" + text + "\n";}
    clearText(){this.text = ""}

    fetc(url, obj){
        // this.setText(url);
        if(!obj){
            return fetch(this._url + url);
        }
        // this.setText(obj);
        let formData = new FormData();
        for (const key in obj) {
            formData.append(key,obj[key]);
        }
        return fetch(this._url + url, {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'charset':'UTF-8'
            },
            body: formData,
        }); 
    }

    login(){
        return this.fetc("user/login", {
            account: 26535,
            password: 123456,
            appVersion: "1.3.0",
        })
        .then(response=>response.json())
        // .catch(err=>{
        //     this.setText("第一次捕获:");
        //     this.setText(err.message);
        // })
        .then(r=>{
            if(r.code == 1){
                this.setText("then1:");
                return r;
            }
            else {
                this.setText("then245:");
                this.setText(r);
            }
        })
        // .catch(err=>{
        //     this.setText("第二次捕获:");
        //     this.setText(err.message);
        // })
        .then(r=>{
            this.setText("最终then:");
            this.setText(r);
        })
        .catch(err=>{
            this.setText("第三次捕获:");
            this.setText(err.message);
        });
    }

    Btn(text, cb){
        return <Touch style = {{padding:Layout.pad, borderColor:Color.white, borderWidth:1}} onPress = {cb}>
            <Label style = {{fontSize:24, color:Color.white}}>{text}</Label>
        </Touch>
    }

    render(){
        return <View style = {{flex:1,backgroundColor:Color.black}}>
            <StateBar/>
            <NavBar title = {"登录"} />
            <View style = {{flex:1, flexDirection:"row", padding:Layout.pad}}>
                <ScrollView style = {{flex:1}}>
                    <Label style = {{color:Color.white, fontSize:Layout.c16}}>{this.state.text}</Label>
                </ScrollView>           
                <View style = {{justifyContent:"flex-end", left:Layout.pad}}>
                    {this.Btn("Build", ()=>{
                        Build.versionName = "1.2.8";this.setText(Build.desc);
                        this.func.func = function(){return 4};
                        this.setText(this.func.func());
                    })}
                    {this.Btn("登录", this.login.bind(this))}
                    {this.Btn("清空", this.clearText.bind(this))}
                    <Button onPress={()=>{
                        Net.login(26535, 123456, "1.3.0", r=>{
                            renavigate(this.props.navigation, "PageRegister");
                        })
                        return;
                        let url = "/user/login";
                        let obj = {
                            account: 26535,
                            password: 123456,
                            appVersion: "1.3.0",
                        };
                        let cb = (result)=>{
                            if(result.code == 1){
                                this.navigate("PageRegister");
                            }else if(result.code == 21){
                                Dialog.msg("有新版本");
                            }
                        };
                    }}/>
                </View>
            </View>
        </View>
    }
}



export class PageRegister extends NavComponent {
// export class PageRegister extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return <View>
            <StateBar/>
            <NavBar title = {"注册"} onLeft = {this.onLeft}/>
        </View>
    }
}






// return;
// if(App.firstStart == -1){
//     DialogUtils.showLoading("", true);
//     HttpUtils.postData(BaseUrl.loginUrl(),{
//         account:"1",
//         password:"1",
//         appVersion: "0.0.0"
//     })
//     .then(result => {
//         SplashScreen.hide();
//         DialogUtils.hideLoading()
//         if (result.code === 21){
//             App.firstStart = 1
//             Dialog.msg1("检测到新版本",()=>{contactBaidu(result.msg)},"前往下载", false)
//         }
//         else {
//             App.firstStart = 0;
//         }
//     })
//     .catch(DialogUtils.hideLoading);
// }

// if(App.firstStart == 0){
//     AsySorUtils.getAccountPwd((result)=>{
//         if(result){
//             this.setState({
//                 text:result[0],
//                 pwd: result[1],
//             })
//             HttpUtils.getData(BaseUrl.getUserInfoBy(result[2]))
//             .then(result => {
//                 if (result.code === 1) {
//                     //Mobx保存方式
//                     AppStore.setUserInfo(result.data)
//                     //全局保存
//                     UserInfo.userInfo = result.data
//                     App.firstStart = 2;
//                 } else {
//                     App.firstStart = 2;
//                 }
//             })
//         }
//     })
// }




// import { contactBaidu } from './setting/LoginPage';
// import { Dialog } from '../utils/Component';
// import App from '../utils/App';
// import Colors from './util/Colors';
