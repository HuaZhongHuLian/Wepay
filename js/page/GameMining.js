import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView,
    Linking,
}from 'react-native'
import BaseComponent, { mainColor } from './BaseComponent';
import NavigationBar from '../common/NavigationBar';
import DialogUtils from '../util/DialogUtils';
import { inject } from 'mobx-react';
import HttpUtils from '../util/HttpUtils';
import BaseUrl from '../util/BaseUrl';
import {Label, Overlay} from "teaset"
import RefreshFlatList from '../common/RefreshFlatList';
import Utils from '../util/Utils';
/**
 * 提交记录
 */


export default class GameMining extends BaseComponent {
    constructor(props) {
        super(props);
        this.pageIndex = 1;
    }
    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }


    render() {
        return (
            <View style={{flex : 1, backgroundColor : '#F1F1F1'}}>
                <NavigationBar
                    title={"换币记录"}
                    navigation={this.props.navigation} />
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

    
    renderItem(items) {
        console.log(JSON.stringify(items));
        const statusStrings = ["申请中", "已完成", "已退回"];
        const statusColors = ["red", "black", "gray"];
        let data =  items.item;
        return <View style={{flexDirection: "row", justifyContent:'space-between', alignItems:'center', paddingHorizontal : 10, paddingVertical : 5,backgroundColor:Colors.white, borderTopWidth : 0.5, borderBottomWidth:0.5, borderColor : '#DDD'}}>
            <View>
                <Text style={{ color: 'black' }}>{data.count}</Text>
                <Text style={{ fontSize : 13, color: 'gray', marginTop : 5 }}>换币数量</Text>
            </View>
            <View>
                <Text style={{ color: statusColors[data.status], textAlign : "right"}}>{statusStrings[data.status]}</Text>
                <Text style={{ fontSize : 13, color: 'gray', marginTop : 5 }}>{Utils.formatDateTime(data.createDate*1000, '-')}</Text>
            </View>
        </View>
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
        HttpUtils.postData(BaseUrl.geturl() + "/carryCoin/carryCoinRecord", {
            sessionId: this.getUserInfo().sessionId,
            pageIndex : this.pageIndex,
        }).then(result => {
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
    }
}
