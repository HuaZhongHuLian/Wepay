import { Dialog, Util, renavigate } from "./Component"
import { Navigator } from "./Navigator";

const c_url = "http://wp.wepay168.com/wepay";
const c_image = "http://wepay.hxksky.com/";


export class Net{
    static getImage(){
        return c_image;
    }


    static _cache = {};
    static clear(){
        this._cache = {};
    }
    static isFetching(url, obj){
        obj = obj ? Util.stringify(obj) : "";
        obj = url + obj;
        if(this._cache[obj] === 1){
            return true;
        }
        this._cache[obj] = 1;
        return false;
    }
    static clear(url, obj){
        obj = obj ? Util.stringify(obj) : "";
        obj = url + obj;
        delete this._cache[obj];
    }


    static _url = c_url;
    static setUrl(url){
        if(this.url != url){
            this.clear();
        }
        this.url = url;
    }



    static fetch(url, obj){
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

    static fetc(url, obj, cb){
        Dialog.loading();
        if(this.isFetching(url, obj)){
            for (const key in obj) {
                if(key === "file"){
                    Dialog.loading("上载中...请耐心等待", true);
                    return;  
                }
            }
            Dialog.loading("请求中");
            return;
        }
        this.fetch(url, obj)
        .then(response=>response.json())
        .catch(err => {
            this.clear(url, obj);
            Dialog.hiding(err);
            Dialog.toast(err.message);
        })
        .then(r=>{
            Dialog.hiding();
            if(!this.isFetching(url, obj)){
                return;
            }
            this.clear(url, obj);
            console.log(r.data);
            cb && cb(r);
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


    static fetcid(url, obj, cb){
        if(obj){
            this.fetc(url, {sessionId:this._user.sessionId, ...obj}, cb)
        }else {
            let str = (url.indexOf("?") >= 0) ? "&" : "?";
            this.fetc(url + str + "sessionId=" + this._user.sessionId, null, cb)
        }
    }

    static cb124(r, cb1, nav){
        if(r.code === 1){
            cb1 && cb1(r);
        }else {
            Dialog.toast(r.msg);
            if(r.code === 2 || r.code === 4){
                nav && Navigator.renavigate(nav, "LoginPage");
            }
        }
    }


    static fet(url, obj, cb1, nav){
        this.fetc(url, obj, r=>{this.cb124(r, cb1, nav);});
    }

    static fetid(url, obj, cb1, nav){
        this.fetcid(url, obj, r=>{this.cb124(r, cb1, nav);})
    }




    static _user = null;
    static getUser(){
        return this._user;
    }
    static loadUser(sessionId, cb, cbOther){
        this.fetc("/user/getIndexUser?sessionId=" + sessionId, null, (r)=>{
            if(r.code === 1){
                this._user = r.data;
                cb && cb(r);
            }else {
                // Dialog.toast(r.msg);
                cbOther && cbOther(r);
            }
        });
    }
    static updateUser(cb1, nav){
        this.fetid("/user/getIndexUser", null, r=>{
            this._user = r.data;
            cb && cb1(this._user);
        }, nav);
    }
 


    static _coins = null;
    static getCoins(index){
        if(Util.isNumber(index)){
            for(let k = 0; k < this._coins.coinVos.length; ++k){
                if(this._coins.coinVos[k].cid == index){
                    return this._coins.coinVos[k];
                }
            }
            return null;
        }
        return this._coins;
    }
    static updateCoins(){
        this.fetid("/coin/index", null, (r)=>{
            this._coins = r.data;
        });
    }



    static checkVersion(appVersion, cb){
        this.fetc("/user/login", {
            account: 0,
            password: 0,
            appVersion: appVersion,
        }, (r)=>{
            cb && cb(r);
        });
    }

    static login(account, password, appVersion, cb, cbOther){
        this.fet("/user/login", {
            account: account,
            password: password,
            appVersion: appVersion, 
        }, (r)=>{
            if(r.code == 1){
                this._user = r.data;
                Dialog.toast("登录成功");
                cb && cb(r);
            }else {
                Dialog.toast(r.msg);
                cbOther && cbOther(r);
            }
        });
    }

}