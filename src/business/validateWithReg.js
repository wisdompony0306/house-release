/**
 * 同步校验
 * @param:
 * > ruleObj: 校验规则 Object[], 或者Object
 * > val: 被校验的值，String[]，或者String
 * > el: 可选，校验失败的话自动滚动到el节点处
 */
import scrollTo from './scrollIntoView';

function validate (ruleObj = '', val, el) {
    const result = {
        validateState: true,
        validateMsg: '',
    };
    if (!ruleObj.required && !val) { // 非必填,当前值为空（合法）
        return result;
    } else if (ruleObj.reg) {
        const [regArr, msgArr] = [ruleObj.reg.split('#'), ruleObj.msg.split('#')];
        if (regArr.length !== msgArr.length) {
            throw new Error('错误: 校验规则的reg和msg属性不一一对应!');
        }
        for (let i = 0, len = regArr.length; i < len; i += 1) {
            const regexp = new RegExp(regArr[i]);
            if (!regexp.test(val)) {
                result.validateState = false;
                result.validateMsg = msgArr[i];
                scrollTo(el);
                break;
            }
        }
    }
    return result;
}

export default function validateSync (ruleObj, val, el) {
    let result = {
        validateState: true,
        validateMsg: '',
    };

    // ruleObj和val为一一对应的Array，将首个通不过校验的结果返回
    if (Array.isArray(ruleObj) && Array.isArray(val)) {
        for (let i = 0, len = ruleObj.length; i < len; ++i) {
            const r = validate(ruleObj[i], val[i], el); // 对第i条规则进行校验
            if (!r.validateState) {
                result = r;
                break;
            }
        }
    } else {
        result = validate(ruleObj, val, el);
    }
    return result;
}
