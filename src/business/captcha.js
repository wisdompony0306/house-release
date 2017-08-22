/* eslint-disable */

import $ from '../libs/zepto';
import {webviewZoom, webviewTouch, hideDialog} from './appShim';

var interval,
    sqrClassReg = /\br(\d)c(\d)\b/i, // 匹配九宫格class的正则表达式
    queueClassReg = /\bcp\-(1st|2nd|3rd|4th)\b/i, // 匹配输入索引class的正则表达式
    // 解密验证码长度（ysnkt: You should not know this）的方法
    decryptLength = function (str) {
        var decStr = parseInt(str + '', 16) + '';
        return decStr.charAt(decStr.length - 4);
    };
/**
 * @namespace _post
 * @description 表单提交配置对象
 * @type {Object}
 */
var _post = {
    /**
     * @method _post.showTip
     * @description 显示提示信息方法
     * @param  {Object} node 显示提示信息的jQuery对象
     * @param  {String} text 提示信息文字
     */
    showTip: function (node, text) {
        var li = node.parent().parent();
        if (!li.hasClass('item')) {
            li = li.parent();
        }
        node = li.children('.tip');
        node.html(text);
        node.show();
        li.find('.placeholder').show(); // 显示占位符，来调整title格里的位置
    },
    /**
     * @method _post.hideTip
     * @description 隐藏提示信息方法
     * @param  {Object} node 隐藏提示信息的jQuery对象
     */
    hideTip: function (node) {
        var li = node.parent().parent();
        if (!li.hasClass('item')) {
            li = li.parent();
        }
        node = li.children('.tip');
        node.hide();
        li.find('.placeholder').hide(); // 显示占位符，来调整title格里的位置
    },
    /**
     * @method _post.send
     * @description 表单提交方法
     * @property {String} captchaInput 验证码用户输入
     * @property {Number} captchaType 验证码等级
     */
    send: function (captchaInput, captchaType) {
        return false;
    }
};

/**
 *
 * @namespace settings
 * @description 默认设置，可由window.__cptrConfig__改变
 * @type {Object}
 * @property {String} cptrId 验证码元素的id
 * @property {String} cptrIptId 验证码输入框的id
 * @property {Number} countDown 重新获取验证码的时间间隔，默认60秒
 * @property {Boolean} autoMakeCall  是否在验证码生成时自动拨打语音电话
 * @property {String} getUrl 获取验证码的url，带xxzl_debug=true表示是debug模式，response中回返回答案
 * @property {String} validateUrl  校验验证码的url
 * @property {String} phoneId  表单中联系电话输入框的id
 * @property {String} phoneValue  表单中联系电话
 * @property {Boolean} postOnValid 是否在校验正确时提交，默认为`false`
 * @property {Object} _post 表单提交对象
 */
var settings = {
    cptrId: 'captcha',
    formId: 'postWarp',
    cptrIptId: 'cptrInput',
    countDown: 60,
    autoMakeCall: false,
    getUrl: '//verifycode.58.com/captcha/get',
    validateUrl: '//verifycode.58.com/captcha/validate',
    phoneValue: '',
    postOnValid: false,
    _post: {}
};
if (process.env.NODE_ENV === 'dev') {
    settings.getUrl += '?xxzl_debug=true';
    settings.validateUrl += '?xxzl_debug=true';
}
/**
 * @namespace cptrMap
 * @description 通过不同类型type加载不同类型验证码。Bsc、Msg、Sqr、Cmb、Error代表五种验证码的样式
 * @type {Object}
 * @property {String} 0 验证码加载错误：Error
 * @property {String} 100 图片-原样输入：Bsc
 * @property {String} 180 图片-腾讯图片验证码
 * @property {String} 200 图片-四则运算：Bsc
 * @property {String} 300 点击-中文原样（九宫格）：Sqr
 * @property {String} 400 短信-原样：Msg
 * @property {String} 500 语音-用户主动拨打：Msg
 * @property {String} 600 短信/点击-颜色/数字(双通道、九宫格)：Cmb
 * @property {String} 700 语音-58主动拨打：Msg
 */
var cptrMap = {
    '0': 'Error', // 验证码加载错误
    '100': 'Bsc', // 图片-原样输入
    '180': 'Bsc', // 图片-腾讯图片验证码
    '200': 'Bsc', // 图片-四则运算
    '300': 'Sqr', // 点击-中文原样（九宫格）
    '400': 'Msg', // 短信-原样
    '500': 'Msg', // 语音-用户主动拨打
    '600': 'Cmb', // 短信/点击-颜色/数字(双通道、九宫格)
    '700': 'Msg', // 语音-58主动拨打
    '1100': 'Msg', // 短信-高危账户验证码
};

/**
 * @description html代码片段（用于不同类型的发布页生成不同样式的验证码）
 * @namespace snippets
 * @type {Object}
 * @property {Object} common 公共html代码片段
 * @property {Object} stylesheet 公共样式
 * @property {Object} publish M端发布页的html代码片段
 */
