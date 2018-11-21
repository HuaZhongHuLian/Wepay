import { Linking } from "react-native"
import SplashScreen from "react-native-splash-screen"
import { Net} from "./Net"
import { Storage } from "./Storage"
import { Build } from "./Build"
import { Dialog } from "./Dialog";


export class Login{
    static _onAutoLogin = null;
    static _local_n1_0_1 = -1;
    static setAutoLogin(cb){
        this._onAutoLogin = cb;
    }
    static onAutoLogind(user){
        this._onAutoLogin && this._onAutoLogin(user);
    }

    static _onPageLogin = null;
    static setPageLogin(cb){
        this._onPageLogin = cb;
    }
    static onPageLogin(){
        this._onPageLogin && this._onPageLogin();
    }

    static onBuild(build){
        console.log(build.desc);
        return;
        if(this._local_n1_0_1 === -1){
            console.log("读取localurl")
            Storage.promiseLoad(Storage.LOCALURL)
            .then(r=>{
                console.log("localurl: " + r);
                Net.setUrl(r);
                Net.setLocalUrl(r);
                console.log("检测版本号");
                if(r){
                    this._local_n1_0_1 = 1;
                } else{
                    this._local_n1_0_1 = 0;
                }
                this.checkVersion(build.versionName);
            }).catch(Dialog.error.bind(Dialog)).done();
        }

        return;
        console.log("测试开始")
        this.test();
        console.log("测试结束")
    }


    static checkVersion(versionName){
        Net.checkVersion(versionName)
        .then(r=>{
            if(r.code === 21){
                SplashScreen.hide();
                Dialog.msg1("检测到新的App版本", ()=>{
                    Linking.canOpenURL(r.msg).then(supported => {
                        if (supported) {
                            Linking.openURL(r.msg);
                        } else {
                            Dialog.toast("无法访问 " + r.msg)
                        }
                    }).catch(err=>console.log(JSON.stringify(err.message))).done()
                },"前往下载", true);
            }else {
                this.loadAccountAndSessionId();
            }
        })
        .catch(e=>{
            if(this._local_n1_0_1 === 1){
                this._local_n1_0_1 = 0;
                console.log("本地请求无响应, 使用正式url");
                Storage.save(Storage.LOCALURL, "");
                Net.setUrl();
                this.checkVersion(versionName);
            }else{
                Dialog.error(e);
            }
        }).done();
    }

    static test(a){
        console.log("空参数: " + typeof(a));
        if(a){
            console.log("undefined is true");
        }else {
            console.log("undefined is false");
        }
        if({}){
            console.log("{} is true");
        }else {
            console.log("{} is false");
        }
        if([]){
            console.log("[] is true");
        }else {
            console.log("[] is false");
        }
        if(""){
            console.log("\"\" is true");
        }else {
            console.log("\"\" is false");
        }
        if(null){
            console.log("null is true");
        }else {
            console.log("null is false");
        }
        if(0){
            console.log("0 is true");
        }else {
            console.log("0 is false");
        }
    }


    static clearSession(){
        Storage.save(Storage.SESSION, "");
    }

    static clearPassWord(){
        Storage.save(Storage.PASSWORD, "");
    }

    static onSessionLogin(account, password, sessionId){
        console.log("使用本地ID请求刷新");
        Net.updateUser(sessionId)
        .then(r=>{
            if(r.is1){
                let user = r.data;
                if((account == user.userid || account == user.mobile || account == user.account)){
                    console.log("本地ID与账号一致, ok");
                    this.onAutoLogind(user);
                }else{
                    console.log("本地ID与账号不一致, 使用本地账号登录");
                    this.clearSession();
                    this.onLogin(account, password);                
                }
            }else{
                console.log("过期或锁定或冻结或其他, 进入登录界面");
                this.clearSession();
                this.onPageLogin();
            }

        }).catch(e=>{
            console.log("本地ID请求刷新失败,使用本地账号登录");
            this.clearSession();
            this.onLogin(account, password);
        }).done();
    }  

    static onLogin(account, password){
        Net.login(account, password, Build.versionName).
        then(r=>{
            console.log("本地账号登录成功");
            let user = r.data;
            console.log("sessionId: " + user.sessionId);
            Storage.save(Storage.SESSION, user.sessionId);
            this.onAutoLogind(user);
        })
        .catch(e=>{
            console.log("本地账号登录失败,进入登录界面");
            Storage.save(Storage.ACCOUNT, [account, ""]);
            this.onPageLogin();
        }).done();
    }

    static loadAccountAndSessionId(){
        console.log("读取本地账号和ID");
        Promise.all([
            Storage.promiseLoad(Storage.ACCOUNT),
            Storage.promiseLoad(Storage.PASSWORD),
            Storage.promiseLoad(Storage.SESSION), 
        ])
        .then((r) => {
            console.log(JSON.stringify(r));
            let account = r[0];
            if(!account){
                console.log("本地无账号,进入登录界面");
                Storage.save(Storage.ACCOUNT, ["", ""]);
                this.clearPassWord();
                this.clearSession();
                this.onPageLogin();
                return;
            }
            let password = r[1];
            if(!password){
                console.log("本地无密码,进入登录界面");
                this.clearSession();
                this.onPageLogin();
                return;
            }
            let sessionId = r[2];
            if(sessionId){
                this.onSessionLogin(account, password, sessionId);
            }else {
                console.log("本地无id,使用本地账号登录");
                this.clearSession();
                this.onLogin(account, password);
            }
        })
        .catch(err=>null).done();
    }
}