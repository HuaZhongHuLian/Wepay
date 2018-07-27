const url = 'http://192.168.0.105:8081/wepay'

export default class BaseUrl {

    /**
     * 登陆接口
     * 
     * @param {*} phone 
     * @param {*} pwd 
     * 
     * @return 
            "userid": 26536,
            "account": "13923044417",
            "mobile": "13923044417",
            "username": "刘丶丶",
            "sessionId": "07978ff98dc14660a42a751ca4145c70",
            "userCredit": 5,
            "useGrade": 0,
            "imgHead": "http://tz.hxksky.com/wepay/upload/toux-icon.png",
            "isReward": 1,
            "walletAdd": "41QdCdW46NNV0Ymm3zmzTyghUe16v0a0cP",
            "cangkuNum": 14.2282,
            "fengmiNum": 501.996,
            "todayReleas": 1.004
     */
    static loginUrl(phone, pwd) {
        return url + "/user/login?account=" + phone + "&password=" + pwd
    }
    /**
     *  获取设置界面是否有新消息  其他字段几乎没用
     *  
     * @returns
        1	code	是	状态码 
        2	msg	是	错误信息
        3	data	是	数据(code=1返回数据)
        3.1	userid		用户id
        3.2	mobile		手机号/账号
        3.3	username		用户名
        3.4	userCredit		用户星级
        3.5	imgHead		头像网络地址
        3.6	newMessage		是否有新消息1.是，0.否
     * @param {*} sessionId 
     */
    static getuserInfoUrl(sessionId) {
        return url + "/user/userCenter?sessionId=" + sessionId;
    }

    /**
     * 2.获取首页轮播图
     * 
     * @return 数组   
     *       "id": 3,
             "pic": "u=1611874237,1149893887&fm=200&gp=0.jpg",
             "gotoUrl": "
     */
    static getBanner() {
        return url + "/user/getBanner"
    }

    /**
     * 
     * 获取用户信息
     * 
     * @param {*} sessionId 
     * @return   "userid": 26536,
             "account": "13923044417",
             "mobile": "13923044417",
             "username": "刘丶丶",
             "sessionId": "07978ff98dc14660a42a751ca4145c70",
             "userCredit": 5, 用户星级
             "useGrade": 0,
             "imgHead": "http://tz.hxksky.com/wepay/upload/toux-icon.png",
             "isReward": 1,  //0->未领取奖金,1->已经领取积分释放
             "walletAdd": "41QdCdW46NNV0Ymm3zmzTyghUe16v0a0cP",//钱包地址
             "cangkuNum": 14.2282,   //余额
             "fengmiNum": 501.996,   //积分
             "todayReleas": 1.004
 
     */
    static getUserInfoBy(sessionId) {
        return url + "/user/getIndexUser?sessionId=" + sessionId
    }

    /**
     * 修改用户昵称
     * @param {*} sessionId 
     * @param {*} userName 
     * 
     * @return  1 
     */
    static updateUserName(sessionId, userName) {
        return url + "/user/updateUserName?sessionId=" + sessionId + "&userName=" + userName;
    }
    /**
     * 获取验证码
     * @param {*} mobile 
     * @returns     "code": 1,
                    "msg": "",
                    "data": 537461
     */
    static getVerificationCodeUrl(mobile) {
        return url + "/user/sendCode?mobile=" + mobile
    }
    /**
     * 用户注册
     *  
     * POST
     * @param {*} mobile 
     * @param {*} username 用户昵称
     * @param {*} referrer 推荐人UID/手机号
     * @param {*} loginPwd 登录密码
     * @param {*} safetyPwd 交易密码
     * @return  1 
     */
    static getRegisterUrl() {
        return url + "/user/register"
    }

    /**
     * 用户上传头像url 
     * POST
     * 
     * sessionId	是	token	String
     * file	是	File图片文件	file
     */
    static getUpdataHeadUrl() {
        return url + "/user/updateImgHead"
    }
    /**
      * 提交建议的 url 
      * POST
      * 
      * sessionId	是	token	            String
      * file	    是	File图片文件	      file
      * contents	是	投诉内容（100字以内）	String
      */
    static getComplaintUrl() {
        return url + "/opinions/add"
    }

