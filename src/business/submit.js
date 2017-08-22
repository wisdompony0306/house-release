/* eslint-disable */

/**
 * 表单提交结果
 */

import Util from './util';
import Request from '../business/request';
import API from '../service/api';
import PageInitData from '../service/pageInitData';
import {
    showDialog,
    hideDialog,
    webLog,
    AppVersion,
    AppVersionPaySDK,
    AppOS,
    getPay,
    loadPage,
    toastMsg,
    showMsg,
    goBack,
    savePublishInfo,
    pubHistory,
} from './appShim';
import eventHub from '../components/form/eventHub';
import ACTIONS from '../config/fangActions';

/**
 * 关闭弹窗
 * @param code：
 * 0: 无条件关闭app弹出的提示？
 * 1:
 * 100:
 */
function hideDialogPosting (code = '0') {
    if (AppOS === 'ios' && (PageInitData.initData.operate === 'edit')) {
        code = '1';
    }
    hideDialog.action({ code });
}

function showError (data) {
    let msg = '系统错误,请稍后再试';
    let code = '0';
    if (data) {
        if (data.msg || data.errmsg) {
            msg = data.msg || data.errmsg;
        } else if (data.bizExt && data.bizExt.msg) {
            msg = data.bizExt.msg;
            code = '100';
        }
    }
    hideDialogPosting(code);// 关闭弹窗
    showDialog.action({
        type: 'single',
        title: '提示',
        content: msg,
        txt1: '确定',
    });
}

/**
 * 原老版参数长度为2,第二个参数是一个json对象{code:2,bizExt:{msg:'提示信息'}},需要跟RD确认
 * @param data
 * {
 *       status: false,
 *       code:{
 *          code:2
 *          bizExt: {
 *              msg:''
 *          }
 *       }
 *  }
 */
function code2Fun (data) {
    const { code, bizExt: { errmsg: msg } } = data;
    if (window.WBAPP) {
        showMsg.action({
            code,
            msg,
        })
    }
}

/**
 *
 */
function code6 (data) {
    if (!Util.isJSON(data)) {
        return;
    }
    if (data.code != 6) {
        return;
    }
    hideDialogPosting('100');// 关闭弹窗
    const bizExt = data.bizExt;
    const paymentIos = bizExt.payment_ios;
    if (paymentIos && paymentIos == 1) {
        showDialog.action({
            type: 'single',
            title: '提示',
            content: '您已到达发帖上线，当前系统暂不支持发帖，请前往其他渠道完成发布。',
            txt1: '确定',
        });
    } else {
        // 支付逻辑
        payPost(data);
        webLog.action({
            actiontype: 'endtime',
            params: [PageInitData.secondCate.dispid, '', `${(new Date()).getTime()}`, 'endtimepay'],
        });
    }
}

