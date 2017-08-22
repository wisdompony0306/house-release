<style lang="less">
    @import "../../assets/mixins";

    .fang_select {
        font-size: 14px;
        color: #333;
        display: flex;
        width: 100%;
        padding-right: 5px;
        align-items: center;
        justify-content: space-between;

        &::after {
            display: block;
            width: 7px;
            height: 7px;
            content: "";
            border-top: 2px solid #c0c0c1;
            border-right: 2px solid #c0c0c1;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
        }

        &.hover {
            background-color: #6f747a;
        }

        &.fang_gray {
            color: #ccc;
        }

        > .fang_text {
            max-width: 180px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &.disabled {
            > .fang_text {
                color: #ccc;
            }
        }
    }
</style>

<template>
    <span class="fang_select"
          :class="[{fang_gray},{hover:isHoving}, {disabled}]"
          @click.prevent="handleClick"
          @touchstart="handleTouchstart"
          @touchmove="handleTouchmove"
          @touchend="handleTouchend"
    >
        <em class="fang_text">{{ c_data.msg }}</em>
    </span>
</template>

<script>
    import { selectLocalAddr, selectDiy, selectXiaoqu, selectInput, toastMsg } from '../../business/appShim';
    import Util from '../../business/util';
    import FangActions from '@actions';
    import EventHub from './eventHub';
    import validate from '@business/validateWithReg';
    import stripTags from '@business/stripTags';

    export default {
        props   : {
            value   : {
                type: [Array, String, Object],
                default () {
                    return [{
                        paramname: 'localArea',
                        text     : '',
                        value    : '',
                    }, {
                        paramname: 'localDiduan',
                        text     : '',
                        value    : '',
                    }]
                },
            },
            type    : {
                type   : String,
                default: 'localAddr', // localAddr(区域) diy(自定义数据) xiaoqu(小区) input(带语音的输入)
            },
            disabled: {
                type: Boolean,
                default: false,
            },

            // 禁用时的提示信息
            disableMsg: {
                type   : String,
                default: '',
            },
            rules: {
                type: [Array, Object],
                default () {
                    return {};
                },
            },
            /**
             * 是否有UI交互(即hover效果)
             */
            hasUIActions: {
                type: [String, Boolean],
                default: '0',
            },
        },
        data () {
            return {
                hovered: false, // hover效果
            }
        },
        computed: {
            c_data () { // 显示在组件里的文案
                switch (this.type) {
                    case 'localAddr':
                        const result = {
                            msg: '',
                            ary: [],
                        };

                        // localAddr时this.value为数组，将数组item.text的内容拼起来
                        for (const op of this.value) {
                            result.msg += op.text + ' ';
                            result.ary.push(op);
                        }
                        return result;
                        break;
                    case 'diy':
                        // 兼容传入空数据或非Object类型的数据
                        let val = Util.parse(this.value);
                        val = Object.assign({
                            paramname: "",
                            title: "",
                            option: [
                                {text: "请选择", value: "-1", selected: true}
                            ]
                        }, val);
                        let selectedItem = val.option.filter(item => item.selected === true || item.selected === 'true');

                        // 没有默认选中项时将第一项选中
//                        if (!selectedItem.length) {
//                            selectedItem = [val.option[0]];
//                        }
                        return {
                            msg: selectedItem.length ? selectedItem[0]['text'] : '',
                        };
                        break;
                    case 'xiaoqu': // todo 选择小区
                        return {
                            msg: this.value.text || this.value.tip,
                        };
                        break;

                    // 将html标签过滤掉
                    case 'input':
                        return {
                            msg: stripTags(this.value.text) || this.value.tip,
                        };
                        break;
                }
            },

            // value中的tip和text一样的话给select加上placeholder灰色效果（只有input类型有tip字段）
            fang_gray () {
                return this.c_data.msg === this.value.tip;
            },
            isHoving () {
                if (this.hasUIActions === '0') {
                    return false;
                }
                return this.hovered;
            },
        },
        methods : {
            handleClick () {
                let _self = this;

                // disableMsg不为空时报错提示并返回
                if (this.disableMsg) {
                    toastMsg.action({
                        msg: this.disableMsg,
                    });
                    return;
                }
                if (this.disabled) {
                    return;
                }

                // 区分【4?】种类型的选择器
                switch (this.type) {

                    // * 选择【区域】
                    case 'localAddr':
                        selectLocalAddr.setCallback((data) => { // 设置选择完毕后的回调
                            _self.$emit('input', data);
                        });

                        // 触发【选择行为】
                        selectLocalAddr.action();
                        break;

                    // * 选择【自定义选项】
                    case 'diy':
                        selectDiy.setCallback((data) => { // 设置选择完毕后的回调
                            let _data = JSON.parse(JSON.stringify(_self.value));
                            _data.option.forEach(item => item.selected = data[0]['value'] == item.value);
                            _data.selected = {
                                value: data[0]['value'],
                                text: data[0]['text'],
                            };
                            _self.$emit('input', _data);
                        });
                        selectDiy.action(this.value); // 设置自定义选项的内容，然后触发【选择行为】
                        break;

                    // * 选择【小区(autocomplete)】
                    case 'xiaoqu':
                        selectXiaoqu.setCallback((data) => { // 设置选择完毕后的回调
                            let _data    = JSON.parse(JSON.stringify(_self.value));
                            _data.text   = data.xiaoqu.name;
                            _data.dizhi  = data.xiaoqu.address;
                            _data.quyu   = data.xiaoqu.quyu;
                            _data.xiaoqu = data.xiaoqu.xiaoqu;
                            _self.$emit('input', _data);
                        });
                        selectXiaoqu.action(this.value.nearxiaoqu); // 设置自定义选项的内容，然后触发【选择行为】
                        break;

                    // *  选择【带有语音的textarea】
                    case 'input':
                        selectInput.setCallback((data) => { // 设置选择完毕后的回调
                            let _data  = JSON.parse(JSON.stringify(_self.value));
                            _data.text = data;
                            _self.$emit('input', _data);
                        });

                        // 设置自定义选项的内容，然后触发【选择行为】。设置默认值以免传入的数据不完整
                        selectInput.action(Object.assign({
                            title    : '请输入',
                            tip      : '',
                            minlength: '',
                            text     : '',
                            msg      : '',
                        }, {
                            title    : this.value.title,
                            tip      : this.value.tip,
                            minlength: this.value.minlength,
                            text     : this.value.text,
                            msg      : this.value.msg,
                        }));
                        break;
                }
            },
            handleTouchstart () {
                if (this.disabled) {
                    return;
                }
                this.hovered = true;
            },
            handleTouchmove () {
                this.hovered = false;
            },
            handleTouchend () {
                this.hovered = false;
            },
            validate () {
                let result;
                // 区分【4?】种类型的选择器
                switch (this.type) {

                    // * 选择【区域】，此时@validate中的两个参数都是数组
                    case 'localAddr':
                        result = validate(this.rules, this.c_data.ary.map(item => item.text));
                        break;

                    // * 选择【自定义选项】
                    case 'diy':
                        result = validate(this.rules, this.c_data.msg);
                        break;

                    // * 选择【小区(autocomplete)】
                    case 'xiaoqu':
                        result = validate(this.rules, this.c_data.msg); // todo 未测试
                        break;

                    // *  选择【带有语音的textarea】
                    case 'input':
                        result = validate(this.rules, this.c_data.msg);
                        break;
                }
                return result;
            },
        },
        mounted () {
            EventHub.$emit(FangActions.FORM_RECORDS_ADD, [this]);
            EventHub.$emit(FangActions.TOUCHMOVE, this);
        },
        beforeDestroy () {
            EventHub.$emit(FangActions.FORM_RECORDS_REMOVE, [this]);
        },
    }

</script>