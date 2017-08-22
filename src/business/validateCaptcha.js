/**
 * 功能模块：
 * 1. 对短信验证码进行校验，成功则xx，失败则提示错误文案
 * @param：
 * > st: 【Object】验证码的state的引用，里面包括ajax需要的数据
 * > phoneNum: [String]手机号
 */

/* eslint-disable no-param-reassign */

import ApiRequest from '../service/apiRequest';
import { errorMsgConfig } from '../config/business';
import getVueData from './getVueData';

const { yzm: yzmError } = errorMsgConfig;
const st = getVueData();
const { formDatas } = st;
const yzmSt = st.formState.yzm;

/**
 * 对captcha进行校验(没有耦合业务逻辑)
 * 此方法无副作用，即不包含对状态的更改
 * 返回promise：验证码正确或者不需要验证码resolve，否则reject
 */
function getCaptchaValidateState () {
    const { captcha_input, captcha_type, xxzl_cp, Phone } = formDatas;
    const param = {
        captcha_input,
        captcha_type,
        responseid: xxzl_cp,
        tel_number: Phone,
        captcha_url: window.location.href,
    };
    return new Promise((resolve, reject) => {
        // 当前状态没有显示验证码
        if (!yzmSt.show) {
            resolve();
            return;
        }
        if (!captcha_input.trim().length) {
            reject(new Error(yzmError.empty));
            return;
        }
        ApiRequest.verifycodeValidateV2(param, (success, r) => {
            if (!success) { // 网络错误
                reject(new Error(yzmError.validateError));
                return;
            }
            if (+r.code === 0) { // 接口通
                if (+r.data.result === 1) { // 验证码输入正确
                    resolve(r);
                } else { // 验证码输入错误
                    reject(new Error(yzmError.captchaError));
                }
            } else { // 接口返回错误信息
                reject(new Error(r.message));
            }
        });
    });
}

/**
 * 校验captcha的业务逻辑
 * @return promise，验证码正确resolve(1), 否则resolve(0)
 */
export default function () {
    return new Promise((resolve) => {
        getCaptchaValidateState()
            .then(() => { // 验证码正确
                yzmSt.error.show = false;
                formDatas.post_captcha_biz = 'phone_verify';
                resolve(1);
            })
            .catch((error) => { // 验证码错误或者接口报错
                yzmSt.error.show = true;
                yzmSt.error.msg = error.message;
                resolve(0);
            });
    });
}

export {
    getCaptchaValidateState,
};
