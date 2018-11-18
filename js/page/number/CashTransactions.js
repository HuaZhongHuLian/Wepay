import React,{Component} from 'react';
import {
    StyleSheet,
    // Text,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ScrollView,
    Platform,
    View, 
    TextInput, 
    Modal, 
    RefreshControl, 
    // StatusBar
} from 'react-native';
import BaseComponent, {mainColor, upDataUserInfo} from "../BaseComponent";
import RefreshFlatList from "../../common/RefreshFlatList"
import Colors from "../../util/Colors"
import {SegmentedBar} from 'teaset';
import PassWordInput from "../../common/PassNumInput";
import BankCardView from "../../common/BankCardView"
import ViewUtils from '../../util/ViewUtils';
import CheckMoney from '../../common/CheckMoney';
import SplashScreen from "react-native-splash-screen"
import { Net, Dialog, NavComponent, Text, StatusBar, NavBar, Button1, C, Button, U, isAndroid, KEY_SESSION } from '../../utils/Component';
import AsySorUtils from '../../dao/AsySorUtils';
import UserInfo from '../../model/UserInfo';


const c_prices = [500, 1000, 1500, 2000, 2500,3000, 3500, 4000, 5000];
export const c_DataFields = ["创建时间", "匹配时间", "打款时间", "完成时间"];
export const eSeg = {PUBLISH:0, HALL:1,RECORD:2};
export const eBuySell = {BUY:0, SELL:1};
export default class CashTransactions extends NavComponent {
    constructor(props) {
        super(props);
        this.state = {
            SegmentedIndex : eSeg.HALL,
            buySellIndex : eBuySell.BUY,
            bankCard:null,
            amount:"",
            hideCheckMoney : false,
        }
        this.checkMoneyIndex = 0;
        this.pageIndex = 1;
        // this.params = {cid:1};
    }


    componentDidMount(){
        Net.updateCoins();
        this.loadData(this.state.SegmentedIndex, this.state.buySellIndex, true);
        return;
        SplashScreen.hide();
        if(1){
            U.load(KEY_SESSION, info=>{
                if(info){
                    Net.loadUserData(info.sessionId);
                    setTimeout(this.autoUpdate.bind(this),500);
                } else {
                    this.autoLogin();
                }
            });
        }
        else {
            this.autoLogin(); 
        }
        return;
        this.loadData(this.state.SegmentedIndex, this.state.buySellIndex, true);
    }

    autoLogin(){
        let acount = isAndroid ? 26536 : 26538;
        let pwd = 123456;
        Net.login(acount, pwd, "1.3.0", ()=>{
            U.save(KEY_SESSION, {sessionId:Net.getUser().sessionId})
            this.autoUpdate();
        });  
    }

    autoUpdate(){
        Net.updateCoins();
        UserInfo.userInfo = Net.getUser();
        UserInfo.sessionId = UserInfo.userInfo.sessionId;
        // this.props.AppStore.setUserInfo(Net.getUser());
        // upDataUserInfo(this.props.AppStore);
    }

    onSegmented(index){
        if(this.state.SegmentedIndex == index){
            return;
        }
        this.setState({
            SegmentedIndex : index, 
        });
        this.loadData(index, this.state.buySellIndex, true);
    }

    
    onBuySell(index){
        if(this.state.buySellIndex == index){
            return;
        }
        this.setState({buySellIndex : index});
        this.loadData(this.state.SegmentedIndex, index, true);
    }

    onPrice(index){
        if(this.checkMoneyIndex == index){
            return;
        }
        this.checkMoneyIndex = index;
        this.loadData(this.state.SegmentedIndex, this.state.buySellIndex, true);
    }


    onCreate(buySellIndex){
        if(!this.state.bankCard){
            Dialog.msg1("请选择银行卡")
            return;
        }
        if(this.checkMoneyIndex < 0){
            Dialog.msg1("请选择价格")
            return;
        }
        let amount = this.state.amount;
        if(amount.length < 0){
            Dialog.msg1("请输入有效数值")
            return;
        }
        amount = parseInt(amount);
        if(amount < 1 || amount.toString() != this.state.amount){
            Dialog.msg1("请输入整数")
            return;
        }

        if(buySellIndex == eBuySell.SELL){
            let coin = Net.getCoins(this.params.cid);
            if(amount > coin.num)
            {
                Dialog.msg1(coin.coinName + "数量不足");
                return;
            }
        }
        
        PassWordInput.showPassWordInput((safetyPwd) => this.onCreatePwd(buySellIndex, safetyPwd, amount))
    }

