import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Animated,
} from 'react-native';
import Utils from '../util/Utils';
import BaseComponent, { mainColor } from '../page/BaseComponent';
import SYImagePicker from 'react-native-syan-image-picker'
import BaseUrl from '../util/BaseUrl';
import HttpUtils from '../util/HttpUtils';
import DialogUtils from '../util/DialogUtils';
//未完成订单中，大概分为3个阶段， (刚发布)未选择打款人 ，  (有人购买你的或者卖你的)未选择打款人没有下拉，已选择打款人 和确认打款人点击下拉有银行卡信息 
/** 未选择打款人 ，  (刚发布)
 *  已选择打款人,    (有人购买你的或者卖你的) 
 *  确认打款人       (对方已付款等待你的确认，或者你已经付款，等待别人确认，)
 *  已完成确认就是完成订单的信息了，
 * 
 *  type 表示     0，买入  1， 卖出    
 * 
 *  orderType    1，未完成订单， 2，确定打款订单  3 已完成订单
 *  这个界面支持 orderType = 2，3
 * 
 */
export default class SellOrderItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            showAnim: new Animated.Value(0),
            rotate: "90deg",
            defaultImage:require("../../res/images/addimg.png"),
            image:[],
        };
        this.showorhide = 0;
        this.type = this.props.type ? this.props.type : 0
        this.orderType = this.props.orderType ? this.props.orderType : 1
        this.userInfo =this.getUserInfo()
    }
    componentDidMount(){
        if(this.props.data.item.transImg){
            let transImg = this.getImgUrl()+this.props.data.item.transImg
            this.setState({
               // defaultImage:{uri:transImg},
            })
        }
    }
    //显示隐藏的布局
    _showorhideItems() {
       // alert("buy"+JSON.stringify(this.props.data.item))
        //alert(this.getOrderState(this.state.data.item.payState))
        if (this.props.data.item.payState !== 0) {
            Animated.timing(          // Uses easing functions
                this.state.showAnim,    // The value to drive
                {
                    toValue: this.showorhide == 0 ? 1 : 0
                }            // Configuration
            ).start();
            this.showorhide = this.showorhide == 0 ? 1 : 0;
        }
    }
    //点击旋转图片 
    _onPress(type) {
        var rotate = "90deg"
        rotate = this.state.rotate === rotate ? "270deg" : "90deg"
        this.setState({
            rotate: rotate,
        })
        this._showorhideItems()
    }
    /**
     * 根据订单状态获取相应的值
     * 订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     * @param {*} state 
     */
    getOrderState(state) {
        var stateText = "未选择打款人";
        switch (state) {
            case 0:
                break;
            case 1:
                stateText = "已选择打款人";
                break;
            case 2:
                stateText = "已打款";
                break;
            case 3:
                stateText = "确认到款";
                break;
            default:
                stateText = "未选择打款人";
                break
        }
        return stateText;
    }

    /**
     * 使用方式sync/await
     * 相册参数暂时只支持默认参数中罗列的属性；
     * 选择照片 并显示设置headImg
     * @returns {Promise<void>}
     */
    handleAsyncSelectPhoto = async () => {
        SYImagePicker.removeAllPhoto()
        try {
            const photos = await SYImagePicker.asyncShowImagePicker({ imageCount: 1, isCrop: true, showCropCircle: false });
            photos.map((photo, index) => {
                let source = { uri: photo.uri };
                if (photo.enableBase64) {
                    source = { uri: photo.base64 };
                }
                this.setState({
                    defaultImage:source,
                    image:[photo]
                })
            })
        } catch (err) {
            DialogUtils.showToast(err.message)
            // 取消选择，err.message为"取消"
            // alert(err.message)
        }
    };

    
    //取消订单
    cancelState() {
        cancelOrder=()=> { DialogUtils.showLoading()
        let url = BaseUrl.getCncelBalanceOrder(this.userInfo.sessionId,this.props.data.item.id)
        HttpUtils.getData(url)
            .then(result => {
                //alert(JSON.stringify(result))
                if (result.code === 1) {
                    this.props.delBack(this.props.data.index)
                    DialogUtils.showMsg("订单已取消")
                } else {
                    DialogUtils.showToast(result.msg)
                }
                DialogUtils.hideLoading()
            })
            .catch(error => {
                DialogUtils.showMsg("error:" + error.message)
                DialogUtils.hideLoading()
            })
        }
       DialogUtils.showPop("您确认要取消此订单？",()=>cancelOrder(),null,"取消订单","点错了")
    }

    /**
     * 提交选择的照片 确认打款
     * @param {*} imgs 
     */
    uploadImage(imgs){
       let url =  BaseUrl.getUpdataHeadUrl()
        HttpUtils.uploadImage(url,{sessionId:this.state.sessionId},imgs,(result)=>{
            if(result.code===1){
                DialogUtils.showToast("上传成功")
                this.setState({
                    headImg: this.source
                })
            }else{
                DialogUtils.showToast(result.msg)
            }
        })
    }

    // //卖出-确认收款-修改状态为确认收款
    confirmButton(){
        confirmState = () => {
            DialogUtils.showLoading()
            let url = BaseUrl.getOutAPUpdate(this.userInfo.sessionId,this.props.data.item.id)
            HttpUtils.getData(url)
                .then(result => {
                   // alert(JSON.stringify(result))
                   this.props.delBack(this.props.data.index)
                    if (result.code === 1) {
                        DialogUtils.showMsg("已确认收款",)
                    } else {
                        DialogUtils.showToast(result.msg)
                    }
                    DialogUtils.hideLoading()
                })
                .catch(error => {
                    DialogUtils.showMsg("error:" + error.message)
                    DialogUtils.hideLoading()
                })
        }
        DialogUtils.showPop("你确认已收到卖出款？",()=>confirmState(),null,"确认收款","取消")

    }

    onClickImage(){
        alert("查看大图")   
        // if(this.props.data.item.payState===2){
        //     if(this.state.image.length>0){
        //         this.props.navigation.navigate('ImageBorwser',{
        //             images:this.state.image,
        //         });
        //     }else{
        //         this.handleAsyncSelectPhoto()
        //     }
        // }else if(this.props.data.item.payState===3){
        //      alert("查看大图")   
        // }
    }
    
    render() {
        let backgroundColor = "#f8f8f8"
        //取消订单按钮
        let cancleOrder = <TouchableOpacity
            style={{
                marginTop: 10, borderColor: "#d11", borderRadius: 8, borderWidth: 1,
                width: 100, height: 30, alignItems: "center", justifyContent: "center",
            }} >
            <Text style={{ fontSize: 14, color: "#d11", textAlign: "center" }} >取消订单</Text>
        </TouchableOpacity>

        let addImage = <TouchableOpacity onPress={()=>this. onClickImage()}>
            <Image style={{ width: 140, height: 140 ,borderWidth:0.5,borderColor:"#999",marginTop:10}} source={this.state.defaultImage} />
        </TouchableOpacity>

        //确认按钮
        let confirmOrder = <TouchableOpacity
            onPress={()=>this.confirmButton()}
            style={{
                marginTop: 10, borderRadius: 15, backgroundColor: mainColor,
                width: 100, height: 30, alignItems: "center", justifyContent: "center",
                alignSelf:"flex-end"
            }} >
            <Text style={{ fontSize: 14, color: "#fff", textAlign: "center" }} >确认收款</Text>
        </TouchableOpacity>

        //隐藏布局 -imageview
        let imageView = <View style={{ flexDirection: "column" ,backgroundColor:backgroundColor,}}>
         <View style={{ backgroundColor: "#c1c1c1", height: 2, marginBottom:10}}/>
            <Text style={Styles.text}>打款截图:</Text>
             <View style={{ flexDirection: "row" ,backgroundColor:backgroundColor}}>
             {addImage} <View style={{flex:1}}></View>{this.props.data.item.payState===3?null:confirmOrder}
            </View> 
        </View>
        return (
            <View style={{flex:this.state.flex, flexDirection: "column", marginBottom: 5, }}>
                <View style={{ backgroundColor: "#fff", flexDirection: "column", padding: 12, flex: 1, }}>

                    <TouchableOpacity activeOpacity={0.9}
                        onPress={() => this._onPress(this.props.data.item.payState)}>
                        <View style={{ flexDirection: 'row', }}>

                            <Text style={{ flex: 1, color: "#333333", fontSize: 18, }}>挂单金额:{this.props.data.item.payNums}RMB</Text>

                            <Text style={{
                                color: "#2828FF", marginTop: 5, fontSize: 15,
                            }}>{this.getOrderState(this.props.data.item.payState)}+{this.props.data.item.payState}</Text>
                            <Image style={{ transform: [{ rotate: this.state.rotate }] }} source={require("../../res/images/ic_tiaozhuan.png")} />

                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', }}>           
                    <Text style={{ color: "#666666", fontSize: 14, marginTop: 10,flex:1 }}>
                        {Utils.formatDateTime(this.props.data.item.payTime * 1000)}
                    </Text>
                    <Text style={{ color: "#666666",  fontSize: 14, marginTop: 10, marginRight: 10,}}>
                        打款人： {this.props.data.item.userName}
                    </Text>
                   </View>             
                   {this.props.data.item.payState >= 2 ? null : cancleOrder}
                </View>
                <Animated.View
                    style={{
                        height: this.state.showAnim.interpolate({
                            inputRange: [0, 1], outputRange: [0, 360]
                        }),
                        overflow: 'hidden'
                    }}
                >
                    <View style={{
                        justifyContent: 'center', backgroundColor: backgroundColor, padding: 12,
                    }}>
                        <View style={Styles.view}>
                            <Text style={Styles.text}>姓名:</Text>
                            <Text style={Styles.textValue}>{this.props.data.item.userName}</Text>
                        </View>

                        <View style={{ backgroundColor: "#c1c1c1", height: 0.5 }}></View>

                        <View style={Styles.view}>
                            <Text style={Styles.text}>手机号码:</Text>
                            <Text style={Styles.textValue}>{this.props.data.item.mobile}</Text>
                        </View>

                        <View style={{ backgroundColor: "#c1c1c1", height: 0.5 }}></View>

                        <View style={Styles.view}>
                            <Text style={Styles.text}>交易金额:</Text>
                            <Text style={Styles.textValue}>{this.props.data.item.payNums}</Text>
                        </View>

                        <View style={{ backgroundColor: "#c1c1c1", height: 0.5 }}></View>

                        <View style={Styles.view}>
                            <Text style={Styles.text}>状态:</Text>
                            <Text style={[Styles.textValue, { color: "#2828FF" }]}>{this.getOrderState(this.props.data.item.payState)}</Text>
                        </View>
                        {imageView}
                    </View>
                </Animated.View>
            </View>
        );
    }
}
export const Styles = StyleSheet.create({

    view: {
        height: 40, flexDirection: "row", alignItems: "center"
    },
    text: {
        // padding:10,
        fontSize: 15, color: "#666"
    },
    textValue: {
        flex: 1, fontSize: 15, color: "#333", textAlign: "right",
    }
});