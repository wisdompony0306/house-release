<!--
    desc: 同意协议Radio
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .agreementRadio {
        width: 100%;
        .agreementRadioBox {
            width: 100%;
            font-size: px2rem(28px);
            text-align: center;
            font-weight: 300;
            padding-top: px2rem(45px);
            i {
                margin-right: px2rem(5px);
                height: px2rem(32px);
                width: px2rem(32px);
            }
            .icon {
                display: inline-block;
                height: px2rem(32px);
                width: px2rem(32px);
                vertical-align: middle;
                background: data-uri("//img.58cdn.com.cn/fangrs/img/f75eb1ce9e72059d8579ad13440f5add.png") center no-repeat;
                background-size: cover;
                &.checked {
                    background: data-uri("//img.58cdn.com.cn/fangrs/img/93acfa38938a12bbab378627de091c5e.png") center no-repeat;
                    background-size: cover;
                }
            }
            .open {
                font-size: @fontsize28;
                color: #1993c3;
                text-decoration: none;
            }
        }
    }
</style>

<template>
    <section class="agreementRadio">
        <div class="agreementRadioBox" :style="topStyle">
            <i class="icon" :class="{checked:isChecked}" @click="handleClickIcon"></i>同意
            <span class="open" @click="handlerClickOpen">58订金保障协议</span>
        </div>
        <DialogAgreement :data-agreement="dialog" @clickButton="handlerDialogAgreementButton"/>
    </section>
</template>

<script type="text/ecmascript-6">
    import DialogAgreement from '../dialogAgreement/main.vue';

    const dataAgreementDefault = {
        topHeight: 0,
        dialog: {
            show: false,
            class: '',
            buttons: ['我再想想', '同意'],
        },
    };

    export default {
        name: 'agreementRadio',
        data() {
            return {
                isChecked: true,
                dialog: dataAgreementDefault.dialog,
            }
        },
        props: {
            value: {
                type: Boolean,
                default: true,
            },
            dataAgreement: {
                type: Object,
                default: function () {
                    return dataAgreementDefault;
                }
            },
        },
        computed: {
            agreement(){
                let _agreement = Object.assign({}, dataAgreementDefault, this.dataAgreement);
                this.dialog = Object.assign({}, dataAgreementDefault.dialog, _agreement.dialog);
                return _agreement;
            },
            topStyle(){
                if (this.agreement.topHeight) {
                    let remTopHeight = this.$util.px2rem(this.agreement.topHeight);
                    return {paddingTop: remTopHeight}
                } else {
                    return '';
                }
            }
        },
        methods: {
            setIsChecked(value){
                if (this.isChecked == value) {
                    return
                }
                this.isChecked = value;
                this.$emit('input', value);//必须触发此事件v-model才生效
                this.$emit('click', value);
            },
            handleClickIcon () {
                let _isChecked = !this.isChecked;
                this.setIsChecked(_isChecked);
            },
            handlerClickOpen(e){
                this.dialog.show = true;
            },
            handlerDialogAgreementButton(index){
                this.dialog.show = false;

                //>1按钮时,最后一个按钮点击,radio处于选中状态
                let buttonNum = this.dialog.buttons.length;
                if (buttonNum > 1 && index == (buttonNum - 1)) {
                    this.setIsChecked(true);
                }
            }
        },
        components: {
            DialogAgreement,
        }
    };
</script>