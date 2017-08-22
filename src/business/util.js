/* eslint-disable */

const Util = {
    isArray (value) {
        if (typeof value === 'object' && Object.prototype.toString.call(value).toLowerCase() === '[object array]') {
            return true;
        }
        return false;
    },
    isJSON (value) {
        if (typeof (value) === 'object' && Object.prototype.toString.call(value).toLowerCase() === '[object object]' && !value.length) {
            return true;
        }
        return false;
    },
    mixin (...sources) {
        const _target = Object.assign({}, ...sources);
        return _target;
    },

    // 保证把val包装成合法的对象格式
    parse (val) {
        let result = val;

        // val.trim() === ''时
        if (typeof val === 'string') {
            if (!val.trim()) {
                result = {};
            } else {
                result = JSON.parse(val);
            }
        } else if (!val) {
            result = {};
        }
        return result;
    },
    /**
     * TODO:老文件中的方法,需要重写
     * 比较两个版本，如果 version1 版本高于或等于 version2，返回true,否则返回false
     * 参数version1, version2是字符串类型 @String
     */
    isAppVersionEgt (version1, version2) {
        if (typeof version1 !== 'string' || typeof version2 !== 'string') {
            return false;
        }
        const version1Arr = version1.split('.');
        const version2Arr = version2.split('.');
        let len = 0;
        version1Arr.length > version2Arr.length ? len = version1Arr.length : len = version2Arr.length;
        for (let i = 0, ver1_i = 0, ver2_i = 0; i < len; i++) {
            version1Arr[i] ? ver1_i = parseInt(version1Arr[i]) : ver1_i = 0;
            version2Arr[i] ? ver2_i = parseInt(version2Arr[i]) : ver2_i = 0;
            if (ver1_i === ver2_i) {

            } else if (ver1_i > ver2_i) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    },
    /**
     * 获取 cookie
     */
    getCookie (name, encode) {
        for (let arg = `${name}=`, alen = arg.length, clen = document.cookie.length, i = 0, j = 0; i < clen;) {
            if (j = i + alen, document.cookie.substring(i, j) == arg) {
                let endstr = document.cookie.indexOf(';', j);
                if (endstr == -1) {
                    endstr = document.cookie.length;
                }
                let _value;
                if (encode == 0) {
                    _value = document.cookie.substring(j, endstr);
                } else {
                    _value = decodeURIComponent(document.cookie.substring(i, endstr));
                }
                return _value;
            }
            if (i = document.cookie.indexOf(' ', i) + 1, i == 0) {
                break;
            }
        }
        return null;
    },
    /**
     *  设置 cookie
     */
    setCookie (name, value, expires, path, domain, secure) {
        let argv = arguments,
            argc = arguments.length,
            now = new Date();

        expires = argc > 2 ? (new Date()).getTime() + 24 * parseInt(expires) * 60 * 60 * 1e3 : new Date(now.getFullYear(), now.getMonth() + 1, now.getUTCDate());
        path = argc > 3 ? argv[3] : '/';
        domain = argc > 4 ? argv[4] : '.58.com';
        secure = argc > 5 && argv[5];

        const _expires = expires == null ? '' : `; expires=${new Date(expires).toGMTString()}`;
        const _path = path == null ? '' : `; path=${path}`;
        const _domain = domain == null ? '' : `; domain=${domain}`;
        const _secure = secure == 1 ? '; secure' : '';
        document.cookie = `${name}=${encodeURIComponent(value)}${_expires}${_path}${_domain}${_secure}`;
    },
    /**
     * 原mclient_ui.js中的方法
     * @param url
     * @param pName
     * @returns {*}
     */
    removeUrlParam (b, c) {
        const d = new RegExp(`${c}=[^&]*`, 'gmi');
        b = b.replace(d, '');
        if (b.indexOf('&') == b.length - 1) {
            b = b.substring(0, b.length - 1);
        }
        if (b.indexOf('?') == b.length - 1) {
            b = b.substring(0, b.length - 1);
        }
        b = b.replace('?&', '?').replace('&&', '&');
        b = b.replace(/&$/, '');
        return b;
    },
};

export default Util;

