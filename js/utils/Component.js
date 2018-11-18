import React from "react";
import {Platform,  Dimensions, View, Text as _Text, StatusBar as _StatusBar, Image, TouchableHighlight, Linking} from "react-native"
import {StackActions, NavigationActions } from "react-navigation"
import {_Dialog} from "./Dialog"
import {_Net} from "./Net"
import {_Util} from "./Util"

import icons from "../../res/images/_icons";
import images from "../../res/pictures/_images"
import bankcards from "../../res/bank_card_icon/_bankcard"


// 只适用于(不支持横竖屏切换)
const {width, height} = Dimensions.get("window");
export const vsSize = {width : width, height : height};
export const isAndroid = (Platform.OS != "ios");
export const isFullScreen = (height / width) > 1.8 || isAndroid

export const Icons = icons;
export const Images = images;
export const Bankcard = bankcards;

export const Touch = TouchableHighlight;
export const Dialog = _Dialog;
export const Net = _Net;
export const U = _Util;

export const KEY_ACCOUNT = "account_password";
export const KEY_SESSION = "sessionId";

export const C = {
    theme : "#48B1A3",
    line : "#E0E0E0",
    back : "#E0E0E0",
    black : "black",
    white : "white",
    gray : "gray",
    transparent : "transparent",   
    opacity : "rgba(0,0,0,0.7)",

    c13 : 13,
    cFontSize : 14,
    c14 : 14,
    c16 : 16,
    c18 : 18,
    c20 : 20,
    cPad : 10,
    cMargin : 10,
    cRadius : 8,
}


// class StatusBarAndroid extends _StatusBar{
//     static defaultProps = {
//         ..._StatusBar.defaultProps,
//         style : {
//             ..._StatusBar.defaultProps.style,
//             backgroundColor : C.theme,
//         }
//     }
// }

export const StatusBar = isAndroid ? <_StatusBar backgroundColor = {C.theme}/> : <View style = {{backgroundColor : C.theme, height : 16}}/>;


// export class Text extends _Text{
//     render(){
//         let {style, ...other} = this.props;
//         style = {
//             fontSize:C.cFontSize,
//             ...style,
//         }
//         this.props = {style, ...other};
//         return super.render();
//     }  
// }
export const Text = _Text;


export class NavLeft extends React.PureComponent{
    render(){return <Touch
            style = {{paddingHorizontal:C.cPad, flexDirection:"row", alignItems:"center"}}
            onPress={this.props.onLeft}
        >
            <View style = {{flexDirection:"row"}}>
                <Image opacity = {this.props.onLeft ? 1 : 0} source={icons.fanhui}/>
                <Text style = {{fontSize:C.c16, color:C.transparent}}>返回</Text>
            </View>
        </Touch>
    }
}

export class NavRight extends React.PureComponent{
    render(){return <Touch 
            style = {{flexDirection:"row"}}
            onPress={this.props.onRight}
        >
            <View style = {{paddingHorizontal:C.cPad, flexDirection:"row", alignItems:"center"}}>
                <Image opacity = {0} source={icons.fanhui}/>
                <Text style = {{fontSize:C.c16, color:this.props.onRight ? C.white : C.transparent }}>更多</Text>
            </View>
        </Touch>
    }
}

export class NavTitle extends React.PureComponent{
    render(){
        return <View style = {{flex:1, justifyContent:"center", alignItems:"center"}}>
            <Text style = {{fontSize:C.c20, color:C.white}}>{this.props.title}</Text>
        </View>
    }
}

export class NavBar extends React.PureComponent{
    render(){
        let title = this.props.title || "";
        return <View style={{
            backgroundColor:C.theme, 
            flexDirection:"row", 
            alignItems:"stretch", 
            minHeight:40, 
        }}>
            {this.props.left || <NavLeft onLeft = {this.props.onLeft}/>}
            {(typeof(this.props.title) == "string") ? <NavTitle title = {this.props.title}/> : (this.props.title)}
            {this.props.right || <NavRight onRight = {this.props.onRight}/>}
        </View>
    }
}



export class NavComponent extends React.Component{
    static s_isNavigating;
    constructor(props){
        super(props);
        this.params = this.props.navigation.state.params;
        this.onLeft = this.onLeft.bind(this);
    }

    componentDidMount(){
        NavComponent.s_isNavigating = false;
    }

    onLeft(){
        if(NavComponent.s_isNavigating){
            return;
        }
        Net.clear();       
        this.props.navigation.goBack(null);
    }

    static renavigate(nav, page){
        if(this.s_isNavigating){
            return;
        }
        this.s_isNavigating = true;
        Net.clear();
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: page }),
            ],
        });
        nav.dispatch(resetAction)
    }

    renavigate(page){
        NavComponent.renavigate(this.props.navigation, page);
    }


    static navigate(nav, page, obj){
        if(this.s_isNavigating){
            return;
        }
        this.s_isNavigating = true;
        Net.clear();
        nav.navigate(page, obj);
    }

    navigate(page, obj){
        NavComponent.navigate(this.props.navigation, page, obj);
    }

    fet(url, obj, cb){
        Net.fet(url, obj, cb, this.props.navigation);
    }

    fetid(url, obj_str, cb){
        Net.fetid(url, obj_str, cb, this.props.navigation);
    }
}



export class Button extends Touch {
    render(){
        let {style, children, pure, round, ...other} = this.props;
        pure = pure || true;
        const fontSize = (style && style.fontSize) || C.cFontSize;
        const color = (style && style.color) || C.theme;
        children = children || <Text 
                style = {{fontSize:fontSize, color: pure ? C.white : color}}>
                {this.props.title || "button"}
            </Text>;
        style = {
            minWidth : C.cFontSize * 3 + C.cPad * 2,
            width : C.cFontSize * 4 + C.cPad * 2,
            height : C.cFontSize + C.cPad * 2,
            justifyContent:"center",
            alignItems:"center",
            borderRadius : round ? (parseInt(C.cFontSize / 2) + C.cPad) : 4,
            borderWidth : pure ? 0 : 1,
            borderColor : color,
            backgroundColor : pure ? color : null,
            fontSize : fontSize,
            color : color,
            ...style,
        }
        this.props = {style, children, ...other};
        return super.render();
    }
}

export class Button1 extends Button {
    render(){
        let {style, ...other} = this.props;
        style = {
            alignSelf: 'center',
            fontWeight: "900",
            marginVertical:30,
            borderRadius : 8,
            width : 180,
            height : 50,
            fontSize : C.c20,
            ...style,
        }
        this.props = {style, ...other};
        return super.render();
    }   
}