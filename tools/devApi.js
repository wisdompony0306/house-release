/* eslint-disable import/no-extraneous-dependencies */
/**
 * 伪接口
 */
const { URL } = require('url');
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5

const upload = multer(); // for parsing multipart/form-data

module.exports = function (app) {
    app.use(bodyParser.json()); // for parsing application/json

    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // 验证手机号
    app.get('/repo/checkphoneV2', (req, res) => {
        const phone = req.query.phone;
        // console.log(req.query);
        switch (phone) {
            case '18721784561':
                // 关联账号数大于N（前端处理：提示联系电话关联的帐号太多，不允许发布）：
                res.json({
                    errorCode: -1,
                    errorMsg: 'tooManyAccounts',
                    data: {},
                });
                break;
            case '18721784562':
                // 需要验证码校验：
                res.json({
                    errorCode: -2,
                    data: {
                        msg_encryptedKey: '4aa062128700f923707489f2a98e23f3a29fdf49efdba0fc7a1a463b5cc0ae395e25b4ea7fd5eeb7096d9c535c2648ef8d734bed2efd952ec2d078616a167814f6965b07d9adfc976619016f6b4180901962af876a6ce260b0d68690031054d05c498eea83d35f13acc57337138300533f0bb1431d45e85ebee9c1b62ea30bf003dc40824bddd85ea4cbafd428d36f56e0e971d7761827d2b4547ab409ccbef682163d223157c150e0e971d7761827d26c92ec149f927bc43d91fa3b5009a0c1e0cfbd0e1bdf7ef729f815556f38e61e29e2562b206e9d19b22289afbe9c0124c00a113789730ef8ccef10ff2c055d5c875bb43de2f164f64b68b6e8d2a26745b39b14c1455c3ad12f4da8638b316898a0b94adf12ca0e5c5b54602c0b7769746cc777e05cdcf812bdccf7e67610a4731c59344c8e7addff69d57d99ec2554549f5131a732b2f8b7750f8405346d583b51a217939eeaec1d3d2688b2c0cb0dff1bc56454505c7dc91e7062c5b1b7b5b68c261661f81316ea7cf25ca81209c8f61c44b780aee02ecfa8c4598aa899cb1f92f4436d7615a60e40e8004afccdbc98a725d2c47dc3e668a7f6dbddaa5dca42c6bbd33ac1842f6d68310314427bfef87ea4deb5bf4907f1c766a8da5b341de7b712abde0c39a89586b76ec1e97eea26d16bd814e86c3098dcc33a2985fdb59d0de1fcdcefe4ae0e926df3be4cadff50a3b4a01ae368f8def875f99d578aa8e87e8ad9ce888b3b362a7e415dba1b5ebd410abaf46c31685e1c92b33c67daa75a918c389032950179df22b07fac93369e0ffc80b6bed3453c4ddb8ecbe5f065b7ea6e999a27caa565021e3eab9831e7d1de9729519969bca6ea9fb93114cc81d5476d2cdf385b4fdabc4f307fdd04824367ba749c4b6ac3b130d43b1613e6fcc891793d63b6e2e4fa3968ae4d218cdb26a7f513335f8108f067501392a25be61d',
                        phone: '18509213835',
                        voice_encryptedKey: '4aa062128700f923707489f2a98e23f3a29fdf49efdba0fc7a1a463b5cc0ae395e25b4ea7fd5eeb7096d9c535c2648ef8d734bed2efd952ec2d078616a167814f6965b07d9adfc976619016f6b4180901962af876a6ce260b0d68690031054d05c498eea83d35f13acc57337138300533f0bb1431d45e85ebee9c1b62ea30bf003dc40824bddd85ea4cbafd428d36f56e0e971d7761827d2b4547ab409ccbef682163d223157c150e0e971d7761827d26c92ec149f927bc43d91fa3b5009a0c1e0cfbd0e1bdf7ef729f815556f38e61e29e2562b206e9d19b22289afbe9c0124c00a113789730ef8ccef10ff2c055d5c875bb43de2f164f64b68b6e8d2a26745b39b14c1455c3ad12f4da8638b316898a0b94adf12ca0e5c5b54602c0b7769746cc777e05cdcf812bdccf7e67610a4731c59344c8e7addff69d57d99ec2554549f5131a732b2f8b7750f8405346d583b51a217939eeaec1d3d2688b2c0cb0dff1bc56454505c7dc91e7062c5b1b7b5b68c261661f81316ea7cf25ca81209c8f61c44b780aee02ecfa8c4598aa899cb1f92f4436d7615a60e40e8004afccdbc98a725d2c47dc3e668d171cd594f434398c6bbd33ac1842f6d68310314427bfef87ea4deb5bf4907f1f33c41d9100d5c2cb712abde0c39a89586b76ec1e97eea26d16bd814e86c3098dcc33a2985fdb59d0de1fcdcefe4ae0e926df3be4cadff50a3b4a01ae368f8def875f99d578aa8e87e8ad9ce888b3b362a7e415dba1b5ebd410abaf46c31685e1c92b33c67daa75a918c389032950179df22b07fac93369e0ffc80b6bed3453c4ddb8ecbe5f065b7ea6e999a27caa565021e3eab9831e7d1de9729519969bca6ea9fb93114cc81d5476d2cdf385b4fdabc4f307fdd04824367ba749c4b6ac3b130d43b1613e6fcc891793d63b6e2e4fa3968ae4d218cdb26a7f513335f8108f067501392a25be61d',
                    },
                    errorMsg: 'needVerify',
                });
                break;
            case '18721784563':
                // 参数错误：
                res.json({
                    errorCode: -3,
                    errorMsg: '参数错误',
                    data: {},
                });
                break;
            default:
                // 不需要验证码校验（前端处理：正常发布）：
                res.json({
                    errorCode: 0,
                    data: {},
                    errorMsg: '校验通过',
                });
        }
    });

    // 发送短信验证码(jsonp)
    app.get('/captcha/getV2', (req, res) => {
        const url = new URL(req.headers.referer);
        const searchParams = url.searchParams;
        const code = +searchParams.get('getV2');
        const callback = req.query.callback;
        let r = null;
        // console.log(callback);
        setTimeout(() => {
            switch (code) {
                case -1:
                    r = {
                        code: -8,
                        message: '参数错误 ',
                        data: {},
                    };
                    res.jsonp(r);
                    break;
                default:
                    r = {
                        code: 0, // 成功
                        message: 'ok',
                        data:
                        {
                            id: '012c9f932d15458dad5efd70a0268996',
                            ysnkt: '13b1e5',
                            isimg: false,
                            smssr: true,
                            type: 400,
                            sysid: 10,
                            smssr_str: 'OK_383169769723907',
                            tip: '已经向您尾号为3214的电话发送了一条信息，请注意查收。您也可以拨打10105858后按5收听验证码',
                        },
                    };
                    res.jsonp(r);
            }
        }, 1000);
    });

    // 校验短信验证码(jsonp)
    app.get('/captcha/validateV2', (req, res) => {
        const callback = req.query.callback;
        let r = null;
        // console.log('/captcha/validateV2 callback: ', callback);
        switch (+req.query.captcha_input) {
            case 3:
                r = {
                    code: 3,
                    message: '获取至填写间隔时间太久',
                    data: {},
                };
                res.jsonp(r);
                break;
            case 1:
                r = {
                    code: 1,
                    message: '输入答案错误，请重新输入',
                    data: {},
                };
                res.jsonp(r);
                break;
            default:
                r = {
                    code: 0,
                    message: 'ok',
                    data: {
                        count: 0,
                        result: true,
                    },
                };
                res.jsonp(r);
        }
    });

    // 自动填充手机号
    app.get('/repo/autofillphone', (req, res) => {
        const r = {
            r1: { // 正常
                data: {
                    phone: '17602153214',
                    type: 'binded',
                },
                errorCode: 0,
                errorMsg: 'success',
            },
            r2: { // 未登录
                data: {
                    phone: '',
                    type: '',
                },
                errorCode: -1,
                errorMsg: 'notlogin',
            },
        };

        setTimeout(() => {
            res.json(r.r1);
        }, 500);
    });

    // passport孙悟空用户状态 原:limitpostapp.js
    app.get('/wukong/userstate', (req, res) => {
        const r = {
            isLogin: '0',
            isBind: '0',
            mobile: '17602153214',
        };
        res.jsonp(r);
    });

    // 个人中心--我的发布
    app.get('/api/m/infoall', (req, res) => {});

    // 发布 submit (post refabu draft)
    app.post('/fang/ajax/:ctid/:cateid/s5/submit', upload.array(), (req, res) => {
        // console.log('req.body: ', req);
        const r = {

            // r0是【修改-edit】的接口返回的值，格式一致
            r0: {
                bizCode: '0',
                bizExt: {
                    fullpath: '1,15',
                    infoid: 30326522318149,
                    state: 3, // 0：info 关闭（个人中心的删除现在用的是这个状态） 3:前置审核/敏感 4：已删除
                },
                code: 0,
                msg: '发布成功',
                rs: 'succ',
            },
            r1: {
                bizCode: 'Content',
                bizExt: {
                    errmsg: '补充说明不足10个字',
                    errtype: '2',
                },
                bizMsg: '',
                code: 1,
                msg: '补充说明不足10个字',
                rs: 'failed',
            },
            r2: {
                bizCode: 'error',
                bizExt: {
                    errmsg: '经纪人不能发布个人房源，如果您是经纪人请到中国网络经纪人并拨打电话400-620-9008开通账号发布房源 ',
                    errtype: '2',
                    originMsg: '经纪人不能发布个人房源，如果您是经纪人请到中国网络经纪人并拨打电话400-620-9008开通账号发布房源 ',
                },
                bizMsg: '',
                code: 2,
                msg: '经纪人不能发布个人房源，如果您是经纪人请到中国网络经纪人并拨打电话400-620-9008开通账号发布房源 ',
                rs: 'failed',
            },
            r5: {
                bizCode: 'phoneVerifyCode',
                bizExt: {
                    msg_encryptedKey: '3e0e67e5052057dab36bc1f5c108f1544f3cdc28e99ab000',
                    voice_encryptedKey: '3e0e67e5052057da5aab7dba570a8d654f3cdc28e99ab000',
                },
                bizMsg: '',
                code: 5,
                msg: '电话校验回填验证码',
                rs: 'failed',
            },
            r6: {
                bizCode: 'paymentPage',
                bizExt: {
                    orderId: '3004530388474732073',
                    os: 'ios',
                    payInfoId: 30388474732073,
                    payIsBiz: '0',
                    payParam: {
                        action: 'get_pay',
                        alipayChannelId: 33,
                        balancePaid: '1',
                        buyAccountId: 19486314152454,
                        endtime: '2017-06-14 23:59:59',
                        merId: 1162,
                        notifyUrl: 'http://pwebapp.58.com/repo/payment/paysuccess/backendcallback',
                        orderId: '3004530388474732073',
                        orderMoney: '1.00',
                        payType: 'wechat|alipay|iappay',
                        payfrom: '5',
                        platfrom: 'mobile',
                        productDesc: '付费1.0元，支付认证',
                        productName: '支付验证',
                        returnUrl: '//pwebapp.58.com/repo/payment/paysuccess/frontendcallback/3004530388474732073',
                        sign: 'b1230f177bae44e761dadf80a8e5d516',
                        starttime: '2017-06-14 00:00:00',
                        validPayTime: '5d',
                        weixinChannelId: 83,
                    },
                    payTip: '',
                    payTitle: '为减少无效信息，发布需支付1.0元，15天内删帖将退还（Apple Pay支付除外）',
                    payType: 'identityCheckPay',
                    payUrl: '//paycenter.58.com/pay',
                    productIdIAP: 'com.taofang.iphone.shangxian1',
                    useMorePayWay: false,
                    useZhima: false,
                    zmrzParam: {
                        Phone: '17602153214',
                    },
                    zmrzUrl: '//pwebapp.58.com/repo/zhiMaCredit/collectUserInfo',
                },
                bizMsg: '',
                code: 6,
                msg: '支付页面',
                rs: 'failed',
            },

            // 触发IQAS验证码弹窗，此接口非线上抓包
            r10: {
                fb_validate_type: 1,
                cptrkey: '400',
            },

            // 发布失败，需要认证营业执照：
            r11: {
                code: 11,
                bizExt: {
                    infoid: 'infoid',
                    state: 'state',
                    fullpath: 'fullpath',
                },
                formatsource: 'formatsource',
                msg: '需要认证营业执照。。。',
            },
        };
        res.json(r.r10);
    });

    // 编辑 submit
    app.all('/fang/ajax/update/:infoId/submit', upload.array(), (req, res) => {
        const r = {
            r0: {
                bizCode: '0',
                bizExt: {
                    fullpath: '1,15',
                    infoid: 30326522318149,
                    state: 1,
                },
                code: 0,
                msg: '修改成功，您可以在“个人中心-我的发布”中查看、刷新或删除信息。APP用户享有额外免费刷新特权！',
                rs: 'succ',
            },
            r2: {
                bizCode: '',
                bizExt: {
                    errmsg: '当前登陆用户与信息所属用户不一致',
                    errtype: '5',
                },
                bizMsg: '',
                code: 2,
                msg: '当前登陆用户与信息所属用户不一致',
                rs: 'failed',
            },
        };
        setTimeout(() => {
            res.json(r.r0);
        }, 500);
    });

    // 发布填写页
    app.get('/:cityid/:dispid/s5', (req, res) => {});
};
