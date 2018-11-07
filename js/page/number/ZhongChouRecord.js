import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import Utils from "../../util/Utils";
import HttpUtils from "../../util/HttpUtils";
import { SegmentedBar, Label } from 'teaset';
import BaseUrl from '../../util/BaseUrl';
import RefreshFlatList from '../../common/RefreshFlatList';
import DialogUtils from '../../util/DialogUtils';
import Colors from "../../util/Colors"
import ZhongChou from './ZhongChou'
import CheckMoney from '../../common/CheckMoney';

/**
 * 众筹记录
 */

const width = Utils.getWidth()
export default class ZhongChouRecord extends BaseComponent {
    pageIndex = 1;
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        }
        this.userInfo = this.getUserInfo()
        this.activeIndex = 0;
        this.currencySelect = 0;
    }
    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }
    selectIndex(index) {
        this.setState({ activeIndex: index })
        this.activeIndex = index;
        this._refreshData()
    }
    render() {
        let { activeIndex } = this.state;
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={"认购记录"}
                    navigation={this.props.navigation} />
                <View style={{ flexDirection: "row", backgroundColor: Colors.white, justifyContent: "center", alignItems : 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.selectIndex(0)}
                        style={{
                            borderColor: Colors.r1, borderWidth: 1, borderTopLeftRadius: 18, borderBottomLeftRadius: 18,
                            justifyContent: "center", alignItems: "center", backgroundColor: activeIndex != 0 ? Colors.white : Colors.red,
                            marginVertical : 10, width : '30%'
                        }}>
                        <Text style={{ padding: 8, fontSize: 16, marginLeft: 10, marginRight: 10, color: activeIndex != 0 ? Colors.red : Colors.white }}>购买记录</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.selectIndex(2)}
                        style={{
                            borderColor: Colors.r1, borderWidth: 1, 
                            justifyContent: "center", alignItems: "center", backgroundColor: activeIndex != 2 ? Colors.white : Colors.red,
                            marginVertical : 10, width : '30%'
                        }}>
                        <Text style={{ padding: 8, fontSize: 16, marginLeft: 10, marginRight: 10, color: activeIndex != 2 ? Colors.red : Colors.white }}>认购数量</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.selectIndex(1)}
                        style={{
                            borderColor: Colors.r1, borderWidth: 1, borderTopRightRadius: 18, borderBottomRightRadius: 18,
                            justifyContent: "center", alignItems: "center", backgroundColor: activeIndex == 1 ? Colors.red : Colors.white,
                            marginVertical : 10, width : '30%'
                        }} >
                        <Text style={{ padding: 8, fontSize: 16, marginLeft: 10, marginRight: 10, color: activeIndex == 1 ? Colors.white : Colors.red }}>释放记录</Text>
                    </TouchableOpacity>
                </View>
                {this.renderItemTitle()}
                <View style={{ flex: 1, backgroundColor: "#f1f1f1", marginTop: 1, }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        isDownLoad={true}
                        onRefreshs={() => this._refreshData()}
                        onLoadData={() => this._onLoadData()}
                        renderItem={(items) => this.renderItem(items)}
                    />
                </View>
            </View>
        );
    }

    static CurrencyNames = ['Wepay', '比特币', '莱特币', '以太坊', '狗狗币']
    renderItemTitle() {
        if(0){
            let view1 = <View style={{flexDirection: "row", padding: 5, marginTop: 1,backgroundColor:Colors.bgColor ,paddingTop:10,paddingBottom:10}}>
                <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                    <Text style={{ fontSize: 14, color: Colors.text6, flex: 1,textAlign:"center" }}>数量</Text>
                </View>
                <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                    <Text style={{ fontSize: 14, color: Colors.text6, flex: 1,textAlign:"center" }}>总价</Text>
                </View>
                <View style={{ flexDirection: "row", flex: 2, alignItems: "center"}}>
                    <Text style={{ fontSize: 14, color: Colors.text6, flex: 1 ,textAlign:"center"}}>时间</Text>
                </View>
            </View>

            let view2 = <View style={{flexDirection: "row", padding: 5, marginTop: 1,backgroundColor:Colors.bgColor ,paddingTop:10,paddingBottom:10}}>
                <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                    <Text style={{ fontSize: 14, color: Colors.text6, flex: 1,textAlign:"center" }}>数量</Text>
                </View>
                <View style={{ flexDirection: "row", flex: 1, alignItems: "center"}}>
                    <Text style={{ fontSize: 14, color: Colors.text6, flex: 1 ,textAlign:"center"}}>时间</Text>
                </View>
            </View>
        }

        let styleTitle = {textAlign : "center", color : "black", width : (Utils.getWidth() - 20) / 3 - 1, paddingVertical : 10};
        let viewLine = <View style = {{width : 1, height : 30, backgroundColor : "#F1F1F1"}}/>;
        return this.state.activeIndex===0?<View />: (this.state.activeIndex===1 ? <CheckMoney
        // selectWidth = {120}
        // selectHeight = {null}
        //unselectedColor = {'#AAA'}
        //fontStyle = {{fontSize :20, fontWeight :'900'}}
        //fontDesc = {(t)=>{return (t + '元')}}
        styleItem = {{marginVertical : 5}}
        viewStyle = {{paddingVertical : 0}}
        arrText={ZhongChouRecord.CurrencyNames}
        onSelected={(index, value) => {this.currencySelect = index; this.selectIndex(1);}}
        seleIndex = {this.currencySelect}
        selectedValue = {ZhongChouRecord.CurrencyNames[this.currencySelect]}/> : 
        <View style = {{flexDirection : "row", paddingHorizontal : 10, justifyContent : "center", alignItems : "center"}}>
            <Text style = {styleTitle}>认购数量</Text>
            {viewLine}
            <Text style = {styleTitle}>剩余数量</Text>
            {viewLine}
            <Text style = {styleTitle}>日释放量</Text>
        </View>)
    }

    
    renderItem(items) {
        /**
         * "buyNum": 25,
            "createTime": "1540558829",
            "consume": 50,
            "currency": 1,
            "projectName": "vpay"
         */
        let data =  items.item;
        let view1 = <View style={{flexDirection: "row", justifyContent:'space-between', alignItems:'center', paddingHorizontal : 10, paddingVertical : 5,backgroundColor:Colors.white, borderTopWidth : 0.5, borderBottomWidth:0.5, borderColor : '#DDD'}}>
            <View style={{}}>
                <Text style={{ color: 'black' }}>购买 {data.buyNum} {data.projectName}</Text>
                <Text style={{ fontSize : 13, color: 'gray', marginTop : 5 }}>{Utils.formatDateTime(data.createTime*1000, '-')}</Text>
            </View>
            <Text style={{ color: 'black'}}>- {data.consume} {ZhongChou.CurrencyNames[data.currency]}</Text>
        </View>

        /**
         * "releaseNum": 1,
        "createTime": "1540559104",
        "cid": 1
        */
        let view2 = <View style={{flexDirection: "row", justifyContent:'space-between', alignItems:'center', paddingHorizontal : 10, paddingVertical : 5,backgroundColor:Colors.white, borderTopWidth : 0.5, borderBottomWidth:0.5, borderColor : '#DDD'}}>
        <View style={{}}>
            <Text style={{ color: 'black' }}>释放 {data.releaseNum} {ZhongChouRecord.CurrencyNames[data.cid - 1]}</Text>
            <Text style={{ fontSize: 13, color: 'gray', marginTop : 5 }}>{Utils.formatDateTime(data.createTime*1000, '-')}</Text>
        </View>
        <Text style={{ color: 'black'}}>+ {data.releaseNum} {ZhongChouRecord.CurrencyNames[data.cid - 1]}</Text>
        </View>
        // let view2 = <View style={{flexDirection: "row", padding: 5, marginTop: 1,backgroundColor:Colors.white ,paddingTop:15,paddingBottom:15}}>
        //     <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
        //         <Text style={{ fontSize: 14, color: Colors.text6, flex: 1,textAlign:"center" }}>{data.buyNum}</Text>
        //     </View>
        //     <View style={{ flexDirection: "row", flex: 1, alignItems: "center"}}>
        //         <Text style={{ fontSize: 14, color: Colors.text6, flex: 1 ,textAlign:"center"}}>{Utils.formatDateTime(data.createTime*1000)}</Text>
        //     </View>
        // </View>

        let styleTitle = {textAlign : "center", color : "black", width : (Utils.getWidth() - 20) / 3 - 1, paddingVertical : 10};
        let view3 = <View style = {{flexDirection : "row", paddingHorizontal : 10, justifyContent : "center", alignItems : "center", backgroundColor:Colors.white, borderTopWidth : 0.5, borderBottomWidth:0.5, borderColor : '#DDD'}}>
            <Text style = {styleTitle}>{data.buyNum}</Text>
            <Text style = {styleTitle}>{data.remainingNum}</Text>
            <Text style = {styleTitle}>{data.dayRelease}</Text>
        </View>;
        return (this.state.activeIndex===0) ? view1 : ((this.state.activeIndex===1) ? view2 : view3);
    }

    //刷新数据
    _refreshData() {
        this.refList.refreshStar()
        this.pageIndex = 1;
        this.getData(true)
    }
    //加载更多数据
    _onLoadData() {
        this.getData(false)
    }

    /**
     * 获取数据
     * @param {*} isRefesh  是否刷新
     * @param {*} pageIndex 
     */
    getData(isRefesh) {
        if(isRefesh){
            this.refList.setData([]);
        }
        let url = (this.activeIndex === 0) ? BaseUrl.getCrowdConsumeBuyRecordUrl() : 
        ((this.activeIndex === 1) ? BaseUrl.getCrowdConsumeReleaseRecordUrl() : 
        BaseUrl.getCrowdConsumeCrowdRecordUrl())
        let obj = (this.activeIndex == 1) ? 
        {
            sessionId: this.userInfo.sessionId,
            pageIndex : this.pageIndex,
            cid : this.currencySelect + 1
        } :  {
            sessionId: this.userInfo.sessionId,
            pageIndex : this.pageIndex,
        }
        HttpUtils.postData(url, obj).then(result => {
            if (result.code == 1) {
                if (isRefesh) {
                    this.refList.setData(result.data)
                    if (result.data.length < 1) {
                        DialogUtils.showToast("暂无记录")
                    } 
                } else {
                    this.refList.addData(result.data)
                }
                this.pageIndex += 1;
            } else {
                DialogUtils.showToast(result.msg);
                if(result.code == 2 || result.code == 4){
                    this.goLogin(this.props.navigation);
                }
            }
        });
        return;
        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                    //alert(JSON.stringify(result.data))
                    if (isRefesh) {
                        this.refList.setData(result.data)
                        if (result.data.length < 1) {
                            DialogUtils.showToast("暂无记录")
                        }
                    } else {
                        this.refList.addData(result.data)
                    }
                    this.pageIndex += 1

                } else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })

    }
}
