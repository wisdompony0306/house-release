<style rel="stylesheet/less" lang="less">
    @import "../../assets/mixins";
    @iLineHeight: px2rem(68px);
    @iBorderWidth: 1px;
    @iPadding: px2rem(10px);

    @iFontSize: 14px;

    .fang_singleRadio_group {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        padding: @iPadding;
        line-height: @iLineHeight;
        border: @iBorderWidth solid #d1d1d1;
        border-top: 0px;
        font-size: @iFontSize;
    }
    .fang_item_label {
        color: #737373;
    }
    .fang_icon_toast {
        background: url("../../public/images/question.png") no-repeat center;
        background-size:100%;
        width: 20px;
        height: 20px;
        position: relative;
        display: inline-block;
        margin-left: -20px;
    }
    .fang_single_radio {
        display: flex;
        align-items: center;

        .fang_icon {
            position: relative;
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1px solid #cfcfcf;
            border-radius: 100%;
        }
    
        &.checked {
            .fang_icon::after {
                content: '';
                position: absolute;
                bottom: 3px;
                left: 3px;
                display: block;
                width: 10px;
                height: 10px;
                border-radius: 100%;
                background: #fc5717;
            }
        }

        &.disabled {
            cursor: not-allowed;
            .fang_icon {
                background: #E7E7E7;
            }
            &.checked {
                .fang_icon::after {
                    background: #cfcfcf
                }
            }
        }
    }
</style>

<template>
    <div class="fang_singleRadio_group">
        <label class="fang_item_label">{{label}}</label>
        <span class="fang_icon_toast" @click="handleToast">
        </span>
        <span 
              class="fang_single_radio"
              :class="[{checked:value.selected === value.on}, {disabled}]"
              @click="handleClick">
            <i class="fang_icon"></i>
        </span>
    </div>
</template>

<script>
    import {showDialog} from '../../business/appShim';
    export default {
        data() {
            return {
              selected: this.value   
            }
        },
        props: {
            value: {
                type: Object,
                default () {
                    return {
                        on: '1',
                        off: '0',
                        selected: '0',
                    }
                },
            },
            disabled: {
                type: Boolean,
                default: false
            },
            label: {
                type: String,
                default: ''
            },
            tipTitle: {
                type: String,
                default: '提示',
            },
            tipContent: {
                type: String,
                default: '58隐私保护介绍\n1.设置后您的手机号码将被隐藏，别人只能通过虚拟的手机号与您沟通。\n2.虚拟的手机号不唯一，且可能是外地号。',
            },
            tipButton: {
                type: String,
                default: '知道了',
            },
        },
        methods: {
            handleClick () {
                if(this.disabled) {
                    return;
                }
                const newValue = JSON.parse(JSON.stringify(this.value));
                const val = this.value;
                if(newValue.selected === val.on) {
                    newValue.selected = val.off;
                }else{
                    newValue.selected = val.on;
                }
                this.$emit('input', newValue);
            },
            handleToast () {
                showDialog.action({
                    type: 'single', 
                    title: this.tipTitle,
                    content: this.tipContent,
                    txt1: this.tipButton,
                });
            }
        },
    }
</script>