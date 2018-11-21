import {StackActions, NavigationActions } from "react-navigation"
import { Jx } from "./Jx"


const c_navigateLength = 8;
const ACT_1 = "1st", ACT_NAV = "navigate", ACT_RESET = "reset";
export class Navigator{
    static _isNavigating = false;
    static _routes;
    static _action = ACT_1;
    static _navigators = [];
    static _navigator1st = null;

    static onNavigate(prevNav, nav, action){
        if(action.type === "Navigation/COMPLETE_TRANSITION" || action.type === "Navigation/RESET"){
            this._routes = nav.routes;
        }      
    }

    static getRouteName(){
        let length =  this._routes.length - 1;
        if(length < 0){
            return "";
        }
        this._routes[length].routeName;
    }

    static push(nav){
        if(this._action === ACT_1){
            this._navigator1st = nav;
        } else if(this._action === ACT_RESET){
            this._navigators = [nav];
        } else {
            this._navigators.push(nav);
        }
    }

    static getNav(){
        let length = this._navigators.length - 1;
        if(length < 0){
            return this._navigator1st;
        }
        return this._navigators[length];
    }

    static getName(){
        return this.getNav().state.params.routeName;
    }

    static renavigate(nav, page){
        nav = nav || this.getNav();
        if(!nav){
            return;
        }
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: page}),
            ],
        });
        this._action = ACT_RESET;
        nav.dispatch(resetAction)
    }

    static navigate(nav, page, params){
        nav = nav || this.getNav();
        if(!nav){
            return;
        }
        this._action = ACT_NAV;
        nav.navigate(page, params);
    }

    static navigateBack(nav){
        nav = nav || this.getNav();
        if(!nav){
            return;
        }
        if(this._action === ACT_1 || this._navigators.length < 2){

        }else {
            this._navigators.pop();
        }
        nav.goBack(null);
    }

    static isNavigating(){
        return this._isNavigating;
    }

    static startNavigating(){
        this._isNavigating = true;
    }

    static stopNavigating(){
        this._isNavigating = false;
    }

    static stopNavigatingTimeOut(){
        setTimeout(this.stopNavigating, 500);
    }
}