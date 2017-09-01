<!--
    desc: 订单详情--房东信息组件
-->
<style rel="stylesheet/less" lang="less">
    @import "../../asset/const";

    .detailPerson {
        width: 100%;
        height: px2rem(172px);
        background: #FFFFFF;

        display: -webkit-flex;
        -webkit-flex-flow: row nowrap;
        -webkit-justify-content: space-between;
        -webkit-align-items: center;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;

        position: relative;
        border: none;
        &::after {
            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
            border-bottom: 1px solid #E8E8E8;
            width: 100%;
            content: ' '
        }

        .dpInfoBox {
            padding-left: px2rem(30px);
            .dpPic {
                float: left;
                display: block;
                width: px2rem(110px);
                height: px2rem(110px);
                -webkit-border-radius: 50%;
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: auto;
                    height: 100%;
                }
            }
            .dpInfo {
                float: left;
                padding-left: px2rem(20px);
                height: px2rem(110px);
                overflow: hidden;
                .dpName {
                    width: px2rem(200px);
                    overflow: hidden;
                    margin: px2rem(8px) 0;
                    color: #000;
                    font-size: @fontsize36;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .dpLevel {
                    font-size: @fontsize24;
                    color: #666;
                }
            }
        }

        .dpContactBox {
            display: -webkit-flex;
            -webkit-flex-flow: row nowrap;
            -webkit-justify-content: flex-start;
            -webkit-align-items: center;

            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            .dpContact {
                display: block;
                width: px2rem(145px);
                height: px2rem(120px);
                font-size: @fontsize22;
                color: #666;
                text-align: center;
                .dpcIcon {
                    display: block;
                    margin: px2rem(20px) auto px2rem(10px);
                    width: 100%;
                    height: px2rem(50px);
                    &.chat {
                        background: data-uri('./images/detailPerson_chat.png') center no-repeat;
                        background-size: px2rem(47px) px2rem(49px);

                    }
                    &.tel {
                        background: data-uri('./images/detailPerson_tel.png') center no-repeat;
                        background-size: px2rem(46px) px2rem(46px);
                    }
                }
                .dpcText {
                    width: 100%;
                    text-align: center;
                }
            }
        }
    }

    @media (-webkit-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5) {
        .detailPerson {
            &::after {
                -webkit-transform: scaleY(0.7);
                transform: scaleY(0.7);
            }
        }
    }

    @media (-webkit-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
        .detailPerson {
            &::after {
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
            }
        }
    }

    @media (-webkit-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
        .detailPerson {
            &::after {
                -webkit-transform: scaleY(0.33);
                transform: scaleY(0.33);
            }
        }
    }

</style>

<template>
    <section class="detailPerson">
        <div class="dpInfoBox">
            <div class="dpPic">
                <img :src="user.pic" @click="handlerUserDetail">
            </div>
            <div class="dpInfo">
                <div class="dpName">{{user.name}}</div>
                <div class="dpLevel">{{user.roleName}}</div>
            </div>
        </div>
        <ul class="dpContactBox">
            <li class="dpContact">
                <a class="dpcIcon" :class="[contacts.chat.class]" @click="handlerChat"></a>
                <div class="dpcText">{{contacts.chat.text}}</div>
            </li>
            <li class="dpContact" v-if="user.phone.length>0">
                <a class="dpcIcon" :class="[contacts.tel.class]" :href='user.phone | telFilter' @click="handlerTel"></a>
                <div class="dpcText">{{contacts.tel.text}}</div>
            </li>
        </ul>
    </section>
</template>

<script type="text/ecmascript-6">
    import API from '../../service/api';
    import DataPerson from '../../datas/dataPerson';

    /*用户默认头像*/
    const PIC_USER_DEFAULT = '//img.58cdn.com.cn/olympia/img/house/detail/renzheng_manHead.png?platform=app';

    export default {
        data() {
            return {
                contacts: {
                    /*微聊*/
                    chat: {
                        text: '微聊',
                        class: 'chat',
                    },
                    /*电话*/
                    tel: {
                        text: '电话',
                        class: 'tel',
                    },

                }
            }
        },
        props: {
            dataUser: {
                type: Object,
                default: function () {
                    return DataPerson;
                }
            }
        },
        filters: {
            telFilter(value) {
                if (value != '') {
                    return 'tel:' + value;
                }
                return "";
            }
        },
        computed: {
            user(){
                let _this = this;
                let _user = Object.assign({}, DataPerson, this.dataUser);
                let _roleName = '';
                switch (+_user.role) {
                    case 1:
                        _roleName = '租客';
                        break;
                    case 2:
                        _roleName = '房东';
                        break;
                    default:
                        break;
                }
                if (_user.pic == null || _user.pic == '') {
                    _user.pic = PIC_USER_DEFAULT;
                }

                Object.assign(_user, {roleName: _roleName});
                return _user;
            }
        },
        methods: {
            /*进入房东资料页*/
            handlerUserDetail(event){
                this.$emit('clickUser', event);
                let _this = this;
                let _url = window.location.protocol + API.userDetail.url + '?platform=app&id=' + _this.user.userid;
                this.$app.loadPage('link', _url, '', 0, 0, 0);
            },
            /*调起微聊*/
            handlerChat(event){
                this.$emit('clickChat', event);
                let _user = this.user;
                this.$app.im(_user.userid, _user.name, '', '', _user.infoId);
            },
            /*调起电话*/
            handlerTel(event){
                this.$emit('clickTel', event);
            },
        }
    };
</script>