/**
 * Created by luanchi on 17/6/12.
 *
 * 后端数据请求封装
 * axios: https://github.com/mzabriskie/axios
 * jsonp: https://github.com/webmodules/jsonp
 */
import Axios from 'axios';
import Jsonp from 'jsonp';

const ERR_MSG = 'RD Server Error!';
const request = {
    /**
     * get 请求
     * @param url
     * @param data
     * @param dataType
     * @param timeout
     * @param callback
     */
    get({url = '', data = {}, dataType = 'json', timeout, callback = (err, data) => {}}) {
        let config = {
            params: data,
            responseType: dataType,
        };
        if (timeout) {
            Object.assign(config, {timeout: timeout});
        }
        Axios.get(url, config).then(function (response) {
            callback(true, response.data);
        }).catch(function (error) {
            callback(false, ERR_MSG);
        });
    },
    /**
     * post请求
     * @param url
     * @param data
     * @param dataType
     * @param timeout
     * @param callback
     */
    post({url = '', data = {}, dataType = 'json', timeout, callback = (err, data) => {}}) {
        let config = {
            responseType: dataType,
        };
        if (timeout) {
            Object.assign(config, {timeout: timeout});
        }
        Axios.post(url, data, config).then(function (response) {
            callback(true, response.data);
        }).catch(function (error) {
            callback(false, ERR_MSG);
        });
    },
    /**
     * jsonp请求
     * @param url
     * @param data
     * @param timeout
     * @param callback
     * @param jsonpname
     */
    jsonp({url = '', data, timeout, callback = (err, data) => { }, jsonpName = 'jsoncallback'}) {
        let _url = url,
            _index = url.indexOf('?');
        if (_index > -1) {
            _url = url.substring(0, _index);

            let _search = url.substring(_index + 1, url.length),
                _searchArr = _search.split('&'),
                _searchObj = {};

            for (let i = 0; i < _searchArr.length; i++) {
                let _paramArr = _searchArr[i].split('=');
                if (_paramArr.length > 1) {
                    _searchObj[_paramArr[0]] = _paramArr[1];
                }
            }
            data = Object.assign({}, _searchObj, data);
        }
        let search = '';
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                if (k.toLowerCase() == 'callback') {
                    jsonpName = jsonpName ? jsonpName : k.toLowerCase();
                } else {
                    search += k + '=' + data[k] + '&';
                }
            }
        }
        if (search.length > 0) {
            search = '?' + search.replace(/&$/, '');
        }

        _url = _url + search;

        let config = {
            prefix: 'jp'
        };
        if (timeout) {
            config.timeout = timeout;
        }
        if (jsonpName && typeof jsonpName === 'string' && jsonpName.length > 0) {
            config.param = jsonpName;
        }

        Jsonp(_url, config, function (error, response) {
            if (error) {
                callback(false, ERR_MSG);
            } else {
                callback(true, response);
            }
        });
    },
};

export default request;