import React from "react";
import { AsyncStorage } from 'react-native';
export class _Util{
    static isElement(any){return React.isValidElement(any);}
    static isString(any){return typeof(any) == "string"}
    static isNumber(any){return typeof(any) == "number"}
    static isObject(any){return typeof(any) == "object"}
    static isBoolean(any){return typeof(any) == "boolean"}
    static isUndefined(any){return typeof(any) == "undefined"}
    static isArray(arr){return Array.isArray(arr);}
    static isFloat(str){ return /^[0-9]+.?[0-9]*$/.test(str);}
    static replaceInt(str){return str.replace(/[^\d]/g, "");}
    static replaceFloat(str){return str.replace(/[^\a-\z\A-\Z0-9]/g, "");}
    static replaceDAZ(str){return str.replace(/[^\a-\z\A-\Z0-9]/g, "");}
    static toDate(t, symbol, cut) {
        symbol = symbol || "-";
        let date = new Date(t*1000);
        t = n=>(n>9)?n:("0"+n);
        symbol = date.getFullYear() + symbol + t(date.getMonth()) + symbol + t(date.getDate());
        if(this.isBoolean(cut) && cut){
            return symbol;
        }
        cut = cut || " ";
        return symbol + cut + date.toTimeString().substr(0, 8)
    }

    static toFile(uri){
        let arr = uri.split('/');
        let starIndex = uri.lastIndexOf(".");
        let suffix = uri.substring(starIndex,uri.length).toLocaleLowerCase();
        if(suffix === ".jpg" || suffix===".png" || suffix === ".jpeg"){
            return { 
                uri: uri, 
                type: "application/octet-stream", 
                name: arr[arr.length - 1] 
            };
        }
        return null;
    }

    static save(key, info) {
        AsyncStorage.setItem(key, JSON.stringify(info), (error) => {
            if (error) {
                Dialog.toast(error.message)
            }
        });
    }

    static load(key, cb) {
        AsyncStorage.getItem(key, (error, result) => {
            cb(error ? null : JSON.parse(result));
        })
    }
}