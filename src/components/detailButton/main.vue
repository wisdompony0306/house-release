<!--
    desc: 订单详情--底部按钮组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .detailButton {
        width: 100%;
        height: 100%;
        line-height: px2rem(90px);
        text-align: center;
        font-size: @fontsize34;
        a {
            display: block;
        }
        .lineRight {
            border-right: px2rem(3px) solid #fff;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
        }
        .lineLeft {
            border-left: px2rem(3px) solid #fff;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
        }
        .grey {
            background: #eee;
            color: #1A2628;
        }
        .orange {
            background: #ff552e;
            color: #fff;
        }
    }
</style>

<template>
    <div class="detailButton">
        <div v-if="[dataButton.action]!='connect'" :class="[dataButton.class]" @click="handleClick">
            {{dataButton.text}}
        </div>
        <a v-if="[dataButton.action]=='connect'" :class="[dataButton.class]" :href="'tel:'+[dataButton.tel]">{{dataButton.text}}</a>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {}
        },
        props: {
            dataButton: {
                type: Object,
                default: function () {
                    return {
                        text: '',
                        class: '',
                    }
                }
            }
        },
        methods: {
            handleClick(event) {
                this.$emit('click', event);
            },
        },
    };
</script>