    /**
     * 忘记密码
     * 
     * POST
     * @param {*} mobile 
     * @param {*} newPwd 
     * @return  1 
     */
    static getForgotPwdUrl() {
        return url + "/user/forgotPwd"
    }
    /**
     * 忘记支付密码
     * 
     * POST
     * @param {*} mobile 
     * @param {*} newPwd 
     * @return  1 
     */
    static getForgotPayPwdUrl() {
        return url + "/user/forgotPayPwd"
    }

    /**
     * 修改支付密码
     *  
     * POST
     * @param {*} sessionId 
     * @param {*} oldPwd 旧密码
     * @param {*} newPwd 新密码
     * @return  1 
     */
    static getUpdatePayPwdUrl() {
        return url + "/user/updatePayPwd"
    }

    /**
   * 修改登录密码
   *  
   * POST
   * @param {*} sessionId 
   * @param {*} oldPwd 旧密码
   * @param {*} newPwd 新密码
   * @return  1 
   */
    static getUpdateLoginPwdUrl() {
        return url + "/user/updateLoginPwd"
    }

    /**
    * 获取银行卡列表
    * @param {*} sessionId 
    * @return  
    *     "id": 58,
           "cardId": 3,
           "userId": 3058,
           "isDefault": 0,
           "addTime": "1524528135",
           "holdName": "杨稳",
           "cardNumber": "6222084000007207445",
           "openCard": "中国工商银行兴东支行",
           "banqGenre": "中国工商银行",
           "banqImg": "http://tz.hxksky.com/wepay/upload/zggsyh.png"
    */
    static getUserBankListUrl(sessionId) {
        return url + "/bank/userBank?sessionId=" + sessionId;
    }
    /**
     * 删除银行卡
     * 
     * @param {*} sessionId 
     * @param {*} id 
     * @returns  code 1 
     */
    static delBankCardUrl(sessionId, id) {
        return url + "/bank/deleteBank?sessionId=" + sessionId + "&id=" + id;
    }
    /**
    * 添加银行卡
    * @param {*} sessionId 
    * @param {*} cardId 银行类型id
    * @param {*} holdName 持卡人姓名
    * @param {*} openCard 开户支行
    * @param {*} cardNumber 银行卡号
    * @param {*} isDefault 是否默认绑定 0  是  ， 1  不是
    * 
    */
    static addBankCardUrl(sessionId, cardId, holdName, openCard, cardNumber,isDefault) {
        return url + "/bank/addBank?sessionId=" + sessionId + "&cardId=" + cardId + "&holdName=" + holdName + "&openCard=" + openCard + "&cardNumber=" + cardNumber+ "&isDefault=" + isDefault;
    }
    /**
     * 银行类型列表
     *  @return    "pid": 3, //暂时没用 只要用qid
                    "banqGenre": "中国工商银行",
                    "banqImg": "http://tz.hxksky.com/wepay/upload/zggsyh.png",
                    "qid": 3

     */
    static getBankListUrl() {
        return url + "/bank/bankNameList"
    }

