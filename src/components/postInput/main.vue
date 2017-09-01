<!--
    desc: input组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .postInput {
        position: relative;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;

        .itemTitle {
            line-height: px2rem(24px);
            color: #ccc;
            font-size: @fontsize24;
            display: none;
            margin-bottom: px2rem(6px);
        }
        .itemInput {
            width: 100%;
            line-height: px2rem(40px);
            font-size: @fontsize38;
            color: #666;
            text-align: center;
            vertical-align: middle;
            border: none;
            padding: 0 px2rem(6px);
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;

        }
        .itemLine {
            position: absolute;
            top: px2rem(37px);
            right: 0;
            width: 1px;
            height: px2rem(70px);
            background: #F3F3F3;
        }
        &.active {
            line-height: 0;
            padding: px2rem(30px) 0 0;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;

            .itemTitle {
                display: block;
            }
            .itemInput {
                color: #000;
            }
        }

        input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
            color: #666;
        }
        input:-moz-placeholder, textarea:-moz-placeholder {
            color: #666;
        }
        input::-moz-placeholder, textarea::-moz-placeholder {
            color: #666;
        }
        input:-ms-input-placeholder, textarea:-ms-input-placeholder {
            color: #666;
        }
    }
</style>
<template>
    <section class="postInput" :class="{active:isActive}" :style="customStyle">
        <span class="itemTitle">{{title}}</span>
        <input class="itemInput"
               :type="type"
               :name="name"
               :value="value"
               :placeholder="currentPlaceholder"
               :readonly="readonly"
               :disabled="disabled"
               :maxlength="maxlength"
               :minlength="minlength"
               ref="input"
               @focus="handleFocus"
               @blur="handleBlur"
               @input="handleInput"/>
        <i class="itemLine" v-if="hasLine"></i>
    </section>
</template>

<script>
    import  CheckRule from '../../service/checkRule';

    export default {
        data () {
            return {
                isActive: false,
                currentPlaceholder: this.placeholder || '',
            };
        },
        props: {
            title: String,
            type: {
                type: String,
                default: 'text'
            },
            name: String,
            value: [String, Number],

            readonly: Boolean,
            disabled: Boolean,
            maxlength: Number,
            minlength: Number,
            placeholder: String,
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
            hasLine: {
                type: Boolean,
                default: false
            },
            width: {
                type: [String, Number],
                default: ''
            }
        },
        watch: {
            value(value, old){
                if (this.value != '') {
                    this.isActive = true;
                }
            }
        },
        computed: {
            customStyle(){
                let _width = this.width;
                if ('' == _width) {
                    return '';
                } else {
                    return {
                        flex: _width,
                    }
                }
            }
        },
        created(){
        },
        mounted() {

        },
        methods: {
            handleFocus(event){
                this.isActive = true;
                this.currentPlaceholder = '';
                this.$eventHub.$emit(this.$eventAction.INPUT_FOCUS, this);

            },
            handleBlur(event){
                if (this.value == '') {
                    this.isActive = false;
                    this.currentPlaceholder = this.placeholder;
                }
                this.validate();
                this.$eventHub.$emit(this.$eventAction.INPUT_BLUR, this);
            },
            handleInput(event){
                this.$emit('input', event.target.value);
            },
            validate(){
                let _this = this;
                let rulesResult = CheckRule(_this.value, _this.rules);
                if (!rulesResult.state) {
                    // _this.$app.toastMsg(rulesResult.msg);
                }
                return rulesResult;
            }
        }
    }
</script>
