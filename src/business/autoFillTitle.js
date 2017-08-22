/**
 * 自动填充title
 * 逻辑：
 * > title内无数据时：按照 {} 规则填充，title非空时不自动填充
 * @param：
 * > maxlength: [Number], title-input的maxlength（默认30）
 * > titleKeyName: [String], formDatas里title字段的key名(默认'Title')
 */

import getVueData from './getVueData';
import { titleAutoFillKeys } from '../config/business';

const { formDatas } = getVueData();

function autoFillTitle (maxlength = 30, titleKeyName = 'Title') {
    const titleAry = [];
    let title = formDatas[titleKeyName];

    // title非空时不自动填充(无法判断当前已填充的内容是否是用户自己输入的)
    if (title.trim()) {
        return;
    }

    // 将autoFillKeyAry里的字段填入
    titleAutoFillKeys.forEach((autoFillkeyItem) => {
        let formDataSub = formDatas;
        const subKeys = autoFillkeyItem.key.split('.');
        for (let i = 0, len = subKeys.length; i < len; i += 1) {
            const formDataSubKey = subKeys[i];
            const formDataSubVal = formDataSub[formDataSubKey];
            if (formDataSubVal === undefined) {
                formDataSub = '';
                break;
            } else {
                formDataSub = formDataSub[formDataSubKey];
            }
        }
        if (formDataSub !== '' && autoFillkeyItem.append) {
            formDataSub += autoFillkeyItem.append;
        }
        titleAry.push(formDataSub);
    });

    // 更新title：触发视图更新
    title = titleAry.join(' ');
    if (maxlength) {
        title = title.substring(0, maxlength);
    }
    formDatas[titleKeyName] = title;
}

export default autoFillTitle;
