import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Modal,
    TextInput,
    TouchableHighlight,
    Image,
    Platform,
} from 'react-native';
import DialogUtils from '../../util/DialogUtils';
import PassWordInput from '../../common/PassNumInput'
import HttpUtils from '../../util/HttpUtils';
import BaseUrl from '../../util/BaseUrl';
import Utils from '../../util/Utils';
import {Overlay, Toast, ActionSheet, Theme, Label, Button, AlbumView} from "teaset";


export default class ZhongChouBuy extends Component{
    constructor(props){
        super(props);
        this.state = {
            count : 0,
            total : 0,
            visible : false,
            // count 被强制<限额,大于限额的情况，都不会刷新(==限额,不变)
            flag : 0
        }
        this.quota = 0;
        this.currencyName = "";
        this.dprice = 0;
        this.amount = 0;
        this.id = 0;
        this.sessionId = '';
        this.countShow = "";
    }

    setVisible(visible){
        this.setState({
            visible : visible
        })
    }

    show(sessionId, id, quota, currencyName, dprice, amount){
        this.setState({
            visible : true,
            count : 0,
            total : 0,
        })

        // alert(JSON.stringify([sessionId, id, quota, currencyName, dprice, amount]));
        this.sessionId = sessionId;
        this.id = id;
        this.quota = quota;
        this.currencyName = currencyName;
        this.dprice = dprice;
        this.amount = amount;
        this.countShow = "";
    }

    static s_flag = 0;
    render(){
        const w = Utils.getWidth()-80;
        const h = 20;
        const styleRow = {flexDirection:"row", width: w, alignItems : 'center', height : 40};
        const styleText = {fontSize:15,color:Colors.text6};
        const styleInput = {flex : 1, fontSize : 15, color : 'black'};
        const viewLine = <View style={{backgroundColor:Colors.red,height: 0.5,width: w}}></View>;

        return <Modal
            // animationType="fade"
            transparent={true}
            visible={this.state.visible}
            // onRequestClose={() => {
            //     alert("Modal has been closed.");
            // }}
        >
            <View style={{backgroundColor:'rgba(0,0,0,0.4)',flex:1,height:Utils.getHeight(),justifyContent:"center"}}>
            <View style={{backgroundColor: "#fff",marginLeft:20,marginRight:20, padding: 20, borderRadius: 8,justifyContent:"center", alignItems: 'center'}}>

                <Text style={{}}>认购</Text>

                <View style={styleRow}>
                    <Text style={styleText}>限 额: </Text>
                    <TextInput
                        style={styleInput}
                        underlineColorAndroid='transparent'
                        editable={false}
                        value={this.quota.toString()}
                    />
                    {/* <Text  style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>Wepay</Text> */}
                </View>
                {viewLine}

                <View style={styleRow}>
                    <Text style={styleText}>单 价: </Text>
                    <TextInput
                        style={styleInput}
                        underlineColorAndroid='transparent'
                        editable={false}
                        value={this.dprice + ' ' + this.currencyName}
                    />
                    <Text  style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}></Text>
                </View>
                {viewLine}

                <View style={styleRow}>
                    <Text style={styleText}>数 量: </Text>
                    <TextInput
                        style={styleInput}
                        placeholder={'请输入数量'}
                        placeholderTextColor={'#999'}
                        underlineColorAndroid='transparent'
                        keyboardType={"numeric"}
                        editable={true}
                        value={this.countShow}
                        onChangeText={(text)=>{
                            if(text.length < 1){
                                text = "0";
                            }
                            text = text.replace(/[^\d]+/, '');
                            let num = parseInt(text);
                            if(num > this.quota){
                                num = this.quota;
                            }
                            
                            this.countShow = num == 0 ? "" : num;
                            this.setState({
                                flag : ++ZhongChouBuy.s_flag,
                                count: num,
                                total: num * this.dprice
                            })
                        }}
                    />
                </View>
                {viewLine}

                <View style={styleRow}>
                    <Text style={styleText}>总 价: </Text>
                    <TextInput
                        style={styleInput}
                        underlineColorAndroid='transparent'
                        editable={false}
                        value={this.state.total == 0 ? "" : (this.state.total + ' ' + this.currencyName)}
                    />
                    {/*<Text  style={{fontSize:15,color:Colors.text6, alignSelf:"center"}}>{Utils.formatNumBer(this.state.number* this.state.unitPrice,4)}</Text>*/}
                </View>
                {viewLine}

                <TouchableOpacity
                    onPress={() => this.setState({visible : false,})}
                    style={{position:"absolute", left:0,top:0,padding:10}} >
                    <Image source={require('../../../res/images/close.png')}/>
                </TouchableOpacity> 


                <TouchableHighlight style={{marginTop:20, padding : 10, borderColor : 'blue', borderRadius : 3, borderWidth : 1}} onPress={() =>this.onClick(this.state.total)}>
                    <Text style = {{fontSize : 16, color : '#08F'}}>确认购买</Text>
                </TouchableHighlight>
            </View>
            </View>
        </Modal>;
    }

    onClick(total){
        this.setVisible(false);
        if(this.state.count < 1){
            DialogUtils.showMsg('请输入购买数量', '返回', ()=>this.setVisible(true));
            return;
        }
        if(this.state.total > this.amount){
            DialogUtils.showMsg(this.currencyName + '不足', '返回', ()=>this.setVisible(true));
            return;
        }

        PassWordInput.showPassWordInput((safetyPwd) => {
            DialogUtils.showLoading('', true);
            HttpUtils.postData(BaseUrl.getCrowdFundingBuyUrl(), {
                sessionId: this.sessionId,
                safetyPwd : safetyPwd,
                buyNum : this.state.count,
                crowdId : this.id,
            }).then(result => {
                DialogUtils.hideLoading();
                if (result.code == 1) {
                    DialogUtils.showMsg(result.msg || '购买成功', () => {this.props.onBuy && this.props.onBuy(this.currencyName);})
                    this.setVisible(false);
                } else {
                    DialogUtils.showToast(result.msg);
                    if(result.code == 2 || result.code == 4){
                        this.goLogin(this.props.navigation);
                    }
                }
            }).catch(error => {
                DialogUtils.hideLoading()
            });
        });
    }
}