<style rel="stylesheet/less" lang="less">
    @iLineHeight: px2rem(68px);
    @iBorderWidth: 1px;
    @iPadding: px2rem(10px);
    @lWidth: px2rem(120px);
    @sWidth: px2rem(2px);
    @sMargin: px2rem(10px);

    @iFontSize: 14px;

    .fang_item {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: center;

        width: 100%;
        box-sizing: border-box;
        padding: @iPadding;
        line-height: @iLineHeight;
        border: @iBorderWidth solid #d1d1d1;
        background-color: #fff;
        font-size: @iFontSize;

        // 一行显示且顶对齐
        &.nowrap {
            flex-flow: row nowrap;
        }

        &.no_border_bottom {
            border-bottom: none;
        }

        &.no_border_top {
            border-top: none;
        }

        .fang_item_label {
            flex: none;
            width: @lWidth;
            height: @iLineHeight;
            line-height: @iLineHeight;
            color: #737373;
            overflow: hidden;

            &.label_align_left {
                text-align: left;
            }

            &.label_align_center {
                text-align: center;
            }

            &.label_align_right {
                text-align: right;
            }

            &.label_align_justify {
                text-align: justify;
                text-align-last: justify;
                -webkit-text-align-last:justify;

                &::after {
                    display:inline-block;
                    content:'';
                    overflow:hidden;
                    width:100%;
                    height:0;
                }
            }
        }

        .fang_item_separator {
            flex: none;
            margin: 0 @sMargin;
            width: @sWidth;
            color: #ccc;
        }

        .fang_item_content {
            flex: auto;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
            flex-basis: 0; // 避免宽度超限导致换行
        }
    }
</style>

<template>
    <div class="fang_item"
         :class="[noBorderDirection!=''?'no_border_'+noBorderDirection:'', {hover:isHoving}, {nowrap:nowrap != '-1'}]"
         @touchstart="handleTouchstart"
         @touchmove="handleTouchmove"
         @touchend="handleTouchend"
    >
        <label class="fang_item_label" :class="['label_align_' + labelAlign ]" v-if="label">{{label}}</label>
        <div class="fang_item_separator" v-if="separator">{{separator}}</div>
        <div class="fang_item_content">
            <slot></slot>
        </div>
        <slot name="after"></slot>
    </div>
</template>

<script>
    import FangActions from "@actions";
    import eventHub from './eventHub';

    export default {
        name: 'FangItem',
        props: {
            // 控制不换行的class
            nowrap: {
                type: String,
                default: '-1',
            },

            /**
             * 表单项label
             */
            label: String,
            /**
             * label对齐方式, 默认center ,取值:left|center|right
             */
            labelAlign: {
                type: String,
                default: 'justify',
                validator: function (align) {
                    let flag = true;
                    switch (align) {
                        case 'left':
                            break;
                        case 'center':
                            break;
                        case 'right':
                            break;
                        case 'justify':
                            break;
                        default:
                            flag = false;
                            break;
                    }
                    return flag;
                }
            },
            /**
             * label位置,默认left,取值top|right|bottom|left
             */
            labelPosition: {
                type: String,
                default: ''
            },
            /**
             * label和表单元素的分隔符
             */
            separator: String,
            /**
             * 取消边框方向, 默认全边框, 取值:left|right|top|bottom|''
             */
            noBorderDirection: {
                type: String,
                default: '',
                validator: function (direction) {
                    let flag = true;
                    switch (direction) {
                        case 'top':
                            break;
                        case 'left':
                            break;
                        case 'bottom':
                            break;
                        case 'right':
                            break;
                        case '':
                            break;
                        default:
                            flag = false;
                            break;
                    }
                    return flag;
                }
            },
            /**
             * 是否有UI交互
             */
            hasUIActions: {
                type: [String, Boolean],
                default: '0',
            },
            disabled: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                hovered: false, // hover效果
            }
        },
        mounted () {
            eventHub.$emit(FangActions.TOUCHMOVE, this);
        },
        computed: {
            isHoving () {
                if (this.hasUIActions === '0') {
                    return false;
                }
                return this.hovered;
            }
        },
        methods: {
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
        },
    };
</script>
