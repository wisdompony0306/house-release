<!--
    desc:租房订单发布
-->
<style rel="stylesheet/less" lang="less">
    @import './index.less';
</style>

<template>
    <article class="postBox">
        <!--页面提示-->
        <section class="tips"><i></i>{{orderTips}}</section>
        <!--房源信息-->
        <PostHouse :data-house="dataHouse"/>
        <!--预订表单信息-->
        <section class="formBox">
            <div class="rowBox lineBottom">
                <PostInput title="订金" type="tel" name="price" v-model="formData.price"
                           :rules="rules.price" placeholder="订金" :hasLine="true"/>
                <PostSelect title="入住日期" type="data" name="checkInDate" v-model="formData.checkInDate"
                            :rules="rules.checkInDate" placeholder="入住日期" @click="handlerClickCheckInDate"/>
            </div>
            <div class="rowBox lineBottom">
                <PostInput title="请确认您的手机号" type="tel" name="buyerPhone" v-model="formData.buyerPhone"
                           :rules="rules.buyerPhone" placeholder="填写您的手机号"/>
            </div>
            <div class="rowBox">
                <PostRadio name="isSee" v-model="formData.isSee" :dataSource="dataSource.isSee" :rules="rules.isSee"
                           v-on:click="handleClickIsSee"/>
            </div>
        </section>
        <!--预订协议-->
        <AgreementRadio v-model="dataAgreement.value" @click="handlerClickProtocol"/>
        <!--提交按钮-->
        <DetailBottomBar :data-position="dataBottomBar.barPosition">
            <DetailButton :data-button="dataButton" @click="handleClickButton"/>
        </DetailBottomBar>
        <!--警告提示-->
        <DialogWarn :text=dataDialog.text :button=dataDialog.cancelButton :next=dataDialog.confirmButton
                   v-model=dataDialog.show @nextStep='handlerDialogConfirm'/>
        <!--日期选择键盘-->
        <KeyboardSelect :show="keyboardShow" :dataSource="dataSource.checkInDate" :value="formData.checkInDate"
                        @confirm="handlerKeyboardConfirm"/>
        <!--加载提示-->
        <Loading :isShow="isLoading"/>
    </article>