    onCreatePwd(buySellIndex, safetyPwd, amount){
        this.fetid("/cashDealing/createOrder", {
            safetyPwd:safetyPwd,
            orderType:[1,0][buySellIndex],
            num:amount,
            money:c_prices[this.checkMoneyIndex],
            bankCardId:this.state.bankCard.id,
            cid:this.params.cid,
        }, result=>{
            Dialog.msg1(result.msg || "订单创建成功");
            if(buySellIndex == eBuySell.SELL){
                let coin = Net.getCoins(this.params.cid);
                Dialog.toast(coin.num);
                coin.num -= amount;
            }
        });
    }

    viewCheckMoney(text){
        return <View style={[{ marginTop:10,flexDirection: 'column', backgroundColor: "#fff" }]}>
            <TouchableHighlight 
                style={{ paddingTop: 5,paddingLeft: 15,paddingBottom: 5,}}
                onPress = {() => this.setState({hideCheckMoney : !this.state.hideCheckMoney})}>
                <Text style={{color: '#999',fontSize: C.c16,}}> {text}</Text>
            </TouchableHighlight>
            {this.state.hideCheckMoney ? null : ViewUtils.getLineView()}
            {this.state.hideCheckMoney ? null : <CheckMoney
                arrText={c_prices}
                styleItem = {{marginVertical : 5}}
                seleIndex = {this.checkMoneyIndex}
                onSelected={(index, value) => this.onPrice(index)}
            />}
        </View>;
    }

    viewOrder(buySellIndex){
        return <ScrollView><View>
            <BankCardView  {...this.props}
                selechBankCard={(bankCard)=>this.setState({bankCard:bankCard})}
            />
            {ViewUtils.getLineView()}
            {this.viewCheckMoney("点击" + (this.hideCheckMoney ? "显示":"隐藏") + (buySellIndex == eBuySell.BUY ? "买入" : "卖出") + "价格")}
            <View style = {{marginVertical:10,flexDirection: 'column', backgroundColor: "#fff", paddingHorizontal : 20, paddingVertical : 10}}>
            <TextInput style = {{fontSize : 16, height : 50, borderColor : '#999', borderRadius : 5, borderWidth : 1, padding : 5}} 
                placeholder = {"输入需求" + (buySellIndex == eBuySell.BUY ? "买入" : "卖出") + "的数量(整数)"}
                placeholderTextColor = {'#999'}
                underlineColorAndroid='transparent'
                keyboardType={'numeric'}
                // value={this.state.amount}
                onChangeText={(str) => {
                    this.setState({
                        amount: str, //.replace(/[^\d]/g, ''),
                    });
                }}
            /></View>
            {/* <TouchableHighlight
                style={{
                    width: '90%',
                    height: 40,
                    alignSelf: 'center',
                    backgroundColor: mainColor,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 30,
                    marginBottom : 50,
                }}
                >
                <Text style={{ fontSize: 20, color: 'white', fontWeight: '900' }}>创建订单</Text>
            </TouchableHighlight> */}
            <Button1 title = {"创建订单"} onPress={() => this.onCreate(buySellIndex)}/>
        </View></ScrollView>;
    }

    loadData(SegmentedIndex, buySellIndex, clear){
        if(clear){
            this.pageIndex = 1;
            this.refList.setData([])
        }
        if(!Net.getUser() || this.checkMoneyIndex < 0 || SegmentedIndex == eSeg.PUBLISH){
            return;
        }

        // let result = {data : []};
        if(0){
            if(SegmentedIndex == eSeg.HALL){
                for(let k = 0; k < (this.pageIndex < 2 ? 20 : 5); ++k){
                    result.data.push({name: ["买入-", "卖出-"][buySellIndex] + c_prices[this.checkMoneyIndex] + "-" + k});
                }
            } else if(SegmentedIndex == eSeg.RECORD){
                for(let k = 0; k < (this.pageIndex < 2 ? 20 : 5); ++k){
                    result.data.push({acount: k, status:k % 3});
                }
            }
            console.log(JSON.stringify(result));
        }
        let buy = [0,1][buySellIndex];
        let sell = [1,0][buySellIndex];
        this.fetid((SegmentedIndex == eSeg.HALL) ? "/cashDealing/dealingLobby" : "/cashDealing/orderList", {
            orderType:(SegmentedIndex == eSeg.HALL) ? buy : sell,
            money:c_prices[this.checkMoneyIndex],
            pageIndex:this.pageIndex,
            cid:this.params.cid,
        }, result=>{
            if (clear) {
                // .current
                this.refList.setData(result.data)
                if (result.data.length < 1 && SegmentedIndex != eSeg.PUBLISH) {
                    Dialog.toast("暂无记录")
                }
            } else {
                // .current
                this.refList.addData(result.data)
            }
            this.pageIndex += 1
        });
    }

