<!--
    desc:租房订单房东详情
-->
<style rel="stylesheet/less" lang="less">
    @import './index.less';
</style>

<template>
    <article class="detailOwnerBox" :class="[dataDialogCommon.show?'stopPageScroll':'']">
        <!--订单状态-->
        <DetailState :data-state="dataState"/>
        <!--订单用户-->
        <DetailPerson :data-user="dataPerson"/>
        <!--订单房源-->
        <DetailHouse :data-house="dataHouse"/>
        <!--预订信息-->
        <Detailbooking :data-booking="dataBooking"/>
        <!--订单信息-->
        <DetailOrder :data-order="dataOrder"/>
        <!--底部按钮-->
        <DetailBottomBar v-if="Object.keys(dataButtons).length>0">
            <DetailButton :data-button="dataButton" v-for="(dataButton,index) in dataButtons"
                          :key="'DetailButton_'+index" @click="handlerClickButton(dataButton)"/>
        </DetailBottomBar>
        <!--带同意协议弹窗-->
        <DialogCommon :data-dialog="dataDialogCommon" @clickButton="handlerDialogCommonButton">
            <AgreementRadio v-model="dataAgreement.value" :data-agreement="dataAgreement"/>
        </DialogCommon>
        <!--微信提现弹窗-->
        <DialogWithdraw :data-dialog="dataDialogWithdraw" @clickButton="handlerDialogWithdrawButton"/>
        <!--加载提示-->
        <Loading :isShow="isLoading"/>
    </article>
