/**
 * @param:
 * str
 * sp1, 如 &
 * sp2， 如 =
 * @returns {}
 */
function getUrlParams (str, sp1, sp2) {
    const result = {};
    if (str && sp1 && sp2) {
        const arr = str.split(sp1);
        for (let i = 0, len = arr.length; i < len; i++) {
            const [name, value] = arr[i].split(sp2);
            result[name] = value;
        }
    }
    return result;
}

/**
 * 解析url中的query参数
 * @returns {}
 */
export default function () {
    const search = window.location.search;
    let result = {};
    if (search) {
        result = getUrlParams(search.substring(1, search.length), '&', '=');
    }
    return result;
}
