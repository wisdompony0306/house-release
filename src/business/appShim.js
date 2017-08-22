/**
 * 包括native在内的【功能封装】，比如'区域选择'、'小区autocomplete'、'带语音的textarea'等
 * 原则：
 * 1. 保证业务组件里不涉及【功能】的实现细节，只关注使用
 * 2. 更新（修改）某个【功能】后暴露的接口不变
 * 3. 新的【功能】根据功能逻辑添加到相应位置（如native的select放在一起）
 * 4. 回调的数据复杂的话将其写到文档里去（比如selectXiaoqu的回调就很复杂）
 */

/* eslint-disable no-underscore-dangle, max-len, consistent-return */

import fill from './fillForm';
import pageInitData from '../service/pageInitData';
import getVueData from './getVueData';

const { formDatas } = getVueData();

/**
 * 由于【action: 'selectdata'】类型的选择器完成选择时app在内部调用【window.$.publish.setSelectdata】方法（无法传参更改）
 * 所以要保证【window.$.publish】对象的存在
 */

function regist$ () {
    window.$ = window.$ || {};
    window.$.publish = window.$.publish || {};
}

/**
 * 对不同端的功能逻辑进行封装：
 * app-native端: 基于【WBAPP._nativeBridge】调起【选择动作】的方法
 * m端：调起m端组件的功能
 * @param 可以参考 mclient.publish3.js
 */
/* eslint-disable */
function bridgeAction(param) {
    let isAPP = true; // 向前兼容，兼容以后M端的组件
    let isM = false;
    if (isAPP) {
        if (!window.WBAPP || !window.WBAPP._nativeBridge) {
            return false;
        }
        return window.WBAPP._nativeBridge(param);
    } else if (isM) {
    }
}

/**
 * 对【window.WBAPP.toastMsg({ msg: '发布成功' })】形式的hybrid的调用的封装
 */
function invokeAction(actName, ...param) {
    if (!window.WBAPP || typeof window.WBAPP[actName] !== 'function') {
        return false;
    }
    window.WBAPP[actName](...param);
}
/* eslint-enable */

function assign (targetObj, obj) {
    if (typeof obj === 'object') {
        Object.assign(targetObj, obj);
    }
}

/**
 * 生成草稿数据
 */
function getDraftData () {
    const r = {
        cateid: '',
        catename: '',
        date: '',
        data: [],
        title: '',
        url: location.href,
    };
    r.data = Object.keys(formDatas).map((key) => {
        const formVal = formDatas[key];
        // localAddr 拆分为原来需要的格式
        if (key === 'localAddr') {
            const [{ value: a_val, text: a_text }, { value: d_val, text: d_text }] = formVal;
            return {
                children: [{
                    paraname: 'localDiduan',
                    text: d_text,
                    value: d_val,
                }],
                paraname: 'localArea',
                text: a_text,
                value: a_val,
            };
        }

        // Content 拆分为原来需要的格式
        if (key === 'Content') {
            const { text } = formVal;
            return {
                paraname: key,
                value: text,
            };
        }

        // string 类型的，包装为 param,value,text
        if (typeof formVal === 'string') {
            return {
                paraname: key,
                value: formVal,
            };
        }

        // object[option] 下拉选项类型的，包装为 param,value,text
        if (typeof formVal === 'object' && Array.isArray(formVal.option)) {
            const objItem = {
                paraname: key,
            };
            const opt = formVal.option;
            let opti;
            for (let i = 0, len = opt.length; i < len; ++i) {
                opti = opt[i];
                if (opti.selected === 'true' || opti.selected === true) {
                    objItem.text = opti.text;
                    objItem.value = opti.value;
                    break;
                }
            }
            return objItem;
        }

        // 都不是以上几种情况（应该不存在），包装一个空item
        return {
            paraname: '',
            text: '',
            value: '',
        };
    });
    return JSON.stringify(r);
}

/**
 * 【native选择】区域
 * native中的选择行为完毕后会调用'window.$.publish.setSelectdata(sltedData)'方法, @sltedData 为选择结果对象
 * type:表示选择项类型 1是区域 2是单选 3是多选 4是动态请求的下一级数据,
 */
