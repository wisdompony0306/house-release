/**
 * 获取表单提交的数据
 * @param:
 * formDatas
 * pageData: 页面子类别的配置
 */

import Util from './util';
import getVueData from './getVueData';
import getInfoId from './getInfoId';
import PageInitData from '../service/pageInitData';

const { formDatas, pageData } = getVueData();

export default function () {
    const postData = {}; // 最终要提交的数据
    const gobquzhiArr = []; // 用于拼接gobquzhi字段

    // 获取formDatas里的字段
    Object.keys(formDatas).forEach((key) => {
        const value = formDatas[key];

        // 只有diduan、zhuanrangfei、danwei为显示时才表单提交该字段
        if ((!pageData.showDiduan && key === 'diduan') ||
            (!pageData.showZhuangrangfei && key === 'zhuanrangfei') ||
            (!pageData.showDanwei && key === 'danwei')) {
            return;
        }
        if (Util.isJSON(value)) {
            if (value.option && Util.isArray(value.option)) {
                // 提取数组类型中选中的option
                const selectedOpt = value.option.filter(opt => opt.selected === true || opt.selected === 'true')[0];
                if (selectedOpt) {
                    postData[key] = selectedOpt.value;
                    gobquzhiArr.push(`${key}=${encodeURIComponent(selectedOpt.text)}`);
                }
            } else if (key === 'Content') {
                postData[key] = value.text;
            }
        } else if (Util.isArray(value)) {
            // 针对地址选项：
            if (key === 'localAddr') {
                value.forEach((ai) => {
                    if (ai && ai.paramname) {
                        postData[ai.paramname] = ai.value;
                    }
                });
            }
        } else { // 字符串的内容（如输入的内容）：
            postData[key] = value;
        }
    });

    // 特殊处理
    postData.yzm = postData.captcha_type;

    // 表单隐藏字段(单元参数的字段)(将一些选中项的【文案内容】拼接起来？)
    postData.gobquzhi = gobquzhiArr.join('&');
    if (PageInitData.isEdit) {
        postData.infoid = getInfoId();
    }
    return postData;
}
