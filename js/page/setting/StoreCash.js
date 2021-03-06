import React from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import BaseComponent, { BaseStyles, mainColor, upDataUserInfo } from "../BaseComponent";
import NavigationBar from "../../common/NavigationBar";
import Utils from '../../util/Utils';
import BaseUrl from '../../util/BaseUrl';
import { inject, observer } from 'mobx-react';
import HttpUtils from '../../util/HttpUtils';
import SYImagePicker from 'react-native-syan-image-picker'
import DialogUtils from '../../util/DialogUtils';
import Colors from '../../util/Colors';
import PassWordInput from '../../common/PassNumInput';


// @inject('AppStore') @observer
export default class StoreCash extends BaseComponent {
    static userData;
    constructor(props) {
        super(props);
        this.userInfo = this.getUserInfo()

        const { requireData } = this.props.navigation.state.params;
        this.availableBalance = requireData.availableBalance;
        this.alreadyWithdrawal = requireData.alreadyWithdrawal;
        this.totalRevenue = requireData.totalRevenue;
        

        // this.props = {
        //     availableBalance : requireData.availableBalance,
        //     alreadyWithdrawal : requireData.alreadyWithdrawal,
        //     totalRevenue : requireData.totalRevenue
        // };

        // this.props.availableBalance = requireData.availableBalance;
        // this.props.alreadyWithdrawal = requireData.alreadyWithdrawal;
        // this.props.totalRevenue = requireData.totalRevenue;

        this.state = {
            availableBalance: requireData.availableBalance,
            alreadyWithdrawal: requireData.alreadyWithdrawal,
            totalRevenue: requireData.totalRevenue,
            // 提款
            count: '',
            // 描述
            desc: '',
            // 银行卡
            bankCard: null,
            // 图片
            photos: [],
        };

        // alert(JSON.stringify(this.props.totalRevenue))
    }



    ViewCash(text, number, fontColor = 'black') {
        return (<View style={{ height: 80, justifyContent: 'space-around', alignItems: 'center', padding: 10 }}>
            <Text style={{ color: fontColor, fontSize: 16 }}>{number}</Text>
            <Text style={{ color: 'gray', fontSize: 16 }}>{text}</Text>
        </View>);
    }

    ViewBankCard() {
        let sty = { fontSize: 16, color: 'black' };
        if (this.state.bankCard) {
            return (<View>
                {/* <Text style={sty}>{this.state.bankCard.holdName}</Text> */}
                {/* <Text style={sty}>{'银行: ' + this.state.bankCard.banqGenre + ' (持有者: ' + this.state.bankCard.holdName + ')'}</Text>
                <Text style={sty}>{'卡号: ' + this.state.bankCard.cardNumber}</Text> */}
                <Text style={sty}>{this.state.bankCard.holdName}</Text>
                <Text style={sty}>{this.state.bankCard.banqGenre}</Text>
                <Text style={sty}>{this.state.bankCard.cardNumber}</Text>
            </View>);
        }
        return <Text style={{ ...sty, color: 'rgb(100, 190, 180)' }}>选择银行卡</Text>;
    }

    selectBankCard() {
        this.props.navigation.navigate("BankCardList", {
            selectBank: (bankCard) => {
                //alert(JSON.stringify(bankCard))
                //this.props.selechBankCard(bankCard)
                this.setState({
                    bankCard: bankCard,
                })
            }
        })
    }


    handleOpenImagePicker = () => {
        SYImagePicker.showImagePicker({ imageCount: 3, isRecordSelected: true }, (err, photos) => {
            console.log(err, photos);
            if (!err) {
                this.setState({
                    photos: photos,
                })
            }
        })
    };
    /**
     * 创建ImagView 显示图片
     * @param {*} photos 
     */
    createImg(photos) {
        if (this.state.photos.length < 1) {
            return <Image source={require('../../../res/images/addimg.png')} />;
        }
        return photos.map((photo, index) => {
            let source = { uri: photo.uri };
            if (photo.enableBase64) {
                source = { uri: photo.base64 };
            }
            return (
                <Image
                    key={`image-${index}`}
                    style={{
                        width: Utils.getWidth() / 4,
                        height: Utils.getWidth() / 4,
                        marginRight: 10,
                    }}
                    source={source}
                    resizeMode={"cover"}
                />
            )
        })
    }

