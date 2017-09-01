<!--
    desc:租房订单页
-->
<style rel="stylesheet/less" lang="less">
    @import './index.less';
</style>

<template>
    <div class="listBox">
        <!--列表数据-->
        <PullRefresh :next="refresh" v-if="showOrderList">
            <!-- 租房订单列表 -->
            <ItemOrder v-for="(item,index) in dataOrderList" :data-order="item" :role="role" :key="index"
                       @orderAction="handlerOrderAction"/>
        </PullRefresh>
        <!--列表无数据-->
        <div v-if="!showOrderList" class="listError">
            <div class="logo"></div>
            <template v-if="role==1">
                <div class="msg">你还没有预订过房源喔～</div>
                <div class="btn" @click="handlerGoSee">去看看</div>
            </template>
            <div v-else class="msg">你还没有订单哦～</div>
        </div>
        <!--加载提示-->
        <Loading :isShow="isLoading"/>
    </div>
</template>
<script type="text/ecmascript-6">
    import {ItemOrder, PullRefresh} from '../../components';
    import API from '../../service/api';

    export default {
        name: 'orderList',
        data() {
            return {
                /*后端加载状态*/
                isLoading: false,
                /*当前URL参数*/
                role: this.$util.getUrlParam('role'),
                /*列表页码*/
                pageNum: 1,
                /*订单列表数据*/
                dataOrderList: [],
                /*埋点通用数据*/
                dataLog: {
                    pagetype: {
                        1: 'renterlist',
                        2: 'ownerlist',
                    }
                },
            }
        },
        computed: {
            /*数据处理: 有无数据显示处理*/
            showOrderList(){
                let _show = false;
                if (this.dataOrderList.length > 0) {
                    _show = true;
                }
                return _show;
            },
        },
        created() {
        },
        mounted() {
            let _this = this;
            if (_this.role) {
                this.getOrderListRequest();
            } else {
                _this.$app.showDialog("single", "提示", "页面请求错误,缺少role参数", function (index) {
                    _this.$app.goBack();
                }, "返回");
            }
            //埋点
            this.trackLog('show');
        },
        methods: {
            /**
             * 数据请求: 列表下拉刷新
             */
            refresh(){
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.getOrderListRequest();
                    resolve();
                })
            },
            /**
             * 数据请求: 获取列表数据请求
             */
            getOrderListRequest() {
                let _this = this;
                _this.isLoading = true;
                _this.$request.jsonp({
                    url: API.getOrderList.url,
                    data: {
                        role: _this.role,
                        pageNum: _this.pageNum,
                    },
                    jsonpName: "jsoncallback",
                    callback: (state, res)=> {
                        _this.isLoading = false;
                        if (!state) {
                            this.$app.toastMsg("服务器接口异常");
                            return;
                        }
                        if (!res) {
                            this.$app.toastMsg("服务器接口数据异常");
                            return;
                        }
                        if (res.code == 0) {
                            if (res.data && res.data.recordList && res.data.recordList.length > 0) {
                                this.dataOrderList = res.data.recordList;
                            } else {
                                this.dataOrderList = [];
                            }
                        } else {
                            _this.$app.showDialog("single", "提示", res.message, function (index) {
                            }, "确定");
                        }
                    },

                });
            },
            /**
             * 按钮操作: 订单项,按钮操作action入口
             */
            handlerOrderAction(orderAction){
                let _this = this;
                let _action = orderAction.action;
                let _log = orderAction.log;
                if (_log) {
                    _this.trackLog(_log);
                }
                switch (_action) {
                    case 'delete'://删除订单
                        if (orderAction.dialog) {
                            let _orderId = orderAction.orderId;
                            let _dialog = orderAction.dialog;
                            _this.$app.showDialog('double', _dialog.title, _dialog.content, (index)=> {
                                if (index == 1) {
                                    _this.orderDeleteRequest(_orderId);
                                }
                            }, _dialog.text1, _dialog.text2);
                        }
                        break;
                    default:
                        break;
                }
            },
            orderDeleteRequest(orderId){
                let _this = this;
                _this.isLoading = true;
                _this.$request.jsonp({
                    url: API.deleteOrder.url,
                    data: {
                        role: _this.role,
                        orderId: orderId,
                    },
                    jsonpName: "jsoncallback",
                    callback: (state, res)=> {
                        _this.isLoading = false;
                        if (res.code == 0) {
                            _this.getOrderListRequest();
                        } else {
                            _this.$app.toastMsg(res.message);
                        }
                    },
                })
            },
            /**
             * 按钮操作: 租客端列表无数据,去看看
             */
            handlerGoSee(){
                let _this = this;
                _this.trackLog('more');
                let city = _this.$util.getCookie('58home');
                _this.$app.loadNativeList("租房", "chuzu", "37031", '{"list_extra":"geren"}', '{"biz":"0","param9095":"2"}', false, city);
            },
            /*埋点*/
            trackLog(actiontype){
                if (!actiontype) {
                    return;
                }
                let _this = this;
                let _pagetype = _this.dataLog.pagetype[_this.role];
                _this.$app.webLog(actiontype, _pagetype);
            },
        },
        components: {
            ItemOrder,
            PullRefresh,
        }
    }
</script>