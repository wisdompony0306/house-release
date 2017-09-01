<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .dialogWithdraw {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 399;

        .backmask {
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .7);

            display: -webkit-flex;
            -webkit-justify-content: center;
            -webkit-align-items: center;

            display: flex;
            justify-content: center;
            align-items: center;
        }
        .content {
            background-color: #FFF;
            width: 72vw;
            text-align: center;
            &_avatar {
                background-color: #FFF;
                width: 72vw;
                padding-top: px2rem(60px);
                img {
                    width: px2rem(160px);
                    height: px2rem(160px);
                    background-size: 100% 100%;
                    border-radius: px2rem(80px);
                }
            }
            &_nickname {
                padding-top: px2rem(10px);
                font-size: @fontsize28;
                color: #000;
                line-height: px2rem(42px);
                text-align: center;
            }
            &_info {
                padding-bottom: px2rem(52px);
                &_pic {
                    display: inline-block;
                    width: px2rem(24px);
                    height: px2rem(24px);
                    margin-bottom: px2rem(30px);
                    background: data-uri("//img.58cdn.com.cn/fangrs/img/f5388b2449453580df4c6155b183e819.png");
                    background-size: 100% 100%;
                    overflow: hidden;
                }
                &_text {
                    text-align: center;
                    display: inline-block;
                    width: px2rem(374px);
                    font-size: @fontsize22;
                    color: #AAAAAA;
                    line-height: px2rem(32px);
                }
            }
            &_button {
                background: #FFF;
                &_wx {
                    line-height: px2rem(88px);
                    font-size: @fontsize34;
                    color: #FF552E;
                }
                &_other {
                    line-height: px2rem(88px);
                    font-size: @fontsize34;
                    color: #666;
                    border-top: 1px solid #F3F3F3;
                }
                &_cancel {
                    line-height: px2rem(88px);
                    font-size: @fontsize34;
                    color: #666;
                    border-top: 1px solid #F3F3F3;
                }
            }

        }
    }
</style>

<template>
    <section class="dialogWithdraw" v-if="dialog.show">
        <div class="backmask">
            <div class="content">
                <div class="content_avatar">
                    <img :src="dialog.imageUrl">
                </div>
                <div class="content_nickname">{{dialog.nickName}}</div>
                <div class="content_info">
                    <div class="content_info_pic"></div>
                    <div class="content_info_text">{{dialog.content}}</div>
                </div>
                <div class="content_button">
                    <div @click="handlerButton('wx')" class="content_button_wx">{{dialog.buttonWx}}</div>
                    <div @click="handlerButton('other')" class="content_button_other">{{dialog.buttonOther}}</div>
                    <div @click="handlerButton('cancel')" class="content_button_cancel">{{dialog.buttonCancel}}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

    const dataDialogDefault = {
        show: false,
        imageUrl: 'http://img.58cdn.com.cn/olympia/img/house/detail/renzheng_manHead.png?platform=app',
        nickName: '',
        content: '微信身份证信息需和人脸认证信息一致方可成功提现。',
        buttonWx: '提取到此微信',
        buttonOther: '提取到其他微信',
        buttonCancel: '取消',
    };

    export default {
        name: 'WithdrawDialog',
        props: {
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
        },
        methods: {
            handlerButton(action){
                this.$emit('clickButton', action);
            },
        }
    }
</script>