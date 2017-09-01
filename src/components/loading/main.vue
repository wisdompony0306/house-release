<!--
    desc: loading组件
-->
<style rel="stylesheet/less" lang="less">
    .loadingBox {
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
        &.pop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 30;

            .loadWrap {
                width: px2rem(200px);
                height: px2rem(200px);
                background-color: rgba(0, 0, 0, 0);
                display: -webkit-flex;
                -webkit-justify-content: center;
                -webkit-align-items: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .loading {
            display: block;
            border-radius: 100%;
            border: px2rem(5px) solid #ff552e;
            border-bottom-color: transparent;
            height: px2rem(50px);
            width: px2rem(50px);
            -webkit-animation: loadingRotate .75s 0s linear infinite;
            animation: loadingRotate .75s 0s linear infinite;
        }

        @-webkit-keyframes loadingRotate {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg)
            }
            50% {
                -webkit-transform: rotate(180deg);
                transform: rotate(180deg)
            }
            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg)
            }
        }
    }
</style>

<template>
    <div class="loadingBox" :class="[mode]" v-if="isShow" @touchmove="handlerMove">
        <div class="loadWrap">
            <i class="loading"></i>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            isShow: {
                type: Boolean,
                required: true,
                default: false
            },
            mode: {
                type: String,
                default: 'pop',
                validator: function (value) {
                    let flag = true;
                    switch (value) {
                        case 'pop':
                            break;
                        case '':
                            break;
                        default:
                            flag = false;
                            break;
                    }
                    return flag;
                }
            }
        },
        methods: {
            /*
             * 页面滚动穿透处理,阻止默认行为
             */
            handlerMove(e){
                e.preventDefault();
            }
        },
    };
</script>