const selectLocalAddr = {

    // 用于调起功能的参数
    sltParam: {
        action: 'selectdata', // 固定值
        type: '1', // 固定值
        data: '', // 固定值
        callback: '', // 固定值
        msg: '网络错误', // 固定值
    },

    // 选择完成后的回调
    setCallback (cb) {
        regist$();
        window.$.publish.setSelectdata = cb; // window.$.publish.setSelectdata 是app内的固定值
    },

    // 执行【选择】区域的行为
    action () {
        bridgeAction(this.sltParam);
    },
};

/**
 * 【native选择】自定义项
 * @sltParam.data String 自定义的选项，通过 @setSltValue 方法在业务里传入
 */
const selectDiy = {

    // 用于调起功能的参数
    sltParam: {
        action: 'selectdata', // 固定值
        type: '2', // 固定值
        data: '', // 固定值
        callback: '', // 固定值
        msg: '网络错误', // 固定值
    },

    setSltValue (val) {
        this.sltParam.data = typeof val === 'object' ? JSON.stringify(val) : val;
    },

    // 选择完成后的回调
    setCallback (cb) {
        regist$();
        window.$.publish.setSelectdata = cb; // window.$.publish.setSelectdata是app内的固定值
    },

    // 执行【选择】区域的行为
    action (val) {
        if (val !== undefined) {
            this.setSltValue(val);
        }
        bridgeAction(this.sltParam);
    },
};

/**
 * 【native选择／autocomplete】小区
 */
const selectXiaoqu = {

    // 用于调起功能的参数
    sltParam: {
        action: 'area_input', // 固定值
        type: '2', // 固定值
        data: '', // 固定值
        callback: '$.publish.areaInputCallback', // String
        msg: '网络错误', // 固定值
    },

    setSltValue (val) {
        this.sltParam.data = typeof val === 'object' ? JSON.stringify(val) : val;
    },

    // 选择完成后的回调
    setCallback (cb) {
        regist$();
        window.$.publish.areaInputCallback = cb;
    },

    // 执行【选择】区域的行为
    action (val) {
        if (val !== undefined) {
            this.setSltValue(val);
        }
        bridgeAction(this.sltParam);
    },
};

/**
 * 【native输入】带有语音的内容输入
 */
const selectInput = {

    // 用于调起功能的参数
    param: {
        action: 'show_speech_recognizer', // 固定值
        type: '2', // 固定值
        title: '描述',
        tip: '',
        minlength: 10,
        text: '',
        callback: '$.publish.setTextToPage', // String
        msg: '', // 固定值
    },

    // 选择完成后的回调
    setCallback (cb) {
        regist$();
        window.$.publish.setTextToPage = cb;
    },

    // 执行【选择】区域的行为
    action (obj) {
        assign(this.param, obj);
        bridgeAction(this.param);
    },
};

/**
 * 通知native显示照相模块
 * @num: 可以上传多少张图片 num =0 不显示，num > 0显示
 * cateid 是类别id ,取值是在页面模版上的全局变量
 * isedit 可选字段，表示是否为修改信息，true是修改信息，false是正常发布信息填写
 * picpath 可选字段，表示图片地址多个用竖线（\）隔开，
 * 格式为：/mobile/big/n_s01889237821360664.jpg | /mobile/big/n_s11889237854752281.jpg
 * 注意：
 * 此模块无回调，选择完图片后即时上传，提交表单时对上传的图片统一处理
 */
const setPicNum = {
    param: {
        action: 'set_pic_num',
        num: 1,
        cateid: '15',
        isedit: false,
        picpath: '',
        isuse: true,
    },
    action (obj) {
        assign(this.param, obj);
        bridgeAction(this.param);
    },
};

/**
 * 判断是否登录,未登录调起native登录
 * @return promise： 已登录resolve，未登录reject
 */
const userLogin = {
    action () {
        if (!window.WBAPP) {
            return false;
        }
        window.WBAPP.isLogin((data) => {
            const state = data.state;
            if (!state) {
                window.WBAPP.login('', '', '');
            }
        });
        return '正在登录'; // 无意义，一个标记
    },
};

