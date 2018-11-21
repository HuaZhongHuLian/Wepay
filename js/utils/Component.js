import React from "react"
import {Text as Label, TouchableHighlight as Touch, View, Image, StatusBar, TextInput} from "react-native"
import {Color, Layout, Jpp, Jx} from "./Jx"

export {Label, Touch}

class StatusBarAndroid extends React.PureComponent{
    render(){return <StatusBar backgroundColor = {Color.theme}/>}
}
class StatusBarIOS extends React.PureComponent{
    render(){return <View style = {{backgroundColor : Color.theme, height : 16}}/>}
}
export const StateBar = Jpp.isAndroid ? StatusBarAndroid : StatusBarIOS;


const c_iconBack = require("./_back.png");
export class NavLeft extends React.PureComponent{
    render(){
        return <Touch
            style = {{paddingHorizontal:Layout.pad, flexDirection:"row", alignItems:"center"}}
            onPress={this.props.onLeft}
        >
            <View style = {{flexDirection:"row"}}>
                <Image opacity = {this.props.onLeft ? 1 : 0} source={c_iconBack}/>
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
                <Image opacity = {0} source={c_iconBack}/>
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
            {Jx.isString(this.props.title) ? <NavTitle title = {this.props.title}/> : (this.props.title)}
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
        let {style, underlineColorAndroid, ...other} = this.props;
        underlineColorAndroid = underlineColorAndroid || Color.transparent;
        const c16 = Layout.c16;
        style = {
            borderRadius : 4,
            borderWidth : 1,
            paddingLeft : 5,
            borderColor : "#BBB",
            fontSize : c16,
            height : Jpp.isAndroid ? null : 50,
            ...style,
        }
        this.props = {style, underlineColorAndroid, ...other};
        return super.render();
    }
}