<!--
    desc: 订单填写--radio组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .postRadio {
        width: 100%;
        text-align: center;
        .prItem {
            min-width: px2rem(140px);
            height: px2rem(60px);
            line-height: px2rem(60px);
            border-radius: px2rem(30px);
            background: #F6F6F6;
            font-size: @fontsize28;
            color: #999999;
            text-align: center;

            padding: px2rem(10px) px2rem(28px);
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            margin: 0 px2rem(15px);
            &.checked {
                background: #FF3F0D;
                color: #FFF;
            }
        }
    }
</style>

<template>
    <section class="postRadio">
        <span v-for="item of dataSource.items" class="prItem" :class="{checked:item.value==currentValue}"
              @click="handleClick(item.value)">
            {{ item.text}}
        </span>
    </section>
</template>

<script type="text/ecmascript-6">
    import  CheckRule from '../../service/checkRule';

    export default {
        data(){
            return {
                currentValue: '',
            }
        },
        props: {
            dataSource: {
                type: Object,
                default () {
                    return {
                        items: [],
                        default: '',
                    };
                }
            },
            rules: {
                type: Object,
                default () {
                    return {};
                }
            },
            name: String,
            value: {
                type: [Number, String],
                default: '',
            },
        },
        watch: {
            value(val, oldVal) {
                this.setCurrentValue(val);
            }
        },
        created() {
            if (this.value == '') {
                this.setCurrentValue(this.dataSource.default);
            } else {
                this.setCurrentValue(this.value);
            }
        },
        methods: {
            setCurrentValue(value){
                if (this.currentValue == value) {
                    return
                }
                this.currentValue = value;
                this.$emit('input', value);//必须触发此事件v-model才生效
            },
            handleClick (value) {
                this.setCurrentValue(value);
                this.$emit('click', value);
            },
            validate(){
                let _this = this;
                let rulesResult = CheckRule(_this.value, _this.rules);
                if (!rulesResult.state) {
                    _this.$app.toastMsg(rulesResult.msg);
                }
                return rulesResult;
            }
        },
    };
</script>