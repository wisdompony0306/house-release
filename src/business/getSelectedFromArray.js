/**
 * @param:
 * <object>obj:
 * {
 *   "paramname": "type",
 *       "title": "类型",
 *       "option": [
 *       {"value": "4", "text": "出售"},
 *       {"value": "1", "text": "求租"},
 *       {"value": "2", "text": "转让"},
 *       {"value": "3", "text": "求购"},
 *       {"value": "0", "text": "出租", "selected": "true"}
 *   ]
 * }
 * <string>optKey: 从obj的哪个字段找selected项，默认'option'
 * @return:
 * {
 *      value: '0',
 *      text: '出租',
 * }
 */

export default function (obj, optKey = 'option') {
    if (typeof obj !== 'object') {
        return {};
    }
    const option = obj[optKey];
    if (!Array.isArray(option)) {
        return {};
    }
    const selectedOp = option.filter(op => op.selected === true || op.selected === 'true');
    return selectedOp.length ? selectedOp[0] : {};
}