/**
 * 判断用户是否已登录，未登录则触发登录
 * @return promise： 已登录resolve(1)，未登录resolve(0)
 */
function getLoginStateAndLogin () {
    return new Promise((resolve) => {
        if (process.env.NODE_ENV === 'dev') {
            resolve(1); // 已登录
        } else {
            invokeAction('isLogin', (data) => {
                // 未登录，触发登录
                if (!data.state) {
                    invokeAction('login', '', '', '');
                    resolve(0);
                } else { // 已登录
                    resolve(1);
                }
            });
        }
    });
}
/**
 * 日志埋点
 * actiontype : String 必填项，埋点统计的动作类型
 * pagetype : String 必填项，埋点统计页面类型
 * cate : String 选填项，埋点统计页面分类 fullPath
 * params : Array 选填项，埋点参数
 * area : String 选填项，区域信息
 */
const webLog = {
    param: {
        actiontype: '',
        pagetype: 'publish',
        cate: '',
        params: [],
        area: '',
    },
    action (obj) {
        if (!window.WBAPP) {
            return false;
        }
        const param = this.param;
        assign(param, obj);
        const { actiontype, pagetype, cate, params, area } = param;
        console.log('>> 此webLog在开发环境不发送，只在测试／线上环境发送:', param);
        if (process.env.NODE_ENV !== 'dev') {
            window.WBAPP.setWebLog(actiontype, pagetype, cate, params, area);
        }
        return 'weblog已发送';
    },
};

/**
 * dialog弹窗提示
 * type : String 必填项，single/double/pay
 * title : String 必填项，dialog标题内容
 * content : String 必填项，dialog提示内容
 * callback : String|Function 必填项，dialog点击回调函数 callback(index) index: 0/1 0表示左键或者单键 1表示邮件
 * txt1 : String 必填项，dialog左键或者单键显示内容
 * txt2 : String 选填项，type为double时dialog右键显示内容
 * url : String 选填项，如果type为pay的时候起作用，对应弹窗的图片位目前可以是http远程，或者本地图片名字
 * content里不要写html标签（换行用`\n`）
 */
const showDialog = {
    param: {
        type: '',
        title: '',
        content: '',
        callback: '',
        txt1: '',
        txt2: '',
        url: '',
    },
    setCallback (cb) {
        regist$();
        window.$.publish.showDialogCb = cb;
        this.param.callback = 'window.$.publish.showDialogCb';
    },
    action (obj) {
        if (!window.WBAPP) {
            return false;
        }
        const param = this.param;
        assign(param, obj);
        const { type, title, content, callback, txt1, txt2 } = param;
        switch (type) {
            case 'single':
                window.WBAPP.showDialog(type, title, content, callback, txt1);
                break;
            case 'double':
                window.WBAPP.showDialog(type, title, content, callback, txt1, txt2);
                break;
            case 'pay':
                window.WBAPP.showDialog(type, title, content, callback, txt1, txt2, 'shield');
                break;
            default:
                break;
        }
        return '已显示弹窗'; // 无意义，做标记
    },
};
/**
 *
 * 隐藏Dialog
 */
const hideDialog = {
    param: {
        action: 'show_post_msg',
        code: '',
        isHideDialog: 'true',
    },
    action (obj) {
        assign(this.param, obj);
        bridgeAction(this.param);
    },
};

/**
 *
 * {
 *     action: "show_post_msg",
 *     code: "code",
 *     msg: "msg", //提示内容
 *     cateid: "", //类别id
 *     source: "", //来源 ，记录发布入口类型，统计相关
 *     isHideDialog: "true|false", //1、默认值为false，表示显示Dialog|2、true表示隐藏Dialog
 *     infoid: "" //发布成功后的信息id，用于日志统计。4.8添加的协议，可选（不选和空一样）
 * }
 *
 * code="-1" 表示初始值
 * code="0" 表示成功4.8以后，也表示发布修改成功，Native端通过action=set_pic_num反回的isedite来进行区分
 * code="1" 表单输入的错误提示
 *  服务器端错误code
 *      code="2" 后台保存数据错误提示 弹出框只有确定按钮
 *      code="3" 发布中检查错误，发布按钮不可用 弹出框只有确定按钮
 *      code="4" 网络错误 弹出框 可以让用户自主选择重试 有两个按钮“确定”以及取消
 *      code="5" 服务器异常 弹出框 只有确定按钮
 *      code="6" 用户等级及信用不足时弹出提示，点击确定按钮返回上一页
 *      code="10" 表单验证通过后通知native ，native检查图片上传状态，
 *                如果图片检查通过调用$.publish.performPublish(pic_url) 不通过弹出错误提示
 */
