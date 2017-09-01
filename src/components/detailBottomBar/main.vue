<!--
    desc: 订单详情--底部按钮组件
-->
<style rel="stylesheet/less" lang="less">
    .detailBottomBar {
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 10;
        width: 100%;
        height: px2rem(90px);
        background: #ccc;

        display: -webkit-flex;
        -webkit-flex-flow: row nowrap;
        -webkit-justify-content: space-between;
        -webkit-align-items: center;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;

        &.dbbAbsolute {
            position: absolute;
        }
        &.dbbFixed {
            position: fixed;
        }
    }
</style>

<template>
    <section class="detailBottomBar" :class="[barPositionCls]">
        <slot></slot>
    </section>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            dataPosition: {
                type: String,
                default: '',
                validator: function (position) {
                    let flag = true;
                    switch (position) {
                        case 'absolute':
                            break;
                        case 'fixed':
                            break;
                        case '':
                            break;
                        default:
                            flag = false;
                            break;
                    }
                    return flag;
                }
            },
        },
        computed: {
            barPositionCls () {
                let _position = this.dataPosition;
                switch (_position) {
                    case 'absolute':
                        _position = 'dbbAbsolute';
                        break;
                    case 'fixed':
                        _position = 'dbbFixed';
                        break;
                    default:
                        break;
                }
                return _position
            }
        },
    };
</script>