<style lang="less">
    .fang_btn_captcha {
        border-radius: 3px;
        background-color: #ccc;
        width: 104px;
        height: px2rem(68px);
        text-align: center;
        padding: 0 2px;
        font-size: 12px;
        color: #394B59;
        border: none;
        box-sizing: content-box;
        
        &:active {
            background: #aaa;
        }
        
        &.disable {
            background: #aaa;
        }
    }
</style>

<template>
    <button class="fang_btn_captcha" :class="{disable}" type="button">
        <slot>发送验证码</slot>
    </button>
</template>

<script>

    export default {
        props: {
            disable: {
                type: Boolean,
                default: false,
            },
        },
    }
</script>