</template>
<script type="text/ecmascript-6">
    import {
            PostHouse,
            PostRadio,
            PostInput,
            PostSelect,
            DetailBottomBar,
            DetailButton,
            DialogWarn,
            KeyboardSelect,
            AgreementRadio,
    } from '../../components';

    import API from '../../service/api';

    export default {
        name: 'orderBooking',
        data() {
            return {
                /*请求加载状态*/
                isLoading: false,
                /*页面提示*/
                orderTips: '以下是订金有效性的重要依据,请确保在了解后再交订金。',
                /*当前URL参数*/
                infoId: this.$util.getUrlParam("infoId"),
                /*协议相关数据*/
                dataAgreement: {
                    /*是否同意协议 true|false*/
                    value: true,
                },
                /*键盘是否弹起*/
                keyboardShow: false,
                /*房源信息数据*/
                dataHouse: {
                    infoId: '',
                    title: '',
                    picUrl: '',
                    area: '',
                    pLocalName: '',
                    pAreaLocalName: '',
                    chaoXiang: '',
                    price: '',
                    nativeApp: '',
                    buyerPhone: '',
                },
                /*服务器系统当前时间*/
                nowTime: '',
                /*表单项 入住日期 增加天数*/
                increaseDay: 30,
                /*表单显示数据源*/
                dataSource: {
                    checkInDate: {
                        items: {},//对象
                        default: '',
                        tips: '我们建议 <span style="color: #FF552E;">1个月内</span>',
                    },
                    isSee: {
                        items: [{
                            value: '1',
                            text: '未看房',
                        }, {
                            value: '2',
                            text: '已看房',
                        }],
                        default: '1',
                    },
                },
                /*表单提交数据*/
                formData: {
                    /*订金*/
                    price: '',
                    /*入住日期*/
                    checkInDate: '',
                    /*手机号*/
                    buyerPhone: '',
                    /*是否看房 1|2*/
                    isSee: '',
                },
                /*表单校验规则*/
                rules: {
                    price: {
                        required: true,
                        reg: '^[\\s\\S]+$#^([1-9]\\d{2}|1\\d{3}|2000)$',
                        msg: '请填写订金#订金范围为100-2000元，请先和房东协商',
                    },
                    checkInDate: {
                        required: true,
                        reg: '^[\\s\\S]+$',
                        msg: '请选择入住日期',
                    },
                    buyerPhone: {
                        required: true,
                        reg: '^[\\s\\S]+$#^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-35-8])\\d{8}$',
                        msg: '请填写您的手机号#请填写有效手机号',
                    },
                    isSee: {
                        required: true,
                        reg: '^[\\s\\S]+$',
                        msg: '请选择是否看房',
                    },
                },
                /*底部按钮容器bar*/
                dataBottomBar: {
                    barPosition: '',//控制按钮吸底
                },
                /*按钮设置*/
                dataButton: {
                    text: '确定',
                    class: 'orange',
                },
                /*未看房警告弹框*/
                dataDialog: {
                    show: false,
                    text: '未看房交易订金有风险，找房东索要并准确填写姓名、身份证号码将降低被骗风险。',
                    cancelButton: '取消',
                    confirmButton: '继续',
                },
                /*页面跳转配置,跳转到租客端订单详情页*/
                loadPage: {
                    /*租客订单详情页*/
                    renterDetail: {
                        title: "订单详情",
                        url: API.pageGetRenterDetail.url,//租客定金订单详情页面地址
                    }
                },
                /*页面高度,用于判断是否有键盘弹起*/
                pageHeight: window.innerHeight,
                /*埋点通用数据*/
                dataLog: {
                    pagetype: 'renterinputpage',
                },
            }
        },
        created() {
            this.checkInDateInit();
        },
        mounted() {
            let _this = this;
            if (_this.infoId) {
                _this.getPostInfoById();//房源数据请求
            } else {
                _this.$app.showDialog("single", "提示", "页面请求错误,缺少infoId参数", function (index) {
                    _this.$app.goBack();
                }, "返回");
            }
            //页面展现埋点
            _this.trackLog("show");

            this.$eventHub.$on(this.$eventAction.INPUT_FOCUS, () => {
                this.dataBottomBar.barPosition = 'absolute';
            });
            this.$eventHub.$on(this.$eventAction.INPUT_BLUR, () => {
                this.dataBottomBar.barPosition = '';
            });
        },
        methods: {
            /**
             * 数据请求: 获取预订房源信息
             */
            getPostInfoById() {
                let _this = this;
                _this.isLoading = true;
                _this.$request.jsonp({
                    url: API.getPostInfoById.url,
                    data: {
                        infoId: _this.infoId,
                    },
                    callback: _this.getPostInfoByIdCb,
                    jsonpName: "jsoncallback",
                });
            },
            /**
             * 数据请求: 获取预订房源信息回调
             */
            getPostInfoByIdCb(state, res){
                let _this = this;
                _this.isLoading = false;
                if (!state) {
                    this.$app.toastMsg("服务器接口异常");
                    return;
                }
                if (!res || res.code == undefined || res.code == null) {
                    this.$app.toastMsg("服务器接口数据异常");
                    return;
                }
                switch (+res.code) {
                    case 0://正常
                        if (res.data) {
                            ({
                                infoId: _this.dataHouse.infoId = '',
                                title: _this.dataHouse.title = '',
                                picUrl: _this.dataHouse.picUrl = '',
                                area: _this.dataHouse.area = '',
                                pLocalName: _this.dataHouse.pLocalName = '',
                                pAreaLocalName: _this.dataHouse.pAreaLocalName = '',
                                chaoXiang: _this.dataHouse.chaoXiang = '',
                                price: _this.dataHouse.price = '',
                                nativeApp: _this.dataHouse.nativeApp = '',
                                /*表单信息*/
                                buyerPhone: _this.formData.buyerPhone = _this.formData.buyerPhone,
                                nowTime: _this.nowTime = '',
                            } = res.data);
                        } else {
                            _this.$app.showDialog("single", "提示", "服务器房源数据异常,请稍后再试!", function (index) {
                            }, "返回");
                        }
                        break;
                    case 1000007://未登录
                        _this.userLogin();
                        break;
                    default:
                        _this.$app.showDialog("single", "提示", res.message, function (index) {
                        }, "返回");
                        break;
                }
            },
            /**
             * 表单项: 初始化入住日期数据源及默认日期
             */
            checkInDateInit(){
                let _this = this;
                _this.checkInDateDataSource();
                _this.checkInDateDefaultValue();
            },
            /**
             * 数据操作: 从字符串里提取时间yyyy-MM-dd
             */
            extractDate (str) {
                let _date = '';
                if (typeof str === 'string') {
                    const reg = new RegExp('(\\d{4}-\\d{2}-\\d{2})');
                    const arr = str.match(reg) || [];
                    if (arr && arr.length > 0) {
                        _date = arr[0];
                    }
                }
                return _date;
            },
            /**
             * 表单项: 入住日期 数据源
             * 计算起租日期数据源:
             * 起租日期：默认为今天，需要用户主动选择，
             * 最长时间不得超过：今日+30天。
             * 即不可预订1个月以后的房子。提示文案：只能预订1个月以内的房子
             */
            checkInDateDataSource(){
                let _this = this;
                let _nowTime = _this.extractDate(_this.nowTime);
                //console.log("checkInDateDataSource", '_this.nowTime=', _this.nowTime, "_nowTime=", _nowTime);

                let startDate = new Date(), endDate = new Date();
                endDate.setDate(endDate.getDate() + (this.increaseDay - 1));
                let dateObj = {};
                while ((endDate.getTime() - startDate.getTime()) >= 0) {
                    let year = startDate.getFullYear().toString();
                    let month = (startDate.getMonth() + 1).toString();
                    let day = startDate.getDate().toString();
                    if (dateObj[year] == undefined) {
                        dateObj[year] = {value: year, text: `${year}年`, items: {}};
                        dateObj[year]["items"][month] = {value: month, text: `${month}月`, items: {}};
                        dateObj[year]["items"][month]["items"][day] = {value: day, text: `${day}日`};
                    } else if (dateObj[year]["items"][month] == undefined) {
                        dateObj[year]["items"][month] = {value: month, text: `${month}月`, items: {}};
                        dateObj[year]["items"][month]["items"][day] = {value: day, text: `${day}日`};
                    } else if (dateObj[year]["items"][month]["items"][day] == undefined) {
                        dateObj[year]["items"][month]["items"][day] = {value: day, text: `${day}日`};
                    }
                    startDate.setDate(startDate.getDate() + 1);
                }
                _this.dataSource.checkInDate.items = dateObj;
            },
            /**
             * 表单项: 入住日期 默认时间
             */
            checkInDateDefaultValue(){
                let checkInDate = new Date();
                let _checkInDate = [checkInDate.getFullYear(), checkInDate.getMonth() + 1, checkInDate.getDate()].join("-");
                this.dataSource.checkInDate.default = _checkInDate;
            },
            /**
             * 表单项: 入住日期 时间选择弹起
             * 表单提交按钮吸底
             * 如果有键盘弹起延时1s再显示日期选择组件,否则会有键盘闪动
             * 如无键盘弹起立即显示日期选择组件
             */
            handlerClickCheckInDate(event){
                this.dataBottomBar.barPosition = 'absolute';
                let _this = this;
                if (_this.pageHeight == window.innerHeight) {
                    _this.keyboardShow = true;
                } else {
                    setTimeout(function () {
                        _this.keyboardShow = true;
                    }, 1000);
                }
            },
            /**
             * 表单项: 入住日期 时间选择关闭
             * 表单提交按钮吸底 样式重置
             * 设置选择日期给表单项
             */
            handlerKeyboardConfirm(event, value){
                this.keyboardShow = false;
                this.formData.checkInDate = value;
                this.dataBottomBar.barPosition = '';
            },
            /**
             * 表单项: 是否看房 点击
             */
            handleClickIsSee(value){
                let _this = this;
                if (value == 2) {
                    _this.trackLog("saw-click");
                } else {
                    _this.trackLog("nosee");
                }
            },
            /**
             * 数据操作: 预订协议-是否同意 点击
             * 只有同意预订协议底部按钮为橘色可预订反应,否则底部按钮为灰色,不可预订房源
             */
            handlerClickProtocol(){
                let _this = this;
                if (_this.dataAgreement.value) {
                    _this.dataButton.class = 'orange';
                } else {
                    _this.dataButton.class = 'grey';
                }
            },
            /**
             * 表单提交: 未看房警告提示框-点击继续按钮-提交预订房源
             */
            handlerDialogConfirm(){
                this.dataDialog.show = true;
                this.createOrder();
            },
            /**
             * 按钮操作: 发布按钮 点击
             * 用户登录判断
             * 是否同意预订协议
             * 表单校验
             * 未看房显示警告提示框
             * 表单提交
             */
            handleClickButton(){
                let _this = this;
                //点击确定埋点
                _this.trackLog("confirm");
                //判断用户是否登录
                _this.$app.isLogin(function (data) {
                    if (data && data.state == true) {
                        _this.createOrderBefore();//创建订单
                    } else {
                        _this.userLogin();//用户登录
                    }
                });
            },
            /**
             * 表单提交: 创建订单前
             * 是否同意预订协议
             * 表单校验
             * 未看房显示警告提示框
             */
            createOrderBefore(){
                let _this = this;
                //是否通过协议
                if (_this.dataAgreement.value) {
                    //表单验证
                    let _validateResult = this.formValidate();
                    if (_validateResult.state) {
                        let _formData = _this.formData;
                        //若未看房点击确定，需弹窗提示用户风险，仍然可以提交订单
                        if (_formData.isSee == "1") {
                            _this.dataDialog.show = true;
                        } else {
                            _this.createOrder();
                        }
                    } else {
                        _this.$app.toastMsg(_validateResult.msg);
                    }
                }
            },
            /**
             * 表单提交: 表单校验
             * 遍历表单中有validate方法的元素,逐个进行校验
             * @param callback
             * @returns {boolean}
             */
            formValidate(){
                let _this = this;
                let _validateResult = {
                    state: true,
                    msg: ''
                };
                const _children = _this.$children;
                const _len = _children.length;
                if (_len) {
                    for (let i = 0; i < _len; ++i) {
                        const record = _children[i];
                        if (record && typeof record.validate === "function") {
                            const result = record.validate();
                            if (result && !result.state) {
                                _validateResult.state = result.state;
                                _validateResult.msg = result.msg;
                                break;
                            }
                        }
                    }
                }
                return _validateResult;
            },
            /**
             * 表单提交: 数据请求创建订单
             */
            createOrder(){
                let _this = this;
                let _data = Object.assign(this.formData, {infoId: _this.infoId});
                _this.isLoading = true;
                _this.$request.post({
                    url: API.createOrder.url,
                    data: _data,
                    callback: _this.createOrderCb,
                });
            },
            /**
             * 表单提交: 数据请求创建订单回调
             */
            createOrderCb(state, res){
                let _this = this;
                _this.isLoading = false;
                if (!state) {
                    this.$app.toastMsg("服务器接口异常");
                    return;
                }
                if (!res || res.code == undefined || res.code == null) {
                    this.$app.toastMsg("服务器接口数据异常");
                    return;
                }
                switch (+res.code) {
                    case 0:
                        if (res.data) {
                            let _loadPage = _this.loadPage.renterDetail;
                            let _url = _loadPage.url + "?orderId=" + res.data.orderId;
                            _this.$app.loadPage('link', _url, _loadPage.title);
                        }
                        break;
                    case 1000007://请登录
                        _this.userLogin();
                        break;
                    case 1000008://请进行人脸识别
                        _this.$app.openFaceSdk("人脸认证", '3', (state) => {
                            if (state == 0) {
                                //认证成功 重新提交订单
                                _this.createOrderBefore();
                            } else if (state == 2) {
                                //取消认证操作
                                _this.$app.showDialog("single", "提示", "您取消了人脸认证,请先认证再进行其他操作", function (index) {
                                }, "确定");
                            } else {
                                _this.$app.showDialog("single", "提示", "人脸认证失败,请稍后再试!", function (index) {
                                }, "确定");
                            }
                        });
                        break;
                    default:
                        _this.$app.showDialog("single", "提示", res.message, function (index) {
                        }, "确定");
                        break;
                }
            },
            /**
             * 埋点
             */
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
            PostHouse,
            PostInput,
            PostRadio,
            PostSelect,
            DetailBottomBar,
            DetailButton,
            KeyboardSelect,
            AgreementRadio,
            DialogWarn,
        }
    }
</script>