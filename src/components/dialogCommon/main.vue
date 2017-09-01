<!--
    desc: 对话框
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .dialogCommon {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 30;
        background-color: rgba(0, 0, 0, 0.5);

        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dialogMainBox {
        position: relative;
        width: px2rem(540px);
        min-height: px2rem(200px);
        background: #fff;
        border-radius: 2px;

        .contentWrap {
            width: 100%;
            padding: px2rem(40px) px2rem(46px) px2rem(130px);

            box-sizing: border-box;
            -webkit-box-sizing: border-box;

            .title {
                width: 100%;
                height: px2rem(50px);
                line-height: px2rem(50px);
                font-size: @fontsize36;
                color: #333;
                text-align: center;
                margin: 0 0 px2rem(20px);
            }
            .content {
                width: 100%;
                font-size: @fontsize28;
                color: #666;
                line-height: px2rem(40px);
            }

        }
        .buttonWrap {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: px2rem(90px);
            border-top: 1px solid #F3F3F3;

            display: -webkit-flex;
            -webkit-flex-flow: row nowrap;
            -webkit-justify-content: space-between;
            -webkit-align-items: center;

            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;

            .button {
                width: 100%;
                height: 100%;
                line-height: px2rem(90px);
                text-align: center;
                font-size: @fontsize34;
                color: #666;

                &.lineRight {
                    border-right: 1px solid #F3F3F3;
                    box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                }

                &.orange {
                    color: #FF552E;
                }
            }
        }
    }
</style>

<template>
    <section class="dialogCommon" v-if="dialog.show">
        <div class="dialogMainBox">
            <div class="contentWrap">
                <div class="title" v-if="dialog.title" v-html="dialog.title"></div>
                <div class="content" :style="alignStyle" v-if="dialog.content" v-html="dialog.content"></div>
                <slot></slot>
            </div>
            <div class="buttonWrap" v-if="dialog.buttons.length>0">
                <div class="button" v-for="(text,index) in dialog.buttons" key="index"
                     :class="[(index+1)==dialog.buttons.length?'orange':'lineRight']"
                     @click="handlerClickButton(index)">{{text}}
                </div>
            </div>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">

    const dataDialogDefault = {
        show: false,
        action: '',
        title: '',
        content: '',
        buttons: []
    };
    export default {
        name: 'DialogCommon',
        data() {
            return {}
        },
        props: {
            align: {
                type: String,
                default: 'center',
            },
            dataDialog: {
                type: Object,
                default: function () {
                    return dataDialogDefault;
                }
            },
        },
        computed: {
            dialog(){
                let _dialog = Object.assign({}, dataDialogDefault, this.dataDialog);
                return _dialog;
            },
            alignStyle(){
                if (this.align) {
                    return {textAlign: this.align};
                } else {
                    return "";
                }
            },
        },
        methods: {
            handlerClickButton(index){
                this.$emit('clickButton', this.dialog.action, index);
            },
        }
    };
</script>