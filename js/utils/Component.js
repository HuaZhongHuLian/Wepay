import React from "react";
import {Platform, Dimensions, Text as Label, TouchableHighlight as Touch, View, Image, StatusBar, TextInput} from "react-native";

import {Icons} from "../../res/images/_icons";
import {Images} from "../../res/pictures/_images";
import {Bankcards} from "../../res/bank_card_icon/_bankcard";
import {Util} from "./Util";
import {Dialog} from "./Dialog"
import {Net} from "./Net"
import { Navigator } from "./Navigator";

export {Label, Touch, Icons, Images, Bankcards, Util, Dialog, Net}
const {width, height} = Dimensions.get("window");
export const vsWidth = width;
export const vsHeight = height;
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
export const App = Object.freeze({
    isAndroid : (Platform.OS === "android"),
    isIOS : (Platform.OS === "ios"),
    isScreen : (height / width) < 1.8 && (Platform.OS === "ios"),
});

export const renavigate = function(nav, page){
    const resetAction = StackActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: page }),
        ],
    });
    nav.dispatch(resetAction)
}

class StatusBarAndroid extends React.PureComponent{
    render(){return <StatusBar backgroundColor = {Color.theme}/>}
}
class StatusBarIOS extends React.PureComponent{
    render(){return <View style = {{backgroundColor : Color.theme, height : 16}}/>}
}
export const StateBar = App.isAndroid ? StatusBarAndroid : StatusBarIOS;


export class NavLeft extends React.PureComponent{
    render(){
        return <Touch
            style = {{paddingHorizontal:Layout.pad, flexDirection:"row", alignItems:"center"}}
            onPress={this.props.onLeft}
        >
            <View style = {{flexDirection:"row"}}>
                <Image opacity = {this.props.onLeft ? 1 : 0} source={Icons.fanhui}/>
                <Label style = {{fontSize:Layout.c16, color:Color.transparent}}>返回</Label>
            </View>
        </Touch>
    }
}

export class NavRight extends React.PureComponent{
    render(){return <Touch 
            style = {{flexDirection:"row"}}
            onPress={this.props.onRight}
        >
            <View style = {{paddingHorizontal:Layout.pad, flexDirection:"row", alignItems:"center"}}>
                <Image opacity = {0} source={Icons.fanhui}/>
                <Label style = {{fontSize:Layout.c16, color:this.props.onRight ? Color.white : Color.transparent }}>更多</Label>
            </View>
        </Touch>
    }
}

export class NavTitle extends React.PureComponent{
    render(){
        return <View style = {{flex:1, justifyContent:"center", alignItems:"center"}}>
            <Label style = {{fontSize:Layout.c20, color:Color.white}}>{this.props.title}</Label>
        </View>
    }
}

export class NavBar extends React.PureComponent{
    render(){
        let title = this.props.title || "";
        return <View style={{
            backgroundColor:Color.theme, 
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


export class Button extends Touch {
    render(){
        let {style, children, pure, round, ...other} = this.props;
        pure = pure || true;
        const c14 = Layout.c14;
        const fontSize = (style && style.fontSize) || c14;
        const color = (style && style.color) || Color.theme;
        children = children || <Label 
                style = {{fontSize:fontSize, color: pure ? Color.white : color}}>
                {this.props.title || "button"}
            </Label>;
        style = {
            minWidth : c14 * 3 + Layout.pad * 2,
            width : c14 * 4 + Layout.pad * 2,
            height : c14 + Layout.pad * 2,
            justifyContent:"center",
            alignItems:"center",
            borderRadius : round ? (parseInt(c14 / 2) + Layout.pad) : 4,
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
            marginVertical:25,
            borderRadius : 8,
            width : 180,
            height : 50,
            fontSize : Layout.c20,
            ...style,
        }
        this.props = {style, ...other};
        return super.render();
    }   
}


export class Input extends TextInput {
    render(){
        //, placeholderTextColor,
        let {style, underlineColorAndroid, ...other} = this.props;
        // placeholderTextColor = placeholderTextColor || Color.gray;
        underlineColorAndroid = underlineColorAndroid || Color.transparent;
        const c16 = Layout.c16;
        style = {
            borderRadius : 4,
            borderWidth : 1,
            paddingLeft : 5,
            borderColor : "#BBB",
            fontSize : c16,
            height : App.isAndroid ? null : 50,
            ...style,
        }
        //, placeholderTextColor
        this.props = {style, underlineColorAndroid, ...other};
        return super.render();
    }
}