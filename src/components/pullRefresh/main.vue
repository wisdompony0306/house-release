<!--
    desc: 下拉刷新组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    @height50: px2rem(50px);
    .test {
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 10;
    }

    .pullRefresh {
        width: 100vw;
        min-height: 100vh;
        overflow-y: auto;
        transition: 330ms;
        -webkit-overflow-scrolling: touch;
        .prBox {
            position: relative;
            width: 100%;

            .prMessage {
                position: absolute;
                bottom: 0;
                width: 100%;
                margin: 0 auto;
                height: @height50;
                line-height: @height50;
                font-size: @fontsize24;
                text-align: center;
                color: #9B9B9B;
            }
        }
    }
</style>

<template>
    <div class="pullRefresh" id="pullRefresh" ref="container" @touchstart="handleStart" @touchmove="handleMove"
         @touchend="handleEnd">
        <div class="prBox" :style="{height: pullHeight}">
            <div class="prMessage">{{message}}</div>
        </div>
        <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                message: '',
                flag: false, //表示是否达到刷新条件
                loading: false, //表示是否正在刷新中
                startY: 0, //手指触摸屏幕的起点
                distance: 0, //手指滑动的距离
                minDistance: 55, //最小距离
                pullHeight: '0',//下拉高度
            }
        },
        props: {
            next: { // 刷新函数
                type: Function,
                required: true
            }
        },
        methods: {
            handleStart(e){
                let _this = this;
                _this.distance = 0;
                _this.flag = false;

                if (_this.loading) {
                    return false;
                }
                _this.startY = e.touches[0].pageY;
            },
            handleMove(e){
                let _this = this;
                if (_this.loading) {
                    return false;
                }
                let scrollHeight = window.scrollY;
                let startY = _this.startY;
                let moveY = e.touches[0].pageY;

                _this.distance = moveY - startY;
                _this.flag = false;

                if (scrollHeight <= 0 && _this.distance > 10) {
                    e.preventDefault();
                    if (_this.distance < _this.minDistance) {
                        _this.message = '下拉刷新';
                    } else {
                        _this.flag = true;
                        _this.message = '释放刷新';
                    }
                    _this.pullHeight = _this.$util.px2rem(_this.distance);
                } else {
                    _this.pullHeight = _this.$util.px2rem(0);
                }
            },
            handleEnd(e){
                let _this = this;
                _this.message = '';
                _this.pullHeight = _this.$util.px2rem(0);

                if (_this.loading) {
                    return false;
                }

                if (_this.flag) {
                    _this.loading = true;
                    _this.next().then(() => {
                        _this.loading = false;
                    });
                } else {
                    _this.loading = false;
                }
            },
        },
    }
</script>