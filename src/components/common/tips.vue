<!--
    desc: 小贴士, 显示一段提示内容
-->
<style rel="stylesheet/less" lang="less">
    @bcolor: #eee;
    @color: #ec4514;
    @fsize: 14px;
    @pTBSize: px2rem(12px);
    @pLRSize: px2rem(20px);
    @cHeight: px2rem(40px);

    .fang_tips {
        margin-top: px2rem(30px);
        width: 100%;
        background-color: @bcolor;
        color: @color;
        box-sizing: border-box;
        padding: @pTBSize @pLRSize;

        .fang_tips_content {
            line-height: @cHeight;
            font-size: @fsize;
        }
    }
</style>

<template>
    <div class="fang_tips" v-if="show">
        <div class="fang_tips_content" v-html="message"></div>
    </div>
</template>

<script type="text/ecmascript-6">

    export default {
        name: 'FangTips',
        props: {
            /**
             * 提示信息
             */
            message: {
                type: String,
                default: ''
            },
        },
        computed: {
            /**
             * message为空时不显示
             * @returns {boolean}
             */
            show() {
                let _show = this.message.length > 0 ? true : false;
                return _show;
            }
        }
    };
</script>