    /**
     * 获取系统公告列表
     * 
     * @param {*} sessionId 
     * @param {*} pageIndex 分页码 
     * @returns
     *  "id": 90,
        "title": "众筹公告1",
        "addtime": 1526389977
     */
    static getSystemNews(sessionId, pageIndex) {
        return url + "/news/list?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }
    /**
     * 获取系统公告详情
     * @param {*} sessionId 
     * @param {*} id 
     * @returns 
     * "id": 90,
     * "title": "11",
     * "addtime": 1526389977,
     * "content": "11"
     */
    static getSystemgNewsDetails(sessionId, id) {
        return url + "/news/detail?sessionId=" + sessionId + "&id=" + id;
    }


    /**
    * 获取个人消息列表
    * @param {*} sessionId 
    * @param {*} id 
    * @returns 
    *  "id": 10,
       "sendName": "平台",             发送人名称
       "receiverUid": 26536,           接受者id
       "content": "测试", 内容
       "title": "平台向用户发送消息9",      标题
       "createTime": 1531297710,           发送时间
       "status": 1    未读：0，已读：1
    */
    static getNews(sessionId, pageIndex) {
        return url + "/message/list?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }

    /**
    * 获取个人消息详情
    * @param {*} sessionId 
    * @param {*} id 
    * @returns 
    *  "id": 10,
       "sendName": "平台",             发送人名称
       "receiverUid": 26536,           接受者id
       "content": "测试", 内容
       "title": "平台向用户发送消息9",      标题
       "createTime": 1531297710,           发送时间
       "status": 1    未读：0，已读：1
    */
    static getNewsDetails(sessionId, id) {
        return url + "/message/detail?sessionId=" + sessionId + "&id=" + id;
    }

    /**
        * 获取收货地址列表
        * @param {*} sessionId 
        * @param {*} id 
        * @returns 
                "addressId": 36,
                "memberId": "1870",
                "name": "阮先生",
                "telephone": "18975978788",
                "address": "城东南工业园高速公路桥底顺风洗车",
                "cityId": "邵阳市",
                "countryId": "隆回县",
                "provinceId": "湖南",
                "zt": 1
        */
    static getAddressList(sessionId) {
        return url + "/address/list?sessionId=" + sessionId
    }

    /**
     * 删除银行卡
     * 
     * @param {*} sessionId 
     * @param {*} addressId 
     * @returns  code 1 
     */
    static delAddressUrl(sessionId, addressId) {
        return url + "/address/delete?sessionId=" + sessionId + "&addressId=" + addressId;
    }

    /**
     * 添加地址
     * 
     * @param {*} sessionId 
     * @param {*} memberId   用户id
     * @param {*} name 
     * @param {*} telephone    电话号
     * @param {*} provinceId   省
     * @param {*} cityId       市
     * @param {*} countryId   区/县
     * @param {*} address   详细地址
     * @param {*} zt 
     */
    static putAddress(sessionId, memberId, name, telephone, provinceId, cityId, countryId, address, zt) {
        return url + "/address/add?sessionId=" + sessionId
            + "&memberId=" + memberId
            + "&name=" + name
            + "&telephone=" + telephone
            + "&provinceId=" + provinceId
            + "&cityId=" + cityId
            + "&countryId=" + countryId
            + "&address=" + address
            + "&zt=" + zt;
    }

    /**
      * 编辑地址
      * 
      * @param {*} sessionId 
      * @param {*} addressId   地址id
      * @param {*} memberId   用户id
      * @param {*} name 
      * @param {*} telephone    电话号
      * @param {*} provinceId   省
      * @param {*} cityId       市
      * @param {*} countryId   区/县
      * @param {*} address   详细地址
      * @param {*} zt 
      */
    static editAddress(sessionId, addressId, memberId, name, telephone, provinceId, cityId, countryId, address, zt) {
        return url + "/address/update?sessionId=" + sessionId
            + "&addressId=" + addressId
            + "&memberId=" + memberId
            + "&name=" + name
            + "&telephone=" + telephone
            + "&provinceId=" + provinceId
            + "&cityId=" + cityId
            + "&countryId=" + countryId
            + "&address=" + address
            + "&zt=" + zt;
    }


    /**
     * 转出-获取转入用户的信息
     * 
     * @param {*} sessionId 
     * @param {*} account  对方账户 手机号
     * 
     * @returns
     *  1	code	是	状态码 
        2	msg	    是	错误信息
        3	data	是	数据(code=1返回数据)
        3.1	userid		    用户id
        3.2	mobile		    手机号
        3.3	username		用户名
        3.4	userCredit		用户星级
        3.5	imgHead		    头像地址
        3.6	newMessage		暂时没用
     */

    static getUserBy(sessionId, account) {
        return url + "/tranMoney/getUser?sessionId=" + sessionId + "&account=" + account
    }


    /**
      * 转出-余额转出
      * POST
      * @param {*} sessionId 
      * @param {*} payId   支付会员id
      * @param {*} getId   收入方id
      * @param {*} getNums    转出数 
      * @param {*} mobile   手机后4位
      * @param {*} safetyPwd       交易密码
      * 
      * @returns code 1,0
      */
    static tranOutMoney() {
        return url + "/store/outMoney"
    }


    /**
     * 获取转出-获取转出记录
     * @param {*} sessionId 
     * @param {*} pageIndex 
     *  // 1	code	是	状态码 
        // 2	msg	是	错误信息
        // 3	data	是	数据(code=1返回集合数据)
        // 3.1	id		转出记录id
        // 3.2	payId		支付人id
        // 3.3	getId		对方id
        // 3.4	getNums		转账总金额
        // 3.5	getTime		转账时间
        // 3.6	getType		类型 0-转账
        // 3.7	username		对方用户名
        // 3.8	imgHead		对方头像（需要添加前缀如：如http://tz.hxksky.com/wepay/upload/
     */
    static getOutRecord(sessionId, pageIndex) {
        return url + "/tranMoney/outRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex;
    }
    /**
     * 转入-获取转入记录
     * 
     * @param {*} sessionId 
     * @param {*} pageIndex 
     * 返回参数与转出一样
     */
    static getInRecord(sessionId, pageIndex) {
        return url + "/tranMoney/inRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex;
    }


    /**
     * 积分兑换
     * @param {*} sessionId 
     * @param {*} exchangeMoney 需要兑换余额 
     * @param {*} safetyPwd 交易密码 
     * 请求方式:POST
     */
    static creditsExchange() {
        return url + "/store/creditsExchange?"
    }

    /**
     * 积分记录
     * @param {*} sessionId 
     * @param {*} pageIndex 
     */
    static getExchangeRecordJ(sessionId, pageIndex) {
        return url + "/tranMoney/exchangeRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex;
    }
    /**
     * 余额记录
     * @param {*} sessionId 
     * @param {*} pageIndex 
     */
    static getExchangeRecordY(sessionId, pageIndex) {
        return url + "/tranMoney/exchangeRecord?sessionId=" + sessionId
            + "&pageIndex=" + pageIndex;
    }


    /**
     * 卖出-创建卖出订单
     * 
     * POST
     * 
     * @param:
     * sessionId	是	token	String
     * exchangeMoney 是	需要卖出余额	int
     * safetyPwd     是	交易密码	String
     * describe     是	描述	String
     * bankId      是	银行卡id	int
     * 
     * 
     */
    static createOutOrder() {
        return url + "/trans/createOutOrder";
    }


    /**
     * 卖出-未完成订单-未选择打款人
     * @param {*} sessionId 
     * @returns
        序号	参数名称	一定会返回	描述
        1	code	是	状态码 
        2	msg	是	错误信息
        3	data	是	数据(code=1返回集合数据)
        3.1	id		挂单id
        3.2	payoutId		转出余额会员id
        3.3	payinId		转入会员id
        3.4	payNums		挂出金额
        3.5	payState		订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
        3.6	payTime		订单生成时间
        3.7	payNo		订单编号
        3.8	cardId		会员银行卡id
        3.9	tradeNotes		订单备注
        3.10	transType		0->卖出,1->买入
        3.11	transImg		打款凭证
        3.12	getMoneytime		收到款时间
        3.13	feeNums		手续费
     */
    static getOutUndoneUnselectedUrl(sessionId, pageIndex) {
        return url + "/trans/outUndoneUnselected?sessionId=" + sessionId + "&pageIndex=" + pageIndex;;
    }

    /**
     * 卖出-未完成订单-已选择打款人
     * @param {*} sessionId 
     * @returns
     序号	参数名称	一定会返回	描述
     1	code	是	状态码 
     2	msg	是	错误信息
     3	data	是	数据(code=1返回集合数据)
     3.1	id		挂单id
     3.2	payoutId	转出余额会员id
     3.3	payinId		转入会员id
     3.4	payNums		转出数量
     3.5	payState	订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6	payTime		订单生成时间
     3.7	payNo		订单编号
     3.8	userName	打款人姓名
     3.9	mobile		手机号
     */
    static getOutUndoneSelectedUrl(sessionId, pageIndex) {
        return url + "/trans/outUndoneSelected?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


    /**
     * 卖出-确认收款-记录
     * @param {*} sessionId 
     * @returns
     序号	参数名称	一定会返回	描述
     1	code	是	状态码 
     2	msg	是	错误信息
     3	data	是	数据(code=1返回集合数据)
     3.1	id		挂单id
     3.2	payoutId		转出余额会员id
     3.3	payinId		转入会员id
     3.4	payNums		卖出金额
     3.5	payState		订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6	payTime		订单生成时间
     3.7	payNo		订单编号
     3.8	userName		打款人姓名
     3.9	mobile		手机号
     3.10	transImg		打款截图（需要添加前缀如：如http://tz.hxksky.com/wepay/upload/
）
     */
    static getOutAffirmProceeds(sessionId, pageIndex) {
        return url + "/trans/outAffirmProceeds?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


    /**
    * 卖出-已完成订单
    * @param {*} sessionId 
    * @returns
    序号	参数名称	一定会返回	描述
    1	code	是	状态码 
    2	msg	是	错误信息
    3	data	是	数据
    3.1	id		挂单id
    3.2	payoutId		转出余额会员id
    3.3	payinId		转入会员id
    3.4	payNums		买入金额
    3.5	payState		订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
    3.6	payTime		订单生成时间
    3.7	payNo		订单编号
    3.8	userName		收款人（打款人姓名）
    3.9	mobile		手机号
    3.10	transImg		打款截图（需要添加前缀如：如http://tz.hxksky.com/wepay/upload/）
    */
    static getOutCompleteOrder(sessionId, pageIndex) {
        return url + "/trans/outCompleteOrder?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


    /**
     *  卖出-确认收款-修改状态为确认收款
     * @param {*} sessionId 
     * @id {*} id  挂单id
     */
    static getOutAPUpdate(sessionId, id) {
        return url + "/trans/outAPUpdate?sessionId=" + sessionId + "&id=" + id;
    }

     /**
     *  卖出-卖出中心
     * @param {*} sessionId 
     * @param {*} pageIndex 
     * @param {*} amount 匹配金额 
     * 
     1	    code	是	状态码 
     2	    msg	    是	错误信息
     3	    data	是	数据（code=1返回集合）
     3.1	id		    挂单id
     3.2	userName	求购者用户名
     3.3	payinId		求购者id
     3.4	payNums		交易金额
     3.5	imgHead		求购者头像
     3.6	userCredit	求购者信用
     3.7	banqGenre	支付方式
     * 
     * @id {*} id  挂单id
     */
    static getOutSalesCenter(sessionId, pageIndex,amount) {
        return url + "/trans/outSalesCenter?sessionId=" + sessionId + "&pageIndex=" + pageIndex+ "&amount=" + amount;
    }


     /**卖出-卖出中心-卖出
     * 
     * POST
     * 
     * @param {*} sessionId 
     * @param {*} id          挂单id
     * @param {*} safetyPwd   交易密码
     * 
     * @returns 数据 data （code=1}
     */
    static getSalesCenterSaleUrl() {
        return url + "/trans/salesCenterSale?";
    }

    /**
     *  取消订单
     * @param {*} sessionId 
     * @id {*} id  挂单id
     */
    static getCncelBalanceOrder(sessionId, id) {
        return url + "/trans/cancelBalanceOrder?sessionId=" + sessionId + "&id=" + id;
    }


    /**
     * 卖出-创建卖出订单
     * 
     * POST
     * 
     * @param:
     * sessionId	是	token	String
     * exchangeMoney 是	需要卖出余额	int
     * safetyPwd     是	交易密码	String
     * describe     是	描述	String
     * bankId      是	银行卡id	int
     * 
     * 
     */
    static createInOrder() {
        return url + "/trans/createInOrder";
    }


    /**
     *  买入-未完成订单-未选择打款人
     * @param {*} sessionId 
     * @param {*} pageIndex 
     1	code	是	状态码 
     2	msg	是	错误信息
     3	data	是	数据(code=1返回集合数据)
     3.1	id		挂单id
     3.2	payoutId		转出余额会员id
     3.3	payinId		转入会员id
     3.4	payNums		买入金额
     3.5	payState		订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6	payTime		订单生成时间
     3.7	payNo		订单编号
     3.8	cardId		会员银行卡id
     3.9	tradeNotes		订单备注
     3.10	transType		0->卖出,1->买入
     3.11	transImg		打款凭证
     3.12	getMoneytime		收到款时间
     3.13	feeNums		手续费
     3.14	outCard		买入会员银行卡id
     * 
     */
    static getInUndoneUnselectedUrl(sessionId, pageIndex) {
        return url + "/trans/inUndoneUnselected?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }

    /**
     * 买入-未完成订单-未选择打款人
     * @param {*} sessionId 
     * @param {*} pageIndex 
     1	code	是	状态码 
     2	msg	是	错误信息
     3	data	是	数据(code=1返回集合数据)
     3.1	id		挂单id
     3.2	payoutId		转出余额会员id
     3.3	payinId		转入会员id
     3.4	payNums		买入金额
     3.5	payState		订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6	payTime		订单生成时间
     3.7	payNo		订单编号
     3.8	cardId		会员银行卡id
     3.9	tradeNotes		订单备注
     3.10	transType		0->卖出,1->买入
     3.11	transImg		打款凭证
     3.12	getMoneytime		收到款时间
     3.13	feeNums		手续费
     3.14	outCard		买入会员银行卡id
     * 
     */
    static getInUndoneSelectedUrl(sessionId, pageIndex) {
        return url + "/trans/inUndoneSelected?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }
    /**买入-确认打款 列表
     * 
     * @param {*} sessionId 
     * @param {*} pageIndex 
     * 
     1	code	是	状态码 
     2	msg	是	错误信息
     3	data	是	数据(code=1返回集合数据)
     3.1	id		挂单id
     3.2	payoutId		转出余额会员id
     3.3	payinId		转入会员id
     3.4	payNums		买入金额
     3.5	payState		订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6	payTime		订单生成时间
     3.7	payNo		订单编号
     3.8	holdName		收款人姓名
     3.9	mobile		手机号码
     3.10	transImg		打款截图
     3.11	banqGenre		开户银行
     3.12	cardNumber		银行卡号
     3.13	openCard		开户支行
     3.14	getMoneyTime		订单完成时间
     3.15	userName		收款人
     * 
     */
    static getInAffirmProceeds(sessionId, pageIndex) {
        return url + "/trans/inAffirmProceeds?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


    /**
     * .买入-确认打款-修改打款
     * 
     * POST
     * 
     参数名称	是否必须	描述	   格式
     sessionId	是	    token	    String
     id	        是	    挂单id	     int
     file	    是	    打款截图	  file
     */
    static getInAPUpdateUrl() {
        return url + "/trans/inAPUpdate"
    }

    /*买入-已完成订单
     * 
     * @param {*} sessionId 
     * @param {*} pageIndex 
     * 
     1	code	是	状态码 
     2	msg	是	错误信息
     3	data	是	数据(code=1返回集合数据)
     3.1	id		挂单id
     3.2	payoutId		转出余额会员id
     3.3	payinId		转入会员id
     3.4	payNums		买入金额
     3.5	payState		订单状态:0->默认上架,1->有人买入,2->已打款,3->确认到款(已完成)
     3.6	payTime		订单生成时间
     3.7	payNo		订单编号
     3.8	holdName		收款人姓名
     3.9	mobile		手机号码
     3.10	transImg		打款截图
     3.11	banqGenre		开户银行
     3.12	cardNumber		银行卡号
     3.13	openCard		开户支行
     3.14	getMoneyTime		订单完成时间
     * 
     */
    static getInCompleteOrder(sessionId, pageIndex) {
        return url + "/trans/inCompleteOrder?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }

     /**
     *  买入-买入中心
     * @param {*} sessionId 
     * @param {*} pageIndex 
     * @param {*} amount 匹配金额 
     * 
     1	    code	是	    状态码 
     2	    msg	    是	    错误信息
     3	    data	是	    数据（code=1返回集合）
     3.1	id		        挂单id
     3.2	userName		出售者用户名
     3.3	payoutId		出售者id
     3.4	payNums		    交易金额
     3.5	imgHead		    出售者头像
     3.6	userCredit		出售者信用
     3.7	banqGenre		支付方式
     * 
     * 
     */
    static getCallCenter(sessionId, pageIndex,amount) {
        return url + "/trans/callCenter?sessionId=" + sessionId + "&pageIndex=" + pageIndex+ "&amount=" + amount;
    }
   

     /**买入-买入中心-买入
      * 
     * POST
     * 
     * @param {*} sessionId 
     * @param {*} id          挂单id
     * @param {*} safetyPwd   交易密码
     * 
     * @returns 数据 data （code=1}
     */
    static getCallCenterBuyUrl() {
        return url + "/trans/callCenterBuy"
    }


     /**
     *   买入-买入记录
     * @param {*} sessionId 
     * @param {*} pageIndex 
     * 
     1	    code	是	状态码 
     2	    msg	    是	错误信息
     3	    data	是	数据（code=1返回集合）
     3.1	id		    挂单id
     3.2	userName		卖出账号用户名
     3.3	payinId		卖出账号会员id
     3.4	payNums		买入金额
     3.5	getMoneyTime		买入时间
     * 
     */
    static getInBuyRecords(sessionId, pageIndex) {
        return url + "/trans/inBuyRecords?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }


     /**
     *   卖出-卖出记录
     * @param {*} sessionId 
     * @param {*} pageIndex 
     * 
     1	    code	是	状态码 
     2  	msg 	是	错误信息
     3	    data	是	数据（code=1返回集合）
     3.1	id		    挂单id
     3.2	userName		买入账号用户名
     3.3	payinId		买入账号会员id
     3.4	payNums		卖出金额
     3.5	getMoneyTime		卖出时间
     * 
     */
    static getOutSellRecords(sessionId, pageIndex) {
        return url + "/trans/outSellRecords?sessionId=" + sessionId + "&pageIndex=" + pageIndex;
    }

}

