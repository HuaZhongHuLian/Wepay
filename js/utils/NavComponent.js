import React from "react"
import { Navigator } from "./Navigator"
import { Net } from "./Net"
import { Jx } from "./Jx";

export class NavComponent extends React.Component{
    constructor(props){
        super(props);
        Navigator.push(this.props.navigation);
        this.onLeft = this.onLeft.bind(this);
        // console.log(JSON.stringify(this.props.navigation));
    }

    onLeft(){
        Navigator.navigateBack(this.props.navigation);
    }

    getNav(){
        return this.props.navigation;
    }

    getParams(){
        return this.props.navigation.state.params;
    }

    getRouteName(){
        return this.props.navigation.state.routeName;
    }

    componentDidMount(){
    }

    renavigate(page){
        Navigator.renavigate(this.props.navigation, page);
    }

    navigate(page, obj){
        Navigator.navigate(this.props.navigation, page, obj);
    }

    fet(url, obj){
        return Net.fet(this.props.navigation.state.routeName, url, obj);
    }

    fetid(url, obj){
        return Net.fetid(this.props.navigation.state.routeName, url, obj);
    }

    is24(r, notNavigate){
        if(r.is1){
            return false;
        }
        if(r.code === 2 || r.code === 4){
            if(Jx.isUndefined(notNavigate) || (!notNavigate)){
                Navigator.renavigate(this.props.navigation, "LoginPage");
            }
        }
        return true;
    }
}
