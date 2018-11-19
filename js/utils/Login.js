import { Net, Util, renavigate } from "./Component";
import { Storage } from "./Storage";
import { Build } from "./Build";


export class Login{
    clearSession(){
        Storage.save(Storage.SESSION, "");
    }

    onSessionLogin(account, password, sessionid, nav){
        console.log("使用本地ID请求刷新");
        Net.loadUser(sessionid, (r)=>{
            console.log("本地ID请求刷新成功");
            this.onSessionLogined(r);
        }, r=>{
            console.log("本地ID请求刷新失败,使用本地账号登录");
            this.clearSession();
            this.onLogin(account, password, nav);
        })
    }  

    onSessionLogined(r){

    }

    onLogin(account, password, nav){
        Net.login(account, password, Build.versionName, r=>{
            console.log("本地账号登录成功");
            console.log("sessionId: " + r.sessionid);
            Storage.save(Storage.SESSION, r.sessionid);
        }, r=>{
            console.log("本地账号登录失败,进入登录界面");
            Storage.save(Storage.ACCOUNT, [account, ""]);
            this.onPageLogin(nav);
        });
    }

    onPageLogin(nav){
        renavigate(nav, "LoginPage");
    }

    loadAccountAndSessionId(nav){
        Promise.all([
            Storage.promiseLoad(Storage.SESSION), 
            Storage.promiseLoad(Storage.ACCOUNT),
        ])
        .then((r) => {
            let account = r[0][0];
            if(!account){
                console.log("本地无账号,进入登录界面");
                Storage.save(Storage.ACCOUNT, ["", ""]);
                this.clearSession();
                this.onPageLogin();
                return;
            }
            let password = r[0][1];
            if(!account){
                console.log("本地无密码,进入登录界面");
                this.clearSession();
                this.onPageLogin();
                return;
            }
            let sessionid = r[1];
            if(sessionid){
                this.onSessionLogin(account, password, sessionid);
            }else {
                console.log("本地无id,使用本地账号登录");
                this.clearSession();
                this.onLogin(account, password);
            }
        })
        .catch(err=>null)
    }
}