    render() {
        let marLeftInner = 18;
        return (
            <View style={{ flex: 1 }}>
                <NavigationBar title='商家兑现' navigation={this.props.navigation} />
                <ScrollView>
                    <View style = {{backgroundColor : '#FFF'}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            {this.ViewCash('可用余额', this.state.availableBalance, 'red')}
                            {this.ViewCash('已提现余额', this.state.alreadyWithdrawal)}
                            {this.ViewCash('店铺总收益', this.state.totalRevenue)}
                        </View>
                        <View style={{ height: 10, backgroundColor: '#DDD' }} />
                        <Text style={styles.label}>提现数额</Text>
                        <View style={{ width: Utils.getWidth() * 0.7, borderBottomColor: 'gray', borderBottomWidth: 1, flexDirection: 'row', marginLeft: marLeftInner, marginTop: 15, alignItems : 'flex-end' }}>
                            <Text style={{ fontSize: 24, color: 'red', marginRight: 10 }}>¥</Text>
                            <TextInput style={{ fontSize: 16, flex: 1, top : 8 }}
                                placeholder={'500以上、100的倍数'}
                                placeholderTextColor={'gray'}
                                underlineColorAndroid='transparent'
                                keyboardType={'numeric'}
                                value={this.state.count}
                                maxLength = {7}

                                onChangeText={(n) => this.setState({ count: n.replace(/[^\d]+/, '0') })}
                            />
                        </View>
                        {/* <View style={{height:0.5,flex:1,backgroundColor:Colors.lineColor}}/> */}
                        <Text style={styles.label}>到账银行</Text>
                        <TouchableOpacity style={{ marginLeft: marLeftInner, marginTop: 10 }}
                            onPress={() => this.selectBankCard()}>
                            {this.ViewBankCard()}
                        </TouchableOpacity>
                        <Text style={styles.label}>描述</Text>
                        <TextInput style={{ textAlignVertical: 'top', height: 100, fontSize: 16, marginHorizontal: marLeftInner, marginTop: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 2 }}
                            placeholder={'150字以内...'}
                            placeholderTextColor={'gray'}
                            underlineColorAndroid='transparent'
                            multiline={true}
                            numberOfLines={3}
                            maxLength={150}
                            onChangeText={(n) => this.setState({ desc: n })}
                        />
                        <Text style={styles.label}>上传凭证</Text>
                        <Text style={{ fontSize: 16, color: 'gray', marginLeft: marLeftInner, marginTop: 10 }}>请上传商品订单完成截图与快递单截图(1-3张)</Text>

                        <TouchableOpacity style={{ marginLeft: marLeftInner }}
                            onPress={() => this.handleOpenImagePicker()}>
                            <View style={{ flexDirection: 'row', padding: 10 }}>
                                {this.createImg(this.state.photos)}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                marginTop: 30,
                                width: Utils.getWidth() * 0.9,
                                height: 40,
                                alignSelf: 'center',
                                backgroundColor: 'rgb(70, 180, 160)',
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginVertical: 30,
                            }}
                            onPress={() => this.onApply()}>
                            <Text style={{ fontSize: 20, color: 'white', fontWeight: '900' }}>申请提现</Text>
                        </TouchableOpacity>
                        <Text style = {styles.desc}>兑换说明：</Text>
                        <Text style = {styles.desc}>1.只针对Wepay商城商家流通，余额必须来源于商城的正式交易，私下交易和红包释放余额不属于兑现范筹。</Text>
                        <Text style = {styles.desc}>2.申请时必须提交商城总收益截图和快递单号截图，弄虚作假作假者予以封号处理，绝不姑息。</Text>
                        <Text style = {[styles.desc, {marginBottom : 50}]}>3.到帐时间1-3个工作日内。</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    onApply() {
     
        let count = this.state.count;

         if ((count < 500) || ((count % 100) != 0)){
            DialogUtils.showMsg('提现数额要100的倍数, 大于500');
            return;
        }

        if(count > this.availableBalance){
            DialogUtils.showMsg('不能超出可提取余额');
            return;
        }

        // 银行卡
        if(!this.state.bankCard){
            DialogUtils.showMsg('请选择银行卡');
            return;
        }
        // 描述
        if(this.state.desc.length < 10){
            DialogUtils.showMsg('描述字数不得少于10');
            return;
        }
        if(this.state.desc.length > 150){
            DialogUtils.showMsg('描述字数不得多于150');
            return;
        }
        // 图片
        if(this.state.photos.length < 1){
            DialogUtils.showMsg('请上传凭证图片');
            return;
        }
        PassWordInput.showPassWordInput((safetyPwd) => this.applySotreCash(safetyPwd))
    }




    /**
     * 申请提现
     */
    applySotreCash(safetyPwd) {

        let url = BaseUrl.getStoreCashApplyUrl()
        DialogUtils.showLoading("", true);
        /** sessionId   contents  file */
        HttpUtils.uploadImage(
            url,
            {
                sessionId: this.getUserInfo().sessionId,
                amount: this.state.count,
                cardId: this.state.bankCard.id,
                describe: this.state.desc,
                safetyPwd: safetyPwd,
            },
            this.state.photos, 
            (result) => {
                DialogUtils.hideLoading();
                if (result.code == 1) {
                    DialogUtils.showMsg("申请成功, 请耐心等待审核", "知道了", () => {
                    this.props.navigation.goBack()
                });} else {
                    DialogUtils.showToast(result.msg);
                    if(result.code == 2 || result.code == 4){
                        this.goLogin(this.props.navigation)
                    }
                }
        })
    }

}


const styles = StyleSheet.create({
    label : { fontSize: 18, color: 'black', marginLeft: 12, marginTop: 20 },
    desc : {color : 'rgb(245, 95, 95)', marginHorizontal : 20},
});