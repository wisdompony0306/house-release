<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .dialogWarn {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 299;

        .backmask {
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .7);

            display: -webkit-flex;
            -webkit-justify-content: center;
            -webkit-align-items: center;

            display: flex;
            justify-content: center;
            align-items: center;
        }
        .content {
            background-color: #FFF;
            width: 72vw;
            text-align: center;
            &_pic {
                height: px2rem(240px);
                background: data-uri("//img.58cdn.com.cn/fangrs/img/3ab115098254c6afe2b003247f1a9fd3.png");
                background-size: 100% 100%;
                overflow: hidden;
            }
            &_text {
                padding: px2rem(60px) px2rem(50px);
                font-size: @fontsize28;
                color: #666;
                line-height: px2rem(42px);
            }
            &_button {
                background: #FFF;
                line-height: 9.4vw;
                border-top: 1px solid #F3F3F3;
                &_close {
                    height: px2rem(90px);
                    line-height: px2rem(90px);
                    border-right: 1px solid #F3F3F3;;
                    display: inline-block;
                    float: left;
                    width: px2rem(270px);
                    padding: px2rem(20px) auto;
                    box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    color: #666;
                    font-size: @fontsize34;
                }
                &_next {
                    height: px2rem(90px);
                    line-height: px2rem(90px);
                    display: inline-block;
                    float: right;
                    width: px2rem(270px);
                    padding: px2rem(20px) auto;
                    box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    color: #FF552E;
                    font-size: @fontsize34;
                }
            }

        }
    }
</style>

<template>
    <section class="dialogWarn" v-if=value>
        <div class="backmask">
            <div class="content">
                <div class="content_pic"></div>
                <div class="content_text">{{text}}</div>
                <div class="content_button">
                    <div @click="close" class="content_button_close">{{button}}</div>
                    <div @click="nextStep" class="content_button_next">{{next}}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

    export default {
        name: 'DialogWarn',
        props: {
            'text': {
                type: String,
                required: true
            },
            'button': {
                type: String,
                required: true
            },
            'next': {
                type: String,
                required: true
            },
            'value': {
                type: Boolean,
                required: true
            },
        },
        data() {
            return {}
        },
        computed: {},
        methods: {
            close(){
                this.$emit('input', false);
            },
            nextStep(){
                this.$emit('input', true);
                this.$emit('nextStep');
            }
        }
    }
</script>