    viewHallItem(SegmentedIndex, buySellIndex, data){
        let strBuySell = ["买入", "卖出"][buySellIndex];
        // let strBuySellRev = ["卖出", "买入"][buySellIndex];
        if(SegmentedIndex == eSeg.HALL){
            return <View style = {{marginTop:1, padding:10, backgroundColor:"white", flexDirection:"row", justifyContent:"space-between"}}>
                <View style = {{flexDirection:"row"}}>
                    <Image style={{width:50, height:50}} source = {{uri:Net.getImage() + data.imgHead}}/>
                    <View style = {{marginLeft:10}}>
                        <Text style = {{fontSize:16,color:"black"}}>{data.username}</Text>
                        <View style = {{flexDirection:"row"}}>
                            <Text style = {{color:C.black}}>交易数量: </Text>
                            <Text style = {{color:C.black}}>{data.publishNums}</Text>
                        </View>
                        <View style = {{flexDirection:"row"}}>
                            <Text style = {{color:C.black}}>支付方式: </Text>
                            <Text style = {{color:C.black}}>{data.bankName}</Text>
                        </View>
                    </View>
                </View>
                <View style={{justifyContent:"center"}}>
                    {/* <TouchableHighlight style={{backgroundColor:mainColor, borderRadius:3, padding : 10}}onPress = {null}>
                        <Text style={{color:"white"}}>{strBuySell}</Text>
                    </TouchableHighlight> */}
                    <Button title = {strBuySell} round = {true} style = {{width:0}} onPress={()=>{
                        this.onClick(SegmentedIndex, buySellIndex, data);
                    }}/>
                </View>
            </View>
        }

        let status = data.orderStatus - 1;
        let strStatus = ["待匹配", "匹配中 待打款", "已打款 待确认", "已完成"][status];
        let strBtnStatus = [["取消订单", "去打款", "查看详情", "交易详情"],["取消订单", "匹配详情", "去确认", "交易详情"]][buySellIndex][status]
        let strDate = c_DataFields[status];
        let iTime = [data.createTime, data.matchTime, data.remitTime, data.finishTime][status];
        return <View style = {{marginTop:1, backgroundColor:"white", flexDirection:"row", justifyContent:"space-between"}}>
            <View style = {{paddingVertical:10, paddingLeft:10}}>
                {/* <View style = {{flexDirection:"row"}}>
                    <Text style = {{color:C.gray}}>{strBuySellRev}账号 </Text>
                    <Text style = {{color:C.black}}>{data.acount}</Text>
                </View> */}
                <View style = {{flexDirection:"row"}}>
                    <Text style = {{color:C.gray}}>交易金额 </Text>
                    <Text style = {{color:C.black}}>{data.transactionSum}</Text>
                </View>
                <View style = {{flexDirection:"row"}}>
                    <Text style = {{color:C.gray}}>交易状态 </Text>
                    <Text style = {{color: status == 3 ? C.black : "red"}}>{strStatus}</Text>
                </View>
                <View style = {{flexDirection:"row"}}>
                    <Text style = {{color:C.gray}}>{strDate} </Text>
                    <Text style = {{color:C.black}}>{U.toDate(iTime)}</Text>
                </View>
            </View>
            <View style={{justifyContent:"space-around", paddingRight:10}}>
                <Button title = {strBtnStatus} round = {true} onPress = {()=>{
                    this.onClick(SegmentedIndex, buySellIndex, data);
                }}/>
            </View>
        </View>
    }