var snippets = {};
snippets.stylesheet = {
    sqrBg: '.cp-sqt td,.cp-cpt td,.cp-img{background-image: url(#{picUrl});}'
};
// 公共html代码
snippets.common = {
    cptrTable: '<table id="cptrTable" class="cp-cpt" cellspacing="0"><tbody><tr><td class="cp-pmt"></td><td class="r0c1 cp-1st"></td><td class="r0c2 cp-2nd"></td><td class="r0c3 cp-3rd"></td><td class="r0c4 cp-4th"></td></tr></tbody></table>', // 输入方格
    sqrTable: '<table id="sqrTable" class="cp-sqt"><tbody><tr><td class="r1c1"></td><td class="r1c2"></td><td class="r1c3"></td></tr><tr><td class="r2c1"></td><td class="r2c2"></td><td class="r2c3"></td></tr><tr><td class="r3c1"></td><td class="r3c2"></td><td class="r3c3"></td></tr></tbody></table>', // 九宫格
    input: '<input id="' + settings.cptrIptId + '" name="captcha_input" class="cp-ipt" type="text" placeholder="请输入验证码" autocomplete="off" maxlength="6">', // 输入框 captcha_input
    hiddenInput: '<input id="' + settings.cptrIptId + '" type="hidden" name="captcha_input" maxlength="6" />', // 隐藏输入框 captcha_input
    hiddenType: '<input id="captcha_type" type="hidden" name="captcha_type" />', // 隐藏输入框 captcha_type
    image: '<div id="cptrImage" class="cp-img"></div>', // 提示图片
    change: '<a id="cptrChange" class="cp-chg" href="javascript:void(0)">看不清</a>', // 看不清链接
    get: '<a id="cptrGet" class="cp-get" href="javascript:void(0)">获取</a>', // 获取链接
    btnGet: '<button id="cptrGet" class="cp-btn cp-btn-get" type="button">获取</button>', // 获取按钮
    btnSubmit: '<button class="cp-btn cp-btn-smt" type="button">发布</button>', // 发布按钮
    btnCancel: '<button class="cp-btn cp-btn-ccl" type="button">取消</button>', // 取消按钮
    tip: '<div class="tip cp-tip"></div>', // 表单校验提示tip
    prompt: '<li class="cp-pmt">您此次发布，需要验证！</li>'
};
// M端发布页的html代码
snippets['publish'] = {
    wrapper: '<div id="' + settings.cptrId + '"></div>',
    cptrMask: '<div id="cp-mask"></div>',
    Bsc: {
        cptrPop: '<div id="cp-pop">' +
        '<ul>' +
        '<li>' +
        snippets.common.image +
        '</li>' +
        '<li class="item">' +
        snippets.common.change +
        snippets.common.tip +
        '<div class="cp-box">' +
        snippets.common.hiddenType +
        snippets.common.input +
        '</div>' +
        '</li>' +
        '<li>' +
        snippets.common.btnCancel +
        snippets.common.btnSubmit +
        '</li>' +
        '</ul>' +
        '</div>'
    },
    Msg: {
        cptrPop: '<div id="cp-pop">' +
        '<ul>' +
        snippets.common.prompt +
        '<li class="item">' +
        snippets.common.tip +
        '<div class="cp-grp cp-box">' +
        snippets.common.hiddenType +
        snippets.common.input +
        snippets.common.btnGet +
        '</div>' +
        '</li>' +
        '<li>' +
        snippets.common.btnCancel +
        snippets.common.btnSubmit +
        '</li>' +
        '</ul>' +
        '</div>'
    },
    Sqr: {
        cptrPop: '<div id="cp-pop">' +
        '<ul>' +
        '<li>' +
        snippets.common.cptrTable +
        '</li>' +
        '<li class="item cp-opr">' +
        '<div>' +
        snippets.common.hiddenType +
        snippets.common.hiddenInput +
        '</div>' +
        snippets.common.change +
        snippets.common.tip +
        '</li>' +
        '<li>' +
        snippets.common.sqrTable +
        '</li>' +
        '<li style="clear:both;">' +
        snippets.common.btnCancel +
        snippets.common.btnSubmit +
        '</li>' +
        '</ul>' +
        '</div>'
    },
    Cmb: {
        cptrPop: '<div id="cp-pop">' +
        '<ul>' +
        snippets.common.prompt +
        '<li class="item cp-opr">' +
        '<div>' +
        snippets.common.hiddenType +
        snippets.common.hiddenInput +
        '</div>' +
        snippets.common.get +
        snippets.common.tip +
        '</li>' +
        '<li>' +
        snippets.common.sqrTable +
        '</li>' +
        '<li style="clear:both">' +
        snippets.common.btnCancel +
        snippets.common.btnSubmit +
        '</li>' +
        '</ul>' +
        '</div>'
    },
    Error: {
        cptrPop: '<div id="cp-pop">' +
        '<ul>' +
        '<li>' +
        snippets.common.prompt +
        '</li>' +
        '<li>' +
        snippets.common.btnCancel +
        snippets.common.btnGet +
        '</li>' +
        '</ul>' +
        '</div>'
    }

};
/**
 * @name Captcha
 * @class Captcha类定义，封装了验证码的生成、获取、校验等方法
 * @constructor
 * @param {Object}  cptrKey     密钥，获取验证码等传给服务器，解密后为验证码的类型。在xxzl=true的debug模式下，cptrKey可以直接使用验证码的type
 * @param {Object|String} options 配置参数，当为`highrisk`时表示高危账户验证码
 */
