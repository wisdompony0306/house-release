import { userLogin, getLoginStateAndLogin } from './appShim';
import validatePhoneNum from './validatePhoneNum';
import validateCaptcha from './validateCaptcha';

/**
 * 孙悟空验证：验证手机和captcha
 * 手机：手机号无问题(隐藏captcha); 手机号有错误(隐藏captcha，手机报错); 手机号需要captcha进一步校验(显示captcha，隐藏手机报错)
 * captcha：未显示时视为正确。显示时对其进行校验：正确(隐藏错误信息) 错误(提示错误信息)
 * @param:
 * > formDatas
 * > formState
 * @return promise，悟空校验通过resolve，校验未通过或过程中有异常reject
 */
export default function () {
    console.log('>> 悟空校验开始');
    userLogin.action(); // 登录判断
    return new Promise((resolve, reject) => {
        getLoginStateAndLogin()
            .then((loginState) => {
                if (loginState === 0) { // 未登录（已触发登录弹窗）
                    console.log('>> 请先登录');
                    return;
                }

                // 已登录，验证手机号
                validatePhoneNum()
                    // 手机号正常或需要验证码（-2）
                    .then((r) => {
                        if (r === -2) {
                            console.log('>> 悟空校验，需要验证码');
                            validateCaptcha()
                                .then((captchaResult) => {
                                    if (captchaResult === 1) { // 验证码正确
                                        console.log('>> 悟空校验，验证码正确');
                                        resolve();
                                    } else { // 验证码错误
                                        console.log('>> 悟空校验，验证码错误');
                                        reject(new Error('验证码错误'));
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        } else {
                            resolve();
                        }
                    })

                    // 手机号异常或网络异常
                    .catch(() => {
                        console.log('>> 悟空验证，手机号异常或网络异常');
                        reject(new Error('手机号异常'));
                    });
            });
    });
}