</template>
<script type="text/ecmascript-6">
    import {
        DetailState,
        DetailPerson,
        DetailHouse,
        Detailbooking,
        DetailOrder,
        DetailButton,
        DetailBottomBar,
        DialogWithdraw,
        DialogCommon,
        AgreementRadio,
    } from '../../components';

    import API from '../../service/api';

    import DataState from '../../datas/dataState';
    import DataPerson from '../../datas/dataPerson';
    import DataHouse from '../../datas/dataHouse';
    import DataBooking from '../../datas/dataBooking';
    import DataOrder from '../../datas/dataOrder';

    import StatusButtonEnum from './statusButtonEnum';

    export default {
        name: 'orderDetailOwner',
        data() {
            return {
                /*后端加载状态*/
                isLoading: false,
                /*身份 1:租客，2:房东*/
                role: '2',
                /*订单编号 url参数中取*/
                orderId: this.$util.getUrlParam("orderId"),
                /*微信授权应用id*/
                appId: 'wxc7929cc3d3fda545',
                /*是否可提现配置,跟订单状态有关,默认为空,1表示可提现,0表示不可提现*/
                isWithDrawCash: '',

                /*订单状态数据*/
                dataState: DataState,
                /*租客信息数据*/
                dataPerson: Object.assign(DataPerson, {role: 1}),
                /*帖子信息数据*/
                dataHouse: DataHouse,
                /*预订数据*/
                dataBooking: DataBooking,
                /*订单数据*/
                dataOrder: DataOrder,

                /*订单状态与操作枚举数据*/
                statusButtonEnum: StatusButtonEnum,

                /*订单状态调解中11,提交证据按钮禁止操作*/
                statusButtonDisDefendant: {
                    isTimeout: false,//是否超时
                    /*超时配置*/
                    timeout: {
                        text: '提交证据',
                        class: 'grey',
                        action: 'disDefendant',
                        toast: {
                            content: '您已经超过上传证据时间!',
                        }
                    },
                    isCommitted: false,//是否已提交
                    /*已上传证据配置*/
                    committed: {
                        text: '提交证据',
                        class: 'grey',
                        action: 'disDefendant',
                        toast: {
                            content: '您已经上传过证据!',
                        }
                    }
                },
                /*订单状态7、11时,isWithDrawCash=0 禁止提现按钮配置*/
                statusButtonDisWithdraw: {
                    disWithdraw: {
                        text: '提取现金',
                        class: 'grey',
                        action: 'disWithdraw',
                        log: 'diswithdrawal',
                    },
                },
                /*带同意协议弹窗*/
                dataDialogCommon: {
                    show: false,
                    action: '',//操作标识
                    title: '',
                    content: '',
                    buttons: [],
                },
                /*协议相关数据*/
                dataAgreement: {
                    /*是否同意协议 true|false*/
                    value: true,
                    /*协议弹窗*/
                    dialog: {
                        class: 'noMask',
                    },
                },
                /*提现微信弹窗*/
                dataDialogWithdraw: {
                    show: false,
                    imageUrl: '',
                    nickName: '',
                },

                /*埋点通用数据*/
                dataLog: {
                    pagetype: 'wonerdetail'
                },
            }
        },
        computed: {
            /*当前订单状态, 显示的操作按钮*/
            dataButtons(){
                let _this = this;
                let _buttons = {};
                if (_this.statusButtonEnum[_this.dataState.status]) {
                    _buttons = _this.statusButtonEnum[_this.dataState.status];
                    //电话号码特殊处理
                    if (_buttons.connect) {
                        _buttons.connect.tel = _this.dataPerson.phone;
                    }
                    //交易关闭特殊处理
                    if (_this.dataState.status == 13 && _this.isWithDrawCash == 1) {
                        //交易关闭(13)且isWithDrawCash(1)时,有[提现]按钮,否则无[提现]按钮
                        _buttons.withdraw = {
                            text: '提取现金',
                            class: 'orange',
                            action: 'withdraw',
                            log: 'withdrawal',//埋点
                        }
                    }
                    //提现按钮特殊处理,注:必须是'0',空字符串和数字0是相等的
                    if ((_this.dataState.status == 7 || _this.dataState.status == 14) && _buttons.withdraw && _this.isWithDrawCash == '0') {
                        Object.assign(_buttons.withdraw, _this.statusButtonDisWithdraw.disWithdraw);
                    }
                    //仲裁中有两种情况使提交证据按钮置灰
                    if (_this.dataState.status == 11 && _buttons.defendant) {  //仲裁中
                        if (_this.statusButtonDisDefendant.isTimeout) {
                            //超过提交证据时间
                            Object.assign(_buttons.defendant, _this.statusButtonDisDefendant.timeout);
                        } else if (_this.statusButtonDisDefendant.isCommitted) {
                            //已提交过证据
                            Object.assign(_buttons.defendant, _this.statusButtonDisDefendant.committed);
                        }
                    }
                }
                return _buttons;
            },
        },
        created() {
        },
        mounted() {
            let _this = this;
            if (_this.orderId) {
                _this.getOrderInfoById();
            } else {
                _this.$app.showDialog("single", "提示", "页面请求错误,缺少orderId参数", function (index) {
                    _this.$app.goBack();
                }, "返回");
            }
            //埋点
            _this.trackLog('show');
        },
        methods: {
            /**
             * 数据请求: 获取订单信息接口
             */
            getOrderInfoById(){
                let _this = this;
                _this.isLoading = true;
                _this.$request.jsonp({
                    url: API.getOrderInfoById.url,
                    data: {
                        orderId: _this.orderId,
                        role: _this.role,
                    },
                    jsonpName: "jsoncallback",
                    callback: _this.getOrderInfoByIdCb,

                });
            },
            /**
             * 数据请求: 获取订单信息接口回调
             */
            getOrderInfoByIdCb(state, res){
                let _this = this;
                _this.isLoading = false;
                if (res && res.code == 0 && res.data) {
                    ({
                        /*订单状态数据*/
                        status: _this.dataState.status = '',
                        statusDes: _this.dataState.statusDes = '',
                        statusAct: _this.dataState.statusAct = '',
                        buyerPayDeadline: _this.dataState.buyerPayDeadline = '',
                        buyerDeadline: _this.dataState.buyerDeadline = '',
                        buyerAppealDeadline: _this.dataState.buyerAppealDeadline = '',
                        sellerDeadline: _this.dataState.sellerDeadline = '',
                        sellerRefundDeadline: _this.dataState.sellerRefundDeadline = '',
                        sellerAppealDeadline: _this.dataState.sellerAppealDeadline = '',
                        nowTime: _this.dataState.nowTime = '',

                        /*租客或房东数据*/
                        buyerId: _this.dataPerson.userid = '',
                        orderDetail: {
                            buyerPic: _this.dataPerson.pic = '',
                            buyerName: _this.dataPerson.name = '',
                            buyerCardId: _this.dataPerson.cardId = '',
                            buyerPhone: _this.dataPerson.phone = '',
                        },
                        infoDetail: {
                            infoId: _this.dataPerson.infoId = '',
                        },

                        /*房源数据*/
                        infoDetail: {
                            infoId: _this.dataHouse.infoId = '',
                            title: _this.dataHouse.title = '',
                            picUrl: _this.dataHouse.picUrl = '',
                            area: _this.dataHouse.area = '',
                            pLocalName: _this.dataHouse.pLocalName = '',
                            pAreaLocalName: _this.dataHouse.pAreaLocalName = '',
                            chaoXiang: _this.dataHouse.chaoXiang = '',
                            price: _this.dataHouse.price = '',
                            nativeApp: _this.dataHouse.nativeApp = '',
                        },

                        /*预订数据*/
                        totalAmount: _this.dataBooking.totalAmount = '',
                        orderDetail: {
                            checkInDate: _this.dataBooking.checkInDate = '',
                        },

                        /*订单信息*/
                        orderId: _this.dataOrder.orderId = '',
                        createTime: _this.dataOrder.createTime = '',
                        tradeNo: _this.dataOrder.tradeNo = '',
                        transferNo: _this.dataOrder.transferNo = '',
                        payTime: _this.dataOrder.payTime = '',
                        agreeTime: _this.dataOrder.agreeTime = '',
                        checkinTime: _this.dataOrder.checkinTime = '',
                        successTime: _this.dataOrder.successTime = '',
                        closeTime: _this.dataOrder.closeTime = '',

                        /*其他信息*/
                        isWithDrawCash: _this.isWithDrawCash = '',
                    } = res.data);

                    //调解中的订单,特殊处理
                    if (_this.dataState.status == 11) {
                        _this.disDefendant();
                    }
                } else if (res) {
                    _this.$app.toastMsg(res.message);
                } else {
                    _this.$app.toastMsg("服务器开小差...");
                }
            },
            /**
             * 数据操作: 禁止提交证据操作,提交证据灰显,toast提示
             * 1、当前时间已超过调解截止时间,禁止
             * 2、已提交过证据,禁止
             *
             * 先判断是否已超时,已超时的不用再判断是否提交过证据,可以减少一次请求
             */
            disDefendant(){
                let _this = this;
                //非调解中状态的订单不做处理
                if (_this.dataState.status != 11) {
                    return;
                }
                //是否超时判断
                let _isTimeout = false;
                let [_nowTime, _sellerAppealDeadline] = [_this.dataState.nowTime, _this.dataState.sellerAppealDeadline];
                if (_this.$util.isDateTimeStr(_nowTime) && _this.$util.isDateTimeStr(_sellerAppealDeadline)) {
                    let _sTime = (new Date(_nowTime.replace(/-/g, "/"))).getTime();
                    let _eTime = (new Date(_sellerAppealDeadline.replace(/-/g, "/"))).getTime();
                    _isTimeout = _sTime < _eTime ? false : true;
                }
                _this.statusButtonDisDefendant.isTimeout = _isTimeout;
                //是否已提交过证据判断
                if (!_this.statusButtonDisDefendant.isTimeout) {
                    _this.isDefendantCommittedRequest();
                }
            },
            /**
             * 数据请求:房东端仲裁阶段，判断是否提交过证据
             */
            isDefendantCommittedRequest(){
                let _this = this;
                _this.$request.jsonp({
                    url: API.defendantIsUncommitted.url,
                    data: {
                        orderNo: _this.orderId,
                    },
                    jsonpName: "callback",
                    callback: (state, res) => {
                        if (res.code == 1) {//没有提交过证据
                            _this.statusButtonDisDefendant.isCommitted = false;
                        } else if (res.code == -1) {//已提交过证据
                            _this.statusButtonDisDefendant.isCommitted = true;
                        }
                    },
                });
            },
            /**
             * 操作按钮: 入口
             */
            handlerClickButton(dataButton){
                let _this = this;
                let _action = dataButton.action;
                //埋点
                let _log = dataButton.log;
                if (_log) {
                    _this.trackLog(_log);
                }
                switch (_action) {
                    case 'cancel'://取消订单
                        if (dataButton.dialog) {
                            let _dialog = dataButton.dialog;
                            _this.$app.showDialog('double', _dialog.title, _dialog.content, _this.cancelOrder, _dialog.text1, _dialog.text2);
                        }
                        break;
                    case 'agreeRent'://同意出租
                        if (dataButton.dialog) {
                            let _dialog = dataButton.dialog;
                            let _content = _dialog.content.replace("#name#", _this.dataPerson.name);
                            Object.assign(_this.dataDialogCommon, {
                                show: true,
                                action: _action,
                                title: _dialog.title,
                                content: _content,
                                buttons: [_dialog.text1, _dialog.text2],
                            });
                        }
                        break;
                    case 'agreeRefund'://房东同意退款
                        if (dataButton.dialog) {
                            let _dialog = dataButton.dialog;
                            _this.$app.showDialog('double', _dialog.title, _dialog.content, _this.agreeRefund, _dialog.text1, _dialog.text2);
                        }
                        break;
                    case 'disagreeRefund'://房东拒绝退款
                        if (dataButton.dialog) {
                            let _dialog = dataButton.dialog;
                            _this.$app.showDialog('double', _dialog.title, _dialog.content, _this.disagreeRefund, _dialog.text1, _dialog.text2);
                        }
                        break;
                    case 'defendant'://提交证据
                        _this.userFaceAuthRequest(_this.defendantOrder, '提交证据');
                        break;
                    case 'disDefendant'://提交证据 灰显
                        if (dataButton.toast) {
                            let _toast = dataButton.toast;
                            _this.$app.toastMsg(_toast.content);
                        }
                        break;
                    case 'withdraw'://提取现金
                        //版本判断
                        let [_currentAppVersion, _getAppVersionOn] = [_this.$app.getAppVersion(), _this.$app.getAppVersionOn()];
                        let isEgt = _this.$util.compareEgt(_currentAppVersion, _getAppVersionOn);
                        if (!isEgt) {
                            _this.$app.showDialog("single", "版本过低", "升级58app至最新版本才可微信提现哦~", function (index) {
                            }, "好");
                        } else {
                            _this.userFaceAuthRequest(_this.bindWechatRequest, '提现');//先人脸再提现
                        }
                        break;
                    case 'withdrawEnd':
                        if (dataButton.toast) {
                            let _toast = dataButton.toast;
                            _this.$app.toastMsg(_toast.content);
                        }
                        break;
                    case 'disWithdraw'://禁止提现处理
                        break;
                    default:
                        break;
                }
            },
            /**
             * 操作按钮: 同意出租操作
             */
            handlerDialogCommonButton(action, index){
                let _this = this;
                switch (action) {
                    case 'agreeRent'://同意出租
                        if (index == 1 && !_this.dataAgreement.value) {
                            _this.$app.toastMsg("请先同意租房保障协议,方可进行同意出租操作!");
                        } else {
                            _this.dataDialogCommon.show = false;
                            _this.agreeRentOrder(index);
                        }
                        break;
                    default:
                        break;
                }
            },
            /**
             * 操作按钮: 取消订单操作
             */
            cancelOrder(index){
                if (index == 1) {
                    this.buttonRequest(API.cancelOrder.url);
                }
            },
            /**
             * 操作按钮: 同意出租操作
             */
            agreeRentOrder(index){
                if (index == 1) {
                    this.buttonRequest(API.confirmOrder.url);
                }
            },
            /**
             * 操作按钮: 房东同意退款
             */
            agreeRefund(index){
                let _this = this;
                if (index == 1) {
                    this.buttonRequest(API.confirmRefund.url, {isAgree: 1});
                }
            },
            /**
             * 操作按钮: 房东拒绝退款操作
             */
            disagreeRefund(index){
                let _this = this;
                if (index == 1) {
                    this.buttonRequest(API.confirmRefund.url, {isAgree: 2});
                }
            },
            /**
             * 操作按钮: 数据请求
             * requestUrl: 操作请求URL
             * requestData: 扩展参数
             */
            buttonRequest(requestUrl, requestData){
                let _this = this;
                _this.isLoading = true;

                let _data = Object.assign({
                    orderId: _this.orderId,
                    role: _this.role,
                }, requestData);

                _this.$request.jsonp({
                    url: requestUrl,
                    data: _data,
                    jsonpName: "jsoncallback",
                    callback: (state, res) => {
                        _this.isLoading = false;
                        if (!state) {
                            _this.$app.toastMsg("服务器接口异常");
                            return;
                        }
                        if (res.code == 0) {
                            //页面从新渲染数据
                            _this.getOrderInfoById();
                        } else {
                            _this.$app.toastMsg(res.message);
                        }
                    },
                })
            },
            /**
             * 用户是否做过人脸认证
             */
            userFaceAuthRequest(cb, message){
                let _this = this;
                _this.isLoading = true;
                _this.$request.jsonp({
                    url: API.userFaceAuth.url,
                    jsonpName: "jsoncallback",
                    callback: (state, res) => {
                        _this.isLoading = false;
                        if (res.code == 0) {
                            if (res.data == 1) {//已进行人脸认证
                                if (typeof cb == 'function') {
                                    cb();
                                }
                            } else {//人脸认证未通过
                                let [_appVersion, _faceAuthVersion] = [_this.$app.getAppVersion(), _this.$app.getAppVersionFaceAuth()];
                                let isEgt = _this.$util.compareEgt(_appVersion, _faceAuthVersion);
                                if (!isEgt) {
                                    _this.$app.showDialog("single", "版本过低", "升级58app至最新版本才可" + message + "哦~", function (index) {
                                    }, "好");
                                } else {
                                    _this.$app.openFaceSdk("人脸认证", '3', (state) => {
                                        if (state == 0) {
                                            if (typeof cb == 'function') {
                                                cb();
                                            }
                                        } else if (status == 2) {
                                            _this.$app.showDialog("single", "提示", "您取消了人脸认证,请先认证再进行" + message + "操作", function (index) {
                                            }, "确定");
                                        } else {
                                            _this.$app.showDialog("single", "提示", "人脸认证失败,请稍后再试!", function (index) {
                                            }, "确定");
                                        }
                                    });
                                }
                            }
                        } else {
                            _this.$app.toastMsg(res.message);
                        }
                    },
                })
                ;
            },
            /**
             *  操作按钮: 提交证据操作
             */
            defendantOrder(){
                let _this = this;
                let dataButton = _this.statusButtonEnum[11].defendant;
                if (dataButton && dataButton.dialog) {
                    let _dialog = dataButton.dialog;
                    _this.$app.showDialog('double', _dialog.title, _dialog.content, (index) => {
                        if (index == 1) {
                            let _loadPage = dataButton.loadPage;
                            let _url = _loadPage.url + "?orderNo=" + _this.orderId + "&redirectUrl=" + window.location.href;
                            _this.$app.loadPage('link', _url, _loadPage.title, !1, !1, !1);
                        }
                    }, _dialog.text1, _dialog.text2);
                }
            },
            /**
             *  操作按钮: 提现操作
             */
            bindWechatRequest(){
                let _this = this;
                _this.isLoading = true;
                _this.$request.post({
                    url: API.bindWechat.url,
                    data: {
                        appId: _this.appId
                    },
                    callback: (state, res) => {
                        _this.isLoading = false;
                        if (!state) {
                            _this.$app.toastMsg("服务器接口异常");
                            return;
                        }
                        if (!res || res.code == undefined || res.code == null) {
                            _this.$app.toastMsg("服务器接口数据异常");
                            return;
                        }

                        switch (+res.code) {
                            case 0:
                                if (res.data.opendId !== '') {
                                    if (res.data.imageUrl !== '' && res.data.nickName !== '') {
                                        _this.dataDialogWithdraw.nickName = res.data.nickName;
                                        _this.dataDialogWithdraw.imageUrl = res.data.imageUrl;
                                        _this.dataDialogWithdraw.show = true;
                                    } else {
                                        _this.wechatAuth();
                                    }
                                } else {
                                    _this.$app.showDialog("double", "提示", "订金将提取到微信中,请先授权微信。", (index) => {
                                        if (index == 1) {
                                            _this.wechatAuth();
                                            _this.trackLog("accreditwechat");
                                        }
                                    }, "取消", "授权微信");
                                }
                                break;
                            case -1:
                                _this.$app.showDialog("double", "提示", "订金将提取到微信中,请先绑定微信。", function (index) {
                                    if (index == 1) {
                                        _this.wechatBind('bind');
                                        _this.trackLog("bindwechat");
                                    }
                                }, "取消", "绑定微信");
                                break;
                            default:
                                _this.$app.showDialog("single", "提示", res.message, function (index) {
                                }, "确定");
                                break;
                        }
                    },
                });
            },
            /**
             * 微信操作
             * 提现-微信授权操作
             *
             */
            wechatAuth(){
                let _this = this;
                window.wechatWxAuthCallback = function (code) {
                    //-1: 系统异常、-2: 非法请求、0: 成功、1549: 授权码失效、1551:更新授权信息失败
                    if (code == 0) {
                        //授权成功再次调接口
                        _this.bindWechatRequest();
                    } else {
                        _this.$app.toastMsg("微信授权失败：" + code);
                    }
                };
                _this.$app.nativeBridge({
                    "action": "wx_auth",
                    "callback": 'wechatWxAuthCallback'
                });
            },
            /**
             * 微信操作
             * 微信绑定和换绑协议
             *  目前跳转到个人中心进行换绑
             *  type:bind表示微信绑定,unbind表示解绑
             */
            wechatBind(type){
                let _this = this;
                let [_currentVersion, _wechatBindVersion] = [_this.$app.getAppVersion(), _this.$app.getAppVersionWechatBind()];
                let isEgt = _this.$util.compareEgt(_currentVersion, _wechatBindVersion);
                if (!isEgt) {
                    _this.$app.nativeBridge({
                        action: "pagetrans",
                        tradeline: "core",
                        content: {
                            pagetype: "userInfoDetail"
                        }
                    });
                } else {
                    if (type == 'bind') {
                        window.wechatThirdBindCallback = function (code) {
                            //0：成功 1：失败 支持只有一种绑定type
                            if (code == 0) {
                                _this.withdrawCashRequest();//绑定完直接提现
                            } else if (code == 1) {
                                _this.$app.toastMsg("您取消了微信绑定操作或微信绑定失败!");
                            } else {
                                _this.$app.toastMsg("微信绑定失败：" + code);
                            }
                        };
                        _this.$app.nativeBridge({
                            "action": "third_bind",
                            "type": "WEIXIN",
                            "callback": "wechatThirdBindCallback"
                        });
                    } else if (type == 'unbind') {
                        window.wechatUnbindAccountCallback = function (code) {
                            // 0成功  1失败  2 取消（弹层取消） 3未绑定   4 未登录
                            if (code == 0) {
                                _this.$app.showDialog("double", "提示", "您的微信已解绑成功,是否重新绑定微信,并提取现金？", (index) => {
                                    if (index == 1) {
                                        _this.bindWechatRequest();
                                    }
                                }, "我再想想", "更换微信");
                            } else if (code == 2) {
                                _this.$app.toastMsg("您取消了微信解绑操作!");
                            } else if (code == 3) {
                                _this.$app.toastMsg("您尚未绑定微信!");
                            } else if (code == 4) {
                                _this.$app.toastMsg("您还未登录,请先登录再进行微信解绑操作!");
                            } else {
                                _this.$app.toastMsg("微信解绑绑定失败：" + code);
                            }
                        };
                        _this.$app.nativeBridge({
                            "action": "unbind_account",
                            "type": "WEIXIN",
                            "callback": "wechatUnbindAccountCallback"
                        });
                    }
                }
            },
            /**
             * 提现弹窗按钮: action
             *  提现到此微信按钮: wx
             *  提现到其他微信按钮: other
             *  取消按钮: cancel
             */
            handlerDialogWithdrawButton(action){
                let _this = this;
                _this.dataDialogWithdraw.show = false;
                switch (action) {
                    case 'wx':
                        _this.trackLog("confirmwithdrawal2");
                        _this.$app.showDialog("double", "提示", "确定提取订金到微信吗？", (index) => {
                            if (index == 1) {
                                _this.withdrawCashRequest();
                                _this.trackLog("confirmwithdrawal");
                            }
                        }, "取消", "确定");
                        break;
                    case 'other':
                        _this.trackLog("changewechat");
                        _this.wechatBind('unbind');
                        /* //跳转页面
                         _this.$app.nativeBridge({action: 'loadpage', pagetype: 'userInfoDetail'});
                         // 1秒后显示弹窗 是否换绑成功
                         let osType = _this.$app.getOs();
                         if (osType == "andriod") {
                         window.setTimeout(function () {
                         _this.$app.showDialog("double", "提示", "是否已经换绑成功？", (index)=> {
                         if (index == 0) {
                         _this.withdrawCashRequest();
                         _this.trackLog("bindwechatnum");
                         } else if (index == 1) {
                         _this.bindWechatRequest();
                         }
                         }, "换绑成功", "换绑失败");
                         }, 1000);
                         }*/
                        break;
                    case 'cancel':
                        break;
                    default:
                        break;
                }
            },
            /**
             * 数据请求: 订单提现
             */
            withdrawCashRequest(){
                let _this = this;
                _this.isLoading = true;
                _this.$request.post({
                    url: API.withdrawCash.url,
                    data: {
                        orderId: _this.orderId
                    },
                    callback: (state, res) => {
                        _this.isLoading = false;
                        if (!state) {
                            this.$app.toastMsg("服务器接口异常");
                            return;
                        }
                        if (!res || res.code == undefined || res.code == null) {
                            this.$app.toastMsg("服务器接口数据异常");
                            return;
                        }
                        if (res.code == 0) {
                            window.setTimeout(function () {
                                _this.getTransferResultRequest();
                            }, 3000);
                        } else if (res.code == 1) {//未到提现时间,提现延时打款
                            _this.$app.toastMsg(res.message);
                        } else {
                            _this.$app.toastMsg("提现失败,请稍后再试!");
                        }
                    },
                });
            },
            /**
             * 数据请求: 订单提现状态更新接口
             */
            getTransferResultRequest(){
                let _this = this;
                _this.$request.post({
                    url: API.getTransferResult.url,
                    data: {
                        orderId: _this.orderId
                    },
                    callback: (state, res) => {
                        if (!state) {
                            _this.$app.toastMsg("服务器接口异常");
                            return;
                        }
                        if (!res || res.code == undefined) {
                            _this.$app.toastMsg("服务器接口数据异常");
                            return;
                        }
                        if (res.code == 0) {
                            _this.getOrderInfoById();
                            //res.data.status: -1提现失败、0提现中、1提现成功
                            if (res.data.status == -1) {//提现失败
                                if (res.data.message == 'NAME_MISMATCH' || res.data.message == 'V2_ACCOUNT_SIMPLE_BAN') {
                                    let _dialog = {
                                        title: '提现失败',
                                        content: '可能的原因为:1.微信没有绑定银行卡2.微信绑定银行卡户主实名信息同58人脸认证信息一致。请在微信中绑定银行卡或更换微信提取订金。',
                                        text1: '我知道了',
                                        text2: '更换微信',
                                    };
                                    _this.$app.showDialog("double", _dialog.title, _dialog.content, (index) => {
                                        if (index == 1) {
                                            _this.wechatBind('unbind');//微信绑定
                                        }
                                    }, _dialog.text1, _dialog.text2);
                                } else {
                                    _this.$app.showDialog("single", "提现失败", res.data.reason, function (index) {
                                    }, "好");
                                }
                            }
                        } else {
                            _this.$app.toastMsg("服务器开小差...");
                        }
                    },
                });
            },
            /*埋点*/
            trackLog(actiontype){
                if (!actiontype) {
                    return;
                }
                let _this = this;
                let _pagetype = _this.dataLog.pagetype;
                _this.$app.webLog(actiontype, _pagetype);
            },
        },
        components: {
            DetailState,
            DetailPerson,
            DetailHouse,
            Detailbooking,
            DetailOrder,
            DetailButton,
            DetailBottomBar,
            AgreementRadio,
            DialogCommon,
            DialogWithdraw,
        }
    }
</script>