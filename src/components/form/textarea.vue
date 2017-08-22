<style lang="less">
    @import "../../assets/mixins";

    .fang_textarea {
        width: 100%;
        min-height: 100px;
        line-height: 22px;
        resize: none;
        display: inline-block;
        border: none;
        .font-size-dpr(28px);
    }
</style>

<template>
    <textarea class="fang_textarea" :value="value" :placeholder="placeholder" @input="handleInput($event)"></textarea>
</template>

<script>
    // todo 日租／短租里的textarea
    export default {
        props: {
            placeholder: {
                type: [String, Number],
                default: '',
            },
            value: {
                type: [String, Number],
                default: '',
            },
            disabled: {
                type: Boolean,
                default: false,
            }
        },
        methods: {
            handleInput(event) {
                this.$emit('input', event.target.value);
            }
        }
    }
</script>