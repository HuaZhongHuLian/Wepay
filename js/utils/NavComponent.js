import React from "react";
import { Navigator } from "./Navigator";
import { Net } from "./Component";

export class NavComponent extends React.Component{
    constructor(props){
        super(props);
        Navigator.setNavigator(this.props.navigation);
        this.onLeft = this.onLeft.bind(this);
    }

    onLeft(){
        Navigator.navigateBack(this.props.navigation);
    }

    getParams(){
        return this.props.navigation.state.params;
    }

    componentDidMount(){

    }

    renavigate(page){
        Navigator.renavigate(this.props.navigation, page);
    }

    navigate(page, obj){
        Navigator.navigate(this.props.navigation, page, obj);
    }


    fet(url, obj, cb1){
        Net.fet(url, obj, cb1, this.props.navigation);
    }

    fetid(url, obj, cb1){
        Net.fetid(url, obj, cb1, this.props.navigation);
    }
}
