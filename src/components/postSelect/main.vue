<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .postSelect {
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
    }
</style>
<template>
    <section class="postSelect" :class="{active:isActive}">
        <span class="itemTitle">{{title}}</span>
        <span class="itemInput" @click="handlerClick">{{currentVaule}}</span>
        <input type="hidden" :name="name" :value="value"/>
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
            name: String,
            value: String,
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
        },
        computed: {
            currentVaule(){
                if (this.value != '') {
                    return this.value;
                } else {
                    return this.currentPlaceholder;
                }
            }
        },
        created(){
            if (this.value != '') {
                this.isActive = true;
            }
        },
        methods: {
            handlerClick(event){
                this.handleFocus(event);
                this.$emit('click', event);
            },
            handleFocus(event){
                this.isActive = true;
                this.currentPlaceholder = '';
                this.$emit('focus', event);
            },
            handleBlur(event){
                if (this.value == '') {
                    this.isActive = false;
                    this.currentPlaceholder = this.placeholder;
                }
                this.validate();
                this.$emit('blur', event);
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
