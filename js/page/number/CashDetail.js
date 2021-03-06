import React, {Component} from 'react';
import {View,Image,ScrollView,TextInput, } from 'react-native';
import SyanImagePicker from 'react-native-syan-image-picker';
import { Net,Dialog,Label as Text,StateBar,NavBar,Color,Button1,Layout, Icons, Touch, Jx, NavComponent} from '../../utils/_component';
import { eBuySell, c_DataFields } from "./CashTransactions"
import DialogUtils from '../../util/DialogUtils';

class Text2 extends React.PureComponent{
    render(){ return <View style = {{flexDirection:"row",alignItems:"center", marginTop:Layout.margin, ...this.props.style}}>
        <Text style = {{fontSize:Layout.c16, color:Color.gray, minWidth:Layout.c20*4}}>{this.props.field}</Text>
        {Jx.isElement(this.props.children)?this.props.children:<Text style = {{fontSize:Layout.c16, color:Color.black}}>{this.props.children}</Text>}
    </View>}
}

export default class CashDetail extends NavComponent {
    constructor(props) {
        super(props);
        let status = this.getParams().status_234;
        let buy = this.getParams().buysell_01;
        if(status == 2){
            this.title = ["打款", "匹配详情"][buy];
            if(buy == 0){
                this.remit = true;
                this.btnRemit = "确定打款";
            }
        }else{
            this.remitVoucherField = "打款凭证";
            this.remitVoucher = this.getParams().data.remitProof;
            this.remitVoucher = { uri : Net.getImage() + this.remitVoucher};
            if(status == 3){
                this.title = ["打款详情", "收款详情"][buy];
                if(buy == 1){
                    this.btnRemit = "确定收款";
                }
            }else{
                this.title = "交易详情";
            }
        } 
        if(status == 2){
            this.subTitle = ["收款人信息:", "打款人信息:"][buy];
        }
        if(buy == 1){
            this.nameField = "打款人"
        } else {
            this.nameField = "收款人";
        }
        this.dateField = c_DataFields[status - 1];
        this.state = {photo : null};
        this.pick = this.pick.bind(this);
// finishTime: "0"
// matchTime: "1542436154"
// orderId: 22
// orderType: 0
// publishBankName: "中国工商银行"
// publishCardNumber: "61734643"
// publishId: 26538
// publishName: "哈哈"
// publishNums: 20
// publishOpenCard: "深圳分行"
// publishPhone: "18629448593"
// remitProof: "0"
// remitTime: "0"
// subscriptionBankName: "支付宝"
// subscriptionCardNumber: "13923044417"
// subscriptionId: 26536
// subscriptionName: "至尊宝"
// subscriptionOpenCard: "好运来"
// subscriptionPhone: "13923044417"
// transactionSum: 2000
        let buy2 = buy;
        let data = this.getParams().data;
        this.name = [data.publishName, data.subscriptionName][buy2];
        this.phone = [data.publishPhone, data.subscriptionPhone][buy2];
        this.money = data.transactionSum;
        this.count = data.publishNums;
        this.bank = [data.publishBankName, data.subscriptionBankName][buy2];
        this.card = [data.publishCardNumber, data.subscriptionCardNumber][buy2];
        this.date = [data.matchTime, data.remitTime, data.finishTime][status-2];
        this.date = Jx.toDate(this.date)
    }

    
    render(){ 
        return<View style = {{flex:1}}> 
            <StateBar />
            <NavBar title = {this.title} onLeft = {()=>{this.onLeft(); this.getParams().onBack()}}/>
            {this.subTitle && <View style = {{paddingLeft:Layout.pad, paddingTop:Layout.pad, backgroundColor:Color.white}}>
                <Text style = {{fontSize:Layout.c16,color:Color.theme}}>{this.subTitle}</Text>
            </View>}
            <View style = {{backgroundColor:Color.white, padding:Layout.pad}}>
                <Text2 style = {{marginTop:0}} field = {this.nameField}>{this.name}</Text2>
                <Text2 field = {"手机号"}>{this.phone}</Text2>
                <Text2 field = {"交易金额"}>{this.money}</Text2>
                <Text2 field = {"交易数量"}>{this.count}</Text2>
                <Text2 field = {"支付类型"}>{this.bank}</Text2>
                <Text2 field = {"支付账号"}><Text style = {{fontSize:Layout.c16, color:"red"}}>{this.card}</Text></Text2>
                <Text2 field = {this.dateField}>{this.date}</Text2>
                {this.remitVoucherField && <Text2 style = {{alignItems:"flex-start",}}
                    field = {this.remitVoucherField}>
                    <Touch onPress = {()=>DialogUtils.onImagePress([this.remitVoucher],0)}>
                        <Image 
                            style={{ marginTop: Layout.margin, width:120, height:120, resizeMode: "cover"}}
                            source={this.remitVoucher}
                        />
                    </Touch>
                    
                </Text2>}
            </View>
            {this.remit && <View 
                style = {{backgroundColor:Color.white, marginTop:Layout.margin, padding:Layout.pad}}>
                <Text style = {{fontSize:Layout.c16,color:Color.theme}}>上传打款凭证</Text>
                <Touch onPress = {this.pick}>
                    <Image 
                        style={{ marginTop: Layout.margin, width:120, height:120, resizeMode: "cover"}}
                        source={this.state.photo || Icons.shangchuan_3}
                    />
                </Touch>
            </View>} 
            {this.btnRemit && <Button1 title = {this.btnRemit} onPress={this.onClick.bind(this)}/>}
        </View>
    }

    onClick(){
        if(this.getParams().buysell_01 == 0){
            if(!this.state.photo){
                Dialog.msg1("未选取打款凭证");
                return;
            }
            let cb = ()=>{this.fetid("/cashDealing/inAPUpdate",{ 
                orderId : this.getParams().data.orderId,
                file : Jx.toFile(this.state.photo.uri),
                },result=>{
                    Dialog.msg1(result.msg || "打款成功");
                    this.onLeft();
                    this.getParams().onBack();
                });
            };
            Dialog.msg2("确认已经打款?", cb);
        } else {
            let cb = ()=>{
                this.fetid("/cashDealing/outAPUpdate",{
                    orderId : this.getParams().data.orderId,
                },result=>{
                    Dialog.msg1(result.msg || "收款成功");
                    this.onLeft();
                    this.getParams().onBack();
                });
            };
            Dialog.msg2("确定已收款?", cb);
        }
    }


    pick(){
        SyanImagePicker.showImagePicker({imageCount: 1, isRecordSelected: false}, 
            (err, photos) => {
                if(err){
                    Dialog.toast(err);
                    return;
                }
                this.setState({
                    photo : {
                        uri : photos[0].enableBase64 ? photos[0].base64 : photos[0].uri
                    }
                });
            }
        );
    }
}