var Captcha = function (cptrKey, options) {
    /**
     * @alias Captcha#settings
     * @description 控件参数，可由`window.__cptrConfig__`配置全局参数，由'options'配置实例对象参数
     * @type {Object}
     */
    this.settings = {};
    // 高危账号验证码
    if (typeof options === 'object') {
        this.settings = $.extend({}, settings, options);
        if(options["highrisk"]==='highrisk'){
            this.settings = $.extend({}, this.settings, Captcha.highriskOptions);
        }
    } else {
        this.settings = settings;
    }
    _post = $.extend({}, _post, this.settings._post);
    /**
     * @alias Captcha.type
     * @description 代表不同类型验证码，可以参照cptrMap
     * @type {String}
     * @see  cptrMap
     */
    this.type = -100;
    /**
     * @alias Captcha.cptrType
     * @description 验证码类型。Bsc|Msg|Sqr|Cmb
     * @type {string}
     * @see  cptrMap
     */
    this.cptrType = '';
    /**
     * @alias Captcha.cptrKey
     * @description 验证码密钥。由服务器端传给客户端，客户端上送到verifycode.58.com解密
     * @type {string}
     */
    this.cptrKey = cptrKey || '';
    /**
     * @alias Captcha.state
     * @description  控件状态。
     * ![状态转移](http://192.168.119.81/captcha/images/states.png)
     * @type {string}
     * @default 'loading'
     * @property {String} loading 控件处于加载状态，此时不能请求验证码，防抖动
     * @property {String} ready 控件处于加载完毕状态
     * @property {String} cooldown 控件处于倒计时冷却状态（只在短信、语音、双通道验证码状态下可用），此时不能请求验证码
     * @property {String} success 控件处于校验成功状态，此时验证码锁定，事件和重构失效
     * @property {String} error 控件处于加载错误状态，当出现网络错误或者未填写手机号时会进入该状态
     */
    this.state = 'loading';
    /**
     * @alias Captcha.picUrl
     * @description 验证码图片url，base64数据类型
     * @type {string}
     */
    this.picUrl = '';
    /**
     * @alias Captcha.getUrl
     * @description 获取验证码url，在type为600下为语音拨打url
     * @type {string}
     */
    this.getUrl = this.settings.getUrl;
    /**
     * @alias Captcha.validateUrl
     * @description 校验验证码url
     * @type {string}
     */
    this.validateUrl = this.settings.validateUrl;
    /**
     * @alias Captcha.$elem
     * @description 验证码jQuery元素
     * @type {object}
     */
    this.$elem = null;
    /**
     * @alias Captcha.$input
     * @description 验证码输入框jQuery元素
     * @type {object}
     */
    this.$input = null;
    /**
     * @alias Captcha.$image
     * @description 验证码图片jQuery元素
     * @type {object}
     */
    this.$image = null;
    /**
     * @alias Captcha.postBtn
     * @description 验证码发布按钮
     * @type {object}
     */
    this.$postBtn = null;
    /**
     * @alias Captcha.errorCount
     * @description 输入错误次数
     * @type {number}
     * @default 0
     */
    this.errorCount = 0;
    /**
     * @alias Captcha.ysnkt
     * @description 验证码长度，由服务器返回的ysnkt参数解码后得到。you shold not know this。
     * @type {number}
     * @default 0
     */
    this.ysnkt = 0; // @XXX: 存在安全隐患
    /**
     * @alias Captcha.injector
     * @description 验证码生成方法注入器，this.injector引用生成某种验证码的方法，并作为参数注入到{@link Captcha.requestCaptcha}的callback中
     * @type {function}
     */
    this.injector = null;
    this.init(this.cptrKey);
};
/**
 * @alias Captcha.highriskOptions
 * @description 高危账号验证码配置项
 * @type {Object}
 * @see module:captcha~settings
 */
