<!--
    包括所有的表单字段、组件
    【单元测试】保证这里的所有逻辑正确即可？
-->
<style lang="less">
    @import "../../assets/base";
    @import "./demo.less";
</style>

<template>
    <div class="postWarp">
        <FangTips message="您今天还可免费发帖<b> 3 </b>条，本月还可免费发帖<b> 5 </b>条。"/>

        <FangForm :datas="formDatas" :rules="formRules" ref="postform">
            <FangItem label="区域" separator="|">
                <FangSelect type="localAddr" v-model="formDatas.localAddr" v-on:console="print"/>
            </FangItem>
            <FangItem label="地段" separator="|" noBorderDirection="top">
                <FangInput placeholder="2-12字" v-model="formDatas.diduan" maxlength="12"/>
            </FangItem>

            <FangLine/>

            <FangItem label="面积" separator="|">
                <FangInput type="tel" v-model="formDatas.area" maxlength="7" appendText="平米"/>
            </FangItem>
            <FangItem label="转让费" separator="|" noBorderDirection="top">
                <FangInput type="tel" v-model="formDatas.zhuanrangfei" appendText="万元"/>
            </FangItem>
            <FangItem label="租金" separator="|" noBorderDirection="top" widthPercent="70%">
                <FangInput type="tel" v-model="formDatas.minPrice" maxlength="11" appendText="|" widthPercent="30%"/>
                <FangSelect type="diy" v-model="formDatas.danwei" v-on:console="print"/>
            </FangItem>

            <FangLine/>

            <FangItem label="类型" separator="|">
                <FangSelect type="diy" v-model="formDatas.ObjectType" v-on:console="print"/>
            </FangItem>

            <FangLine/>

            <FangItem label="标题" separator="|">
                <FangInput placeholder="8-28字" v-model="formDatas.Title" maxlength="28"/>
            </FangItem>
            <FangItem label="描述" separator="|" noBorderDirection="top">
                <FangSelect type="input" v-model="formDatas.Content" v-on:console="print"/>
            </FangItem>

            <FangLine/>
            <FangLine/>

            <FangItem label="联系人" separator="|">
                <FangInput placeholder="至少2字" v-model="formDatas.goblianxiren"/>
            </FangItem>
            <FangItem label="手机号" separator="|" noBorderDirection="top">
                <FangInput v-model="formDatas.Phone" maxlength="11"/>
            </FangItem>
            <FangItem label="验证码" separator="|" noBorderDirection="top">
                <FangInput/>
            </FangItem>
            <FangItem label="身份" separator="|" noBorderDirection="top">
                <FangRadio v-model="formDatas.isBiz"/>
            </FangItem>

            <FangLine/>

            <FangItem label="房屋配置" separator="|" class="no_wrap">
                <FangCheckbox v-model="formDatas.HouseAllocation"/>
            </FangItem>

            <FangItem label="描述信息" separator="|" noBorderDirection="top">
                <FangTextarea :placeholder="'10-2000字,不能填写联系方式'" v-model="formDatas.Content.text"/>
            </FangItem>

            <FangLine/>

            <FangItem label="选择小区" separator="|">
                <FangSelect type="xiaoqu" v-model="formDatas.xiaoqu" v-on:console="print"/>
            </FangItem>

            <FangItem label="M端选择" separator="|">
                <FangSelect type="xiaoqu" v-model="formDatas.xiaoqu" v-on:console="print"/>
            </FangItem>

            <FangButton @click="formSubmit">发布</FangButton>
            <FangButton @click="refresh">刷新</FangButton>

        </FangForm>
        <FangToast message=""/>
    </div>
</template>

