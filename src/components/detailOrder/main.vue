<!--
    desc: 订单详情--订单信息组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .detailOrder {
        width: 100%;
        padding: px2rem(25px) px2rem(30px) px2rem(115px);
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        .doBox {
            display: block;
            li {
                display: block;
                height: px2rem(38px);
                line-height: px2rem(38px);
                font-size: @fontsize24;
                color: #b1b1b1;
                .label {
                    padding: 0 px2rem(20px) 0 0;
                }
            }
        }
    }
</style>

<template>
    <section class="detailOrder">
        <ul class="doBox">
            <li>
                <span class="label">订单编号</span>
                <span class="text">{{order.orderId}}</span>
            </li>
            <li>
                <span class="label">创建时间</span>
                <span class="text">{{order.createTime}}</span>
            </li>
            <li v-if="order.payTime">
                <span class="label">付款时间</span>
                <span class="text">{{order.payTime}}</span>
            </li>
            <li v-if="order.agreeTime">
                <span class="label">同意出租时间</span>
                <span class="text">{{order.agreeTime}}</span>
            </li>
            <li v-if="order.checkinTime">
                <span class="label">确认入住时间</span>
                <span class="text">{{order.checkinTime}}</span>
            </li>
            <li v-if="order.closeTime">
                <span class="label">交易关闭时间</span>
                <span class="text">{{order.closeTime}}</span>
            </li>
            <li v-if="order.successTime">
                <span class="label">交易成功时间</span>
                <span class="text">{{order.successTime}}</span>
            </li>
        </ul>
    </section>
</template>
<script type="text/ecmascript-6">
    import DataOrder from '../../datas/dataOrder';

    export default {
        props: {
            dataOrder: {
                type: Object,
                default: function () {
                    return DataOrder;
                }
            }
        },
        computed: {
            order(){
                let _order = Object.assign({}, DataOrder, this.dataOrder);
                return _order;
            }
        },
    };
</script>