import { AsyncStorage } from 'react-native';

export const Storage = Object.freeze({
    ACCOUNT : "account_password",
    SESSION : "sessionid",

    save : function(key, info) {
        AsyncStorage.setItem(key, JSON.stringify(info), (error) => {
            if (error) {
                Dialog.toast(error.message)
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