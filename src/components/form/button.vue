<!--
    desc: 按钮
-->
<style rel="stylesheet/less" lang="less">
    @bWidth: px2rem(280px);
    @bHeight: px2rem(86px);
    @bMargin: px2rem(20px);
    @bBorder: 1px;

    @bBackgroundColor: #54bcde;
    @bBackgroundColorHover: #236c8b;
    @bBackgroundColorDisabled: #eee;
    @bColor: #fff;
    @bFontSize: 14px;

    .fang_button {
        margin-top: @bMargin;
        width: 100%;
        height: @bHeight;
        text-align: center;
        .fang_button_content {
            width: @bWidth;
            height: @bHeight;
            line-height: @bHeight;
            border: @bBorder solid @bBackgroundColor;
            background-color: @bBackgroundColor;
            color: @bColor;
            text-align: center;
            font-size: @bFontSize;

            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            outline: 0;

            &.hover {
                background-color: @bBackgroundColorHover;
                border: @bBorder solid @bBackgroundColorHover
            }
            &.disable {
                background-color: @bBackgroundColorDisabled;
                border: @bBorder solid @bBackgroundColorDisabled;
                color: #9a9a9a;
            }
        }
    }
</style>

<template>
    <div class="fang_button">
        <button class="fang_button_content" :class={disable:currentDisabled,hover:isHover} :disabled="currentDisabled"
                :type="type"
                @click="handleClick" @touchstart="handleTouchstart" @touchmove="handleTouchmove"
                @touchcancel="handleTouchcancel">
            <slot></slot>
        </button>
    </div>
</template>

<script>
    import FangActions from "../../config/fangActions";

    export default {
        name: 'FangButton',
        props: {
            /**
             * 按钮类型
             */
            type: {
                type: String,
                default: 'button'//button|reset|submit
            },
            /**
             * 是否禁用
             */
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                currentDisabled: this.disabled,
                isHover: false,
                isMove: false
            }
        },
        watch: {
            'disabled'(val, oldVal) {
                this.currentDisabled = val;
            }
        },
        methods: {
            handleTouchstart(event){
                this.isHover = true;
                this.isMove = false;
            },
            handleTouchmove(event){
                this.isHover = false;
                this.isMove = true;
            },
            handleTouchcancel(event){
                this.isHover = false;
            },
            handleClick(event) {
                this.isHover = false;
                if (this.isMove) {
                    return;
                }
                this.$emit(FangActions.CLICK, event);
            }
        }
    };
</script>