const showMsg = {
    param: {
        action: 'show_post_msg',
        code: '',
        msg: '',
        cateid: pageInitData.firstCate.dispid,
        source: '',
        isHideDialog: 'false',
        infoid: '',
    },
    action (obj) {
        assign(this.param, obj);
        bridgeAction(this.param);
    },
};

const getPay = {
    // 用于调起功能的参数
    param: {
        action: 'get_pay',
        productName: '',
        productDesc: '',
        orderMoney: '',
        merId: '',
        orderId: '',
        notifyUrl: '',
        returnUrl: '',
        payType: '',
        validPayTime: '',
        starttime: '',
        endtime: '',
        accountInfo: false,
        sign: '',
        extensionInfo: null,
        balancePaid: '',
        platfrom: 'mobile',
        buyAccountId: '',
        _mark: 10,
        callback: null,
        IAPProductI: '',
    },
    action (obj) {
        assign(this.param, obj);
        bridgeAction(this.param);
    },
};
/**
 * 页面跳转
 */
const loadPage = {
    param: {
        pagetype: 'link',
        url: '',
        title: '',
        showarea: false,
        showpub: false,
        isfinish: false,
        top_right: '',
        is_recent: false,
        showsift: false,
        backtoroot: false,
    },
    action (obj) {
        if (!window.WBAPP) {
            return false;
        }
        const param = this.param;
        assign(param, obj);
        const { pagetype, url, title, showarea, showpub, isfinish, top_right, is_recent, showsift, backtoroot } = param;
        window.WBAPP.loadPage(pagetype, url, title, showarea, showpub, isfinish, top_right, is_recent, showsift, backtoroot);
        return '页面已跳转'; // 无意义
    },
};
/**
 * native toast提示
 */
const toastMsg = {
    param: {
        msg: '',
    },
    action (obj) {
        assign(this.param, obj);
        invokeAction('toastMsg', this.param.msg);
    },
};
/**
 * 返回上一页
 */
const goBack = {
    action () {
        invokeAction('goBack');
    },
};
/**
 *
 */
const savePublishInfo = {
    param: {
        action: 'savepublishinfor',
        commonkey: '0',
        commonvalue: '',
        specialkey: '',
        specialvalue: '',
    },
    action (obj) {
        assign(this.param, obj);
        bridgeAction(this.param);
    },
};

const pubHistory = {
    param: {
        action: 'pub_history',
        type: '',
        data: '',
        msg: '',
    },
    action (obj) {
        assign(this.param, obj);
        bridgeAction(this.param);
    },
};

// 发送用户填写的电话给native
const phoneNumber = {
    param: {
        action: 'phonenum',
        phone: '',
    },
    action (obj) {
        assign(this.param, obj);
        bridgeAction(this.param);
    },
};
/**
 * 核心api框架版本
 */
const version = window.WBAPP ? window.WBAPP.version : '0.0.0';
/**
 * app版本
 */
const AppVersion = window.WBAPP ? window.WBAPP.appVersion : '0.0.0';
/**
 * 支付SDK 集成SDK最低app版本
 */
const AppVersionPaySDK = '6.3.2';
/**
 * 系统
 */
const AppOS = window.WBAPP ? window.WBAPP.os : '';

/**
 * 草稿箱
 * native调取时的参数：
 * @param: type:     [get/save/delete] 功能类型，get获取、save保存、delete删除草稿
 * @param: cateid :  ['all'/{cateid}]  在get时传入 all获取所有数据，传入cateid 获取 或 保存 某个类别下的数据
 * @param: data      [json]
 * @param: callback  [String] native回调方法名，参数为返回的数据
 * @param: msg       [String] 表示保存草稿成功的提示信息
 *
 * draft.save({ msg: '保存成功' })
 */
