<!--
    desc: 列表页-订单列表项组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .itemOrder {
        width: 100%;
        margin-top: px2rem(20px);
        padding: px2rem(30px) px2rem(30px) 0;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        background: #fff;

        .iHouse {
            position: relative;
            width: 100%;
            height: px2rem(105px);
            overflow: hidden;
            color: #000;

            display: -webkit-flex;
            -webkit-flex-flow: row nowrap;
            -webkit-justify-content: flex-start;
            -webkit-align-items: flex-start;

            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: flex-start;

            .hPic {
                flex-shrink: 0;
                -webkit-flex-shrink: 0;
                width: px2rem(140px);
                height: px2rem(105px);
                background: url('//img.58cdn.com.cn/n/images/list/noimg2.gif?w=140&h=105&crop=1') center no-repeat;
                background-size: cover;
            }
            .hInfo {
                height: px2rem(105px);
                margin: 0 0 0 px2rem(20px);
                overflow: hidden;

                display: -webkit-flex;
                -webkit-flex-flow: column nowrap;
                -webkit-justify-content: space-between;
                -webkit-align-items: flex-start;

                display: flex;
                flex-flow: column nowrap;
                justify-content: space-between;
                align-items: flex-start;

                .hTitle {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: @fontsize24;
                }
                .hDesc {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: @fontsize22;
                    color: #999;
                }
                .hPrice {
                    font-size: @fontsize24;
                    strong {
                        font-size: @fontsize26;
                        font-weight: normal;
                    }
                }
            }

            .hState {
                position: absolute;
                right: 0;
                top: 40%;
                font-size: @fontsize26;
                line-height: px2rem(35px);
                color: #999;
            }
        }
        .iBooking {
            width: 100%;
            height: px2rem(98px);

            display: -webkit-flex;
            -webkit-flex-flow: row nowrap;
            -webkit-justify-content: space-between;
            -webkit-align-items: center;

            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;

            color: #000;
            .bText {
                font-size: @fontsize24;
                line-height: px2rem(24px);
            }
            .bPrice {
                color: #999;
                strong {
                    font-size: @fontsize38;
                    font-weight: normal;
                }
            }
        }
        .iOperate {
            width: 100%;
            height: px2rem(104px);
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            border-top: 1px solid #F3F3F3;
            padding: px2rem(20px) 0;
            .btn {
                display: block;
                float: right;
                margin: 0 0 0 px2rem(20px);
                width: px2rem(140px);
                height: px2rem(60px);
                line-height: px2rem(60px);

                border: 1px solid rgba(153, 153, 153, 0.5);
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                border-radius: px2rem(2px);

                font-size: @fontsize24;
                color: #666;
                text-align: center;
            }
        }

        &.wait {
            .iHouse {
                .hState {
                    color: #FF552E;
                }
            }
            .iBooking {
                .bPrice {
                    color: #FF5C37;
                }
            }
        }
        &.complete {

        }
        &.close {
            .iHouse {
                color: #ccc;
                .hInfo {
                    .hDesc {
                        color: #ccc;
                    }
                }
                .hState {
                    color: #ccc;
                }
            }
            .iBooking {
                color: #ccc;
                .bPrice {
                    color: #ccc;
                }
            }
        }
    }
</style>

