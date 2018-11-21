import { Jx } from "./Jx"
import { Dialog } from "./Dialog"
import { Navigator } from "./Navigator"


const c_url = "http://wp.wepay168.com/wepay";
const c_localurl = "192.168.0.10:8081";
const c_image = "http://wepay.hxksky.com/";
const c_page = "anywhere";

export class Net{
    static getImage(){
        return c_image;
    }

    static _caches = {};
    static clear(page, key){
        if(this._caches[page]){
            if(this._caches[page][key]){
                delete this._caches[page][key];
                if(Jx.isObjectEmpty(this._caches[page])){
                    delete this._caches[page];
                }
            }else{
                console.log("Net:clear " + page + " 未找到缓存 " + key);
            }
        }else{
            console.log("Net:clear 未找到场景" + page + " 未找到缓存 " + key);
        }
    }
    static insert(page, key){
        if(this._caches[page]){
            if(this._caches[page][key]){
                console.log("Net:insert " + page + " 重复的缓存 " + key);
            }else{
                this._caches[page][key] = true;
            }
        }else {
            this._caches[page] = {[key] : true};
        }
        // console.log("Net:insert: 打印" + JSON.stringify(this._caches));
    }
    static unfetch(page, url, obj){
        // 字典序不必分级
        obj = Jx.isUndefined(obj) ? "" : Jx.stringify(obj);
        url += obj;
        if(Jx.isUndefined(this._caches[page]) || Jx.isUndefined(this._caches[page][url])){
            return url;
        }
        return "";
    }



    static _url = c_url;
    static setUrl(url){
        if(!url){
            url = c_url;
        }else{
            url = "http://" + url + "/wepay"
        }
        if(this._url != url){
            this._caches = {};
        }
        this._url = url;
    }

    static _localurl = c_localurl;
    static setLocalUrl(url){
        this._localurl = url || c_localurl;
    }
    static getLocalUrl(){
        return this._localurl;
    }


    static fetc(page, url, obj){
        console.log("网络请求 " + page + ": " + url);
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

    static error(reject, err, page, key){
        this.clear(page, key);
        Dialog.hiding(err);
        if(reject){
            reject(Jx.stringify(err.message));
        }else{
            Dialog.toast(err.message);
        }
        return;
        let msg = JSON.stringify(err.message)
        if(msg.startsWith("Network") && msg.endsWith("failed")){
            Dialog.toast("网络异常");
        }
    }

    static fet(page, url, obj, cb){
        Dialog.loading();
        page = page || c_page;
        let key = this.unfetch(page, url, obj);
        if(!key){
            Dialog.loading("加载中");
            return Promise.resolve({code:65535, msg:"", data:null, is1:false, page:c_page});
        }
        this.insert(page, key);
        return new Promise((resolve, reject)=>{
            this.fetc(page, url, obj) 
            .then(response=>response.json())
            .catch(err=>this.error(reject, err, page, key))
            .then(r=>{
                this.clear(page, key)
                console.log(r.data);
                Dialog.hiding();
                let is1 = (r.code === 1)
                if(!is1){
                    Dialog.toast(r.msg);
                }
                cb && cb({...r, is1, page});
                resolve({...r, is1, page});
            })
            .catch(err=>this.error(reject, err, page, key));
        });
    }


    static fetid(page, url, obj, cb){
        let sessionId = this.getSessionId();
        if(obj){
            obj = {...obj, sessionId};
        }else{
            obj = (url.indexOf("?") >= 0) ? "&" : "?";
            url = url + obj + "sessionId=" + sessionId;
            obj = null;
        }
        return this.fet(page, url, obj, cb);
    }

    static _user = null;
    static getUser(){
        return this._user;
    }
    static getSessionId(){
        if(this._user){
            return this._user.sessionId
        }
        return "";
    }
    static updateUser(sessionId){
        sessionId = sessionId || this.getSessionId();
        return this.fet(null, "/user/getIndexUser?sessionId=" + sessionId, null, r=>{
            if(r.is1){
                this._user = r.data;
            }
        });
    }


    static _coins = null;
    static getCoins(index){
        if(Jx.isNumber(index)){
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
        return this.fetid(null, "/coin/index", null, r=>{
            if(r.is1){
                this._coins = r.data;
            }
        });
    }

    static checkVersion(appVersion){
        return new Promise((resolve, reject)=>{
            this.fetc(c_page, "/user/login", {account : 0, password : 0, appVersion})
            .then(response=>response.json())
            .catch(err=>reject(err))
            .then(r=>{
                resolve(r);
            })
            .catch(e=>reject(e));
        });
    }

    static login(account, password, appVersion){
        return this.fet(null, "/user/login", {account, password, appVersion}, r=>{
            if(r.is1){
                this._user = r.data;
            }
        });
    }

}