function payPost (data) {
    const bizExt = data.bizExt;
    const payType = bizExt.payType;
    const payTypes = {
        identityCheckPay: 'i',
        monthlyLimitPay: 'm',
        dailyLimitPay: 'd',
    };
    const log4LocalCateWay = `${[PageInitData.currentCity.listname, PageInitData.secondCate.listname, payTypes[payType]].join('_')}_`;

    /* 判断支付SDK */
    const _isPaySDK = Util.isAppVersionEgt(AppVersion, AppVersionPaySDK);
    const _payCallbacks = {
        // 支付 && 芝麻认证
        zmrzPay (index) {
            if (index == 0) {
                let payUrl = bizExt.payUrl.replace('pwebapp.58.com', PageInitData.initData.rootDomain);
                if (payUrl.indexOf('http') < 0) {
                    payUrl = PageInitData.initData.protocol + payUrl;
                }
                const payParam = bizExt.payParam;
                const productIdIAP = bizExt.productIdIAP || '';
                if ((AppOS === 'android' && Util.isAppVersionEgt(AppVersion, '7.2.0.0')) || (AppOS === 'ios' && Util.isAppVersionEgt(AppVersion, '7.3.0'))) {
                    let notifyUrl = payParam.notifyUrl.replace('pwebapp.58.com', PageInitData.initData.rootDomain),
                        returnUrl = payParam.returnUrl.replace('pwebapp.58.com', PageInitData.initData.rootDomain);
                    if (returnUrl.indexOf('http') < 0) {
                        returnUrl = PageInitData.initData.protocol + returnUrl;
                    }
                    getPay.action({
                        productName: `${payParam.productName}`,
                        productDesc: `${payParam.productDesc}`,
                        orderMoney: `${payParam.orderMoney}`,
                        merId: `${payParam.merId}`,
                        orderId: `${payParam.orderId}`,
                        notifyUrl: `${notifyUrl}`,
                        returnUrl,
                        payType: `${payParam.payType}`,
                        validPayTime: `${payParam.validPayTime}`,
                        starttime: `${payParam.starttime}`,
                        endtime: `${payParam.endtime}`,
                        sign: payParam.sign,
                        balancePaid: `${payParam.balancePaid}`,
                        platfrom: 'mobile',
                        buyAccountId: `${payParam.buyAccountId}`,
                        IAPProductID: productIdIAP,
                    });
                } else {
                    let pageTitle = '支 付',
                        appPayUrl = `${payUrl}?_=_`;
                    for (const k in payParam) {
                        if (k == 'weixinChannelId' || k == 'alipayChannelId') {

                        } else {
                            appPayUrl += `&${k}=${payParam[k]}`;
                        }
                    }
                    loadPage.action({
                        pagetype: 'link',
                        url: appPayUrl,
                        title: pageTitle,
                        isfinish: true,
                    });
                    webLog.action({
                        actiontype: 'click',
                        pagetype: 'app_zfrz_releasepop_pay',
                    });
                }
            } else if (index == 1) {
                let orderIdParam = '';
                if (typeof bizExt.orderId !== 'undefined') {
                    orderIdParam = `&orderId=${bizExt.orderId}`;
                }
                let url = `${bizExt.zmrzUrl}?payInfoId=${bizExt.payInfoId}${orderIdParam}&Phone=${bizExt.zmrzParam.Phone}&callback=?`;
                url = url.replace('pwebapp.58.com', PageInitData.initData.rootDomain);
                Request.get({
                    url,
                    callback (state, data) {
                        if (state) {
                            let zmxyUrl = data.zmxyUrl.replace('pwebapp.58.com', PageInitData.initData.rootDomain);
                            if (Util.isAppVersionEgt(AppVersion, '7.0.5')) {
                                if (zmxyUrl.indexOf('http') < 0) {
                                    zmxyUrl = PageInitData.initData.protocol + zmxyUrl;
                                }
                                loadPage.action({
                                    pagetype: 'link',
                                    url: zmxyUrl,
                                    title: '芝麻认证',
                                    isfinish: true,
                                });
                            } else {
                                window.location.href = zmxyUrl;
                            }
                        } else {
                            toastMsg.action({
                                msg: '认证失败！',
                            });
                        }
                    },
                });
                webLog.action({
                    actiontype: 'click',
                    pagetype: 'app_zfrz_releasepop_zmrz',
                });
            }
        },
        // 支付app回调
        immediatePay (index) {
            if (index == 0) {
                webLog.action({
                    actiontype: 'click',
                    pagetype: `${log4LocalCateWay}oldapp_releasepop_wait`,
                });
                if (!_isPaySDK) {
                    /* 跳转个人中心*/
                    const url = `${PageInitData.initData.protocol + API.myPost}?rand=${parseInt(Math.random() * 1e7)}&os=${AppOS}&cversion=${AppVersion}`;
                    loadPage.action({
                        pagetype: 'link',
                        url,
                        title: '我的发布',
                        isfinish: true,
                    });
                } else {
                    webLog.action({
                        actiontype: 'click',
                        pagetype: `${log4LocalCateWay}paypopup_wait`,
                    });
                }
            } else if (index == 1) {
                const payParam = bizExt.payParam;
                if (_isPaySDK) {
                    const productIdIAP = bizExt.productIdIAP || '';
                    webLog.action({
                        actiontype: 'click',
                        pagetype: `${log4LocalCateWay}paypopup_paynow`,
                    });

                    let notifyUrl = payParam.notifyUrl.replace('pwebapp.58.com', PageInitData.initData.rootDomain),
                        returnUrl = payParam.returnUrl.replace('pwebapp.58.com', PageInitData.initData.rootDomain);
                    if (returnUrl.indexOf('http') < 0) {
                        returnUrl = PageInitData.initData.protocol + returnUrl;
                    }
                    getPay.action({
                        productName: `${payParam.productName}`,
                        productDesc: `${payParam.productDesc}`,
                        orderMoney: `${payParam.orderMoney}`,
                        merId: `${payParam.merId}`,
                        orderId: `${payParam.orderId}`,
                        notifyUrl: `${notifyUrl}`,
                        returnUrl,
                        payType: `${payParam.payType}`,
                        validPayTime: `${payParam.validPayTime}`,
                        starttime: `${payParam.starttime}`,
                        endtime: `${payParam.endtime}`,
                        sign: payParam.sign,
                        balancePaid: `${payParam.balancePaid}`,
                        platfrom: 'mobile',
                        buyAccountId: `${payParam.buyAccountId}`,
                        IAPProductID: productIdIAP,
                    });
                } else {
                    webLog.action({
                        actiontype: 'click',
                        pagetype: `${log4LocalCateWay}oldapp_releasepop_paynow`,
                    });
                    let payUrl = bizExt.payUrl.replace('pwebapp.58.com', PageInitData.initData.rootDomain);
                    if (payUrl.indexOf('http') < 0) {
                        payUrl = PageInitData.initData.protocol + payUrl;
                    }
                    let pageTitle = '支 付',
                        appPayUrl = `${payUrl}?_=_`;
                    for (const k in payParam) {
                        if (k == 'weixinChannelId' || k == 'alipayChannelId') {

                        } else {
                            appPayUrl += `&${k}=${payParam[k]}`;
                        }
                    }
                    loadPage.action({
                        pagetype: 'link',
                        url: appPayUrl,
                        title: pageTitle,
                        isfinish: true,
                    });
                }
            }
        },
    };
    // 支付提示窗口
    const _showPayDialog = (function () {
        let dialogParam = {};
        let dialogCallback = '';
        if (_isPaySDK) {
            if (bizExt.payType == 'identityCheckPay' && bizExt.useZhima && bizExt.zmrzUrl) {
                dialogParam = {
                    type: 'double',
                    title: '提示',
                    content: bizExt.payTitle,
                    txt1: `支付${parseInt(bizExt.payParam.orderMoney)}元`,
                    txt2: '芝麻认证',
                };
                dialogCallback = 'zmrzPay';
            } else {
                dialogParam = {
                    type: 'pay',
                    title: bizExt.payTitle,
                    content: bizExt.payTip,
                    txt1: '去刷新',
                    txt2: '立即支付',
                    url: 'shield',
                };
                dialogCallback = 'immediatePay';
            }
        } else {
            dialogParam = {
                type: 'double',
                title: '提示',
                content: `${bizExt.payTitle},${bizExt.payTip.replace(/<[^<>]+>/g, '')}`,
                txt1: '去刷新',
                txt2: '立即支付',
            };
            dialogCallback = 'immediatePay';
        }

        webLog.action({
            actiontype: 'click',
            pagetype: log4LocalCateWay + _isPaySDK ? 'paypopup_show' : 'oldapp_release_show',
        });

        showDialog.setCallback(_payCallbacks[dialogCallback]);
        showDialog.action(dialogParam);
    }());
}

