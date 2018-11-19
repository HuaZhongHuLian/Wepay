import {StackActions, NavigationActions } from "react-navigation";
import { Util, Net } from "./Component";


const c_navigateLength = 8;
export class Navigator{
    static _navigators = [];
    static _navigatorIndex = -1;
    static _isNavigating = false;

    static setNavigator(nav){
        if((++this._navigatorIndex) === c_navigateLength){
            this._navigatorIndex = 0;
        }
        this._navigators[this._navigatorIndex] = nav;
    }

    static getNavigator(){
        return this._navigators[this._navigatorIndex];
    }

    static renavigate(nav_page, page){
        // if(this.isNavigating()){
        //     return;
        // }
        if(!page){
            page = nav_page;
            nav_page = this.getNavigator();
        }
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: page }),
            ],
        });
        // this.startNavigating();
        Net.clear();
        nav_page.dispatch(resetAction)
    }

    static navigate(nav_page, page_obj, obj){
        // if(this.isNavigating()){
        //     return;
        // }
        if(!obj){
            if(!page_obj){
                page_obj = nav_page;
                nav_page = this.getNavigator();
            } else if(Util.isString(nav_page)){
                obj = page_obj;
                page_obj = nav_page;
                nav_page = this.getNavigator();
            }
        }
        // this.startNavigating();
        Net.clear();
        nav_page.navigate(page_obj, obj);
    }

    static navigateBack(nav){
        // if(this.isNavigating()){
        //     return;
        // }
        nav = nav || this.getNavigator();
        // this.startNavigating();
        Net.clear();
        // console.log("导航信息nav...........");
        // console.log(nav);
        // console.log("导航信息getNavigator...........");
        // console.log(this.getNavigator());
        nav.goBack(null);
        if((--this._navigatorIndex) < 0){
            console.log("导航返回越界");
        }
    }

    static isNavigating(){
        return this._isNavigating;
    }

    static startNavigating(){
        this._isNavigating = true;
    }

    static stopNavigatingRightNow(){
        this._isNavigating = false;
    }

    static stopNavigating(){
        setTimeout(this.stopNavigatingRightNow, 500);
    }
}