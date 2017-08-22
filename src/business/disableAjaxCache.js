/**
 * 为jajx的请求数据加上rand，防止缓存
 * @param:
 * dataObj: Object，必须
 */

/* eslint-disable no-param-reassign */

export default function (dataObj) {
    if (typeof dataObj && dataObj !== null) {
        dataObj.rand = +new Date();
    }
}
