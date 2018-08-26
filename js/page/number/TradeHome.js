import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    View,
} from 'react-native';
import BaseComponent, {mainColor, upDataUserInfo} from "../BaseComponent";
import RefreshFlatList2 from "../../common/RefreshFlatList2"
import Colors from "../../util/Colors"
import { Overlay } from 'teaset';
import Echarts from 'native-echarts';
import Dimensions from 'Dimensions';
import SplashScreen from "react-native-splash-screen"
import DialogUtils from "../../util/DialogUtils";
import BaseUrl from "../../util/BaseUrl";
import HttpUtils from "../../util/HttpUtils";
import Utils from "../../util/Utils";

//交易中心首页

export default class TradeHome extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            cid:1,  //1.Wepay 2.比特币 3.莱特币  4.以太坊  5.狗狗币
            title:"Wepay",

            coinBalance: "0.00", //Wepay资产
            walletBalance: "0.00", //余额

            coinPrice:"0.00",//当前价格
            maxPrice:"0.00",//最高价
            minPrice:"0.00",//最低价

            echartsType: 0,  //0：5分钟 ， 1：5小时 ，2：日线
            xdata:[],
            ydata:[],
            activeIndex: 0,//0余额购买 ，1余额出售
        }
        this.userInfo = this.getUserInfo()

        this.cid = 1;
        this.activeIndex = 0;

        this.oneHour = [];
        this.fiveHour = [];
        this.dateLine = [];

    }

    componentDidMount() {
       // SplashScreen.hide();
        this.geTopData(this.cid)
        this._refreshData()
    }

    geTopData(){
        DialogUtils.showLoading()
        let url = BaseUrl.coinDeal(this.userInfo.sessionId,this.cid)
        HttpUtils.getData(url)
            .then(result => {
                DialogUtils.hideLoading()
                if (result.code === 1) {
                    //alert(JSON.stringify(result.data))
                    this.setState({
                        coinBalance: result.data.coinBalance,
                        walletBalance: result.data.walletBalance,
                        coinPrice: result.data.coinPrices,//当前价格
                        maxPrice: result.data.maxPrice,//最高价
                        minPrice: result.data.minPrice,//最低价
                    })
                    this.oneHour = result.data.oneHour;
                    this.fiveHour = result.data.fiveHour;
                    this.dateLine = result.data.dateLine;
                    this.getEchartsData(this.state.echartsType)
                }  else if (result.code === 2||result.code === 4) {
                    DialogUtils.showToast(result.msg)
                    this.goLogin(this.props.navigation)
                } else {
                    DialogUtils.showToast(result.msg)
                }

            })
    }

    getEchartsData(i){
        let data
        if (i===0){
            data = this.oneHour;
        }else if (i===1){
            data = this.fiveHour;
        }else if (i===2){
            data = this.dateLine;
        }
        var dateArr = []
        var dataArr = []
        for (let i = 0; i <data.length; i++) {
            let obj = data[i]
           let dates  = Utils.formatDateGetHour(obj.coinAddtime*1000)
            dateArr.push(dates)
            dataArr.push(obj.coinPrice)
        }
       // alert(JSON.stringify(dateArr))
        this.setState({
            xdata:dateArr.reverse(),
            ydata:dataArr.reverse(),
        })

    }

    render() {
        let { activeIndex } = this.state;
        // 指定图表的配置项和数据
        var options = {
            //点击某一个点的数据的时候，显示出悬浮窗
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                 data:this.state.xdata,
            },
            yAxis: {
                type: 'value'
            },
            color: ["#d15"],
            series: [{
                name: this.state.title,
                data: this.state.ydata,
                type: 'line',
                areaStyle: { color: "#d15", origin: "auto" }
            }]
        };

        return (
            <View style={styles.container}>

                <View style={{
                    flexDirection: "row", justifyContent: "center", alignItems: "center",
                    backgroundColor: Colors.mainColor, height: 45, marginTop: Platform.OS === "ios" ? 20 : 0
                }}>
                    <TouchableOpacity
                        style={[{ paddingRight: 20, paddingTop: 10, paddingBottom: 10, position: "absolute", left: 10 },]}
                        onPress={() => this.props.navigation.goBack(null)} >
                        <Image source={require('../../../res/images/fanhui.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        ref={title => this.title = title}
                        onPress={() => this.showPopover(this.title)}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 18, color: Colors.white, marginBottom: 3 }}>{this.state.title}</Text>
                            <Image source={require("../../../res/images/sanjiao.png")} />
                        </View></TouchableOpacity>

                </View>
                <ScrollView>
                    <View style={{ backgroundColor: Colors.bgColor }}>

                        {/* 顶部布局  资产  余额*/}
                        <View style={[{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                            padding: 10, backgroundColor: mainColor
                        }]}>
                            <TouchableOpacity
                                activeOpacity={0.8} >
                                <View style={{ flexDirection: 'column', alignItems: "center", width: Utils.getWidth() / 2 }}>
                                    <Text style={{ fontSize: 16, color: '#fff' }}>Wepay资产</Text>
                                    <Text style={{ fontSize: 16, color: '#fff' }}>{this.state.coinBalance}</Text>
                                </View></TouchableOpacity>
                            <View style={{ height: 30, width: 0.5, backgroundColor: '#fff' }} />
                            <TouchableOpacity activeOpacity={0.8}>
                                <View style={{ flexDirection: 'column', alignItems: "center", width: Utils.getWidth() / 2 }}>
                                    <Text style={{ fontSize: 16, color: '#fff' }}>余  额</Text>
                                    <Text style={{ fontSize: 16, color: '#fff' }}>{this.state.walletBalance}</Text>
                                </View></TouchableOpacity>
                        </View>
                        <View style={{ padding: 15, flexDirection: "row", backgroundColor: Colors.white }}>
                            <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
                                <Text style={{ fontSize: 14, color: Colors.text8, }}>当前价格</Text>
                                <Text style={{ fontSize: 14, color: Colors.black, }}>{this.state.coinPrice}</Text>
                            </View>
                            <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
                                <Text style={{ fontSize: 14, color: Colors.text8, }}>高</Text>
                                <Text style={{ fontSize: 14, color: Colors.black, }}>{this.state.maxPrice}</Text>
                            </View>
                            <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
                                <Text style={{ fontSize: 14, color: Colors.text8, }}>低</Text>
                                <Text style={{ fontSize: 14, color: Colors.black, }}>{this.state.minPrice}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 15, paddingBottom: 15, backgroundColor: Colors.white, marginTop: 1 }}>

                            <TouchableOpacity onPress={() => this.onClick(1)} style={{ flex: 1 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require("../../../res/images/fabuchushou.png")} style={{ height: 40, width: 40, }} />
                                    <Text style={{ color: this.state.selectIndex === 0 ? Colors.mainColor : Colors.text6, fontSize: 13, marginTop: 5 }}>发布出售订单</Text>
                                </View></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onClick(2)} style={{ flex: 1 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require("../../../res/images/fabugoumai.png")} style={{ height: 40, width: 40, }} />
                                    <Text style={{ color: this.state.selectIndex === 1 ? Colors.mainColor : Colors.text6, fontSize: 13, marginTop: 5 }}>发布购买订单</Text>
                                </View></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onClick(3)} style={{ flex: 1 }}>
                                <View style={{ alignItems: "center", justifyContent: "center", }}>
                                    <Image source={require("../../../res/images/dingdan-shu.png")} style={{ height: 40, width: 40, }} />
                                    <Text style={{ color: this.state.selectIndex === 2 ? Colors.mainColor : Colors.text6, fontSize: 13, marginTop: 5 }}>订单</Text>
                                </View></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onClick(4)} style={{ flex: 1 }}>
                                <View style={{ alignItems: "center", justifyContent: "center", }}>
                                    <Image source={require("../../../res/images/jiaoyijilu-shu.png")} style={{ height: 40, width: 40, }} />
                                    <Text style={{ color: this.state.selectIndex === 2 ? Colors.mainColor : Colors.text6, fontSize: 13, marginTop: 5 }}>交易记录</Text>
                                </View></TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: Colors.bgColor, height: 10 }} />
                        {/* 折线统计图 */}
                        <View style={{ flexDirection: "row", backgroundColor: Colors.white }}>
                            <Text style={{
                                borderColor: Colors.blue1, flex: 1, padding: 10, textAlign: "center", borderWidth: 0.5,
                                backgroundColor: this.state.echartsType === 0 ? Colors.blue1 : Colors.white,
                                color: this.state.echartsType !== 0 ? Colors.blue1 : Colors.white
                            }}
                                onPress={() => this.magicType(0)}
                            >一小时</Text>
                            <Text style={{
                                borderColor: Colors.blue1, flex: 1, padding: 10, textAlign: "center", borderWidth: 0.5,
                                backgroundColor: this.state.echartsType === 1 ? Colors.blue1 : Colors.white,
                                color: this.state.echartsType !== 1 ? Colors.blue1 : Colors.white
                            }}
                                onPress={() => this.magicType(1)}
                            >5小时</Text>
                            <Text style={{
                                borderColor: Colors.blue1, flex: 1, padding: 10, textAlign: "center", borderWidth: 0.5,
                                backgroundColor: this.state.echartsType === 2 ? Colors.blue1 : Colors.white,
                                color: this.state.echartsType !== 2 ? Colors.blue1 : Colors.white
                            }}
                                onPress={() => this.magicType(2)}
                            >日线</Text>
                        </View>
                        {/* 折线统计图 */}
                        <View style={{ marginTop: -50, zIndex: -1, backgroundColor: Colors.white }}>
                            <Echarts option={options} height={240} width={Utils.getWidth()} />
                        </View>

                        <View style={{ flexDirection: "row", backgroundColor: Colors.bgColor, justifyContent: "center", padding: 10, marginTop: -30 }}>
                            <TouchableOpacity
                                onPress={() => this.selectIndex(0)}
                                style={{
                                    borderColor: Colors.r1, borderWidth: 1, borderTopLeftRadius: 18, borderBottomLeftRadius: 18,
                                    justifyContent: "center", alignItems: "center", backgroundColor: activeIndex ? Colors.white : Colors.red
                                }}>
                                <Text style={{ padding: 8, fontSize: 16, marginLeft: 25, marginRight: 10, color: activeIndex ? Colors.red : Colors.white }}>购买</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.selectIndex(1)}
                                style={{
                                    borderColor: Colors.r1, borderWidth: 1, borderTopRightRadius: 18, borderBottomRightRadius: 18,
                                    justifyContent: "center", alignItems: "center", backgroundColor: activeIndex ? Colors.red : Colors.white
                                }} >
                                <Text style={{ padding: 8, fontSize: 16, marginLeft: 25, marginRight: 10, color: activeIndex ? Colors.white : Colors.red }}>出售</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: Colors.bgColor }}>
                            <RefreshFlatList2
                                ref={refList => this.refList = refList}
                                renderItem={(items) => this._getItem(items)}
                                onRefreshs={() => this._refreshData()}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
    onClick(i) {
        this.action = i
        switch (i) {
            case 1:
            case 2:
                this.props.navigation.navigate('CreateBSOrder', {
                    cid: this.state.cid,
                    title: this.state.title,
                    type: i,
                });
                break;
            case 3:
                this.props.navigation.navigate('OrderRecord')
                break;
            case 4:
                break;
        }
    }
    //选择折线图类型
    magicType(i) {
        //alert(i)
        this.setState({ echartsType: i })
        this.getEchartsData(i)
    }
    //购买 出售 订单
    selectIndex(index) {
        this.setState({ activeIndex: index })
        this.activeIndex = index;
        this._refreshData()
    }

    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getItem(data) {
        // return <View style={{ flex: 1 }}>
        //     <Text style={{ padding: 15, fontSize: 15, color: Colors.black }}>{this.state.activeIndex ? "购买" : "出售"}</Text>
        // </View>
        return <TouchableOpacity >
            <View
                key={data.item.index}
                style={{
                    backgroundColor: '#fff', alignItems: 'center',
                    justifyContent: "center", marginBottom: 1,
                    flexDirection: 'row', padding: 10,
                }}>
                <Image
                    style={{ width: 45, height: 45, borderWidth: 1, borderRadius: 23, borderColor: "#666" }}
                    source={data.item?{uri:this.getImgUrl(data.item.imgHead)}:require("../../../res/images/touxiang-xiao.png")}
                />

                <View style={{ flexDirection: 'column', justifyContent: "center", flex: 1, marginLeft: 10, marginRight: 10 }}>
                    <Text
                        style={{ color: "#333333", fontSize: 16 }}>{data.item.username}</Text>

                    <Text style={{ color: "#888", fontSize: 14, marginTop: 5 }}
                        numberOfLines={1}
                    >限 额:{data.item.num}</Text>
                </View>

                <View style={{ flexDirection: 'column', justifyContent: "center", marginLeft: 10, marginRight: 10 }}>
                    <Text
                        style={{ color: Colors.blue, fontSize: 16, textAlign: "right" }}>{data.item.dprice}</Text>
                    <Text
                        onPress={()=>this.trade()}
                        style={{
                        paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, color: Colors.r1,
                        fontSize: 13, textAlign: "center", borderWidth: 1, borderColor: Colors.r1, borderRadius: 10
                    }} numberOfLines={1}>{!this.state.activeIndex ? "购买" : "卖出"}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    /**
     * 交易
     */
    trade(safetyPwd, id,num){
        DialogUtils.showLoading();
        this.url = !this.state.activeIndex ?BaseUrl.dealBuy():BaseUrl.dealSell();
        HttpUtils.postData(this.url,
            {  sessionId: this.userInfo.sessionId,
                id: id,
                num: num,
                safetyPwd: safetyPwd,
            })
            .then(result => {
                DialogUtils.hideLoading()
                if (result.code === 1) {
                    let tip  = !this.state.activeIndex ? "购买" : "出售"
                    DialogUtils.showToast(tip+ "成功")
                    //this.props.navigation.goBack()
                } else {
                    DialogUtils.showToast(result.msg)
                }

            })
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

    getData(isRefesh) {
        if (this.activeIndex === 1) { //购买
            this.url = BaseUrl.dealOrder(this.userInfo.sessionId, this.pageIndex,1,this.cid)
        } else if (this.activeIndex === 0) {//出售
            this.url = BaseUrl.dealOrder(this.userInfo.sessionId, this.pageIndex,2,this.cid)
        }
        //alert(this.url)
        HttpUtils.getData(this.url)
            .then(result => {
                if (result.code === 1) {
                    alert(JSON.stringify(result.data))
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

    //选择币种  cid 各种货币id
    //1.Wepay 2.比特币 3.莱特币  4.以太坊  5.狗狗币
    selectCid(cid,title){
        this.cid = cid
        this.setState({cid:cid, title :title})
        this.geTopData()
        this._refreshData()
    }
    /**
     * onPress={() => this.showPopover(this.refs['downcenter'], 'down', 'center')}
     * @param {*} view
     * @param {*} direction
     * @param {*} align
     */
    showPopover(view) {
        let { black, shadow, showArrow } = this.state;
        let blackStyle = {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            //   paddingTop: 1,
            //   paddingBottom: 1,
            paddingLeft: 12,
            paddingRight: 12,
        };
        let whiteStyle = {
            ...blackStyle,
            backgroundColor: Colors.white,
        };
        let shadowStyle = {
            shadowColor: '#777',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
        };
        let popoverStyle = [].concat(black ? blackStyle : whiteStyle).concat(shadow ? shadowStyle : null);

        view.measure((x, y, width, height, pageX, pageY) => {
            let fromBounds = { x: pageX, y: pageY, width, height };
            let overlayView = (
                <Overlay.PopoverView popoverStyle={popoverStyle}
                    fromBounds={fromBounds} direction={"down"} align={"center"}
                    directionInsets={4} showArrow={showArrow}
                    ref={v => this.view = v}>
                    <View>
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(1,"Wepay")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            Wepay</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(2,"比特币")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            比特币</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(3,"莱特币")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            莱特币</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(4,"以太坊")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            以太坊</Text>
                        <View style={{ backgroundColor: Colors.lineColor, height: 0.5 }} />
                        <Text
                            onPress={() => {
                                this.view.close()
                                this.selectCid(5,"狗狗币")
                            }}
                            style={{ fontSize: 14, color: Colors.text3, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                            狗狗币</Text>
                    </View>
                </Overlay.PopoverView>
            );
            Overlay.show(overlayView);
        });
    }

}


export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
    container: {
        flex: 1,
    },

    titleView: {
        height: Platform.OS == 'ios' ? 64 : 44,
        paddingTop: Platform.OS == 'ios' ? 14 : 0,
        backgroundColor: '#ff6400',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },

});