    onClick(SegmentedIndex, buySellIndex, data){
        let buy = [0,1][buySellIndex];
        let sell = [1,0][buySellIndex];
        if(SegmentedIndex == eSeg.HALL){
            let coin = Net.getCoins(this.params.cid);
            if(buySellIndex == eBuySell.SELL && data.publishNums > coin.num){
                Dialog.msg1(coin.coinName + "数量不足");
                return;
            }
            PassWordInput.showPassWordInput((safetyPwd) => {
                this.fetid("/cashDealing/dealing", {
                    orderId : data.orderId,
                    orderType :buy,
                    safetyPwd:safetyPwd,
                }, result=>{
                    Dialog.msg1(result.msg || "匹配成功");
                    this.loadData(SegmentedIndex, buySellIndex, true);
                })
            })
        } else if(SegmentedIndex == eSeg.RECORD){
            if(data.orderStatus == 1){
                Dialog.msg2("取消订单?", ()=>{
                this.fetid("/cashDealing/cancelOrder", {
                    orderId : data.orderId,
                }, result=>{
                    Dialog.msg1(result.msg || "订单已取消");
                    this.loadData(SegmentedIndex, buySellIndex, true);
                })});
            }else{
                // 234
                this.fetid("/cashDealing/dealingDetails", {
                    orderId : data.orderId,
                }, result=>{
                    this.navigate("CashDetail", {
                        status_234:data.orderStatus, 
                        buysell_01:buy,
                        data : result.data,
                        onBack : ()=>this.loadData(this.state.SegmentedIndex, this.state.buySellIndex, true),
                    })
                })
            }
        }
    }


    render() {
        return (
            <View style = {{flex:1}}>{StatusBar}<NavBar title = {"现金交易"} onLeft = {this.onLeft}/>
                {/* <NavigationBar
                    title='现金交易'
                    navigation={this.props.navigation}
                /> */}
                <SegmentedBar
                    justifyItem={"fixed"}
                    indicatorLineColor={mainColor}
                    indicatorLineWidth={1}
                    // indicatorPositionPadding={5}
                    activeIndex={this.state.SegmentedIndex}
                    onChange={index => this.onSegmented(index)} >
                    <View key={0} style={{ padding: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: this.state.SegmentedIndex == eSeg.PUBLISH ? "red":  mainColor}} >{"创建订单"}</Text>
                    </View>
                    <View key={1} style={{ padding: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: this.state.SegmentedIndex == eSeg.HALL ? "red":  mainColor}} >{"交易大厅"}</Text>
                    </View>
                    <View key={2} style={{ padding: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: this.state.SegmentedIndex == eSeg.RECORD ? "red":  mainColor}} >{"交易记录"}</Text>
                    </View>
                </SegmentedBar>
                <View style={{ flexDirection: "row", backgroundColor: Colors.bgColor, justifyContent: "center", padding: 5 }}>
                    <TouchableOpacity
                        onPress={() => this.onBuySell(0)}
                        style={{
                            borderColor: mainColor, borderWidth: 1, borderTopLeftRadius: 20, borderBottomLeftRadius: 20,
                            justifyContent: "center", alignItems: "center", backgroundColor: this.state.buySellIndex == eBuySell.SELL ? Colors.white : mainColor,
                            paddingVertical : 7, marginVertical : 5, width : "35%"
                        }}>
                        <Text style={{ fontSize:16,color: this.state.buySellIndex == eBuySell.SELL ? Colors.gray : Colors.white }}>买入</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.onBuySell(1)}
                        style={{
                            borderColor: mainColor, borderWidth: 1, borderTopRightRadius: 20, borderBottomRightRadius: 20,
                            justifyContent: "center", alignItems: "center", backgroundColor: this.state.buySellIndex == eBuySell.SELL ? mainColor : Colors.white,
                            paddingVertical : 7, marginVertical : 5, width : "35%"
                        }} >
                        <Text style={{ fontSize:16,color: this.state.buySellIndex == eBuySell.SELL ? Colors.white : Colors.gray }}>卖出</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.SegmentedIndex == eSeg.PUBLISH ? 
                    this.viewOrder(this.state.buySellIndex) : 
                    (this.state.SegmentedIndex == eSeg.HALL ? 
                        this.viewCheckMoney("点击" + (this.hideCheckMoney ? "显示":"隐藏") + "匹配金额") : 
                        null)
                }
                <RefreshFlatList
                    ref={r=> this.refList = r}
                    renderItem={(items) => this.viewHallItem(this.state.SegmentedIndex, this.state.buySellIndex, items.item)}
                    onRefreshs={() => this.loadData(this.state.SegmentedIndex, this.state.buySellIndex, true)}
                    onLoadData={() =>this.loadData(this.state.SegmentedIndex, this.state.buySellIndex, false)}
                    isDownLoad = {true}
                />
            </View>
        );
    }
}
