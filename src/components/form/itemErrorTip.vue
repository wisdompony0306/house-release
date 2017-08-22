<style lang="less">
    .fang_item_error {
        color: #ff5b35;
        font-size: 10px;
        width: 100%;
    }
</style>

<template>
    <p class="fang_item_error">
        <slot></slot>
    </p>
</template>

<script>
    export default {
        props: {
            checked: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            handleClick(event) {
                if(!this.disabled) {

                } else {
                }
            }
        }
    }
</script>