<script>

    // 封装好的数据：
    import {setPicNum} from '../../business/appShim';

    // 组件：
    import FangTips from '../../components/common/tips.vue';
    import FangLine from '../../components/common/line.vue';
    import FangForm from '../../components/form/form.vue';
    import FangItem from '../../components/form/item.vue';
    import FangInput from '../../components/form/input.vue';
    import FangButton from '../../components/form/button.vue';
    import FangRadio from '../../components/form/radio.vue';
    import FangCheckbox from '../../components/form/checkbox.vue';
    import FangTextarea from '../../components/form/textarea.vue';
    import FangSelect from '../../components/form/select.vue';

    export default {
        data(){
            return {
                /**
                 * 所有【交互的】表单字段
                 * 提交值在computed里
                 */
                formDatas: {
                    remain         : DATA.remain, // 剩余发帖数量
                    localAddr      : DATA.localAddr, // 最终提交数据由此数据计算得出（select）
                    diduan         : DATA.diduan, // 地段 （input）
                    area           : DATA.area, // 面积（input）
                    zhuanrangfei   : DATA.zhuanrangfei, // 面积（input）
                    xiaoqu         : DATA.xiaoqu, // 小区（select）
                    minPrice       : DATA.minPrice, // 租金 [出租 转让]
                    danwei         : DATA.danwei, // 单位（select）
                    ObjectType     : DATA.ObjectType, // 类型（select）
                    Title          : DATA.Title, // 自动生成
                    Content        : DATA.Content, // 描述（textarea）
                    goblianxiren   : DATA.goblianxiren, // 联系人（input）
                    Phone          : DATA.Phone,
                    isBiz          : DATA.isBiz, // 选中的【身份】(作为提交值)
                    type           : DATA.type,           // [非交互]0:出租, 1:求租, 转让, 求购, 4:出售
                    HouseAllocation: DATA.HouseAllocation,   // 房屋类型
                },
                /**
                 * 表单校验规则
                 */
                formRules: {
                    localArea   : {
                        required: true,
                        reg     : "^[\\s\\S]+$",
                        msg     : "请填写区域"
                    },
                    localDiduan : {
                        required: true,
                        reg     : "^[\\s\\S]+$",
                        msg     : "请填写商圈"
                    },
                    diduan      : {
                        required: true,
                        reg     : "^[\\s\\S]+$#^(.){2,12}$#^([^\\s]\\s{0,6}(?!([0-9０１２３４５６７８９零一二三四五六七八九壹贰叁肆伍陆柒捌玖]{6}|\\s)))+$#^(?!.*([^0-9a-zA-Z\\u4e00-\\u9fa5]{2,})).*$",
                        msg     : "请填写地段#地段字数不足#地段不能填写电话号码#地段不能填写特殊字符"
                    },
                    area        : {
                        required: true,
                        reg     : "^[\\s\\S]+$#^[1-9]\\d{0,6}$",
                        msg     : "请填写面积#面积必须是大于0的整数"
                    },
                    minPrice    : {
                        required: true,
                        reg     : "^[\\s\\S]+$#^[1-9]\\d{0,7}(\\.\\d{1,2})?$",
                        msg     : "请填写租金#租金8位数以内，可精确至小数点后2位"
                    },
                    danwei      : {
                        required: true,
                        reg     : "^[\\s\\S]+$",
                        msg     : "请填写金额单位"
                    },
                    ObjectType  : {
                        required: true,
                        reg     : "^[\\s\\S]+$",
                        msg     : "请填写区域"
                    },
                    Title       : {
                        required: true,
                        reg     : "^[\\s\\S]++$#^(.){8,28}$#^((?!([0-9０１２３４５６７８９]{11}))\\S\\s*)+$",
                        msg     : "标题字数不足8字#标题字数不足8字#标题不能含有手机号"
                    },
                    Content     : {
                        required: true,
                        reg     : "^[\\s\\S]++$#^[\\s\\S]{10,2000}$",
                        msg     : "描述字数不足10字#描述字数不足10字"
                    },
                    goblianxiren: {
                        required: true,
                        reg     : "^[\\s\\S]+$#^(\\S){2,6}$#^[\\w\\d\\s\\u4e00-\\u9fa5]*$",
                        msg     : "请填写联系人#联系人为2-6字#联系人不能含有特殊字符"
                    },
                    Phone       : {
                        required: true,
                        reg     : "^[\\s\\S]+$#^1(3[0-9]|4[57]|5[0-35-9]|7[0-36-8]|8[0-9])\\d{8}$",
                        msg     : "请填写手机号#请输入有效手机号"
                    },
                    isBiz       : {
                        required: true,
                        reg     : "^[\\s\\S]+$",
                        msg     : "请填写身份"
                    }
                },
            }
        },
        /**
         * 页面初始化操作
         */
        mounted(){
            this.$watch('formDatas', function (newFormDatas) {
                console.log(newFormDatas);
            }, {deep: true});

            // 显示'拍个照呗'
            setPicNum.action();
        },
        methods   : {

            // 用于向textarea内打印测试数据
            print (data) {
                if (typeof data === 'string') {
                    this.formDatas.Content.text = data;
                } else {
                    this.formDatas.Content.text = JSON.stringify(data);
                }
            },

            /**
             * 表单提交
             */
            formSubmit: function () {
                console.log("将要提交的数据：", this.formDatas);

                // 提示发布成功
                WBAPP.showDialog('double', "发布成功！", "  QQ绑定有特权：\n及时沟通 快捷便利\n号码保密 保护隐私\nQQ认证 真实可靠\n \"描述信息\"里是提交字段", function (index) {
//                    WBAPP.showDialog("single", "操作结果", index + "", "", '确定');
                }, "拒绝", "去绑定");
            },

            // 刷新页面
            refresh () {
                location.reload();
            }
        },
        computed  : {

            // 最终提交的数据
            formDataToSubmit () {
                return {};
            }
        },
        /**
         * 分类组件
         */
        components: {
            FangTips,
            FangLine,
            FangForm,
            FangItem,
            FangInput,
            FangButton,
            FangRadio,
            FangCheckbox,
            FangTextarea,
            FangSelect,
        }
    };
</script>