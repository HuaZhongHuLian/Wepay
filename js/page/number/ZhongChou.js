import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    Modal,
    TextInput,
    Button,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import HttpUtils from "../../util/HttpUtils";
import BaseUrl from "../../util/BaseUrl";
import RefreshFlatList from "../../common/RefreshFlatList"
import DialogUtils from '../../util/DialogUtils';
import Colors from "../../util/Colors"
import Utils from '../../util/Utils';
import ZhongChouBuy from './ZhongChouBuy';


class TextTimer extends Component{
    constructor(props){
        super(props);
        this.timer = props.timer;
        this.state = {timer : this.props.timer};
        this.interval = setInterval(() => {
            this.timer -= 1;
            this.setState({timer : this.timer});
            if(this.timer == 0 && this.props.onZero){
                this.props.onZero();
            }
        }, 1000);
    }

    componentWillUnmount(){
        this.interval && clearInterval(this.interval);
    }

    static getTimer(surplusTime){
        text = '';
        if(surplusTime > 86400){
            text += parseInt(surplusTime / 86400) + '天';
            surplusTime %= 86400;
            text += parseInt(surplusTime / 3600) + '时';
            surplusTime %= 3600;
            text += parseInt(surplusTime / 60) + '分';    
        } else {
            if(surplusTime > 3600)
            {
                text += parseInt(surplusTime / 3600) + '时';
                surplusTime %= 3600;
            }
            text += parseInt(surplusTime / 60) + '分' + surplusTime % 60 + '秒';    
        }
        return text;
    }

    render(){
        // return <Text style = {this.props.style}>{this.state.timer}</Text>;
        return <Text style = {this.props.style}>{TextTimer.getTimer(this.state.timer)}</Text>
    }
}


