/* eslint-disable no-param-reassign */

import validateWithReg from './validateWithReg';
import { formRules, errorMsgConfig, client } from '../config/business';
import ApiRequest from '../service/apiRequest';
import PageInitData from '../service/pageInitData';
import getVueData from './getVueData';

const { phone: phoneError } = errorMsgConfig;
const { formDatas, formState } = getVueData();
const { phoneError: phoneErrorSt, yzm: yzmSt } = formState;

/**
 * 验证手机号（无业务逻辑耦合）
 * @return primise（网络错误时reject，否则resolve带出errorCode）
 * errorCode:
 * -5(用户未登录) -4(机号已被其它账户绑定) -3(参数错误) -2(需要验证码) -1(预留该联系电话的账号已超出上限) 0(正常情况，无需校验) 1(号码格式错误)
 * todo:
 * > onGuanximihaoEncryPhone 隐私保护是否要加上？
 */
function getPhoneValidateState () {
    const { Phone: phoneNum } = formDatas;
    return new Promise((resolve, reject) => {
        // 得到同步验证的结果（号码格式）
        const phoneValidateResult = validateWithReg(formRules.Phone, phoneNum);
        // 同步验证未通过
        if (!phoneValidateResult.validateState) {
            // 返回同步错误信息
            resolve({
                errorCode: 1,
                errorMsg: phoneValidateResult.validateMsg,
            });
            return;
        }

        // 异步验证手机号
        // 用户信息放在cookie中
        ApiRequest.repoCheckphoneV2({
            client, // app
            isadd: PageInitData.isadd, // 是否为新增，【修改】时为false
            phone: phoneNum, // 用户填写的联系电话
            dispcateid: PageInitData.secondCate.dispid, // 当前类别的表现ID
            dispcityid: PageInitData.currentCity.dispid, // 当前城市的表现ID
        }, (success, r) => {
            if (!success) {
                reject(new Error(r));
                return;
            }
            resolve(r);
        });
    });
}

/**
 * 业务逻辑封装（校验、错误提示）
 * 返回promise：手机号正常resolve，手机号异常及网络错误reject
 */
export default function () {
    return new Promise((resolve, reject) => {
        getPhoneValidateState()
            .then((r) => {
                switch (+r.errorCode) {
                    case 0: // 手机号正常
                        phoneErrorSt.show = false; // 隐藏手机号报错提示
                        yzmSt.show = false;        // 隐藏验证码
                        resolve();
                        break;
                    case -1: // 手机号超限
                        phoneErrorSt.show = true;
                        phoneErrorSt.msg = phoneError['-1'];
                        yzmSt.show = false;        // 隐藏验证码
                        reject();
                        break;
                    case -2: // 需要验证码
                        yzmSt.show = true; // 显示验证码
                        phoneErrorSt.show = false; // 隐藏手机号报错提示
                        yzmSt.msg_encryptedKey = r.data.msg_encryptedKey; // 保存key（验证smscode时会用到）
                        yzmSt.voice_encryptedKey = r.data.voice_encryptedKey;
                        resolve(-2);
                        break;
                    case -4: // 已被其他人绑定
                        yzmSt.show = false;        // 隐藏验证码
                        phoneErrorSt.show = true;
                        phoneErrorSt.msg = phoneError['-4'];
                        reject();
                        break;
                    default: // 其他手机号错误提示
                        yzmSt.show = false;        // 隐藏验证码
                        phoneErrorSt.show = true;
                        phoneErrorSt.msg = r.errorMsg;
                        reject();
                }
            })
            .catch((error) => { // 网络错误
                phoneErrorSt.show = true;
                phoneErrorSt.msg = error.message;
                reject(error);
            });
    });
}

export {
    getPhoneValidateState,
};
