import React from "react";

export class Util{
    static isElement(any){return React.isValidElement(any);}
    static isString(any){return typeof(any) === "string"}
    static isNumber(any){return typeof(any) === "number"}
    static isObject(any){return typeof(any) === "object"}
    static isBoolean(any){return typeof(any) === "boolean"}
    static isUndefined(any){return typeof(any) === "undefined"}
    static isArray(arr){return Array.isArray(arr);}
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