Captcha.highriskOptions = {
    getUrl: '//' + location.host + '/ajax?action=highrisksendcaptcha',
    validateUrl: '//' + location.host + '/ajax?action=highriskcheckcaptcha'
};
/* Captcha方法定义*/
Captcha.prototype = {
    /**
     * @description Captcha构造方法
     * @method constructor
     * @memberOf Captcha
     * @instance
     */
    constructor: Captcha,
    /**
     * @description 初始化方法
     * 1. 找到参数元素`$refElem`，一般发布页（除招聘会和全职招聘发布页）为发布按钮外层的`<tr>`
     * + 通过{@linkcode Captcha.createStyle}方法创建样式表
     * + 异步获取验证码，通过获取到的type参数生成不同类型验证码，生成方法是通过{@linkcode Captcha.injector}方法进行字面值注入的
     * + 将生成的验证码DOM节点插入到参考元素之前（之后）
     * @memberOf Captcha
     * @instance
     * @param {String} cptrKey 密钥
     */
    init: function (cptrKey) {
        var _t = this,
            $refElem = $('#' + settings.formId), // 插入位置
            $captcha; // DOM元素
        // 如果存在验证码则调用重构方法
        if ($('#' + settings.cptrId).length > 0 || !!captcha) {
            _t.refactor(_t.cptrKey);
            return false;
        }

        _t.createStyle();
        // 请求验证码后通过注入的renderCaptcha方法生成验证码
        _t.requestCaptcha(_t.getUrl, function (data, renderCaptcha) {
            clearInterval(interval); // 清除计时器
            $captcha = renderCaptcha.call(_t, data);
            _t.appendCaptcha($refElem);
            _t.$elem.find('#captcha_type').val(_t.type);
            // 如果type为600并且autoMakeCall标识为true，自动给用户拨打语音电话
            if (_t.type == 700 && settings.autoMakeCall) _t.refactor(_t.cptrKey);

        });
    },
    /**
     * @description 重构方法。作用是当存在验证码时进行重构
     * + 大体上跟初始化过程相同，额外移除旧的验证码，当验证码类型未改变时仅改变验证码图片url以及重置样式
     * @memberOf Captcha
     * @instance
     * @param {string} cptrKey 密钥
     * @param {object|string} options 附加参数，如果为`highrisk`时表示高危账号验证码
     */
    refactor: function (cptrKey, options) {
        var _t = this,
            oldType = _t.type,
            $refElem = $('body'),
            $oldCaptcha = $('#' + settings.cptrId);
        // 当弹出层处于隐藏状态下时，先显示弹出层
        if (_t.$elem.hasClass('cp-hide') || _t.$elem.css('display') === 'none') {
            destroyCaptcha();
            initCaptcha(cptrKey);
            return false;
        }
        // 当处于加载或者校验成功状态时，不能重构
        if (_t.state === 'loading' || _t.state === 'success') return false;
        // 重置cptrKey
        if (typeof cptrKey !== 'undefined') _t.cptrKey = cptrKey;
        // 重置this.settings
        if (typeof options === 'object') {
            _t.settings = $.extend({}, settings, options);

        } else if (typeof options === 'string' && options === 'highrisk') {
            _t.settings = $.extend({}, settings, Captcha.highriskOptions);
            _t.picUrl = (isIE6 || isIE7) ? _t.settings.IE6GetImageUrl : '';
            _t.validateUrl = _t.settings.validateUrl;
        }
        _t.getUrl = _t.settings.getUrl;
        _t.requestCaptcha(_t.getUrl, function (data, renderCaptcha) {
            clearInterval(interval); // 清除计时器
            _t.$input.removeAttr('disabled');
            // 隐藏提示语
            try {
                _post.hideTip(_t.$input);
            } catch (e) {
            }
            // 返回type与原有type不相等时或者为双通道验证码时，重新生成。相等时改变图片
            if (_t.type !== oldType || _t.cptrType === 'Cmb' || _t.cptrType === 'Error') {
                _t.setBgStyle();
                $captcha = renderCaptcha.call(_t, data);
                $oldCaptcha.remove(); // 移除原有的验证码
                _t.appendCaptcha($refElem);
                _t.$elem.find('#captcha_type').val(_t.type);
            } else {
                _t.resetGrid();
                _t.$input.val('');
                // 短信验证码和双通道验证码倒计时功能
                if (_t.cptrType === 'Msg' || _t.cptrType === 'Cmb') _t.setCooldownState();
            }
        });
    },
    /**
     * @description 将验证码元素追加到DOM中
     * @param  {Object} $refElem 元素追加的参考位置
     * @memberOf Captcha
     * @instance
     */
    appendCaptcha: function ($refElem) {
        var _t = this,
            marginTop,
            vHeight = document.documentElement.clientHeight,
            pHeight = document.getElementsByTagName('body')[0].offsetHeight,
            $cptrPop = _t.$elem.find('#cp-pop'),
            $cptrMask = _t.$elem.find('#cp-mask');
        $refElem.append(_t.$elem);
        _t.$elem.show();
        marginTop = '-' + $cptrPop.get(0).clientHeight / 2 + 'px';
        $cptrPop.css('margin-top', marginTop);
        $cptrMask.css('position', 'absolute');
        $cptrMask.css('top', '-' + vHeight / 2 + 'px');
        $cptrMask.css('height', pHeight + vHeight + 'px');
        // 绑定取消和关闭按钮事件
        _t.bindEvents();
    },

    /**
     * @description 获取语音校验码
     * @param {String} url 获取语音验证码的url
     * @memberOf Captcha
     * @instance
     */
    getVoiceCaptcha: function (url) {
        var _t = this,
            timer = setTimeout(function () {
                if (_t.state === 'loading') _t.setErrorState();
            }, 10000); // 超时10秒仍然处于loading状态时则置为错误状态
        if (_t.state === 'loading') return false;
        _t.setLoadingState(); // 设置控件的state为loading状态
        $.ajax({
            dataType: 'jsonp',
            url: url + '&callback=?',
            success: function (json) {
                clearTimeout(timer);
                // 0: "ok";
                // 100: "bad request";
                // 200: "out of limit rate";
                // 300: "invoke(scf/400) error or no code for this tel";
                // 400: "no disturbing time";
                // 900: "system error";
                if (json && json.code == '0') {
                    _t.setReadyState();
                    _t.resetGrid();
                    _t.$input.val('');
                    _t.setCooldownState();
                } else if (json && json.code == '200') {
                    _t.setErrorState('获取语音验证码次数超出限制！');
                } else {
                    _t.setErrorState('获取语音验证码失败！');
                }
            }
        });
    },
    /**
     * @description 销毁验证码方法
     * @memberOf Captcha
     * @instance
     */
    destroy: function () {
        var _t = this;
        _t.$elem.remove();
        $('#sqrBgStyle').remove();
        $('body')[0].scrollTop = 0;
        captcha = null;
        return false;
    },
    /**
     * @description 获取html代码方法。通过发布页的类别，加载不同的html代码段，最后生成不同样式的验证码
     * @param  {String} elem 获取的元素
     * @memberOf Captcha
     * @instance
     * @return {string} elem元素的html代码段
     * @see snippets UIMap
     */
    getSnippet: function (elem) {
        var _t = this,
            postui = 'publish'; // 发布页样式
        // 公共html代码
        if (elem in snippets.common) return $(snippets['common'][elem]);
        // 每个类别的公共html代码
        if (elem in snippets[postui]) return $(snippets[postui][elem]);

        return $(snippets[postui][_t.cptrType][elem]);
    },
    /**
     * @description 创建样式表方法。在head标签内创建两个样式表，一个是是验证码公用样式，另一个是验证码图片的url，重新获取图片验证码时重写验证码图片url的相关样式
     * @memberOf Captcha
     * @instance
     */
    createStyle: function () {
        var _t = this,
            head = document.getElementsByTagName('head')[0],
            sqrBgStyle = document.createElement('style'),
            sqrBgDiv = document.createElement('div');

        sqrBgDiv.innerHTML = '_<style type="text/css" id="sqrBgStyle">' + snippets.stylesheet.sqrBg.replace('#{picUrl}', _t.picUrl) + '</style>'; //替换#{picUrl}占位符为获取到的图片url
        sqrBgDiv.removeChild(sqrBgDiv.firstChild);
        head.appendChild(sqrBgDiv.firstChild);
    },
    /**
     * @description 设置图片样式方法。用于改变验证码的图片url
     * @memberOf Captcha
     * @instance
     */
    setBgStyle: function () {
        var _t = this,
            stylesheet = document.createElement('style'),
            head = document.getElementsByTagName('head')[0],
            sqrBgDiv = document.createElement('div');

        sqrBgDiv.innerHTML = '_<style type="text/css" id="sqrBgStyle">' + snippets.stylesheet.sqrBg.replace('#{picUrl}', _t.picUrl) + '</style>';
        sqrBgDiv.removeChild(sqrBgDiv.firstChild);
        $('#sqrBgStyle').remove();
        head.appendChild(sqrBgDiv.firstChild);
    },
    /**
     * @description 请求验证码方法。请求成功会设置控件的一系列参数
     * @param  {String}   url      获取验证码的url
     * @param  {Function} callback 获取验证码成功后的回调函数
     * @memberOf Captcha
     * @instance
     */
    requestCaptcha: function (url, callback) {
        var _t = this,
            //telNumber = $('#' + settings.phoneId).val(),
            telNumber = _t.settings.phoneValue,
            isTimeout = false,
            params = '',
            message,
            cptrParam = !!_t.cptrKey ? ('str=' + _t.cptrKey) : '',
            timer = setTimeout(function () {
                if (_t.state === 'loading') {
                    isTimeout = true; // 设置超时标识为true
                    message = '获取验证码超时！';
                    _t.setErrorState(message);
                    _t.injector = _t['renderErrorCaptcha'];

                    if (typeof callback === 'function') callback(message, _t.injector);
                }
            }, 10000); // 超时10秒仍然处于loading状态时则置为错误状态

        params += (_t.getUrl.indexOf('?') > -1 ? '&' : '?') + 'tel_number=' + telNumber;
        params += '&' + cptrParam;
        _t.setLoadingState(); // 设置控件的state为loading状态，此时屏蔽更换图片功能
        $.ajax({
            dataType: 'jsonp',
            url: url + params + '&callback=?',
            success: function (json) {
                var data,
                    rand = '?v=' + (new Date().getTime());
                // 如果超时10秒，即使10秒返回成功，也不重新加载验证码
                if (isTimeout) return false;
                clearTimeout(timer);
                // 验证码超时加载错误
                if (_t.state === 'error') return false;
                if (json && json.code == '0') {
                    data = json.data;
                    _t.setReadyState();
                    _t.ysnkt = decryptLength(data.ysnkt); // 解密验证码长度
                    // 通过返回的type装载不同类型的验证码
                    if (typeof cptrMap[data.type] === 'string') {
                        _t.type = data.type;
                        _t.cptrType = cptrMap[data.type];
                        _t.injector = _t['render' + cptrMap[data.type] + 'Captcha'];
                    } else {
                        data = '不能获取验证码，请稍后再试';
                        _t.setErrorState(data);
                        _t.injector = _t['renderErrorCaptcha'];
                    }
                    // type为700时，将获取验证码的url设置为语音拨打电话的url
                    if (_t.type == 700 && !!data.callphoneurl) {
                        _t.getUrl = data.callphoneurl;
                    }
                    // 设置图片url
                    if (!!data.img) {
                        _t.picUrl = 'data:image/png;base64,' + data.img;
                        _t.setBgStyle();
                    } else {
                        _t.picUrl = '';
                    }
                    // 向callback方法传递data和生成方法
                    if (typeof callback === 'function') callback(data, _t.injector);
                }
                else {
                    data = json.message;
                    _t.setErrorState(data);
                    _t.injector = _t['renderErrorCaptcha'];
                    if (typeof callback === 'function') callback(data, _t.injector);
                }
            }
        });
    },
    /**
     * @description 设置验证码提示语方法
     * @param  {Function} callback 变更验证码成功后的回调函数
     * @memberOf Captcha
     * @instance
     */
    setPrompt: function (tip) {
        var _t = this;
        if ($('.cp-pmt').length > 0) $('.cp-pmt').html(tip);
    },
    /**
     * @description 生成图片验证码。对应type: 100, 200
     * @param  {Object} data 服务器返回的数据
     * @memberOf Captcha
     * @instance
     * @return {Object}      生成的jQuery验证码元素
     */
    renderBscCaptcha: function (data) {
        var _t = this,
            $snippet = _t.getSnippet('wrapper'),
            $cptrMask = _t.getSnippet('cptrMask'),
            $cptrPop = _t.getSnippet('cptrPop');
        // 控件属性赋值
        _t.$input = $cptrPop.find('#' + settings.cptrIptId);
        _t.$image = $cptrPop.find('#cptrImage');
        // 设置元素样式、文字
        if (_t.type === 200) _t.$input.attr('placeholder', '请填写运算结果');
        _t.$image.addClass('cp-img-bsc');
        // DOM操作
        $snippet.append($cptrMask).append($cptrPop);
        _t.$elem = $snippet;
        // “看不清”按钮点击事件
        $snippet.find('#cptrChange').bind('click', function (e) {
            e.preventDefault(); // IE6 hack
            _t.$input.attr('disabled', true); // 将输入框的disable属性设置为true
            _t.refactor(_t.cptrKey);
        });
        return $snippet;
    },
    /**
     * @description 生成短信或电话验证码。对应type: 400, 500, 700
     * @param  {Object} data 服务器返回的数据
     * @memberOf Captcha
     * @instance
     * @return {Object}      生成的jQuery验证码元素
     */
    renderMsgCaptcha: function (data) {
        var _t = this,
            $snippet = _t.getSnippet('wrapper'),
            $cptrMask = _t.getSnippet('cptrMask'),
            $cptrPop = _t.getSnippet('cptrPop');
        // 控件属性赋值
        _t.$input = $cptrPop.find('#' + settings.cptrIptId);
        // 设置元素样式、文字
        $cptrPop.find('.cp-pmt').html(data.tip);
        _t.$input.addClass('cp-grp-ipt');
        $cptrPop.find('.cp-btn-get').addClass('cp-grp-btn');
        // DOM操作
        $snippet.append($cptrMask).append($cptrPop);
        _t.$elem = $snippet;
        // type为700时，需要用户主动点击“获取验证码”，不触发倒计时
        if (_t.type != 700) {
            _t.setCooldownState();
        }
        // “获取”点击事件
        $cptrPop.find('#cptrGet').bind('touchend', function (e) {
            e.preventDefault(); // IE6 hack
            if (_t.state === 'cooldown') return false;
            if (_t.type == 700) {
                _t.getVoiceCaptcha(_t.getUrl);
            } else {
                _t.refactor(_t.cptrKey);
            }
        });
        return $snippet;
    },
    /**
     * @description 生成九宫格验证码。对应type: 300
     * @param  {Object} data 服务器返回的数据
     * @memberOf Captcha
     * @instance
     * @return {Object}      生成的jQuery验证码元素
     */
    renderSqrCaptcha: function (data) {
        var _t = this,
            $snippet = _t.getSnippet('wrapper'),
            $cptrMask = _t.getSnippet('cptrMask'),
            $cptrPop = _t.getSnippet('cptrPop');
        // 控件属性赋值
        _t.$input = $cptrPop.find('#' + settings.cptrIptId);
        _t.$image = $cptrPop.find('#cptrImage');
        // 设置元素样式、文字
        $cptrPop.find('.cp-pmt').html('请按顺序点击');
        // DOM操作
        $snippet.append($cptrMask).append($cptrPop);
        _t.$elem = $snippet;
        // 九宫格点击事件
        $cptrPop.find('#sqrTable td').bind('touchend', function (e) {
            var $t = $(this),
                $inputs = $cptrPop.find('#cptrTable td').not('.cp-pmt'),
                classTyped = 'typed ',
                classGrid = $t.attr('class').match(sqrClassReg)[0];
            if (_t.state === 'loading') return false;
            if ($inputs.not('.typed').length === 0) return false;
            if (!$t.hasClass('typed')) {
                classTyped += $inputs.not('.typed').eq(0).attr('class').match(queueClassReg)[0];
            } else {
                classTyped += 'cp-1st cp-2nd cp-3rd cp-4th';
            }
            $t[!$t.hasClass('typed') ? 'addClass' : 'removeClass'](classTyped);
            _t[$t.hasClass('typed') ? 'appendGrid' : 'removeGrid'](classGrid);
        });
        // “看不清”按钮点击事件
        $snippet.find('#cptrChange').bind('click', function (e) {
            e.preventDefault(); // IE6 hack
            _t.refactor(_t.cptrKey);
        });
        return $snippet;
    },
    /**
     * @description 生成双通道验证码。对应type: 700
     * @param  {Object} data 服务器返回的数据
     * @memberOf Captcha
     * @instance
     * @return {Object}      生成的jQuery验证码元素
     */
    renderCmbCaptcha: function (data) {
        var _t = this,
            $snippet = _t.getSnippet('wrapper'),
            $cptrMask = _t.getSnippet('cptrMask'),
            $cptrPop = _t.getSnippet('cptrPop');
        // 控件属性赋值
        _t.$input = $cptrPop.find('#' + settings.cptrIptId);
        // 设置元素样式、文字
        $cptrPop.find('.cp-pmt').html(data.tip);
        // DOM操作
        $snippet.append($cptrMask).append($cptrPop);
        _t.$elem = $snippet;
        _t.setCooldownState();
        // 九宫格点击事件
        $cptrPop.find('#sqrTable td').bind('touchend', function (e) {
            var $t = $(this),
                className = $t.attr('class').match(sqrClassReg)[0];
            if (_t.state === 'loading') return false;
            if (_t.ysnkt - _t.$input.val().length <= 0) return false;
            $t[!$t.hasClass('typed') ? 'addClass' : 'removeClass']('typed');
            _t[$t.hasClass('typed') ? 'appendGrid' : 'removeGrid'](className);
        });
        // “获取”点击事件
        $cptrPop.find('#cptrGet').bind('click', function (e) {
            e.preventDefault(); // IE6 hack
            if (_t.state === 'cooldown') return false;
            _t.refactor(_t.cptrKey);
        });
        return $snippet;
    },
    /**
     * @description 生成获取失败的验证码
     * @memberOf Captcha
     * @instance
     * @return {object}      生成的jQuery验证码元素
     */
    renderErrorCaptcha: function (message) {
        var _t = this,
            $snippet = _t.getSnippet('wrapper'),
            $cptrMask = _t.getSnippet('cptrMask'),
            $cptrPop = _t.getSnippet('cptrPop');
        // 控件属性赋值
        _t.$input = $cptrPop.find('#' + settings.cptrIptId);
        // 设置元素样式、文字
        $cptrPop.find('.cp-pmt').html(message);
        // DOM操作
        $snippet.append($cptrMask).append($cptrPop);
        _t.$elem = $snippet;
        // “点击重新获取”点击事件
        $cptrPop.find('#cptrGet').bind('touchend', function (e) {
            e.preventDefault(); // IE6 hack
            _t.refactor(_t.cptrKey);
        });
        return $snippet;
    },
    /**
     * @description 追加选中方格方法。用于Sqr和Cmb两种验证码。
     * @param  {String} className 追加方格的class，也代表位置。
     * @memberOf Captcha
     * @instance
     */
    appendGrid: function (className) {
        var _t = this,
            $tds = null,
            $append = null, // 验证码输入区域的方格
            sIndex = 0,
            typed = ['', '', '', ''],
            queue, // 追加方格的索引
            row, // 追加方格的所在行
            col; // 追加方格的所在列
        row = parseInt(sqrClassReg.exec(className)[1], 10);
        col = parseInt(sqrClassReg.exec(className)[2], 10);
        queue = (row - 1) * 3 + col - 1;
        if (_t.cptrType === 'Sqr') {
            $tds = _t.$elem.find('#cptrTable td').not('.cp-pmt');
            $append = $(_t.$elem.find('#cptrTable td').not('.cp-pmt,.typed').get(0));
            if ($append.length === 0) return false;
            $tds.each(function (idx) {
                var $t = $(this);
                if ($t.hasClass('typed')) typed[idx] = _t.$input.val().charAt(sIndex++);
            });
            // 插入点击九宫格的索引
            for (var i = 0, len = typed.length; i < len; i++) {
                if (typed[i] === '') {
                    typed[i] = queue;
                    break;
                }
            }
            $append.addClass('typed');
            _t.$input.val(typed.join(''));
        } else if (_t.cptrType === 'Cmb') {
            _t.$input.val(_t.$input.val() + queue.toString());
        }
        if (_t.cptrType === 'Sqr') {
            // 固定长度校验
            if (_t.$input.val().length === 4) _t.validateCaptcha(_t.settings.postOnValid);
        } else if (_t.cptrType === 'Cmb') {
            if (_t.$input.val().length == _t.ysnkt) _t.validateCaptcha(_t.settings.postOnValid);
        }
    },
    /**
     * @description 移除方格方法。用于Sqr和Cmb两种验证码。
     * @param  {String} className 移除方格的class，也代表位置。
     * @memberOf Captcha
     * @instance
     */
    removeGrid: function (className) {
        var _t = this,
            $typed = null, // 验证码输入区域的方格
            value = _t.$input.val(),
            queue, // 追加方格的索引
            index,
            row, // 追加方格的所在行
            col; // 追加方格的所在列
        row = parseInt(sqrClassReg.exec(className)[1], 10);
        col = parseInt(sqrClassReg.exec(className)[2], 10);
        queue = (row - 1) * 3 + col - 1;
        index = value.indexOf(queue);
        if (_t.cptrType === 'Sqr') {
            $typed = _t.$elem.find('#cptrTable td.typed');
            $typed.eq(index).removeClass('typed');
        }
        _t.$input.val(value.replace(queue, ''));
    },
    /**
     * @description 重置九宫格方法
     * @memberOf Captcha
     * @instance
     */
    resetGrid: function () {
        var _t = this,
            $inputs;
        _t.$input.val('');
        if ('Sqr,Cmb'.indexOf(_t.cptrType) === -1) return false;
        _t.$elem.find('#sqrTable td').removeClass('typed cp-1st cp-2rd cp-3rd cp-4th');
        if (_t.cptrType === 'Sqr') {
            $inputs = $('#cptrTable td').not('.cp-pmt');
            $inputs.removeClass('typed');
        }
    },
    /**
     * @description 设置验证码正在加载状态方法
     * @memberOf Captcha
     * @instance
     */
    setLoadingState: function () {
        var _t = this;
        _t.state = 'loading';
        try {
            _t.$elem.find('#cptrGet').html('获取中...');
            _t.$elem.find('#cptrTable').addClass('cp-ld');
            _t.$image.addClass('cp-ld');
        } catch (e) {
        }

    },
    /**
     * @description 设置验证码加载完毕状态方法
     * @memberOf Captcha
     * @instance
     */
    setReadyState: function () {
        var _t = this;
        _t.state = 'ready';
        try {
            _t.$elem.find('#cptrGet').html('获取');
            _t.$elem.find('#cptrTable').removeClass('cp-ld');
            _t.$image.removeClass('cp-ld');
        } catch (e) {
        }
    },
    /**
     * @description 设置冷却状态方法。用于Msg和Cmb两种验证码。
     * @memberOf Captcha
     * @instance
     */
    setCooldownState: function () {
        var _t = this,
            countDown = settings.countDown,
            $elem = _t.$elem.find('#cptrGet');
        interval = setInterval(function () {
            if (countDown === 0) { // 倒计时结束
                _t.setReadyState();
                $elem.removeClass('cp-cd').removeAttr('disabled').html('获取');
                clearInterval(interval);
            } else {
                $elem.html(countDown-- + (_t.cptrType === 'Cmb' ? '秒后可重新获取' : ''));
            }
        }, 1000);
        _t.state = 'cooldown'; // 倒计时状态设为cooldown
        $elem.addClass('cp-cd').attr('disabled', true).html(countDown-- + (_t.cptrType === 'Cmb' ? '秒后可重新获取' : ''));
    },
    /**
     * @description 设置校验成功状态方法
     * @memberOf Captcha
     * @instance
     */
    setSuccessState: function () {
        var _t = this,
            $backspace = _t.$elem.find('td.cp-del'),
            $indicator = _t.$elem.find('#cptrTip'),
            $success = null,
            fixPosition = function ($cptrPop) {
                var marginTop = '-' + $cptrPop.get(0).clientHeight / 2 + 'px';
                $cptrPop.css('margin-top', marginTop);
            };
        _t.state = 'success';
        _t.$input.attr('readonly', 'readonly');
        _t.$elem.find('#cptrChange').remove();
        _t.setPrompt('输入正确！');
        $indicator.remove();

        if (_t.cptrType === 'Bsc' || _t.cptrType === 'Msg') {
            $success = $('<span class="cp-ok cp-pos"></span>');
            $success.insertAfter(_t.$input);
        } else {
            _t.$elem.find('#sqrTable').closest('li').remove();
            $success = $(document.createElement('td'));
            $success.css({'border': '0'}).html('<span class="cp-ok"></span>');
            $backspace.hide();
            $success.insertAfter($backspace);
            $backspace.remove();
        }
        clearInterval(interval);
        _t.$elem.find('#cptrGet').remove();
        _t.$elem.find('.cp-tip').remove();
        _t.$elem.find('.cp-opr').css('height', '0');
        try {
            _t.$image.remove();
        } catch (e) {
        }
        fixPosition(_t.$elem.find('#cp-pop'));
        _t.$elem.find('.cp-btn').attr('disabled', true);
        setTimeout(function () {
            _t.$elem.find('.cp-btn').removeAttr('disabled');
        }, 500);
    },
    /**
     * @description 设置验证码获取失败状态方法
     * @memberOf Captcha
     * @instance
     */
    setErrorState: function (message) {
        var _t = this;
        message = message || '验证码加载失败';
        try {
            _t.$elem.find('#cptrGet').html('获取');
            _t.$elem.find('#cptrTable').removeClass('cp-ld');
            _t.$image.removeClass('cp-ld');
        } catch (e) {
        }
        _t.state = 'error';
        _t.type = 0;
        _t.cptrType = 'Error';
        _t.setPrompt(message);
    },
    /**
     * @description 设置验证码校验错误状态方法
     * @memberOf Captcha
     * @instance
     */
    setFailState: function () {
        // #TODO: 设置验证码校验错误状态方法
        return false;
    },
    /**
     * @description 验证码校验方法
     * @memberOf Captcha
     * @instance
     * @param {Boolean} onSubmit 是否处于提交状态
     * @return {object} ajaxValidator校验对象
     */
    validateCaptcha: function (onSubmit) {
        var _t = this,
            value = _t.$input.val().replace(/(^\s*)|(\s*$)/g, ""),
            params = '',
            isTimeout = false,
            regexList = {
                'Bsc': '^[0-9a-zA-Z]{1,6}$',
                'Msg': '^[0-9a-zA-Z]{5,6}$',
                'Sqr': '^[0-9]{4}$',
                'Cmb': '^[0-9]{2,6}$'
            },
            regex = new RegExp(regexList[_t.cptrType]),
            timer = setTimeout(function () {
                if (_t.state === 'loading') {
                    isTimeout = true; // 设置超时标识为true
                    message = '服务器超时！';
                    _t.setErrorState(message);
                }
            }, 10000); // 超时10秒仍然处于loading状态时则置为错误状态
        // 去除首尾空格
        _t.$input.val(value);
        // 非空与正则校验
        if (value.length === 0) {
            _post.showTip(_t.$input, '请输入验证码');
            return false;
        } else if (!value.match(regex)) {
            _post.showTip(_t.$input, '验证码输入有误');
            return false;
        }
        if (onSubmit && _t.state === 'success') {
            _t.$elem.addClass('cp-hide');
            _t.state = 'ready';
            _post.send(_t.$input.val(), _t.type);
            return true;
        }
        params += (_t.validateUrl.indexOf('?') > -1 ? '&' : '?') + 'captcha_input=' + value;
        params += '&captcha_type=' + $('#captcha_type').val();
        // 服务器校验
        $.ajax({
            dataType: 'jsonp',
            url: _t.validateUrl + params + '&callback=?',
            success: function (json) {
                var data;
                // 如果超时10秒，即使10秒返回成功，也不重新加载验证码
                if (isTimeout) {
                    return false;
                }
                if (json && json.code == '0') {
                    if (json.data.result + '' === 'true') {
                        _t.setSuccessState();
                        _t.$elem.find('#cptrTip').removeAttr('id');
                        // 如果onSubmit为true，表明正在提交表单
                        if (onSubmit) {
                            _t.$elem.addClass('cp-hide');
                            _t.state = 'ready';
                            _post.send(_t.$input.val(), _t.type);
                        }
                        return true;
                    } else {
                        _t.errorCount++;
                        _post.showTip(_t.$input, '验证码错误');
                        if (_t.cptrType === 'Sqr' || _t.cptrType === 'Cmb') {
                            _t.resetGrid(); // 重置九宫格
                            // 处于倒计时状态时不重新获取验证码
                            if (_t.state === 'cooldown') return false;

                            _t.refactor(_t.cptrKey);
                            _t.$input.val('');
                        }
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        });

    },
    /**
     * @description 绑定发布、取消按钮等事件
     * @memberOf Captcha
     * @instance
     */
    bindEvents: function () {
        var _t = this;
        // “取消”按钮事件
        _t.$elem.find('.cp-btn-ccl').bind('click', function (e) {
            destroyCaptcha();
        });
        // “发布”按钮事件
        _t.$elem.find('.cp-btn-smt').bind('click', function (e) {
            var hidden_type = $("#captcha_type");
            var hidden_value = $("#" + settings.cptrIptId);
            hidden_type.val(_t.type);
            hidden_value.val(_t.$input.val());
            _t.validateCaptcha(true);
            return false;
        });
        // 键盘“前往”点击事件
        _t.$input.bind('keypress', function (e) {
            if (e.keyCode === 13) _t.validateCaptcha(true);
        });

        $("#cp-pop").bind('touchmove', function (e) {
            e.preventDefault();
        });
        $("#cp-mask").bind('touchmove', function (e) {
            e.preventDefault();
        });
    }
};

var captcha = null;

var initCaptcha = function (cptrKey, options) {
    // 将webView放大至全屏大小，并将webView层级置于native之上来隐藏图片上传面板
    try {
        webviewZoom.action({'status': '1'});
        webviewTouch.action({'clickStatus': '1'});
        hideDialog.action({'code': 0});
    } catch (err) {}
    if (!captcha) {
        captcha = new Captcha(cptrKey, options);
    } else {
        captcha.refactor(cptrKey, options);
    }

};

var destroyCaptcha = function () {
    try {
        webviewZoom.action({'status': '0'});
    } catch (err) {
    }

    if (!!captcha) {
        captcha.destroy();
        captcha = null;
    }
};

export {
    initCaptcha as IQASCaptcha
}
