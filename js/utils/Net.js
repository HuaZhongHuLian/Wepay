import {Linking} from "react-native"
import { NavComponent, Dialog } from "./Component"

import App from "./App";

const c_url = "http://wp.wepay168.com/wepay";
const c_image = "http://wepay.hxksky.com/";


export class _Net{
    static _url = c_url;
    // static _url = "http://192.168.0.10:8081/wepay";
    static _cache = {};

    static userData = null;
    static getUser(){
        return this.userData;
    }
    static updateUserData(){
        this.fetid("/user/getIndexUser", null, (result)=>{
            this.userData = result.data;
        });
    }
    static loadUserData(sessionId){
        this.fet("/user/getIndexUser?sessionId=" + sessionId, null, (result)=>{
            this.userData = result.data;
        });
    }

    static coins = null;
    static getCoins(index){
        if(index || index == 0){
            for(let k = 0; k < this.coins.coinVos.length; ++k){
                if(this.coins.coinVos[k].cid == index){
                    return this.coins.coinVos[k];
                }
            }
            return null;
        }
        return this.coins;
    }
    static updateCoins(){
        this.fetid("/coin/index", null, (result)=>{
            this.coins = result.data;
        });
    }

    static getImage(){
        return c_image;
    }
    static setUrl(url){
        if(this.url != url){
            this.clear();
        }
        this.url = url;
    }

    static clear(){
        this._cache = {};
    }

    static fetching(url, obj){
        obj = obj ? JSON.stringify(obj) : "";
        obj = url + obj;
        if(this._cache[obj] && this._cache[obj] == 1){
            return true;
        }
        this._cache[obj] = 1;
        return false;
    }

    static clear(url, obj){
        obj = obj ? JSON.stringify(obj) : "";
        obj = url + obj;
        delete this._cache[obj];
    }

    static fetc(url, obj){
        console.log(url);
        if(!obj){
            return fetch(this._url + url);
        }
        console.log(obj);
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

    static fet(url, obj, cb, nav){
        if(NavComponent.s_isNavigating){
            return;
        }
        Dialog.loading();
        if(this.fetching(url, obj)){
            for (const key in obj) {
                if(key == "file"){
                    Dialog.loading(true, "上载中...请耐心等待");
                    return;  
                }
            }
            Dialog.loading(null, "请求中");
            return;
        }
        this.fetc(url, obj)
        .then(response=>response.json())
        .then(result=>{
            Dialog.hiding();
            if(!this.fetching(url, obj)){
                return;
            }
            this.clear(url, obj);
            if(result.code == 1 || result.code == 21){
                console.log(result.data);
                cb(result);
            }else {
                Dialog.toast(result.msg);
                if(result.code == 2 || result.code == 4){
                    nav && NavComponent.renavigate(nav, "LoginPage")
                }
            }
        })
        .catch(err => {
            this.clear(url, obj);
            Dialog.hiding(err);
            Dialog.toast(err.message);
            return;
            let msg = JSON.stringify(err.message)
            if(msg.startsWith("Network") && msg.endsWith("failed")){
                Dialog.toast("网络异常");
            }
        })
    }

    static fetid(url, obj, cb, nav){
        if(obj){
            this.fet(url, {sessionId:this.userData.sessionId, ...obj}, cb, nav)
        }else {
            let str = (url.indexOf("?") >= 0) ? "&" : "?";
            this.fet(url + str + "sessionId=" + this.userData.sessionId, null, cb, nav)
        }
    }

    static login(account, password, appVersion, cb){
        this.fet("/user/login", {
            account: account,
            password: password,
            appVersion: appVersion || App.getVersionName(),
        }, (result)=>{
            if(result.code == 1){
                this.userData = result.data;
                Dialog.toast("登录成功");
                cb && cb();
            }else if(result.code == 21){
                Dialog.msg2("检测到新版本", ()=>{
                    Linking.canOpenURL(result.msg)
                    .then(ok => {
                        if (ok) {
                            return Linking.openURL(result.msg);
                        } else {
                            Dialog.toast("An error occurred: " + result.msg);
                        }
                    })
                    .catch(err => {
                        console.error("An error occurred: ", result.msg)
                    });
                }, null, "下载", "稍后");
            }
        });
    }
}