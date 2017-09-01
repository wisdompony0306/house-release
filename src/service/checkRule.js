/**
 * Created by luanchi on 17/6/30.
 * 表单校验
 */
/**
 * 表单字段校验
 * @param value
 * @param rules
 * @param callback
 * @returns {{state: boolean, msg: string}}
 */
function checkRule(value, rules, callback) {
    let rulesResult = {
        state: true,
        msg: ''
    };
    if (!rules.required && !value) { //非必填,当前值为空
        return rulesResult;
    } else if (rules.reg) {
        let [regArr,msgArr] = [rules.reg.split("#"), rules.msg.split("#")];
        if (regArr.length != msgArr.length) {
            throw new Error('错误: rules校验规则的reg和msg属性不匹配!');
        }
        for (let i = 0; i < regArr.length; i++) {
            let regexp = new RegExp(regArr[i]);
            if (!regexp.test(value)) {
                ([rulesResult.state, rulesResult.msg] = [false, msgArr[i]]);
                break
            }
        }
    }
    if (typeof callback === "function") {
        callback(rulesResult);
    }
    return rulesResult
}

export default checkRule;