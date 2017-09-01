<!--
    desc: 订单详情--状态组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .detailState {
        position: relative;
        width: 100%;
        height: px2rem(520px);
        overflow: hidden;
        color: #fff;
        .dsTitle {
            width: 100%;
            margin: px2rem(98px) 0 0 px2rem(78px);
            font-size: @fontsize60;
            line-height: px2rem(84px);
            display: -webkit-flex;
            -webkit-align-items: center;
            display: flex;
            align-items: center;
            &:before {
                content: "";
                display: inline-block;
                width: px2rem(50px);
                height: px2rem(50px);
                margin: 0 px2rem(12px) 0 0;
            }
        }
        .dsDesc {
            position: absolute;
            top: px2rem(315px);
            left: 0;
            width: 100%;
            padding: 0 px2rem(80px);
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            font-size: @fontsize28;
            em {
                font-weight: bold;
            }
        }
        .dsSpline {
            position: absolute;
            top: px2rem(278px);
            left: px2rem(80px);
            width: px2rem(240px);
            height: 1px;
            background: #fff;
        }
        /*等待(进行态) */
        &.wait {
            background: #F1A82A;
            .dsTitle:before {
                width: px2rem(50px);
                height: px2rem(50px);
                background: data-uri("./images/detailState_wait.png") no-repeat;
                background-size: cover;
            }
        }

        /*退款(进行态)*/
        &.refund {
            background: #F1A82A;
            .dsTitle:before {
                width: px2rem(56px);
                height: px2rem(52px);
                background: data-uri("./images/detailState_refund.png") no-repeat;
                background-size: cover;
            }
        }
        /*仲裁(进行态)*/
        &.arbitration {
            background: #F1A82A;
            .dsTitle:before {
                width: px2rem(51px);
                height: px2rem(51px);
                background: data-uri("./images/detailState_arbitration.png") no-repeat;
                background-size: cover;
            }
        }
        /*完成(完成态)*/
        &.complete {
            background: #2FB033;
            .dsTitle:before {
                width: px2rem(50px);
                height: px2rem(50px);
                background: data-uri("./images/detailState_complete.png") no-repeat;
                background-size: cover;
            }

        }
        /*拒绝退款(完成态)*/
        &.rejectRefund {
            background: #FF7758;
            .dsTitle:before {
                width: px2rem(56px);
                height: px2rem(52px);
                background: data-uri("./images/detailState_refund.png") no-repeat;
                background-size: cover;
            }
        }
        /*关闭(完成态)*/
        &.close {
            background: #A0AAAD;
            .dsTitle:before {
                width: px2rem(50px);
                height: px2rem(50px);
                background: data-uri("./images/detailState_close.png") no-repeat;
                background-size: cover;
            }
        }
    }
</style>

<template>
    <section class="detailState" :class="[state.class]">
        <div class="dsTitle" v-html="state.title"></div>
        <div class="dsSpline"></div>
        <div class="dsDesc" v-html="state.desc"></div>
    </section>
</template>

<script type="text/ecmascript-6">
    import DataState from '../../datas/dataState';
    import StatusEnum from './statusEnum';

    export default {
        data() {
            return {
                statusEnum: StatusEnum,
            }
        },
        props: {
            dataState: {
                type: Object,
                default: function () {
                    return DataState;
                }
            }
        },
        /*
         * 没有直接替换属性dataState的值,方便定位数据
         */
        computed: {
            state(){
                let _this = this;
                let _state = Object.assign({}, DataState, _this.dataState);
                let _title = _state.statusDes;
                let _desc = _state.statusAct;
                let _class = '';

                let _status = _state.status;
                let _stateConfig = _this.statusEnum[_status];
                if (_stateConfig) {
                    _class = _stateConfig.class;
                    if (_stateConfig.dataTime && _state[_stateConfig.dataTime]) {
                        let [_dateTimeStart, _dateTimeEnd] = [_state.nowTime, _state[_stateConfig.dataTime]];
                        let _time = _this.timeCountDownFormat(_dateTimeStart, _dateTimeEnd);//时间倒计时
                        _desc = _desc.replace("#time#", _time);
                    }
                }
                return {
                    title: _title,
                    desc: _desc,
                    class: _class,
                };
            },
        },
        methods: {
            timeCountDownFormat(startDateStr, endDateStr){
                let _this = this;
                //校验
                if (!(startDateStr && typeof startDateStr === 'string' && endDateStr && typeof endDateStr === 'string')) {
                    return;
                }
                let [_milliscond, _oneMinuteSecond, _oneHourSecond, _oneDaySecond] = [1000, 60, 60 * 60, 24 * 60 * 60];
                let _startDate = new Date(startDateStr.replace(/-/g, "/"));
                let _endDate = new Date(endDateStr.replace(/-/g, "/"));
                let _totalSecond = Math.floor((_endDate.getTime() - _startDate.getTime()) / _milliscond);

                if (_totalSecond >= 0) {
                    let days = Math.floor(_totalSecond / _oneDaySecond);
                    let hours = Math.floor((_totalSecond - days * _oneDaySecond) / _oneHourSecond);
                    let minutes = Math.floor((_totalSecond - days * _oneDaySecond - hours * _oneHourSecond) / _oneMinuteSecond);
                    let seconds = Math.floor(_totalSecond - days * _oneDaySecond - hours * _oneHourSecond - minutes * _oneMinuteSecond);

                    let _dateFormat = '';
                    if (_totalSecond >= _oneDaySecond) {
                        _dateFormat = `<em>[ ${days}天${hours}小时${minutes}分钟 ]</em>`;
                    } else if (_totalSecond >= _oneHourSecond) {
                        _dateFormat = `<em>[ ${hours}小时${minutes}分钟 ]</em>`;
                    } else if (_totalSecond >= _oneMinuteSecond) {
                        _dateFormat = `<em>[ ${minutes}分钟 ]</em>`;
                    } else {
                        _dateFormat = `<em>[ ${seconds}秒 ]</em>`;
                    }
                    return _dateFormat;
                } else {
                    return '';
                }
            },
        }
    };
</script>