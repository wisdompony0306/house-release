import api from '../service/api';
import PageInitData from '../service/pageInitData';
import { formRules, pageTypeConfig } from '../config/business';

/**
 * 返回相应类别的vue-data
 * 原则：
 * > 后端传入的数据从【PageInitData】中获取（一般是一些选项），如localAddr、danwei、isBiz等
 * > 无初始值的数据传空字符串'',（一般是input），如diduan、Title等
 * > Content字段原来是js动态拼接的，没有模版数据。现在放在业务里写死即可
 */
const dataCatch = {}; // 缓存
const dataFactory = {
    // 【厂房】的vue-data
    changfang () {
        let result = dataCatch.changfang;
        if (!result) {
            result = {
                formDatas: {
                    localAddr: PageInitData.localAddr, // 对【localArea、localDiduan】的包装
                    diduan: '', // 手动填写的地段
                    area: '', // 面积
                    zhuanrangfei: '', // 装修费
                    minPrice: '', // 租金
                    danwei: PageInitData.dataSrc.danwei, // 租金的单位
                    ObjectType: PageInitData.dataSrc.ObjectType, // 类型
                    Title: '', // 标题
                    // 老代码中数据以 [html或attr]形式填入模版
                    Content: {
                        title: '描述', // 显示在顶部的title，原html
                        tip: '10字以上', // placeholder，原 attr['tip']
                        minlength: 10, // 用于报错提示：'字数不能小于{x}',原 [hidden]attr['minlength']
                        text: '', // 输入的内容
                        msg: '尽情说出您的房源优势吧', // 语音输入时话筒上的提示，原 attr['msg']
                    },
                    goblianxiren: '', // 联系人
                    Phone: '', // 手机号
                    yzm: '', // 接口返回的验证码
                    isBiz: PageInitData.dataSrc.isBiz, // 身份：个人／中介
                    type: PageInitData.dataSrc.type,
                    Pic: '', // 提交时由native返回的值计算出来，判断返回的图片url是不是手机实时拍摄的
                    gobquzhi: '', // 提交时动态拼接的字符串
                    formatsource: PageInitData.initData.formatsourse, // 页面来源
                    headerData: PageInitData.initData.headerData,
                    shoujishipai: PageInitData.initData.shoujishipai,
                    hidPostParam: PageInitData.initData.hidPostParam,
                    captcha_input: '', // 用户输入的验证码 === yzm
                    captcha_type: '', // 获取验证码成功时填入
                    post_captcha_biz: '', // 校验验证码时设置，取值如写死的：'phoneVerify'
                    xxzl_cp: '', // // 获取验证码成功时填入
                    captcha_responseid: '', // // 获取验证码成功时填入 === xxzl_cp
                    canEditLocal: PageInitData.initData.canEditLocal,
                },

                // 表单校验规则
                formRules,

                // 存放【表单状态】
                formState: {
                    // vue闪烁的提示信息
                    toastMessage: '',

                    // 页面提示信息
                    tipsMessage: PageInitData.extData.pageTips,

                    // 表单提交按钮是否可点击
                    submitButtonDisabled: false,

                    // 手机号的状态：错误显隐、错误信息
                    phoneError: {
                        show: false, // 是否显示手机号错误节点
                        msg: '', // 手机号的错误提示
                    },

                    // 验证码状态：显隐、报错、倒计时
                    yzm: {
                        disable: false, // true: ajaxing || counting
                        show: false, // 是否显示验证码item
                        ajaxing: false, // 正在发送验证码
                        counting: false, // 正在倒计时

                        // 报错信息
                        error: {
                            show: false, // 是否显示验证码错误提示节点
                            msg: '',
                        },
                        btnHtml: '发送验证码',
                        msg_encryptedKey: '',   // 校验手机号时从接口获取，用于发送验证码
                        voice_encryptedKey: '', // 校验手机号时从接口获取，用于发送语音验证码？
                    },

                    // 表单提交url。放到这是因为url会根据图片上传进行参数的添加删除且【编辑】需要走自己的接口
                    submitPostUrl: api.postSubmit,

                    // 是否禁用身份切换:
                    isBizDisabled: typeof PageInitData.extData.isBizDisable !== 'undefined' ? Boolean(+PageInitData.extData.isBizDisable) : false,
                },

                // 页面子类别的配置
                pageData: pageTypeConfig[PageInitData.currentType.value] || pageTypeConfig[0],

                // touchmove时需要去除hover状态的ref（android下元素节点touchmove有时不会触发）
                touchmovedRefs: [],
            };
            dataCatch.changfang = result;
        }
        return result;
    },
};

export default function () {

    // todo 把不要把所有类别都打包
    return dataFactory[process.env.cate]();
}
