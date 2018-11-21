import React from "react"
import {Platform, Dimensions} from "react-native"
const {width, height} = Dimensions.get("window")
export const Jpp = Object.freeze({
    width, height,
    isAndroid : (Platform.OS === "android"),
    isIOS : (Platform.OS === "ios"),
    isScreen : (height / width) < 1.8 && (Platform.OS === "ios"),
});
export const Color = Object.freeze({
    theme : "#48B1A3", 
    line : "#E0E0E0",
    back : "#E0E0E0",
    black : "black",
    white : "white",
    gray : "gray",
    transparent : "transparent",   
    opacity : "rgba(0,0,0,0.7)",
});
export const Layout = Object.freeze({
    c13 : 13,
    c14 : 14,  // 默认 14
    c16 : 16,
    c18 : 18,
    c20 : 20,
    pad : 10,
    margin : 10,
    radius : 8,
});

export class Jx {
    static _increment = 0;
    static getIncrement(){return ++this._increment;}
    static isElement(any){return React.isValidElement(any);}
    static isString(any){return typeof(any) === "string";}
    static isNumber(any){return typeof(any) === "number";}
    static isObject(any){return typeof(any) === "object";}
    static isObjectEmpty(any){return typeof(any) === "object" && JSON.stringify(any) === "{}"}
    static isBoolean(any){return typeof(any) === "boolean";}
    static isUndefined(any){return typeof(any) === "undefined";}
    static isArray(arr){return Array.isArray(arr);}
    static isArrayEmpty(arr){return Array.isArray(arr) && arr.length === 0;}
    static isFloat(str){ return /^[0-9]+.?[0-9]*$/.test(str);}
    static replaceInt(str){return str.replace(/[^\d]/g, "");}
    static replaceFloat(str){return str.replace(/[^\a-\z\A-\Z0-9]/g, "");}
    static replaceDAZ(str){return str.replace(/[^\a-\z\A-\Z0-9]/g, "");}
    static stringify(text){return this.isObject(text) ? JSON.stringify(text) : text;}
    
    static toDate(ti, symbol, cut_link) {
        symbol = symbol || "-";
        let date = new Date(ti*1000);
        ti = n=>(n>9)?n:("0"+n);
        symbol = date.getFullYear() + symbol + ti(date.getMonth()) + symbol + ti(date.getDate());
        if(this.isBoolean(cut_link) && cut_link){
            return symbol;
        }
        cut_link = cut_link || " ";
        return symbol + cut_link + date.toTimeString().substr(0, 8)
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

    static checkInterger(str){
        let str2 = str;
        if(str2.length < 0){
            return "输入不能为空";
        }
        str2 = parseInt(str2);
        if(str2 < 1 || str2.toString() != str){
            return "请输入整数";
        }
        return ""
    }
}