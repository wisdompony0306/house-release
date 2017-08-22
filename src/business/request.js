/**
 * 后端数据请求封装
 * axios: https://github.com/mzabriskie/axios
 * jsonp: https://github.com/webmodules/jsonp
 */

/* eslint-disable no-param-reassign */

import AXIOS from 'axios';
import JSONP from 'jsonp';
import disableAjaxCache from './disableAjaxCache';

const ERR_MSG = '网络错误，请稍后重试';

const request = {
    /**
     * get 请求
     * @param url
     * @param data
     * @param dataType
     * @param timeout
     * @param callback(err, data)
     */
    get ({ url = '', data = {}, dataType = 'json', timeout, callback = () => {}, cache = false }) {
        const config = {
            params: data,
            responseType: dataType,
        };
        if (timeout) {
            Object.assign(config, { timeout });
        }
        if (!cache) {
            disableAjaxCache(config.params);
        }
        AXIOS.get(url, config).then((response) => {
            callback(true, response.data);
        }).catch(() => {
            callback(false, ERR_MSG);
        });
    },
    /**
     * post请求
     * @param url
     * @param data
     * @param dataType
     * @param timeout
     * @param callback(err, data)
     */
    post ({ url = '', data = {}, dataType = 'json', timeout, callback = () => {}, cache = false }) {
        const config = {
            responseType: dataType,
        };
        if (timeout) {
            Object.assign(config, { timeout });
        }
        if (!cache) {
            disableAjaxCache(data);
        }
        const formData = new FormData();
        Object.keys(data).forEach((dataKey) => {
            formData.append(dataKey, data[dataKey]);
        });
        AXIOS.post(url, formData, config).then((response) => {
            callback(true, response.data);
        }).catch(() => {
            callback(false, ERR_MSG);
        });
    },
    /**
     * jsonp请求
     * @param url
     * @param data
     * @param timeout
     * @param callback
     * @param jsonpname(err, data)
     */
    jsonp ({ url = '', data, timeout, callback = () => {}, jsonpName }) {
        let urlToUse = url;
        const index = url.indexOf('?');
        if (index > -1) {
            urlToUse = url.substring(0, index);

            const search = url.substring(index + 1, url.length);
            const searchArr = search.split('&');
            const searchObj = {};

            for (let i = 0; i < searchArr.length; i++) {
                const paramArr = searchArr[i].split('=');
                if (paramArr.length > 1) {
                    searchObj[paramArr[0]] = paramArr[1];
                }
            }
            data = Object.assign({}, searchObj, data);
        }
        let search = '';
        Object.keys(data).forEach((k) => {
            if (k.toLowerCase() === 'callback') {
                jsonpName = jsonpName || data[k];
            } else {
                search += `${k}=${data[k]}&`;
            }
        });
        if (search.length > 0) {
            search = `?${search.replace(/&$/, '')}`;
        }

        urlToUse += search;

        const config = {};
        if (timeout) {
            config.timeout = timeout;
        }
        if (jsonpName && typeof jsonpName === 'string' && jsonpName.length > 0 && jsonpName !== '?') {
            config.name = jsonpName;
        }
        JSONP(urlToUse, config, (error, response) => {
            if (error) {
                callback(false, ERR_MSG);
            } else {
                callback(true, response);
            }
        });
    },
};

export default request;
