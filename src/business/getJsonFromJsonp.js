/**
 * 从jsonp的返回结果中提取json数据
 */

export default function (jsonpStr) {
    return JSON.parse(/\((.+)\)$/.exec(jsonpStr)[1]);
}
