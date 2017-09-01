<!--
    desc: 订单详情--房源组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .postHouse {
        width: 100%;
        min-height: px2rem(198px);
        padding: 0 px2rem(30px);
        box-sizing: border-box;
        -webkit-box-sizing: border-box;

        .phBox {
            width: 100%;
            min-height: px2rem(216px);
            border: 1px solid #F3F3F3;
            border-left: none;
            border-right: none;

            display: -webkit-flex;
            -webkit-flex-flow: row nowrap;
            -webkit-justify-content: flex-start;
            -webkit-align-items: center;

            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;

            .dhPic {
                display: block;
                width: px2rem(184px);
                height: px2rem(138px);
            }
            .dhInfo {
                width: 100%;
                height: 100%;
                padding: px2rem(30px) px2rem(20px);
                box-sizing: border-box;
                -webkit-box-sizing: border-box;

                .dhiTitle {
                    line-height: px2rem(40px);
                    font-size: @fontsize32;
                    color: #000;

                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;

                }
                .dhiDesc {
                    line-height: px2rem(40px);
                    font-size: @fontsize24;
                    color: #999;
                }
                .dhiPrice {
                    line-height: px2rem(40px);
                    margin-top: px2rem(23px);
                    padding-top: px2rem(10px);
                    font-size: @fontsize36;
                    color: #FF552E;
                    i {
                        font-size: @fontsize22;
                        font-style: normal;
                    }
                }
            }
        }

    }
</style>

<template>
    <section class="postHouse">
        <div class="phBox">
            <img class="dhPic" :src="house.pic">
            <div class="dhInfo">
                <div class="dhiTitle">{{house.title}}</div>
                <div class="dhiDesc">{{house.desc}}</div>
                <div class="dhiPrice">{{house.price}} <i>元/月</i></div>
            </div>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            dataHouse: {
                type: Object,
                default: function () {
                    return {
                        infoId: '',
                        title: '',
                        picUrl: '',
                        area: '',
                        pLocalName: '',
                        pAreaLocalName: '',
                        chaoXiang: '',
                        price: '',
                        nativeApp: '',
                        buyerPhone: '',
                    }
                }
            }
        },
        computed: {
            house(){
                let _house = this.dataHouse;
                for (let key in _house) {
                    if (_house.hasOwnProperty(key) && _house[key] == null) {
                        _house[key] = '';
                    }
                }
                let _title = _house.title;
                let _desc = `${_house.pLocalName.length > 0 ? _house.pLocalName + '-' : ''}${_house.pAreaLocalName.length > 0 ? _house.pAreaLocalName + ' ' : ''}${_house.area.length > 0 ? _house.area + '㎡ ' : ''}${_house.chaoXiang.length > 0 ? '朝' + _house.chaoXiang : ''}`;
                let _price = `${_house.price.length > 0 ? _house.price : ''}`;
                let _pic = '//img.58cdn.com.cn/n/images/list/noimg2.gif';
                if (_house.picUrl != '') {
                    _pic = _house.picUrl;
                }
                return {
                    pic: _pic,
                    title: _title,
                    desc: _desc,
                    price: _price,
                };
            }
        },
        methods: {}
    };
</script>