export default class ZhongChou extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0,
            isNull: false,
        }
        this.userInfo = this.getUserInfo();
        this.action = 0;
        this.dataLength = 0;
        this.buyRef = React.createRef();
        
    }
    //界面加载完成
    componentDidMount() {
        this._refreshData()
    }

    componentWillUnmount(){
        this.buyRef && this.buyRef.current.setState({visible : false});
    }

    //刷新数据
    _refreshData() {
        this.refList.refreshStar()
        this.pageIndex = 1;
        this.getData(this.action, true)
    }
    //加载更多数据
    _onLoadData() {
        this.getData(this.action, false)
    }

    /**
    * 获取数据
    * @param {*} isRefesh  是否刷新
    * @param {*} pageIndex 
    */
    getData(selectIndex, isRefesh) {
        if(0){
            let req1 = {"code":1,"msg":"","data":[{"crowdId":30,"projectImg":"crowd/1540562476446.png","projectName":"大V","openTime":"1541037600","quota":100,"releaseRate":1,"currency":1,"num":10000,"dprice":8,"surplusTime":"400581","totalJindu":0,"status":1}]};
            // let req2 = {"code":1,"msg":"","data":[{"crowdId":29,"projectImg":"crowd/1540558305695.png","projectName":"vpay","openTime":"1540558500","quota":30,"releaseRate":1,"currency":1,"num":200,"dprice":2,"surplusTime":"0","totalJindu":32.5,"status":2},{"crowdId":28,"projectImg":"crowd/1540546646293.png","projectName":"10086","openTime":"1540560600","quota":100,"releaseRate":1,"currency":1,"num":1000000,"dprice":8,"surplusTime":"0","totalJindu":20.01,"status":2},{"crowdId":26,"projectImg":"crowd/1540539030086.png","projectName":"wepay资产","openTime":"1540539300","quota":100,"releaseRate":1,"currency":1,"num":1000000,"dprice":8,"surplusTime":"0","totalJindu":0.03,"status":2}]};
            // let req3 = {"code":1,"msg":"","data":[{"crowdId":27,"projectImg":"crowd/1540542964156.png","projectName":"wepay测试","openTime":"1540542600","quota":100,"releaseRate":1,"currency":1,"num":150,"dprice":1,"surplusTime":"0","totalJindu":100,"status":3}]};
            
            let datas = [req1.data, [], []][this.action];
            this.dataLength = datas.length;
            if (this.dataLength < 1) {
                DialogUtils.showToast("暂无信息")
                this.refList.setData([]);
                return;
            }
            let data = datas[0];
            data.projectName = 'Wepay资产';
            data.openTime -= 36000;
            data.num = 1000000;

            
            if(isRefesh){
                this.refList.setData(datas)
            } else {
                this.refList.addData(datas)
            }
            return;
        }
        
        console.log(JSON.stringify(this.getUserInfo().sessionId));
        HttpUtils.postData(BaseUrl.getCrowdFundingUrl(), {
            sessionId : this.getUserInfo().sessionId, 
            type : selectIndex + 1
        }).then(result => {
            this.refList.setData([]);

            console.log(JSON.stringify(result));
            if(result.code == 1){
                this.dataLength = result.data.length;
                if (this.dataLength < 1) {
                    DialogUtils.showToast("暂无信息")
                } else if(isRefesh){
                    this.refList.setData(result.data)
                } else {
                    this.refList.addData(result.data)
                }
            }else {
                DialogUtils.showToast(result.msg);
                if(result.code == 2 || result.code == 4){
                    this.goLogin(this.props.navigation);
                }
            }
        })
        // .catch(error => DialogUtils.hideLoading())

        // if (this.action === 1) {
        //     this.url = BaseUrl.getOutUndoneUnselectedUrl(this.userInfo.sessionId, this.pageIndex)
        // } else if (this.action === 2) {
        //     this.url = BaseUrl.getOutUndoneUnselectedUrl(this.userInfo.sessionId, this.pageIndex)
        // } else {
        //     this.url = BaseUrl.getOutUndoneUnselectedUrl(this.userInfo.sessionId, this.pageIndex)
        // }
        // HttpUtils.getData(this.url)
        //     .then(result => {
        //         if (result.code === 1) {
        //             if (isRefesh) {
        //                 this.refList.setData(result.data)
        //                 if (result.data.length < 1) {
        //                     DialogUtils.showToast("暂无信息")
        //                 }
        //                 this.setState({
        //                     isNull: result.data.length < 1 ? true : false,
        //                 })
        //             } else {
        //                 this.refList.addData(result.data)
        //             }
        //             this.pageIndex += 1
        //         } else if (result.code === 2||result.code === 4) {
        //             DialogUtils.showToast(result.msg)
        //             this.goLogin(this.props.navigation)
        //         } else {
        //             DialogUtils.showToast(result.msg)
        //         }
        //     })

    }

    render() {
        return (
            <View style={[BaseStyles.container_column, { backgroundColor: "#f1f1f1" }]}>
                <NavigationBar
                    title='私募中心'
                    navigation={this.props.navigation}
                    rightView={NavigationBar.getRightStyle_Text('记录', {
                        fontSize: 16,
                        color: "#fff"
                    }, () => this.transactionRecord())}
                />

                <View style={{ flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: Colors.white }}>

                    <TouchableOpacity onPress={() => this.onClick(0)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image source={require("../../../res/images/yure.png")} style={{ height: 30, width: 30, }} />
                            <Text style={{ color: this.state.selectIndex === 0 ? Colors.mainColor : Colors.text3 }}>预热中</Text>
                        </View></TouchableOpacity>
                    <View style={{ backgroundColor: Colors.lineColor, width: 1, height: 40}}></View>
                    <TouchableOpacity onPress={() => this.onClick(1)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image source={require("../../../res/images/jinxingzhong.png")} style={{ height: 30, width: 30, }} />
                            <Text style={{ color: this.state.selectIndex === 1 ? Colors.mainColor : Colors.text3}}>进行中</Text>
                        </View></TouchableOpacity>
                    <View style={{ backgroundColor: Colors.lineColor, width: 1, height: 40 }}></View>
                    <TouchableOpacity onPress={() => this.onClick(2)} style={{ flex: 1 }}>
                        <View style={{ alignItems: "center", justifyContent: "center", }}>
                            <Image source={require("../../../res/images/yijiesu.png")} style={{ height: 30, width: 30, }} />
                            <Text style={{ color: this.state.selectIndex === 2 ? Colors.mainColor : Colors.text3 }}>已结束</Text>
                        </View></TouchableOpacity>

                </View>

                <View style={{ flex: 1, backgroundColor: "#f1f1f1", marginTop: 10, }}>
                    <RefreshFlatList
                        ref={refList => this.refList = refList}
                        isDownLoad={true}
                        renderItem={(items) => this._getItem(items)}
                        onRefreshs={() => this._refreshData()}
                    />

                </View>
                <ZhongChouBuy 
                    ref = {this.buyRef} 
                    onBuy = {(currencyName)=>{
                        this.getData(1, false);
                        if(currencyName == CurrencyNames[1]){
                            upDataUserInfo(this.props.AppStore);
                        }
                    }}
                />
            </View>
        );
    }

    static getOpenTime(inputTime){
        let sb = '-';
        let date = new Date(inputTime);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + sb + m + sb + d + '\n' + h + ':' + minute;
    }

    /**
     * 绘制itemView
     * @param data
     * @returns {*}
     * @private
     */
    _getItem(item) {
        /**
         * {
            "crowdId": 22,
            "projectImg": "crowd/1540367271684.png",
            "projectName": "wepay资产",
            "openTime": "1541700600",
            "quota": 100,
            "releaseRate": 100,
            "currency": 1,
            "num": 100,
            "dprice": 8,
            "surplusTime": "1244446",
            "totalJindu": 0,
            "status": 1
        }
         */
        let data = item.item;
        // alert(JSON.stringify(data));
        const fontSizeSmall = 13;
        return <View style={{ backgroundColor: Colors.white, padding : 10, marginVertical : 5}}>
            <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                <View style = {{flexDirection : 'row'}}>
                    <Image style = {{width : 80, height : 80}} 
                        source = {{uri : this.getImgUrl(data.projectImg)}}
                        // source = {require('../../../res/images/logo-d.png')}
                    />
                    <View style = {{marginLeft : 5}}>
                        <Text style = {{color : 'black', fontSize : 18, marginBottom : 10}}>{data.projectName}</Text>
                        {/* <View style = {{flexDirection : 'row'}}>
                            <Text style = {{color : 'black', fontSize : fontSizeSmall}}>每个ID限购{data.quota}枚   </Text>
                            <Text style = {{color : 'gray', fontSize : fontSizeSmall}}>释放比例{data.releaseRate}%</Text>
                        </View> */}
                        <View style = {{flexDirection : 'row'}}>
                            <Text style = {{color : 'gray', fontSize : fontSizeSmall}}>每个ID限购: </Text>
                            <Text style = {{color : 'black', fontSize : fontSizeSmall}}>{data.quota}枚</Text>
                        </View>
                        <View style = {{flexDirection : 'row'}}>
                            <Text style = {{color : 'gray', fontSize : fontSizeSmall}}>释放比例: </Text>
                            <Text style = {{color : 'black', fontSize : fontSizeSmall}}>{data.releaseRate}%</Text>
                        </View>
                        <View style = {{flexDirection : 'row'}}>
                            <Text style = {{color : 'gray', fontSize : fontSizeSmall}}>接收币种: </Text>
                            <Text style = {{color : 'black', fontSize : fontSizeSmall}}>{ZhongChou.CurrencyNames[data.currency]}</Text>
                        </View>
                    </View>
                </View>
                {data.status == 2 ? null : <View style = {{position : 'absolute', right : 0, alignItems : 'center'}}>
                    <Image style = {{width : 15, height : 15, }} resizeMode = {'contain'} source={require("../../../res/images/yure.png")}/>
                    <Text style = {{textAlign : 'center', fontSize : fontSizeSmall, color : 'red'}}>{ZhongChou.getOpenTime(data.openTime * 1000)}</Text>
                </View>}
            </View>
            <View style={{ backgroundColor: "#F1F1F1", height : 1, margin : 10}} />
            <View style={{ flexDirection : 'row', justifyContent : 'space-between'}}>
                <View>
                    <View style = {{flexDirection : 'row'}}>
                        <View style = {{alignItems : 'center'}}>
                            <Text style = {{color : 'gray', fontSize : fontSizeSmall}}>私募规模</Text>
                            <Text style = {{color : 'black', fontSize : fontSizeSmall}}>{data.num / 10000}万</Text>
                        </View>
                        <View style = {{alignItems : 'center', marginLeft : 15}}>
                            <Text style = {{color : 'gray', fontSize : fontSizeSmall}}>价格</Text>
                            <Text style = {{color : 'black', fontSize : fontSizeSmall}}>1{data.projectName}={data.dprice}{data.currency == 1 ? "余额" : "Wepay"}</Text>
                        </View>
                    </View> 
                    <View style = {{flexDirection : 'row', alignItems : 'center', marginTop : 10}}>
                        <View style = {{width : 180, height : 6, backgroundColor : '#F1F1F1', borderRadius : 3}}>
                            <View style = {{position : 'absolute', width : 180 * data.totalJindu / 100, height : 6, backgroundColor : '#0088FF', borderRadius : 3}}/>
                        </View>
                        <Text style = {{color : 'gray', fontSize : fontSizeSmall, marginLeft : 5}}>{data.totalJindu}%</Text>
                    </View>
                </View>
                <View style ={{justifyContent : 'space-around', alignItems : 'center'}}>
                    {data.status == 2 ? null :<Text style = {{color : 'gray', fontSize : fontSizeSmall}}>剩余时间</Text>}
                    {data.status == 2 ? null : (
                        data.status == 3 ? <Text style = {{color : '#0FF'}}>已结束</Text> : 
                        <TextTimer style = {{color : 'red'}}
                            timer = {data.surplusTime}
                            onZero = {()=>this.getData(0, false)}
                        />)
                    }
                    <TouchableHighlight 
                        style = {{padding : 5, backgroundColor : data.status == 2 ? mainColor : '#F1F1F1', borderRadius : 4}} 
                        onPress = {()=>this.onBuy(item.index, data)}
                    >
                        <Text style = {{color : data.status == 2 ? 'white' : 'gray'}}>立即购买</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    }
    static CurrencyNames = ['???','余额','TOT','???'];


    transactionRecord() {//交易记录
        this.props.navigation.navigate('ZhongChouRecord');
    }

    onClick(type) {
        switch (type) {
            case 0: //预热中
            case 1://进行中
            case 2://已结束
                this.setState({
                    selectIndex: type,
                })
                // state不及时，需要类的selectIndex
                this.action = type;
                this._refreshData()
                break;
            case 4://记录
                this.props.navigation.navigate('TranWepay');
                break;
        }
    }

    onBuy(index, data){
        if(data.status != 2 || this.buyRef == null){
            return;
        }
        // alert(this.buyRef.current.show);
        // return;
        if(data.currency == 2){
            DialogUtils.showLoading('', true);
            HttpUtils.getData(BaseUrl.numberIndex(this.getUserInfo().sessionId))
                .then(result => {
                    DialogUtils.hideLoading();
                    if (result.code === 1) {
                        amount = result.data.num;
                        // id, quota, currencyName, dprice, amount
                        this.buyRef.current.show(this.getUserInfo().sessionId, data.crowdId, data.quota, 
                            ZhongChou.CurrencyNames[data.currency], data.dprice, result.data.num);
                    } else if (result.code === 2||result.code === 4) {
                        DialogUtils.showToast(result.msg)
                        this.goLogin(this.props.navigation)
                    } else {
                        DialogUtils.showToast(result.msg)
                    }
                })
        } else {
            this.buyRef.current.show(this.getUserInfo().sessionId, data.crowdId, data.quota, 
            ZhongChou.CurrencyNames[data.currency], data.dprice, this.getUserInfo().cangkuNum);
        }
    }
}
export const styles = StyleSheet.create({
    container_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:"absolute",  //绝对布局
    },
});