/**
 * 功能模块：
 * 1. 发送验证码
 * 2. 发送成功则倒计时、失败则提示错误文案
 */

/* eslint-disable no-param-reassign */

import { errorMsgConfig } from '../config/business';
import ApiRequest from '../service/apiRequest';
import countDown from './countDown';
import getVueData from './getVueData';

const { yzm: yzmError } = errorMsgConfig;
const st = getVueData();
const { formDatas } = st;
const yzmSt = st.formState.yzm;

function send () {
    const phoneNum = st.formDatas.Phone;
    return new Promise((resolve, reject) => {
        yzmSt.ajaxing = true;
        ApiRequest.verifycodeGetV2({
            tel_number: phoneNum,
            str: yzmSt.msg_encryptedKey,
        }, (success, r) => {
            yzmSt.ajaxing = false;
            if (!success) {
                reject(new Error(yzmError.default, r));
                return;
            }

            // 短信发送成功
            if (+r.code === 0) {
                formDatas.xxzl_cp = r.data.id;
                formDatas.captcha_responseid = r.data.id;
                formDatas.captcha_type = r.data.type;
                resolve(r);
            } else { // 短信发送失败
                reject(new Error(yzmError.default, r));
            }
        });
    });
}
/**
 * 业务逻辑的封装：
 * > 发送成功则倒计时，错误则报错提示
 * > ajax过程中及倒计时过程中【发送按钮不可点】
 * 想手动实现业务逻辑的话请在外部引入【send】，它会返回promise
 */
export default function () {
    if (yzmSt.disable) {
        return;
    }
    yzmSt.disable = true;
    send()
        .then(() => countDown(yzmSt)) // 发送成功，开始倒计时
        .then(() => {
            // 倒计时结束
            yzmSt.disable = yzmSt.ajaxing || yzmSt.counting;
        })
        .catch((error) => {
            // 发送错误，提示
            yzmSt.disable = yzmSt.ajaxing || yzmSt.counting;
            yzmSt.error.show = true;
            yzmSt.error.msg = error.message;
        });
}

export {
    send,
};
