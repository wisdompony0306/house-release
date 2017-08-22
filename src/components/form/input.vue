<!--
    desc: input组件
    todo:需要考虑一个组件会对应多个表单字段的情况,例如:区域,显示为一个select,但对应区域localArea、商圈localDiduan、可能带有地址dizhi三个表单字段
-->
<style rel="stylesheet/less" lang="less">
    @import "../../assets/mixins";

    @iHeight: px2rem(74px);
    @iColor: #333;
    @iBorderWidth: 1px;
    @iBorderColor: #f87f7f;
    @iBackgroundColorError: #ffefef;
    @iFontSize: 14px;
    @aMargin: px2rem(10px);
    @iPlaceholderColor: #ccc;

    .mixin-placeholder() {
        color: @iPlaceholderColor;
        font-weight: normal;
    }

    .fang_input {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: @iHeight;
        font-size: @iFontSize;

        .fang_input_content {
            flex: auto;
            padding-left: 4px;
            align-self: stretch;
            border: 1px solid transparent;
            color: @iColor;
            font-weight: 700;
            width: 100%;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            outline: 0;
            border-radius: 0;
            box-sizing: border-box;

            &.error {
                box-shadow: inset 0 0 0 1px @iBorderColor; // ios border有渲染问题
                background-color: @iBackgroundColorError;
            }

            &:focus {
                box-shadow: inset 0 0 0 1px #e59700; // ios border有渲染问题
                background: transparent;
            }

            &::-webkit-input-placeholder {
                .mixin-placeholder;
            }
            &:-ms-input-placeholder {
                .mixin-placeholder;
            }
            &::-moz-placeholder {
                .mixin-placeholder;
            }
            &::placeholder {
                .mixin-placeholder;
            }
        }

        .fang_input_append {
            flex: none;
            margin: 0 @aMargin;
            color: #ccc;
            font-weight: 400;
        }
    }
</style>
<template>
    <div class="fang_input">
        <input class="fang_input_content"
               :class="{error: !validateState}"
               :type="type"
               :name="name"
               :value="value"
               :placeholder="placeholder"
               :readonly="readonly"
               :disabled="disabled"
               :maxlength="maxlength"
               :minlength="minlength"
               :rules="rules"
               ref="input"
               @focus="handleFocus"
               @blur="handleBlur"
               @input="handleInput"/>
        <div class="fang_input_append" v-if="showAppend">{{ appendText }}</div>
    </div>
</template>
<script>
    import FangActions from "@actions";
    import EventHub from "./eventHub";
    import scrollTo from "@business/scrollIntoView";
    import validate from "@business/validateWithReg";

    export default {
        name: 'FangInput',
        data () {
            return {
                validateState: true
            };
        },
        props: {
            /**
             * 类型:text,number,tel
             */
            type: {
                type: String,
                default: 'text'
            },
            name: String, // 表单的name
            value: [String, Number],
            placeholder: String,
            readonly: Boolean,
            disabled: Boolean,
            maxlength: [Number, String],
            minlength: Number,
            rules: {
                type: Object,
                default: function () {
                    return {
                        required: false,
                        reg: '',
                        msg: ''
                    }
                }
            },
            // 附加文本,例如金额单位元
            appendText: {
                type: String,
                default: ''
            },
        },
        computed: {
            showAppend () {
                return this.appendText.length > 0;
            }
        },
        mounted () {
            EventHub.$emit(FangActions.FORM_RECORDS_ADD, [this]);
        },
        beforeDestroy () {
            EventHub.$emit(FangActions.FORM_RECORDS_REMOVE, [this]);
        },
        methods: {
            handleFocus(event){
                this.$emit(FangActions.FOCUS, event);
            },
            handleBlur(event){
                this.$emit(FangActions.BLUR, event);
                this.validate(false);
            },
            handleInput(event){
                this.$emit(FangActions.INPUT, event);
                this.$emit('input', event.target.value);
            },
            validate(showMsg){
                const result = validate(this.rules, this.value, this.$refs.input);
                if (!result.validateState  && showMsg) {
                    EventHub.$emit(FangActions.TOAST_MESSAGET, result.validateMsg);
                }
                this.validateState = result.validateState;
                return result;
            }
        }
    }
</script>
