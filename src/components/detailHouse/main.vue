<!--
    desc: 订单详情--房源组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .detailHouse {
        width: 100%;
        min-height: px2rem(184px);
        padding: 0 px2rem(30px);
        box-sizing: border-box;
        -webkit-box-sizing: border-box;

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
            width: px2rem(140px);
            height: px2rem(105px);
            object-fit: cover;
        }
        .dhInfo {
            height: 100%;
            width: px2rem(570px);
            padding: px2rem(30px) 0 px2rem(30px) px2rem(20px);
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            line-height: px2rem(40px);
            .dhiTitle {
                font-size: @fontsize24;
                color: #000;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 80%;
            }
            .dhiDesc {
                font-size: @fontsize22;
                color: #999;
            }
            .dhiPrice {
                font-size: @fontsize24;
                color: #000;
            }
        }
    }
</style>

<template>
    <section class="detailHouse" @click="handlerHouseDetail">
        <img class="dhPic" :src="house.pic | picDefault">
        <div class="dhInfo">
            <div class="dhiTitle">{{house.title}}</div>
            <div class="dhiDesc">{{house.desc}}</div>
            <div class="dhiPrice">{{house.price}}</div>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
    import DataHouse from '../../datas/dataHouse';

    /*房源默认图片*/
    const PIC_HOUSE_DEFAULT = '//img.58cdn.com.cn/n/images/list/noimg2.gif';

    export default {
        props: {
            dataHouse: {
                type: Object,
                default: function () {
                    return DataHouse;
                }
            }
        },
        computed: {
            house(){
                let _house = Object.assign({}, DataHouse, this.dataHouse);
                for (let key in _house) {
                    if (_house.hasOwnProperty(key) && _house[key] == null) {
                        _house[key] = '';
                    }
                }
                let _title = _house.title;
                let _desc = `${_house.pLocalName.length > 0 ? _house.pLocalName + '-' : ''}${_house.pAreaLocalName.length > 0 ? _house.pAreaLocalName + ' ' : ''}${_house.area.length > 0 ? _house.area + '㎡ ' : ''}${_house.chaoXiang.length > 0 ? '朝' + _house.chaoXiang : ''}`;
                let _price = `${_house.price.length > 0 ? _house.price + ' 元/月' : ''}`;
                return {
                    pic: _house.picUrl,
                    title: _title,
                    desc: _desc,
                    price: _price,
                };
            }
        },
        filters: {
            picDefault(value) {
                if (value == '') {
                    return PIC_HOUSE_DEFAULT;
                } else {
                    return value;
                }

            }
        },
        methods: {
            /*
             * 调native接口跳到信息详情页
             * nativeApp表示native载体json
             * loadPage表示native跳h5的链接json
             */
            handlerHouseDetail(){
                this.$emit('clickInfo', event);
                let _house = this.dataHouse;
                if (_house.nativeApp) {
                    this.$app.nativeBridge(JSON.parse(_house.nativeApp));
                }
            }
        }
    };
</script>