<!--
    desc: 房产(1)-厂房/仓库/土地/车位(15)
-->
<style lang="less">
    @import './fangchan.less';
</style>

<template>
    <div class="postWarp" id="postWarp" @touchmove="handleFormTouchmove">
        <FangTips :message="formState.tipsMessage"/>

        <FangForm ref="postForm">
            <FangItem label="区域" separator="|" hasUIActions :disabled="!formDatas.canEditLocal">
                <FangSelect
                        type="localAddr"
                        v-model="formDatas.localAddr"
                        :rules="formRules.localAddr"
                        :disabled="!formDatas.canEditLocal"
                />
            </FangItem>

            <FangItem label="地段" separator="|" noBorderDirection="top" v-if="pageData.showDiduan">
                <FangInput type="text" v-model="formDatas.diduan" name="diduan" :maxlength="12"
                           :rules="formRules.diduan" placeholder="2-12字"/>
            </FangItem>

            <FangLine/>

            <FangItem label="面积" separator="|">
                <FangInput type="tel" v-model="formDatas.area" name="area" :maxlength="7" :rules="formRules.area"
                           appendText="平米"/>
            </FangItem>

            <FangItem label="转让费" separator="|" noBorderDirection="top" v-if="pageData.showZhuangrangfei">
                <FangInput type="number" v-model="formDatas.zhuanrangfei" name="zhuanrangfei" :maxlength="7"
                           :rules="formRules.zhuanrangfei"
                           appendText="万元"/>
            </FangItem>

            <FangItem :label="pageData.priceLabel" separator="|" noBorderDirection="top" widthPercent="70%">
                <FangInput type="tel" v-model="formDatas.minPrice" name="minPrice" :maxlength="11"
                           :rules="formRules.minPrice" :appendText="pageData.priceDanwei" widthPercent="30%"/>
                <FangSelect
                        type="diy"
                        v-model="formDatas.danwei"
                        hasUIActions
                        v-if="pageData.showDanwei"
                        :rules="formRules.danwei"
                />
            </FangItem>

            <FangLine/>

            <FangItem label="类型" separator="|" hasUIActions>
                <FangSelect type="diy" v-model="formDatas.ObjectType"/>
            </FangItem>

            <FangLine/>

            <FangItem label="标题" separator="|">
                <FangInput type="text" v-model="formDatas.Title" name="Title" :maxlength="30" :rules="formRules.Title"
                           placeholder="8-28个字" v-on:focus="fillTitle"/>
            </FangItem>

            <FangItem label="描述" separator="|" noBorderDirection="top" hasUIActions>
                <FangSelect
                        type="input"
                        v-model="formDatas.Content"
                        :rules="formRules.Content"
                />
            </FangItem>

            <FangLine/>
            <FangLine/>

            <FangItem label="联系人" separator="|">
                <FangInput type="text" v-model="formDatas.goblianxiren" name="goblianxiren"
                           :rules="formRules.goblianxiren" placeholder="至少2字"/>
            </FangItem>
            <FangItem label="手机号" separator="|" noBorderDirection="top">
                <FangInput
                        type="tel"
                        v-model="formDatas.Phone"
                        name="Phone"
                        :maxlength="11"
                        :rules="formRules.Phone"
                        @blur="validatePhoneNum"
                />
                <FangItemError v-if="formState.phoneError.show" slot="after">{{ formState.phoneError.msg }}
                </FangItemError>
            </FangItem>

            <FangItem v-if="formState.yzm.show" label="验证码" separator="|" noBorderDirection="top">
                <FangInput type="tel" v-model="formDatas.captcha_input" @blur="validateCaptcha"/>
                <FangButtonCaptcha @click.native="handleCaptchaClick" :disable="formState.yzm.disable">{{
                    formState.yzm.btnHtml }}
                </FangButtonCaptcha>
                <FangItemError v-if="formState.yzm.error.show" slot="after">{{ formState.yzm.error.msg }}
                </FangItemError>
            </FangItem>

            <FangItem label="身份" separator="|" noBorderDirection="top">
                <FangRadio
                        v-model="formDatas.isBiz"
                        :disabled="formState.isBizDisabled"
                        :rules="formRules.isBiz"
                />
            </FangItem>

            <FangButton @click="formSubmit" :disabled="formState.submitButtonDisabled">发布</FangButton>

        </FangForm>
    </div>
