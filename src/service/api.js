import PageInitData from './pageInitData';

// 线上的接口地址
const prod = {
    // 发布填写页
    postS5: `//${PageInitData.initData.rootDomain}/${PageInitData.currentCity.dispid}/${PageInitData.secondCate.dispid}/s5`,

    // 提交接口【post draft refabu】 todo refabu入口在哪里？
    postSubmit: `/fang/ajax/${PageInitData.firstCate.dispid}/${PageInitData.secondCate.dispid}/s5/submit`,

    // 提交接口【edit】
    editSubmit: '/fang/ajax/update/{infoId}/submit', // {infoId}在【perpareSubmit】的时候被替换掉

    // 个人中心--我的发布
    myPost: '//app.58.com/api/m/infoall',

    // passport孙悟空用户状态 原:limitpostapp.js
    passportUserState: 'https://passport.58.com/wukong/userstate',

    // iqas 信质孙悟空验证码。发送短信验证码
    verifycodeGetV2: '//verifycode.58.com/captcha/getV2',

    // iqas 信质孙悟空验证码。校验短信验证码
    verifycodeValidateV2: '//verifycode.58.com/captcha/validateV2',

    // 自动填充手机号
    repoAutofillphone: '/repo/autofillphone?client=app',

    // 检查手机号的合法性。可能包括的情况：合法、超限、需要验证码、已绑定其他手机等
    repoCheckphoneV2: '/repo/checkphoneV2',

    // iqas 验证码获取 9种 原mclient.captcha.js
    verifycodeGet: '//verifycode.58.com/captcha/get',

    // iqas 验证码校验 9种 原mclient.captcha.js
    verifycodeValidate: '//verifycode.58.com/captcha/validate',
};

/**
 * 开发环境的接口配置到本地：
 * 原来的绝对路径需要在这里写成相对地址以便在本地用伪接口调试开发
 */
/* eslint-disable no-constant-condition */
if (process.env.NODE_ENV === 'dev') {
    // 在浏览器端使用RD的接口（app端可以通过代理走RD的服务）
    if (1 && !(/wuba/i).test(navigator.userAgent)) {
        // RD 开发服务器的地址。
        prod.postSubmit = 'http://10.9.192.217:5198/ajax/1/15/s5/submit';
    }

    // 是否要用本地的伪接口
    if (1 || !(/wuba/i).test(navigator.userAgent)) {
        // 发布
        prod.postSubmit = `/fang/ajax/${PageInitData.firstCate.dispid}/${PageInitData.secondCate.dispid}/s5/submit`;

        // passport孙悟空用户状态
        prod.passportUserState = '/wukong/userstate';

        // iqas 信质孙悟空验证码。发送短信验证码
        prod.verifycodeGetV2 = '/captcha/getV2';

        // iqas 信质孙悟空验证码。校验短信验证码
        prod.verifycodeValidateV2 = '/captcha/validateV2';
    }
}

export default prod;
