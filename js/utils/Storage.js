import { AsyncStorage } from 'react-native'

export const Storage = Object.freeze({
    ACCOUNT : "account",
    PASSWORD : "password",
    SESSION : "sessionId",
    LOCALURL : "localurl",

    save : function(key, info) {
        AsyncStorage.setItem(key, JSON.stringify(info), (error) => {
            if (error) {
                Dialog.toast(error.message)
            }else{
                console.log("本地存储: " + key + " : " + JSON.stringify(info));
            }
        });
    },

    load : function(key, cb) {
        AsyncStorage.getItem(key, (err, r) => {
            cb(err ? null : JSON.parse(r));
        })
    },

    promiseLoad : function(key){
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem(key, (err, r) => {
                resolve(err ? null : JSON.parse(r));
            })
        });
    }
});