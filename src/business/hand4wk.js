/**
 * 提交表单后的悟空验证
 * @param： data，submit接口返回的data
 */

import getVueData from './getVueData';
import { preventDialog } from './submit';

const formDatas = getVueData();
const { formState } = formDatas;
const { phoneError, yzm } = formState;

export default function (data) {
    // 验证码错误
    if (data.bizCode === 'checkCaptchaFail') {
        phoneError.show = false;
        yzm.show = true;
        yzm.msg_encryptedKey = data.bizExt.msg_encryptedKey;
        yzm.voice_encryptedKey = data.bizExt.voice_encryptedKey;
        yzm.error.show = true;
        yzm.error.msg = '验证码错误';
        preventDialog();
    } else if (data.bizCode === 'phoneAssociateTooManyAccounts') { // 手机号被其他账号绑定
        phoneError.show = true;
        phoneError.msg = '使用该联系电话的58账户过多，请填写其他电话'; // 配置信息统一话
        preventDialog();
    } else if (data.bizCode === 'phoneVerifyCode') { // 需要验证手机
        phoneError.show = false;
        yzm.show = true;
        yzm.msg_encryptedKey = data.bizExt.msg_encryptedKey;
        yzm.voice_encryptedKey = data.bizExt.voice_encryptedKey;
        preventDialog();
    } else if (data.bizCode === 'userNeedBind') { // 手机号码被别人绑定
        phoneError.show = true;
        phoneError.msg = '该手机号已被其它账户绑定，请更改联系电话或直接用该手机号登录';
    }
}
