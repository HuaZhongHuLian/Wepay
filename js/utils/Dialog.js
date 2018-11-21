import React from 'react'
import {View,ActivityIndicator,Linking} from 'react-native'
import {Overlay} from "teaset"
import {Label, Touch} from "./Component"
import {Color, Layout, Jx, Jpp} from "./Jx"


class ViewContent extends React.PureComponent{
    render(){return <View style = {{
        minHeight: 100, 
        padding: Layout.pad, 
        justifyContent: "center", 
        alignItems: "center",
    }}>
        <Label style={{ fontSize: Layout.c16, color: Color.black, textAlign:"center" }}>{this.props.text}</Label>
    </View>}
}
class Button extends React.PureComponent{
    render(){return <Touch style = {{
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
    }} 
    onPress = {this.props.onPress}>
        <Label style={{ fontSize: Layout.c18, color: Color.black }}>{this.props.title}</Label>
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
    // Layout.radius 为什么报错
    borderRadius: 8, 
}

export class Dialog{
    static refs = {};
    static toasts = {}

    static loading(text_model, modal) {
        this.hiding();
        if(!modal){
            if(Jx.isBoolean(text_model)){
                modal = text_model;
                text_model = null;
            }
        }
        if(!text_model){
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
            <View style={{ backgroundColor: '#333', padding: Layout.pad, borderRadius: Layout.radius, alignItems: 'center' }}>
                <ActivityIndicator size={'large'} animating={true}/>
                <Label style={{ color: "#fff" }}>{text_model}</Label>
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
        if(this.s_toast == 0 || this.s_toast > ((Jpp.height-100) / 30)){
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
                <Label style={{color:Color.white, }}>{Jx.stringify(text)}</Label>
            </View>
        </Overlay.View>);
        this.toasts[key] = key;
        setTimeout(()=>{this.toastTimer(key)}, 2500);
    }

    static error(e){
        if(e && Jx.isString(e)){
            console.log(e);
        }
        return e;
    }


    static close(text, cb, noClose){
        if(!noClose && this.refs[text]){
            // this.refs[text].close();
            Overlay.hide(this.refs[text]);
            delete this.refs[text];
        }
        cb && cb();
    }

    static msg2(text, cbOk, cbCancel, textOk, textCancel) {
        text = Jx.stringify(text);
        this.close(text);

        this.refs[text] = Overlay.show(<OverView modal={true}>
            <View style = {styleMsg}>
                <ViewContent text = {text}/>
                <View style={{ backgroundColor: Color.line, height: 1 }} />
                <View style={{ flexDirection: "row", height: 60}}>
                    <Button title = {textOk || "确定"} onPress = {()=>this.close(text, cbOk)}/>
                    <View style={{ width: 1, backgroundColor: Color.line, height: 40, alignSelf:"center" }} />
                    <Button title = {textCancel || "取消"} onPress = {()=>this.close(text, cbCancel)}/>
                </View>
            </View>
        </OverView>);
    }


    static msg1(text, cbOk, textOk, noClose) {
        text = Jx.stringify(text);
        this.close(text);
        this.refs[text] = Overlay.show(<OverView
        modal={true}>
            <View style = {styleMsg}>
                <ViewContent text = {text}/>
                <View style={{ backgroundColor: Color.line, height: 1 }} />
                <View style={{ flexDirection: "row", height: 60}}>
                    <Button title = {textOk || "确定"} onPress = {()=>this.close(text, cbOk, noClose)}/>
                </View>
            </View>
        </OverView>);
    }

    static msg(text) {
        text = Jx.stringify(text);
        Overlay.show(<OverView
        modal={false}>
            <View style = {{...styleMsg, justifyContent:"center"}}>
                <ViewContent text = {text}/>
            </View>
        </OverView>);
    }

    static msgVersion(url){
        this.msg2("检测到新版本", ()=>{
            Linking.canOpenURL(url)
            .then(ok => {
                if (ok) {
                    return Linking.openURL(url);
                } else {
                    Dialog.toast(r.msg);
                }
            })
            .catch(err => {
                console.error(err.msg)
            });
        }, null, "下载", "稍后");
    }



}