/**
 * 原来$.publish.postCallback按顺序的参数：
 * {
 *   status:false
 *   errtype: 0,
 *   errmsg: "",
 *   fullpath: "1,15",
 *   formatsource: "",
 *   infoid: "30051220579383",
 *   infostate: "1",
 *   secondcateid: 15,
 *   cityid: 1
 * }
 * @param data的格式见 devApi.js
 */
function codeFun (data, formDatas) {
    const { code, bizExt: { infoid = '', state = '', fullpath = '' }, formatsource = '', msg = '' } = data;
    hideDialogPosting();// 关闭弹窗
    if (code == 0) { // 发布成功
        // 埋点
        webLog.action({
            actiontype: 'endtime',
            params: [PageInitData.secondCate.dispid, '', `${(new Date()).getTime()}`, 'endtimeconfirm'],
        });
        if (+state === 0) {
            infoState_0(data, formDatas);
        } else if (+state === 3 || +state === 4) {
            infoState_3_4(data);
            return;
        }
    } else if (code == 11) { // 发布失败，需要进行营业执照认证
        showDialog.setCallback((index) => {
            if (index == 0) {
                // 再次提交
                eventHub.$emit(ACTIONS.SUBMIT);
            } else if (index == 1) {
                goBack.action();
            }
        });
        showDialog.action({
            type: 'double',
            title: '营业执照认证',
            content: msg,
            txt1: '已认证',
            txt2: '返回',
        });
    }

    showMsg.action({
        code: code,
        msg,
        cateid: fullpath,
        source: formatsource,
        infoid,
    });
}

/**
 * 0 info 关闭（个人中心的删除现在用的是这个状态）
 * @param data
 */
function infoState_0 (data, formDatas) {
    // 埋点
    if (PageInitData.initData.show == 'show') {
        webLog.action({
            actiontype: 'postsuccess',
            params: [`${PageInitData.firstCate.dispid},${PageInitData.secondCate.dispid}`],
        });
    }
    // 埋点
    webLog.action({
        actiontype: 'nodescription',
    });
    // 小区、地域信息放入cookie
    setXiaoquToCookie(formDatas);
    // 保存信息到savepublishinfor方法中
    const commonValue = getPublishInfoValue(formDatas);
    savePublishInfo.action({
        commonkey: '0',
        commonvalue: commonValue,
    });

    // 发布填写信息页成功发布后保存发布二级类别给native
    if (PageInitData.initData.operate != 'edit') {
        const _saveData = {
            catename: PageInitData.secondCate.name,
            cateid: PageInitData.secondCate.dispid,
            subcatename: PageInitData.currentType != null ? PageInitData.currentType.text : '',
            url: PageInitData.initData.currentUrl,
        };
        if (PageInitData.initData.operate == 'draft') {
            _saveData.url = Util.removeUrlParam(_saveData.url, 'isdraft');
        }
        pubHistory.action({
            type: 'save',
            data: _saveData,
        });
    }
}

