<!--
    desc: 订单详情--预订信息组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .detailbooking {
        width: 100%;
        padding: 0 px2rem(30px);
        box-sizing: border-box;
        -webkit-box-sizing: border-box;

        .dbBox {
            height: 100%;
            padding: px2rem(20px) 0;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            position: relative;
            border: none;
            &::after {
                display: block;
                position: absolute;
                left: 0;
                bottom: 0;
                border-bottom: 1px solid #E8E8E8;
                width: 100%;
                content: ' ';

            }
            &::before {
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                border-top: 1px solid #E8E8E8;
                width: 100%;
                content: ' ';
            }

            .dbItem {
                display: block;
                font-size: @fontsize24;
                color: #000;
                height: px2rem(40px);
                line-height: px2rem(40px);
                .text {
                    em {
                        font-size: @fontsize38;
                        color: #FF552E;
                    }
                    i {
                        font-style: normal;
                        color: #FF552E;
                    }
                }
            }
        }

        @media (-webkit-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5) {
            .dbBox {
                &::before {
                    -webkit-transform: scaleY(0.7);
                    transform: scaleY(0.7);
                }
                &::after {
                    -webkit-transform: scaleY(0.7);
                    transform: scaleY(0.7);
                }
            }
        }

        @media (-webkit-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
            .dbBox {
                &::before {
                    -webkit-transform: scaleY(0.5);
                    transform: scaleY(0.5);
                }
                &::after {
                    -webkit-transform: scaleY(0.5);
                    transform: scaleY(0.5);
                }
            }
        }

        @media (-webkit-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
            .dbBox {
                &::before {
                    -webkit-transform: scaleY(0.33);
                    transform: scaleY(0.33);
                }
                &::after {
                    -webkit-transform: scaleY(0.33);
                    transform: scaleY(0.33);
                }
            }
        }
    }


</style>

<template>
    <section class="detailbooking">
        <ul class="dbBox">
            <li class="dbItem">
                <span>入住时间：</span>
                <span>{{booking.checkInDate | datetimeFormat}}</span>
            </li>
            <li class="dbItem">
                <span class="text">订金 <em>{{booking.totalAmount}}</em><i> 元</i></span>
            </li>
        </ul>
    </section>
</template>

<script type="text/ecmascript-6">
    import DataBooking from '../../datas/dataBooking';

    export default {
        props: {
            dataBooking: {
                type: Object,
                default: function () {
                    return DataBooking;
                }
            }
        },
        computed: {
            booking(){
                let _booking = Object.assign({}, DataBooking, this.dataBooking);
                return _booking;
            }
        }
    };
</script>