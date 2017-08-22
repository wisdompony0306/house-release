import Request from '../business/request';
import API from './api';

/* eslint-disable no-param-reassign */

/**
 * 因有非vue组件调用后端请求,因此封装
 */
const apiRequest = {
    /**
     * passport孙悟空用户状态
     * @param params: {} 说明: json格式参数
     * @param callback: function 说明: 回调函数
     * @param jsonpName: string 说明: jsonp callback名称
     */
    passportUserState: (params, callback, jsonpName) => {
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }
        Request.jsonp({
            url: API.passportUserState,
            data: params,
            jsonpName,
            callback,
        });
    },
    /**
     * iqas 信质孙悟空验证码获取
     * @param params: {} 说明: json格式参数
     * @param callback: function 说明: 回调函数
     * @param jsonpName: string 说明: jsonp callback名称[可选]
     */
    verifycodeGetV2: (params, callback, jsonpName) => {
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }
        Request.jsonp({
            url: API.verifycodeGetV2,
            data: params,
            jsonpName,
            callback,
        });
    },
    /**
     * iqas 信质孙悟空验证码校验
     * @param params: {} 说明: json格式参数
     * @param callback: function 说明: 回调函数
     * @param jsonpName: string 说明: jsonp callback名称
     */
    verifycodeValidateV2: (params, callback, jsonpName) => {
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }
        Request.jsonp({
            url: API.verifycodeValidateV2,
            data: params,
            jsonpName,
            callback,
        });
    },
    /**
     * repo 回填手机号
     * @param params: {} 说明: json格式参数
     * @param callback: function 说明: 回调函数
     */
    repoAutofillphone: (params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }
        Request.get({
            url: API.repoAutofillphone,
            data: params,
            callback,
        });
    },
    /**
     * repo 校验手机号
     * @param params: {} 说明: json格式参数
     * @param callback: function 说明: 回调函数
     */
    repoCheckphoneV2: (params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }
        // 防止缓存
        Request.get({
            url: API.repoCheckphoneV2,
            data: params,
            callback,
        });
    },
    /**
     * iqas 验证码获取
     * @param params: {} 说明: json格式参数
     * @param callback: function 说明: 回调函数
     * @param jsonpName: string 说明: jsonp callback名称
     */
    verifycodeGet: (params, callback, jsonpName) => {
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }
        Request.jsonp({
            url: API.verifycodeGet,
            data: params,
            jsonpName,
            callback,

        });
    },
    /**
     * iqas 验证码校验
     * @param params: {} 说明: json格式参数
     * @param callback: function 说明: 回调函数
     * @param jsonpName: string 说明: jsonp callback名称
     */
    verifycodeValidate: (params, callback, jsonpName) => {
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }
        Request.jsonp({
            url: API.verifycodeValidate,
            data: params,
            jsonpName,
            callback,

        });
    },
};

export default apiRequest;
