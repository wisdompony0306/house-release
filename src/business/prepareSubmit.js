/* eslint-disable camelcase */

import { performSubmit, AppOS, androidHeaderData, phoneNumber, showMsg, AppVersion, draft, webLog } from './appShim';
import Util from './util';
import request from './request';
import getFormSubmitData from './getFormSubmitData';
import { IQASCaptcha } from './captcha';
import { codeFun, code2Fun, code6Fun, showErrorFun, preventDialog } from './submit'; // 表单提交结果封装
import PageInitData from '../service/pageInitData';
import hand4wk from './hand4wk';
import getVueData from './getVueData';
import api from '../service/api';
import getInfoId from './getInfoId';

const { formDatas, formState } = getVueData();

/**
 * 业务逻辑：
 * 提交表单数据（执行发布操作），并注册提交后的回调
 * todo:
 * 加上发布成功的提示
 */
function submit (timeout = 30000) {
    formState.submitButtonDisabled = true;
    console.log('>> 正在提交表单');
    request.post({
        url: formState.submitPostUrl,
        timeout,
        data: getFormSubmitData(),

        // state: 发送请求成功true，网络错误或超时false
        // data: 请求成功发送后服务器传回的结果
        callback: (state, data) => {
            console.log('data:', data);
            if (state) {
                if (+data.fb_validate_type === 1) {
                    IQASCaptcha(data.cptrkey, {
                        phoneValue: formDatas.Phone,
                        _post: {
                            send: (captcha_input, captcha_type) => {
                                formDatas.captcha_input = captcha_input;
                                formDatas.captcha_type = captcha_type;
                                submit();
                            },
                        },
                    });
                } else if (+data.highrisk_need_check === 1) {
                    IQASCaptcha(data.cptrkey, {
                        highrisk: data.highrisk,
                        phoneValue: formDatas.Phone,
                        _post: {

                            // 跟上面的send一样
                            send: (captcha_input, captcha_type) => {
                                formDatas.captcha_input = captcha_input;
                                formDatas.captcha_type = captcha_type;
                                submit();
                            },
                        },
                    });
                } else if (+data.code === 2) { // 提示经纪人不能发帖
                    code2Fun(data);
                } else if (+data.code === 5) { // 电话需要校验
                    hand4wk(data);
                } else if (data.code && +data.code === 6) { // 去支付
                    code6Fun(data, formDatas);
                    preventDialog();
                } else if ( // 需要营业执照认证
                    +data.fb_validate_type !== 1 && +data.highrisk_need_check !== 1
                ) {
                    codeFun(data, formDatas);
                } else {
                    showErrorFun(data);
                }
            } else {
                // 提示提交错误：
                // todo 提示信息统一配置
                const appVersion = '4.9.1';
                let msg = '网络发生异常!是否重试?';
                if (Util.isAppVersionEgt(AppVersion, appVersion)) {
                    if (PageInitData.initData.operate !== 'edit') {
                        draft.save();
                    }
                    if (PageInitData.initData.operate !== 'draft') {
                        msg = '网络异常,信息已存为草稿,是否重试?';
                    }
                }
                showMsg.action({
                    // code="4" 网络错误 弹出框 可以让用户自主选择重试 有两个按钮“确定”以及取消
                    code: '4',
                    msg,
                });
                webLog.action({
                    actiontype: 'linkalert',
                    params: [`${PageInitData.firstCate.dispid},${PageInitData.secondCate.dispid}`],
                });
            }

            // 成功／失败都再次开启提交按钮
            formState.submitButtonDisabled = false;
        },
    });
}

/**
 * 提交表单之前需要做的处理：
 * 设置好回调：performSubmit.setCallback
 * 通知app调用上述回调，同时传入picUrl
 *   picUrl的格式（用|分割图片地址）:
 *   /mobile/big/n_v1lfjsldfjald.jpg|/mobile/big/n_v1lfjsldfjalsd.jpg|isrealtime=false|fromuserpic=1
 * 在回调里提交表单：submit
 */
export default function () {
    console.log('>> 设置提交表单后的回调');

    // 注册 window.$.publish.performPublish 方法
    performSubmit.setCallback((picUrl) => {
        // edit走自己的编辑接口
        if (PageInitData.isEdit) {
            const infoId = getInfoId();
            formState.submitPostUrl = api.editSubmit.replace(/{infoId}/g, infoId);
        }
        if (picUrl) {
            formDatas.Pic = picUrl;

            // 判断是否试用了app的拍照功能,如果使用了app的拍照功能时，在提交的URL中添加fromuserpic=true
            if (formState.submitPostUrl.includes('fromuserpic=')) {
                formState.submitPostUrl = Util.removeUrlParam(formState.submitPostUrl, 'fromuserpic');
            }
            if (picUrl.includes('fromuserpic=1')) {
                formState.submitPostUrl += '&fromuserpic=1';
            }

            // 判断返回的图片url是不是[手机实时拍摄]的
            if (picUrl.includes('isrealtime')) {
                formDatas.shoujishipai = picUrl.includes('isrealtime=true') ? '617382' : '617383';
                formDatas.Pic = picUrl.substr(0, picUrl.indexOf('isrealtime') - 1);
            }

            // android 特殊处理，获取头信息，解决发布过程中丢失头信息的bug
            if (AppOS === 'android') {
                const headerData = androidHeaderData.action();
                if (headerData) {
                    formDatas.headerData = headerData;
                }
            }
        } else {
            formDatas.Pic = '';
        }

        // 重新写入cookie信息 $.common.reset_cookies todo
        console.log('>> 执行 submit');
        submit();
    });

    // 发送用户填写的电话给native
    if (formDatas.Phone !== '') {
        phoneNumber.action({
            phone: formDatas.Phone,
        });
    }

    // 通知app调用 window.$.publish.performPublish 方法
    showMsg.action({
        code: '10',
        msg: '提交中...',
    });

    // 在非58app环境里触发表单提交（方便在chrome里开发测试）【showMsg.action-code10】
    if (process.env.NODE_ENV === 'dev') {
        if (!(/wuba/i).test(navigator.userAgent)) {
            const picUrl = '';
            window.$.publish.performPublish(picUrl);
        }
    }
}
