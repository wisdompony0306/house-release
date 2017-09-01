/**
 * Created by a58 on 2017/8/31.
 */

/**
 * 从当前URL里面提取参数值
 * @param name 参数名称
 * @returns {string} 参数值
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        return '';
    }
}

/**
 * desc:获取名字为name的Cookie值
 * @param name
 * @returns {string}
 */
function getCookie(name) {
    let value = '';
    if (window.document.cookie.length > 0 && name) {
        const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        const arr = window.document.cookie.match(reg);
        if (arr) {
            value = decodeURIComponent(arr[2]);
        }
    }
    return value;
};

/**
 * desc:px转rem
 * @param px 没有单位
 * @returns {string}
 */
function px2rem(px = 0) {
    let rem = px / 75 + 'rem';
    return rem;
};

/**
 * version1>=version2 true
 * version1<version2 false
 * 以逗号分隔的两个字符串比较大小
 * @param version1
 * @param version2
 * @returns {*}
 */
function compareEgt(version1, version2) {
    if (typeof version1 !== 'string' || typeof version2 !== 'string') {
        return false;
    }
    let version1Arr = version1.split('.');
    let version2Arr = version2.split('.');
    let len = version1Arr.length > version2Arr.length ? version1Arr.length : version2Arr.length;
    for (let i = 0; i < len; i++) {
        let v1 = version1Arr[i] ? parseInt(version1Arr[i]) : 0;
        let v2 = version2Arr[i] ? parseInt(version2Arr[i]) : 0;
        if (v1 == v2) {

        } else if (v1 > v2) {
            return true;
        } else {
            return false;
        }
    }
    return true;
};

/**
 * 是否是yyyy-MM-dd HH:mm:ss格式的字符串
 * @param dateTimeStr
 * @returns {boolean}
 */
function isDateTimeStr(dateTimeStr) {
    let res = false;
    if (typeof dateTimeStr === 'string') {
        const reg = new RegExp('(\\d{4}-\\d{1,2}-\\d{1,2} \\d{1,2}:\\d{1,2}:\\d{1,2})');
        const arr = dateTimeStr.match(reg) || [];
        if (arr && arr.length > 0) {
            res = true;
        }
    }
    return res;
}

export {
    getUrlParam,
    getCookie,
    px2rem,
    compareEgt,
    isDateTimeStr,
}