/**
 * 将小区地域信息放到cookie中
 */
function setXiaoquToCookie (formDatas) {
    if (Util.isJSON(formDatas)) {
        // 地域信息的处理
        const localAddr = formDatas.localAddr;
        if (Util.isArray(localAddr)) {
            for (const index in localAddr) {
                const item = localAddr[index];
                if (item && item.paramname && item.text && item.value) {
                    Util.setCookie(`__${item.paramname}`, `${item.value}&${item.text}`);
                }
            }
        }
        // 小区信息的处理,厂房类别暂无小区,此处待处理 todo
    }
}

/**
 * 主要type的处理
 * @param formDatas
 * @returns {Array}
 */
function getPublishInfoValue (formDatas) {
    const _nameArr = ['Phone', 'isBiz', 'localAddr', 'goblianxiren'];
    if (typeof PageInitData.extData.wkLimitPost !== 'undefined' && (PageInitData.extData.wkLimitPost === true || PageInitData.extData.wkLimitPost === 'true')) {
        _nameArr.shift();
    }
    let jsonstr = [];
    for (let i = 0; i < _nameArr.length; i++) {
        const name = _nameArr[i];
        const value = formDatas[name];
        if (Util.isJSON(value)) {
            if (value.option && Util.isArray(value.option)) {
                for (const index in value.option) {
                    const item = value.option[index];
                    if (item && item.selected == true) {
                        jsonstr.push({
                            paraname: name,
                            value: item.value,
                            text: item.text,
                        });
                    }
                }
            }
        } else if (Util.isArray(value)) {
            if (name == 'localAddr') {
                const localArea = value.length > 0 ? value[0] : { paraname: 'localArea', value: '', text: '' };
                const localDiduan = value.length > 1 ? value[1] : { paraname: 'localDiduan', value: '', text: '' };
                jsonstr.push({
                    paraname: localArea.paraname,
                    value: localArea.value,
                    text: localArea.text,
                    children: [{
                        paraname: localDiduan.paraname,
                        value: localDiduan.value,
                        text: localDiduan.text,
                    }],
                });
            }
        } else {
            jsonstr.push({
                paraname: name,
                value,
                text: '',
            });
        }
    }
    jsonstr = JSON.stringify(jsonstr);
    return jsonstr;
}

/**
 * 3 前置审核/敏感 4 已删除
 * 原来$.publish.postCallback按顺序的参数：
 * {
     *   status:false
     *   errtype: 0,
     *   errmsg: "",
     *   fullpath: "1,15",
     *   formatsource: "",
     *   infoid: "30051220579383",
     *   infostate: "1",
     *   secondcateid: 15,
     *   cityid: 1
     * }
 * @param参见devApi.js
 */
function infoState_3_4 (data) {
    const { code, bizExt: { infoid = '', fullpath = '' }, formatsource = '', msg = '' } = data;
    showMsg.action({
        code,
        msg,
        cateid: fullpath,
        source: formatsource,
        infoid,
        isHideDialog: 'true',
    });
    webLog.action({
        actiontype: 'showqqbindjump',
    });
    showDialog.setCallback((index) => {
        if (index == 0) {
            const _url = `${PageInitData.initData.protocol + API.myPost}?random=${parseInt(Math.random() * 1e7)}&os=${AppOS}`;
            loadPage.action({
                pagetype: 'link',
                url: _url,
                title: '我的发布',
                isfinish: true,
            });
        } else if (index == 1) {
            const _url = `${PageInitData.initData.protocol + API.postS5}?s5&refabuinfoid=${infoid}&formatsource=home`;
            loadPage.action({
                pagetype: 'publish',
                url: _url,
                title: '重新发布',
                isfinish: true,
            });
        }
    });
    showDialog.action({
        type: 'double',
        title: '信息审核中！',
        content: '信息正在审核中或审核未通过，您可以修改后重新发布，或去我的发布进行管理操作',
        txt1: '我的发布',
        txt2: '重新发布',
    });
}

export {
    codeFun,
    code2Fun,
    code6 as code6Fun,
    showError as showErrorFun,
    hideDialogPosting as preventDialog,
};
