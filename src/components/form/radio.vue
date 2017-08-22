<style rel="stylesheet/less" lang="less">
    @import "../../assets/mixins";

    .fang_radio_group {
        display: flex;
        align-items: stretch;
        flex-flow: row wrap;
    }

    .fang_radio {
        margin: 0 px2rem(10px);
        .font-size-dpr(28px);
        color: #333;
        display: flex;
        align-items: center;

        .fang_icon {
            position: relative;
            display: inline-block;
            margin-right: 4px;
            width: 16px;
            height: 16px;
            vertical-align: top;
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
                    background: #cfcfcf;
                }
            }
        }
    }
</style>

<template>
    <div class="fang_radio_group">
        <span v-for="item of c_value.option"
              class="fang_radio"
              :class="[{checked:item.selected === true || item.selected === 'true' }, {disabled}]"
              @click="handleClick(item.value)">
            <i class="fang_icon"></i>{{ item.text }}
        </span>
    </div>
</template>

<script>
    import util from '../../business/util';
    import FangActions from '../../config/fangActions';
    import EventHub from './eventHub';
    import validate from '@business/validateWithReg';

    export default {
        props: {
            value: {
                type: Object,
                default () {
                    return {
                        option: []
                    }
                },
            },
            disabled: {
                type: Boolean,
                default: false
            },
            rules: {
                type: Object,
                default () {
                    return {};
                }
            }
        },
        computed: {
            c_value () {
                let val = Object.assign({
                    paramname: '',
                    title: '',
                    option: []
                }, util.parse(this.value));
                return val;
            },
        },
        methods: {
            handleClick (curVal) {
                if(this.disabled){
                    return;
                }
                let new_isBiz = JSON.parse(JSON.stringify(this.c_value));
                new_isBiz.option.forEach(item => item.selected = item.value === curVal);
                this.$emit('input', new_isBiz);
            },

            // 根据传入的规则进行校验
            validate () {
                let r;

                // 获取当前选中的值
                for (const op of this.c_value.option) {
                    if (op.selected === true || op.selected === 'true') {
                        r = op.value;
                        break;
                    }
                }
                return validate(this.rules, r, this.$el);
            }
        },
        mounted () {
            EventHub.$emit(FangActions.FORM_RECORDS_ADD, [this]);
        },
        beforeDestroy () {
            EventHub.$emit(FangActions.FORM_RECORDS_REMOVE, [this]);
        },
    }
</script>