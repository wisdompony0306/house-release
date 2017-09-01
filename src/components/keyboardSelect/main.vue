<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .keyboardBox {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        transition: all .5s;

        .mark {
            position: absolute;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            opacity: 0.5;
            z-index: 99;
        }

        .kbContainer {
            position: fixed;
            width: 100%;
            left: 0;
            bottom: 0;
            z-index: 200;
            background-color: #fff;
            transition: transform 0.3s ease;
            transform: translateY(0);
        }
        .kbMask {
            width: 100%;
            height: 100%;
            position: fixed;
            left: 0;
            top: 0;
            opacity: 0;
            transition: opacity 0.1s ease;
            background: #000;
            z-index: 199;
        }
        .kbHeader {
            width: 100%;
            height: px2rem(90px);
            display: flex;
            box-align: center;
            align-items: center;
            display: -webkit-flex;
            -webkit-box-align: center;
            -webkit-align-items: center;
            background: #f9fafc;
            border-bottom: 1px solid #E3E3E4;
            position: relative;
            overflow: hidden;

            .kbDesc {
                -webkit-box-flex: 1;
                -webkit-flex: 1;
                flex: 1;
                text-align: center;
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                line-height: px2rem(90px);
                font-size: @fontsize30;
                color: #999;
                background-color: #F9FAFC;
            }

            .kbButton {
                line-height: px2rem(90px);
                position: absolute;
                top: 0;
                right: px2rem(30px);
                font-size: @fontsize34;
                color: #FF552E;
            }
        }
        .kbContent {
            display: flex;
            align-items: center;
            display: -webkit-flex;
            -webkit-align-items: center;
            width: 100%;
            box-align: center;
            padding: 0 px2rem(60px);
            box-sizing: border-box;
            -webkit-box-sizing: border-box;

            .kbItem {
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                -webkit-box-flex: 1;
                -webkit-flex: 1;
                flex: 1;
                text-align: center;
            }
        }
    }
</style>
<template>
    <section class="keyboardBox" v-if="isShow" @touchmove="handlerMove">
        <div class="kbContainer">
            <div class="kbHeader">
                <div class="kbDesc" v-html="headTips" v-if="headTips.length>0"/>
                <div class="kbButton" @click="handlerConfirm">确定</div>
            </div>
            <div class="kbContent ">
                <div class="kbItem">
                    <DateSelect :dataSource="dataFirst" v-model="firstValue"></DateSelect>
                </div>
                <div class="kbItem">
                    <DateSelect :dataSource="dataSecond" v-model="secondValue"></DateSelect>
                </div>
                <div class="kbItem">
                    <DateSelect :dataSource="dataThird" v-model="thirdValue"></DateSelect>
                </div>
            </div>
        </div>
        <div class="mark"></div>
    </section>
</template>

<script>
    import Select from './select.vue';
    export default {
        data () {
            return {
                isShow: this.show,
                firstValue: '',
                secondValue: '',
                thirdValue: '',
                dataFirst: [],
                dataSecond: [],
                dataThird: [],
            };
        },
        props: {
            tips: {
                type: String,
                default: ''
            },
            show: {
                type: Boolean,
                required: true,
                default: false
            },
            value: {
                type: [String, Number],
                default: '',
            },
            dataSource: {
                type: Object,
                default () {
                    return {
                        items: {},
                        default: '',
                        tips: '',
                    };
                }
            }
        },
        watch: {
            show(val, old){
                this.isShow = val;
            },
            firstValue(val, old){
                if (old == '') {
                    return;
                }
                let _this = this;
                let _firstItem = _this.dataSource.items[val];
                if (Object.keys(_firstItem.items).length > 0) {
                    let _items = Object.keys(_firstItem.items).map(function (key) {
                        return _firstItem.items[key];
                    });
                    _this.dataSecond = _items;
                    _this.secondValue = '';
                    if (_this.dataSecond.length > 0) {
                        _this.secondValue = _this.dataSecond[0].value;
                    }
                }
            },
            secondValue(val, old){
                if (old == '') {
                    return;
                }
                let _this = this;
                let _secondItem = _this.dataSource.items[_this.firstValue].items[val];
                if (Object.keys(_secondItem.items).length > 0) {
                    let _items = Object.keys(_secondItem.items).map(function (key) {
                        return _secondItem.items[key];
                    });
                    _this.dataThird = _items;
                    _this.thirdValue = '';
                    if (_this.dataThird.length > 0) {
                        _this.thirdValue = _this.dataThird[0].value;
                    }
                }
            },
        },
        created() {
            this.dataSourceParse();
        },
        mounted() {
        },
        computed: {
            headTips(){
                if (this.dataSource && this.dataSource.tips) {
                    return this.dataSource.tips;
                } else {
                    return '';
                }
            }
        },
        methods: {
            dataSourceParse(){
                let _this = this;
                let _dataSourceF = [];
                let _dataSourceS = [];
                let _dataSourceT = [];

                //默认数据设置
                if (_this.dataSource.default && _this.dataSource.default.length > 0) {
                    let valueArr = _this.dataSource.default.split("-");
                    ([_this.firstValue = '', _this.secondValue = '', _this.thirdValue = ''] = valueArr);
                }
                //数据源设置
                if (Object.keys(_this.dataSource.items).length > 0) {
                    //1
                    let _items = Object.keys(_this.dataSource.items).map(function (key) {
                        return _this.dataSource.items[key];
                    });
                    _dataSourceF = _items;
                    let _firstItem = null;
                    if (_this.dataSource.items[_this.firstValue]) {
                        _firstItem = _this.dataSource.items[_this.firstValue];
                    } else {
                        _firstItem = _items[0];
                    }
                    _this.firstValue = _firstItem.value;

                    //2
                    if (Object.keys(_firstItem.items).length > 0) {
                        let _items = Object.keys(_firstItem.items).map(function (key) {
                            return _firstItem.items[key];
                        });
                        _dataSourceS = _items;
                        let _secondItem = null;
                        if (_firstItem.items[_this.secondValue]) {
                            _secondItem = _firstItem.items[_this.secondValue];
                        } else {
                            _secondItem = _items[0];
                        }
                        _this.secondValue = _secondItem.value;

                        //3
                        if (Object.keys(_secondItem.items).length > 0) {
                            let _items = Object.keys(_secondItem.items).map(function (key) {
                                return _secondItem.items[key];
                            });
                            _dataSourceT = _items;

                            let _thirdItem = null;
                            if (_secondItem.items[_this.thirdValue]) {
                                _thirdItem = _secondItem.items[_this.thirdValue];
                            } else {
                                _thirdItem = _items[0];
                            }
                            _this.thirdValue = _thirdItem.value;
                        }
                    }
                }
                let _dataSourceArr = [_dataSourceF, _dataSourceS, _dataSourceT];
                ([this.dataFirst, this.dataSecond, this.dataThird] = _dataSourceArr);
            },
            /*确定*/
            handlerConfirm(e){
                let _this = this;
                _this.isShow = false;
                let _value = [_this.firstValue, _this.secondValue, _this.thirdValue].join("-");
                this.$emit('confirm', event, _value);

            },
            /*取消*/
            handlerCancel(e){
                let _this = this;
                _this.isShow = false;
                let _value = [_this.firstValue, _this.secondValue, _this.thirdValue].join("-");
                this.$emit('cancel', event);
            },
            /*
             * 页面滚动穿透处理,阻止默认行为
             */
            handlerMove(e){
                e.preventDefault();
            }
        },
        components: {
            DateSelect: Select,
        }
    }
</script>
