import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Animated,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor } from "./BaseComponent";
import NavigationBar from "../common/NavigationBar";
import Utils from "../util/Utils";
import HttpUtils from "../util/HttpUtils";
import { SegmentedBar, Label } from 'teaset';
import BaseUrl from '../util/BaseUrl';
import RefreshFlatList from '../common/RefreshFlatList';
import UnfinshedorderItem from '../item/UnfinshedorderItem';

/**
 * 买入/卖出  未完成订单
 */


const width = Utils.getWidth()
export default class BuyOrSellUnfinishedOrder extends BaseComponent {
    pageIndex = 1;
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        }
        this.barItems = [
            '未选择打款人',
            '已选择打款人',
        ];
        this.userInfo = this.getUserInfo()
        this.activeIndex=0;
    }
    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }

    onSegmentedBarChange(index) {
        if (index != this.activeIndex) {
            this.setState({ activeIndex: index });
            this.activeIndex = index
            this._refreshData()
        }
    }

    renderCustomItems() {
        let { activeIndex } = this.state;
        return this.barItems.map((item, index) => {
            let isActive = index == activeIndex;
            let tintColor = isActive ? mainColor : '#333';
            return (
                <View key={index} style={{ padding: 15, alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, color: tintColor, paddingTop: 4 ,}} >{item}</Text>
                </View>
            );
        });
    }

    render() {
        const { navigation } = this.props;
        const type = navigation.state.params.type ? navigation.state.params.type : 0;
        let title = type === 0 ? "买入" : "卖出"
        let { justifyItem, activeIndex } = this.state;
        let barItems = this.barItems;
        return (
            <View style={BaseStyles.container_column}>
                <NavigationBar
                    title={"未完成订单"}
                    navigation={this.props.navigation}
                />
                <SegmentedBar
                    justifyItem={"fixed"}
                    indicatorLineColor={mainColor}
                    indicatorLineWidth={2}
                    indicatorPositionPadding={5}
                    activeIndex={activeIndex}
                    onChange={index => this.onSegmentedBarChange(index)} >
                    {this.renderCustomItems()}
                </SegmentedBar>

                <View style={{ flex: 1, backgroundColor: "#f1f1f1", marginTop: 1 ,}}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        isDownLoad={true}
                        onRefreshs={() => this._refreshData()}
                        onLoadData={() => this._onLoadData()}
                        renderItem={(items) =>this.renderItem(items)}
                    />
                </View>
            </View>
        );
    }

    renderItem(data){
        let view = <UnfinshedorderItem data={data.item}/>
        return view
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
        if (this.activeIndex === 0) {
            this.url = BaseUrl.getoutUndoneUnselectedUrl(this.userInfo.sessionId, this.pageIndex)
        } else {
            this.url = BaseUrl.getOutUndoneSelectedUrl(this.userInfo.sessionId, this.pageIndex)
        }
        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                    //alert(JSON.stringify(result.data))
                    if (isRefesh) {
                        this.refList.setData(result.data)
                    } else {
                        this.refList.addData(result.data)
                        this.pageIndex += 1
                    }
                } else {
                    DialogUtils.showToast(result.msg)
                }
            })
            .catch(error => {
                this.refList.setData([])
                DialogUtils.showToast("error:" + error.message)
            })
    }
}