</template>

<script>
    import FangActions from "../../config/fangActions"; // 静态事件名
    import { webLog, showMsg } from '../../business/appShim'; // hybrid/M封装的功能
    import PageInitData from '../../service/pageInitData'; // 页面初始化数据

    // 引入【业务功能函数】
    import autoFillTitle from '../../business/autoFillTitle'; // 自动填充title
    import validatePhoneNum from '../../business/validatePhoneNum'; // 电话号码的【同步、异步】校验
    import sendCaptcha from '../../business/sendCaptcha';
    import validateCaptcha from '../../business/validateCaptcha';
    import formSubmit from '../../business/formSubmit';
    import getVueData from '../../business/getVueData';
    import initForm from '../../business/initForm';

    // 表单组件
    import EventHub from "../../components/form/eventHub";
    import FangTips from '../../components/common/tips.vue';
    import FangLine from '../../components/common/line.vue';
    import FangForm from '../../components/form/form.vue';
    import FangItem from '../../components/form/item.vue';
    import FangInput from '../../components/form/input.vue';
    import FangButton from '../../components/form/button.vue';
    import FangButtonCaptcha from '../../components/form/buttonCaptcha.vue';
    import FangItemError from '../../components/form/itemErrorTip.vue';
    import FangRadio from '../../components/form/radio.vue';
    import FangSingleRadio from '../../components/form/singleRadio.vue';
    import FangSelect from '../../components/form/select.vue'; // 封装了native功能，包括：选择区域、选择小区、选择自定义选项、带语音的textarea

    export default {
        data: () => getVueData(),
        created () {
            // 注册全局事件：去掉表单元素的hover状态
            EventHub.$on(FangActions.TOUCHMOVE, (ref) => {
                this.touchmovedRefs.push(ref);
            });

            // 埋点
            webLog.action({
                actiontype: 'starttime',
                params: [PageInitData.secondCate.dispid, "", (new Date()).getTime() + ""],
            });
        },

        // 页面初始化操作
        mounted () {
            // 注册全局事件：弹出表单填写错误的提示
            EventHub.$on(FangActions.TOAST_MESSAGET, (msg) => {
                showMsg.action({
                    code: '1', // code="1" 表单输入的错误提示
                    msg,
                    cateid: PageInitData.secondCate.dispid
                });
            });

            // 注册全局事件：可在任意模块提交表单
            EventHub.$on(FangActions.SUBMIT, () => {
                this.formSubmit();
            });

            // 注册全局事件：用于打印信息到Content里
            EventHub.$on('print', (data) => {
                // this.print(data);
            });

            // 初始化表单
            initForm();

            console.log('PageInitData', PageInitData);
        },
        methods: {
            formSubmit () {
                formSubmit({
                    formRef: this.$refs["postForm"],
                });
            },

            validatePhoneNum () {
                validatePhoneNum()
                    .catch((error) => {
                        console.log(error);
                    });
            },

            // 校验输入的验证码
            validateCaptcha () {
                validateCaptcha()
                    .catch((error) => {
                        console.log(error);
                    });
            },

            // 发送验证码
            handleCaptchaClick () {
                sendCaptcha();
            },

            // 自动填充title
            fillTitle () {
                autoFillTitle();
            },

            // form@touchmove时去除所有表单内的hover状态
            handleFormTouchmove () {
                this.touchmovedRefs.forEach(ref => ref.handleTouchend());
            },

            // 用于测试：把测试数据打印到Content里（用法：EventHub.$emit('print', data)）
            print (data) {
                if (typeof data === 'string') {
                    this.formDatas.Content.text = data;
                } else {
                    this.formDatas.Content.text = JSON.stringify(data);
                }
            },
        },
        components: {
            FangTips,
            FangLine,
            FangForm,
            FangItem,
            FangInput,
            FangButton,
            FangButtonCaptcha,
            FangRadio,
            FangSingleRadio,
            FangSelect,
            FangItemError,
        }
    };
</script>