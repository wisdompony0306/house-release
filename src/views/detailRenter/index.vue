<!--
    desc:租房订单租客详情
-->
<style rel="stylesheet/less" lang="less">
    @import './index.less';
</style>

<template>
    <article class="detailRenterBox" :class="[dataDialogCommon.show?'stopPageScroll':'']">
        <!--订单状态-->
        <DetailState :data-state="dataState"/>
        <!--订单用户-->
        <DetailPerson :data-user="dataPerson"
                      @clickUser="trackLog(dataLog.person.ownerphoto)"
                      @clickChat="trackLog(dataLog.person.im)"
                      @clickTel="trackLog(dataLog.person.tel)"/>
        <!--订单房源-->
        <DetailHouse :data-house="dataHouse" @clickInfo="trackLog(dataLog.house.info)"/>
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
        <DialogCommon :data-dialog="dataDialogCommon" @clickButton="handlerClickButtonDialog">
            <AgreementRadio v-model="dataAgreement.value" :data-agreement="dataAgreement"/>
        </DialogCommon>
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
        DialogCommon,
        AgreementRadio,
    } from '../../components';

    import API from '../../service/api';

    import DataState from '../../datas/dataState';
    import DataPerson from '../../datas/dataPerson';
    import DataHouse from '../../datas/dataHouse';
    import DataBooking from '../../datas/dataBooking';
    import DataOrder from '../../datas/dataOrder';
    import DataWxPay from '../../datas/dataWxPay';

    import StatusButtonEnum from './statusButtonEnum';

    export default {
        name: 'orderDetailRenter',
        data() {
            return {
                /*后端加载状态*/
                isLoading: false,
                /*身份 1:租客，2:房东*/
                role: '1',
                /*订单编号 url参数中取*/
                orderId: this.$util.getUrlParam("orderId"),

                /*订单状态数据*/
                dataState: DataState,
                /*房东信息数据*/
                dataPerson: Object.assign(DataPerson, {role: 2}),
                /*帖子信息数据*/
                dataHouse: DataHouse,
                /*预订数据*/
                dataBooking: DataBooking,
                /*订单数据*/
                dataOrder: DataOrder,

                /*微信付款参数数据*/
                dataWxPay: DataWxPay,

                /*订单状态与操作枚举数据*/
                statusButtonEnum: StatusButtonEnum,

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
                /*埋点通用数据*/
                dataLog: {
                    pagetype: 'renterdetail',
                    person: {
                        ownerphoto: 'ownerphoto',
                        im: 'im',
                        tel: 'tel',
                    },
                    house: {
                        info: 'info',
                    },
                },
            }
        },
        computed: {
            /*当前订单状态, 显示的操作按钮*/
            dataButtons(){
                let _this = this;
                let _buttons = {};
                if (_this.statusButtonEnum[_this.dataState.status]) {
                    _buttons = _this.statusButtonEnum[_this.dataState.status]
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
                let _timestamp = (new Date()).getTime();
                _this.$request.jsonp({
                    url: API.getOrderInfoById.url,
                    data: {
                        orderId: _this.orderId,
                        role: _this.role,
                        random: _timestamp,
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
                if (!state) {
                    this.$app.toastMsg("服务器接口异常");
                    return;
                }
                if (!res) {
                    this.$app.toastMsg("服务器接口数据异常");
                    return;
                }
                if (res.code == 0 && res.data) {
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
                        sellerId: _this.dataPerson.userid = '',
                        orderDetail: {
                            sellerPic: _this.dataPerson.pic = '',
                            sellerName: _this.dataPerson.name = '',
                            sellerPhone: _this.dataPerson.phone = '',
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
                        tradeNo: _this.dataOrder.tradeNo = '',
                        transferNo: _this.dataOrder.transferNo = '',
                        createTime: _this.dataOrder.createTime = '',
                        payTime: _this.dataOrder.payTime = '',
                        agreeTime: _this.dataOrder.agreeTime = '',
                        checkinTime: _this.dataOrder.checkinTime = '',
                        closeTime: _this.dataOrder.closeTime = '',
                        successTime: _this.dataOrder.successTime = '',

                        /*微信付款信息*/
                        orderId: _this.dataWxPay.orderNo = '',
                        bizCode: _this.dataWxPay.bizCode = '',
                        sign: _this.dataWxPay.sign = '',
                        tid: _this.dataWxPay.tid = '',
                        buyerPayDeadline: _this.dataWxPay.orderExpireTime = '',
                    } = res.data);
                } else if (res.code == 1000007) {//用户未登陆
                    this.userLogin();
                } else {
                    _this.$app.showDialog("single", "提示", res.message, function (index) {
                    }, "确定");
                }
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
                //具体操作
                switch (_action) {
                    case 'cancel'://取消订单
                        if (dataButton.dialog) {
                            let _dialog = dataButton.dialog;
                            _this.$app.showDialog('double', _dialog.title, _dialog.content, _this.cancelOrder, _dialog.text1, _dialog.text2);
                        }
                        break;
                    case 'pay'://付款
                        //版本控制
                        let [_currentAppVersion, _onAppVersion] = [_this.$app.getAppVersion(), _this.$app.getAppVersionOn()];
                        let isEgt = _this.$util.compareEgt(_currentAppVersion, _onAppVersion);
                        if (!isEgt) {
                            _this.$app.showDialog("single", "版本过低", "升级58app至最新版本才可微信付款哦~", function (index) {
                            }, "好");
                        } else {
                            _this.payOrder();
                        }
                        break;
                    case 'refund'://退款
                        if (dataButton.dialog) {
                            let _dialog = dataButton.dialog;
                            _this.$app.showDialog('double', _dialog.title, _dialog.content, _this.applyRefund, _dialog.text1, _dialog.text2);
                        }
                        break;
                    case 'checkIn'://确认入住
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
                    case 'arbitration'://发起调解
                        _this.userFaceAuthRequest(_this.arbitrationOrder, '发起调解');
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
             * 操作按钮: 租客申请退款操作
             */
            applyRefund(index){
                if (index == 1) {
                    this.buttonRequest(API.applyRefund.url);
                }
            },
            /**
             * 操作按钮: 租客确认入住操作
             */
            confirmOrder(index){
                if (index == 1) {
                    this.buttonRequest(API.confirmOrder.url);
                }
            },
            /**
             * 按钮操作: 确认入住
             */
            handlerClickButtonDialog(action, index){
                let _this = this;
                switch (action) {
                    case 'checkIn'://确认入住
                        if (index == 1 && !_this.dataAgreement.value) {
                            _this.$app.toastMsg("请先同意租房保障协议,方可进行确认入住操作!");
                        } else {
                            _this.dataDialogCommon.show = false;
                            _this.confirmOrder(index);
                        }
                        break;
                    default:
                        break;
                }
            },
            /**
             * 操作按钮: 数据请求
             * requestUrl: 操作请求URL
             */
            buttonRequest(requestUrl){
                let _this = this;
                _this.isLoading = true;
                _this.$request.jsonp({
                    url: requestUrl,
                    data: {
                        orderId: _this.orderId,
                        role: _this.role,
                    },
                    jsonpName: "jsoncallback",
                    callback: _this.buttonRequestCb
                });
            },
            /**
             * 操作按钮: 数据请求回调
             */
            buttonRequestCb(state, res){
                let _this = this;
                _this.isLoading = false;
                if (!state) {
                    _this.$app.toastMsg("服务器接口异常");
                    return;
                }
                if (res.code == 0) {
                    _this.isLoading = true;
                    window.setTimeout(function () {
                        _this.getOrderInfoById();//页面从新渲染数据
                    }, 1000);
                } else {
                    _this.$app.toastMsg(res.message);
                }
            },
            /**
             * 操作按钮: 微信付款及数据请求
             */
            payOrder(){
                let _this = this;
                _this.isLoading = true;
                _this.$request.jsonp({
                    url: API.wxAppPay.url,
                    data: {
                        orderNo: _this.dataWxPay.orderNo,
                        bizCode: _this.dataWxPay.bizCode,
                        sign: _this.dataWxPay.sign,
                        tid: _this.dataWxPay.tid,
                        orderExpireTime: _this.dataWxPay.orderExpireTime,
                    },
                    jsonpName: "jsonpCallback",
                    callback: _this.payOrderCb,
                });
            },
            /**
             * 操作按钮: 微信付款及数据请求回调
             */
            payOrderCb(state, res){
                let _this = this;

                if (res && res.data && res.code && res.code == 1) {
                    window.payOrderWechatCallback = function (state) {
                        if (state == 0) {//成功
                            _this.isLoading = true;
                            window.setTimeout(function () {
                                _this.getOrderInfoById();//页面从新渲染数据
                            }, 6000);
                        } else if (state == -1) {//错误
                            _this.$app.toastMsg("付款操作错误,请稍后再试!");
                        } else if (state == -2) {//用户取消
                            _this.$app.toastMsg("您取消了支付操作,如需付款,请再次点击付款按钮!");
                        } else {
                            _this.$app.toastMsg("付款数据异常,请稍后再试!");
                        }
                    };

                    let _data = res.data;
                    if (typeof _data === "string") {
                        _data = JSON.parse(_data);
                    }
                    let param = {
                        "action": "wechat_pay",
                        "appid": _data.appid,
                        "partnerid": _data.partnerid,
                        "prepayid": _data.prepayid,
                        "package": _data.package,
                        "noncestr": _data.noncestr,
                        "timestamp": _data.timestamp,
                        "sign": _data.sign,
                        "callback": "payOrderWechatCallback"
                    };
                    setTimeout(function () {
                        _this.isLoading = false;
                        _this.$app.nativeBridge(param);
                    }, 500);
                } else if (res) {
                    _this.isLoading = false;
                    _this.$app.toastMsg(res.message);
                } else {
                    _this.isLoading = false;
                    _this.$app.toastMsg("服务器接口数据异常");
                }
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
                });
            },
            /**
             *  申请仲裁操作
             */
            arbitrationOrder(){
                let _this = this;
                let dataButton = _this.statusButtonEnum[9].arbitration;
                if (dataButton.dialog) {
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
            /*租客订单详情埋点*/
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
            DialogCommon,
            AgreementRadio,
        }
    }
</script>