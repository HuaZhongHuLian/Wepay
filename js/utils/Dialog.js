import React from 'react';
import {Text,View,ActivityIndicator, Dimensions} from 'react-native';
import {Overlay, Toast, ActionSheet, AlbumView} from "teaset";
import { C, Touch, vsSize } from "./Component";

class ViewContent extends React.PureComponent{
    render(){return <View style = {{
        minHeight: 100, 
        padding: C.cPad, 
        justifyContent: "center", 
        alignItems: "center",
    }}>
        <Text style={{ fontSize: C.c16, color: C.black }}>{this.props.text}</Text>
    </View>}
}

class Button extends React.PureComponent{
    render(){return <Touch style = {{
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
    }} 
    onPress = {this.props.onPress}>
        <Text style={{ fontSize: C.c18, color: C.black }}>{this.props.title}</Text>
    </Touch>}
}

// <OverView style = {{alignItems: 'center', justifyContent: 'center'}}
// log报错 Super expression must either be null or a function, not string
// defaultProps 确实不太理解覆盖的问题
class OverView extends Overlay.View{
    static defaultProps = {
        style : {
            alignItems: 'center', justifyContent: 'center',
        }
    }
}

const styleMsg = {
    backgroundColor: "white", 
    minWidth: 300, 
    width: "80%", 
    minHeight: 160, 
    // C.cRadius 为什么报错
    borderRadius: 8, 
}

export class _Dialog{
    static refs = {};
    static toasts = {}

    static stringify(text){
        if(typeof(text)=="string"){
            return text;
        }
        return JSON.stringify(text);
    }

    static close(text, cb, closable){
        if((closable !== false) && this.refs[text]){
            // this.refs[text].close();
            Overlay.hide(this.refs[text]);
            delete this.refs[text];
        } 
        cb && cb();
    }

    static msg2(text, cbOk, cbCancel, textOk, textCancel) {
        text = this.stringify(text);
        this.close(text);

        this.refs[text] = Overlay.show(<OverView modal={true}>
            <View style = {styleMsg}>
                <ViewContent text = {text}/>
                <View style={{ backgroundColor: C.line, height: 1 }} />
                <View style={{ flexDirection: "row", height: 60}}>
                    <Button title = {textOk || "确定"} onPress = {()=>this.close(text, cbOk)}/>
                    <View style={{ width: 1, backgroundColor: C.line, height: 40, alignSelf:"center" }} />
                    <Button title = {textCancel || "取消"} onPress = {()=>this.close(text, cbCancel)}/>
                </View>
            </View>
        </OverView>);
    }


    static msg1(text, cbOk, textOk, closable) {
        text = this.stringify(text);
        this.close(text);
        this.refs[text] = Overlay.show(<OverView
        modal={true}>
            <View style = {styleMsg}>
                <ViewContent text = {text}/>
                <View style={{ backgroundColor: C.line, height: 1 }} />
                <View style={{ flexDirection: "row", height: 60}}>
                    <Button title = {textOk || "确定"} onPress = {()=>this.close(text, cbOk, closable)}/>
                </View>
            </View>
        </OverView>);
    }

    static msg(text) {
        text = this.stringify(text);
        Overlay.show(<OverView
        modal={false}>
            <View style = {styleMsg}>
                <ViewContent text = {text}/>
            </View>
        </OverView>);
    }

    static loading(modal, text) {
        this.hiding();
        if(!text || text.length < 1){
            this.loadingView = Overlay.show(<OverView
                modal={modal || false}
                overlayOpacity={0}>
                <ActivityIndicator size={'large'} animating={true}/>
            </OverView>);
            return;
        }
        this.loadingView = Overlay.show(<OverView
            modal={modal || false}
            overlayOpacity={0}>
            <View style={{ backgroundColor: '#333', padding: C.cPad, borderRadius: C.cRadius, alignItems: 'center' }}>
                <ActivityIndicator size={'large'} animating={true}/>
                <Text style={{ color: "#fff" }}>{text}</Text>
            </View>
        </OverView>);
    }

    static hiding(err) {
        this.loadingView && Overlay.hide(this.loadingView);
    }

    static s_toast = 0;
    static s_toastButtom = 0;
    static toastTimer(key){
        if(this.toasts[key]){
            Overlay.hide(this.toasts[key]);
            delete this.toasts[key];
        }
        this.s_toast = 0;
        for(let k in this.toasts){
            ++this.s_toast;
        }
        if(this.s_toast == 0 || this.s_toast > ((vsSize.height-100) / 30)){
            this.s_toastButtom = 0;
        }        
    }

    static toast(text){
        let key = Overlay.show(<Overlay.View 
            style = {{justifyContent:"flex-end", alignItems:"center"}}
            overlayOpacity={0}
            overlayPointerEvents = {"none"}>
            <View style = {{
                backgroundColor:"rgba(0,0,0,0.8)", 
                borderRadius: 6, 
                paddingVertical:4,
                paddingHorizontal:10,
                bottom : (++this.s_toastButtom) * 30 + 60,
            }}>
                <Text style={{color:C.white, }}>{this.stringify(text)}</Text>
            </View>
        </Overlay.View>);
        this.toasts[key] = key;
        setTimeout(()=>{this.toastTimer(key)}, 2500);
    }
}