const draft = {
    // 调取的默认参数
    param: {
        action: 'publish_draft', // 固定
        type: '', // get/save/delete
        cateid: pageInitData.secondCate.dispid,
        data: '', // save时需要此字段
        callback: 'window.$.publish.handleGetDraft', // 固定。只有get有此字段
        msg: '',
    },

    // 存草稿
    save (op = {}) {
        this._act('save', Object.assign(op, {
            data: getDraftData(),
        }));
        return this;
    },

    // 获取草稿，设置data:''是因为原data【草稿json串】可能较大，减少内存占用
    get (op) {
        this._act('get', Object.assign(op, {
            data: '',
        }));
        return this;
    },

    /**
     * 回填草稿数据
     * callback(data)里的data的结构为：  Array: [{草稿数据}]
     */
    fillBack () {
        this.get({
            callback (draftData) {
                if (Array.isArray(draftData) && draftData[0]) {
                    fill(draftData[0].data); // 将草稿数据回填到表单
                }
            },
        });
    },

    // 删除草稿
    delete (op) {
        // this._act('delete', op); 不生效

        // 存空数据进去，将保存的草稿替换掉
        this._act('save', Object.assign(op, {
            data: ' ',
        }));
        return this;
    },

    _act (type, op = {}) {
        const self = this;
        const { data, callback, msg } = op;
        assign(this.param, {
            type,
            data,
            msg,
        });

        // 只有get才有回调
        if (type === 'get') {
            regist$();
            window.$.publish.handleGetDraft = function handleGetDraft (draftData) {
                self.gettedDraftData = draftData;
                if (callback) {
                    callback(draftData);
                }
            };
        }
        bridgeAction(this.param);
    },
};

/**
 * todo status 的意义？
 */
const webviewZoom = {
    param: {
        action: 'webviewZoom',
        title: '',
        status: '1',
        infoid: '',
        cateid: '',
    },
    action (obj) {
        assign(this.param, obj);
        bridgeAction(this.param);
    },
};

const webviewTouch = {
    param: {
        action: 'webviewTouch',
        title: '',
        clickStatus: '1',
        infoid: '',
        cateid: '',
    },
    action (obj) {
        assign(this.param, obj);
        bridgeAction(this.param);
    },
};

const performSubmit = {
    setCallback (cb) {
        regist$();
        window.$.publish.performPublish = cb;
    },
};

const androidHeaderData = {
    action () {
        let headerData = '';
        if (typeof window.stub !== 'undefined' && typeof window.stub.getCommonHeader !== 'undefined') {
            headerData = window.stub.getCommonHeader();
        }
        return headerData;
    },
};

/**
 * 向native获取发布成功后缓存的数据
 * cateid 表示数据id，格式为(0,234)逗号隔开，其中0是获取缓存的通用数据，逗号后跟着是具体业务线的cateid，
 * callback 为native回调方法，把数据传过来
 */
function setLocalCachePublishInfo () {
    // 接收native返回的缓存数据并填充到页面
    // ios返回的数据格式为：字符串
    window.getLocalCacheInfoCb = function getLocalCacheInfoCb (data) {
        fill(data[0]);
    };
    const param = {
        action: 'getLocalCacheInfo',
        cateid: `0,${pageInitData.secondCate.dispid}`,
        callback: 'getLocalCacheInfoCb',
    };
    bridgeAction(param);
}

export {
    selectLocalAddr,
    selectDiy,
    selectXiaoqu,
    selectInput,
    setPicNum,
    userLogin,
    webLog,
    showDialog,
    hideDialog,
    version,
    AppVersion,
    AppVersionPaySDK,
    AppOS,
    getPay,
    loadPage,
    toastMsg,
    showMsg,
    goBack,
    savePublishInfo,
    draft,
    pubHistory,
    phoneNumber,
    webviewZoom,
    webviewTouch,
    performSubmit,
    androidHeaderData,
    getLoginStateAndLogin,
    setLocalCachePublishInfo,
};