<template>
    <section class="itemOrder hairlines" :class="order.class">
        <div class="iHouse" @click="handlerGoDetail">
            <div class="hPic" :style="order.picUrlStyle"/>
            <div class="hInfo">
                <div class="hTitle">{{order.title}}</div>
                <div class="hDesc">{{order.desc}}</div>
                <div class="hPrice"><strong>{{order.price}}</strong>元/月</div>
            </div>
            <div class="hState">{{order.statusDes}}</div>
        </div>
        <div class="iBooking">
            <div class="bText">入住时间：{{order.checkInDate | dateFormat}}</div>
            <div class="bText">58担保交易：<span class="bPrice"><strong>{{order.totalAmount}}</strong> 元</span></div>
        </div>
        <div class="iOperate" v-if="dataButtons.length>0">
            <a class="btn" v-for="(dataButton,index) in dataButtons" :key="index"
               :href="dataButton.action=='connect'?'tel:'+dataButton.tel:'javascript:void(0);'"
               @click="handlerButton(dataButton)">{{dataButton.text}}</a>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
    import API from '../../service/api';
    import StatusEnum from './statusEnum';

    const dataOrderDefault = {
        orderId: '',
        status: '',
        statusDes: '',
        totalAmount: '',
        infoDetail: {
            //房源id
            infoId: '',
            //房源标题 将府家园小区 2室2厅2卫
            title: '',
            //房源图片地址
            picUrl: '',
            //面积 80
            area: '',
            //区域 朝阳
            pLocalName: '',
            //商圈 将台路
            pAreaLocalName: '',
            //朝向 南
            chaoXiang: '',
            //价格 5000
            price: '',
            //房源详情页native地址 {action:pagetrans.....}
            nativeApp: '',
        },
        orderDetail: {
            buyerPhone: '',
            checkInDate: '',
            sellerCardId: '',
            sellerName: '',
            sellerPhone: '',
            isSee: '',
            mihao: '',
            weiliao: ''
        },
    };

    export default {
        data(){
            return {
                isLoading: false,//后端加载状态
                orderDetailUrl: '',//订单详情页面链接
                //联系人操作按钮配置
                connectButton: {
                    text: '',
                    class: '',
                    action: 'connect',
                    tel: '',
                    log: 'tel',
                },
                //删除按钮操作配置
                deleteButton: {
                    text: '删除订单',
                    class: '',
                    action: 'delete',
                    dialog: {
                        title: '是否删除订单',
                        content: '删除订单后不可恢复，确认删除吗？',
                        text1: '我再想想',
                        text2: '确定删除',
                    },
                    log: 'delete',
                },
                //提现按钮操作配置
                withdrawButton: {
                    text: '提取现金',
                    class: '',
                    action: 'withdraw',
                    log: 'withdraw',
                },
                dataButtons: [],
                statusEnum: StatusEnum,
            }
        },
        props: {
            role: {
                type: [Number, String],
                required: true,
            },
            dataOrder: {
                type: Object,
            }
        },
        computed: {
            order(){
                let _this = this;
                let _order = Object.assign({}, dataOrderDefault, _this.dataOrder);
                _order.infoDetail = Object.assign({}, dataOrderDefault.infoDetail, _order.infoDetail);
                _order.orderDetail = Object.assign({}, dataOrderDefault.orderDetail, _order.orderDetail);

                let _desc = `${_order.infoDetail.pLocalName.length > 0 ? _order.infoDetail.pLocalName + '-' : ''}${_order.infoDetail.pAreaLocalName.length > 0 ? _order.infoDetail.pAreaLocalName + ' ' : ''}${_order.infoDetail.area.length > 0 ? _order.infoDetail.area + '㎡ ' : ''}${_order.infoDetail.chaoXiang.length > 0 ? '朝' + _order.infoDetail.chaoXiang : ''}`;

                let _class = '';
                let _statusEnum = _this.statusEnum[_order.status];
                if (_statusEnum) {
                    _class = _statusEnum.class;
                }
                let _picUrlStyle = '';
                if (_order.infoDetail.picUrl) {
                    _picUrlStyle = `background-image: url(${_order.infoDetail.picUrl}); center no-repeat`;
                }
                return {
                    orderId: _order.orderId,
                    status: _order.status,
                    statusDes: _order.statusDes,
                    totalAmount: _order.totalAmount,
                    title: _order.infoDetail.title,
                    picUrl: _order.infoDetail.picUrl,
                    picUrlStyle: _picUrlStyle,
                    desc: _desc,
                    price: _order.infoDetail.price,
                    buyerPhone: _order.orderDetail.buyerPhone,
                    sellerPhone: _order.orderDetail.sellerPhone,
                    checkInDate: _order.orderDetail.checkInDate,
                    class: _class
                };
            },
        },
        filters: {
            dateFormat(value) {
                if (value) {
                    let fullDate = value.split("-");
                    if (fullDate.length >= 3) {
                        return `${fullDate[0]}年${fullDate[1]}月${fullDate[2]}日`;
                    }
                }
                return "";
            },
        },
        watch: {
            'dataOrder.status'(val, old){
                this.initByRole();
            },
        },
        mounted() {
            this.initByRole();
        },
        methods: {
            initByRole(){
                let _this = this;
                let _role = _this.role;
                switch (+_role) {
                    case 1://租客
                        _this.initRole1();
                        break;
                    case 2://房东
                        _this.initRole2();
                        break;
                    default:
                        break;
                }
            },
            /**
             * 租客端设置
             * 设置隐私通话或只支持微聊的房源，
             * 租客在(3待租客确认4租客已确认7交易成功8申请退款9卖家拒绝退款11申诉中12已延期)状态中，租客订单列表页展示房东电话按钮，其他状态均不展示。
             * 部分状态的订单可进行删除操作：租客：7交易成功、13交易关闭；房东：13交易关闭、16已提现
             */
            initRole1(){
                let _this = this;
                _this.orderDetailUrl = API.pageGetRenterDetail.url;
                _this.connectButton.text = '联系房东';
                _this.connectButton.log = 'ownertel';

                let _phone = _this.order.sellerPhone;
                let _status = _this.order.status;
                if (_phone != '') {
                    _this.connectButton.tel = _phone;

                    if (_status == 3 || _status == 4 || _status == 8 || _status == 9 || _status == 11 || _status == 12) {
                        _this.dataButtons = [_this.connectButton];
                    } else if (_status == 7) {
                        _this.dataButtons = [_this.deleteButton, _this.connectButton];
                    } else if (_status == 13) {
                        _this.dataButtons = [_this.deleteButton];
                    } else {
                        _this.dataButtons = [];
                    }
                } else {
                    //如果房东电话==空 并且 为13或者7状态的,显示删除按钮，其余的什么按钮都不显示
                    if (_status == 13 || _status == 7) {
                        _this.dataButtons = [_this.deleteButton];
                    } else {
                        _this.dataButtons = [];
                    }
                }
            },
            /**
             * 房东端设置
             * 房东端始终展示租客电话。
             * 部分状态的订单可进行删除操作：房东：13交易关闭、16已提现
             */
            initRole2(){
                let _this = this;
                _this.orderDetailUrl = API.pageGetOwnerDetail.url;
                _this.connectButton.text = '联系租客';
                _this.connectButton.log = 'rentertel';

                let _phone = _this.order.buyerPhone;
                let _status = _this.order.status;

                if (_status == 13 || _status == 16) {
                    //删除按钮
                    _this.dataButtons = [_this.deleteButton];
                } else if (_status == 7 || _status == 14) {
                    //提现按钮
                    _this.dataButtons = [_this.withdrawButton];
                } else {
                    _this.dataButtons = [];
                }
                //联系人按钮
                if (_phone != '') {
                    _this.connectButton.tel = _phone;
                    _this.dataButtons.unshift(_this.connectButton);
                }
            },
            handlerGoDetail(){
                let _orderId = this.order.orderId;
                let _role = this.role;
                if (!_orderId || !_role) {
                    return;
                }
                let _currentUrl = this.orderDetailUrl;
                if (_currentUrl != "") {
                    _currentUrl = window.location.protocol + _currentUrl + "?orderId=" + _orderId;
                    this.$app.loadPage('link', _currentUrl, '', !1, !1, !1);
                }
            },
            handlerButton(dataButton){
                let _this = this;
                let _action = dataButton.action;
                let _dataButton = Object.assign({}, dataButton, {orderId: this.order.orderId});
                this.$emit('orderAction', _dataButton);
                //具体操作
                switch (_action) {
                    case 'delete'://删除订单
                        break;
                    case 'withdraw'://提取现金
                        _this.handlerGoDetail();//跳到订单详情页
                        break;
                    case 'connect'://打电话
                        break;
                    default:
                        break;
                }
            },
        }
    };
</script>