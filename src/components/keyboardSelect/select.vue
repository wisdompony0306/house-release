<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    @height: 500px;
    @heightItem: 100px;
    @topHeight: 2 * @heightItem;

    .ksBox {
        display: block;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: px2rem(@height);

        .ksContent {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            z-index: -1;
        }
        .ksMask {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            margin: 0 auto;
            z-index: 3;
            background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6)),
            linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6));
            background-position: top, bottom;
            background-size: 100% px2rem(@topHeight);
            background-repeat: no-repeat;
        }
        .ksItem {
            height: px2rem(@heightItem);
            line-height: px2rem(@heightItem);
            font-size: @fontsize50;
            color: #000;
            text-align: center;
            &.ksSel {
                font-size: @fontsize50;
            }
        }
        .ksIndicator {
            position: absolute;
            left: 0;
            top: px2rem(@topHeight);
            width: 100%;
            height: px2rem(@heightItem);
            z-index: 3;
            background-image: linear-gradient(to bottom, #E3E3E4, #E3E3E4, transparent, transparent),
            linear-gradient(to top, #E3E3E4, #E3E3E4, transparent, transparent);
            background-position: top, bottom;
            background-size: 100% 1px;
            background-repeat: no-repeat;

        }
    }
</style>
<template>
    <div class="ksBox" @touchstart.stop.prevent="handlerStart" @touchmove.stop.prevent="handlerMove"
         @touchend.stop.prevent="handlerEnd">
        <div class="ksMask"></div>
        <div class="ksIndicator"></div>
        <div class="ksContent" :style="styleObject">
            <div class="ksItem" v-for="(item,index) in items"
                 :value="item.value" key="index">{{item.text}}
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data: function () {
            return {
                itemHeight: 100,
                itemTopNum: 2,

                styleObject: {
                    transform: 'translate(0,0)',
                },

                isMoving: false,  //是否正移动

                Y: '0',
                startY: '0',
                moveY: '0',
                endY: '0',

                startT: 0, //开始时间
                endT: 0, //结束时间
                diffT: 0,//endT-startT

                max: 100 * 2,
                min: '',

                timeOut: null,
                d: 0,//初始位置

                itemNum: '', //有多少个item项数量

                currentValue: this.value,//当前位置的日期
            }
        },
        props: {
            dataSource: {
                type: Array,
                default: []
            },
            value: {
                type: [Number, String],
                default: '',
            },
        },
        methods: {
            handlerStart: function (e) {
                let _this = this;
                if (_this.isMoving) {
                    return false
                }
                _this.startY = e.changedTouches[0].clientY;
                _this.startT = e.timeStamp
            },
            handlerMove: function (e) {
                let _this = this;
                let _Y = 0;
                _this.min = ((_this.itemTopNum + 1) - _this.itemNum) * _this.itemHeight;
                _this.moveY = e.changedTouches[0].clientY - _this.startY;
                _Y = parseInt(_this.moveY) + parseInt(_this.Y);

                if (_Y > _this.max) {
                    _Y = _this.max;
                }
                if (_Y < 0 && _Y <= _this.min) {
                    _Y = _this.min
                }
                _this.styleObject.transition = "all 0s";
                _this.styleObject.transform = "translate(0," + _this.$util.px2rem(_Y) + ")";
            },
            handlerEnd: function (e) {
                let _this = this, _moveT = 0.3;
                _this.endT = e.timeStamp;
                _this.diffT = _this.endT - _this.startT;
                _this.Y = parseInt(_this.moveY) + parseInt(_this.Y);
                _this.Y -= _this.itemHeight / 2; //是为了改变每个item位置的区间,让数字在中间的时候光标会选择这个数字
                _this.d = Math.ceil(_this.Y / _this.itemHeight);//向上上取整

                if (_this.d >= _this.itemTopNum) {
                    _this.d = _this.itemTopNum;
                } else if (_this.d <= ((_this.itemTopNum + 1) - _this.itemNum)) {
                    _this.d = (_this.itemTopNum + 1) - _this.itemNum;
                }
                _this.Y = _this.d * _this.itemHeight;
                _this.styleObject.transform = "translate(0," + _this.$util.px2rem(_this.Y) + ")";
                _this.styleObject.transition = "all " + _moveT + "s linear";


                _this.isMoving = true;
                _this.timeOut = setTimeout(function () {
                    _this.isMoving = false
                }, _moveT);

                let _index = Math.abs((_this.Y - _this.itemHeight * _this.itemTopNum) / _this.itemHeight);
                _this.currentValue = _this.dataSource[_index].value;
                this.$emit('input', _this.currentValue);//必须触发此事件v-model才生效
            },
        },
        computed: {
            items(){
                let _this = this;
                let _items = _this.dataSource;
                let _length = _items.length, _index = 0;
                let _value = '';
                for (let i = 0; i < _length; i++) {
                    let _item = _items[i];
                    if (_item.value == _this.currentValue) {
                        _index = i;
                        _value = _item.value;
                        break;
                    }
                }
                if (_value == '') {
                    _value = _items[_index].value;
                }
                _this.currentValue = _value;

                let _Y = _this.itemHeight * (_this.itemTopNum - _index);
                _this.styleObject.transition = "all .5s";
                _this.styleObject.transform = "translate(0," + _this.$util.px2rem(_Y) + ")";
                _this.itemNum = _length;
                _this.$emit('input', _this.currentValue);//必须触发此事件v-model才生效
                return _items;
            },
        },
    }
</script>
