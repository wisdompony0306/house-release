/**
 * 填充表单
 * @param:
 * > dataTobeFilled: 用来回填表单的数据。
 */

import util from './util';
import stripTags from './stripTags';
import getVueData from './getVueData';

const { formDatas } = getVueData();

function fill (dataTobeFilled) {
    const data = util.parse(dataTobeFilled);
    if (!data || !formDatas || !data.forEach) {
        return;
    }
    data.forEach((item) => {
        if (!item) {
            return;
        }
        const { value, text, children } = item;

        // infoParamJson回填信息用的是【paraname】；页面传入的业务数据字段是【paramname】，多了一个m。所以此处做了兼容处理
        let { paraname } = item;
        const { paramname } = item;
        paraname = paraname || paramname;
        const formItem = formDatas[paraname];

        // 直接返回的情况：formData中没有相应字段【除了localArea，因为这个是新增的包装字段】
        if (
            formItem === undefined &&
            paraname !== 'localArea'
        ) {
            return;
        }

        // paraname在formDatas中对应的是string的话：直接覆盖原值
        if (typeof formItem === 'string') {
            formDatas[paraname] = value;
            return;
        }

        // 将localArea转换为[select.vue type=localAddr]需要的格式
        if (paraname === 'localArea') {
            formDatas.localAddr = [{
                paramname: 'localArea',
                value,
                text,
            }, {
                paramname: 'localDiduan',
                value: children[0].value,
                text: children[0].text,
            }];
            return;
        }

        // 将 Content 转换为 [select.vue type=input] 需要的格式
        if (paraname === 'Content') {
            formItem.text = stripTags(value);
            return;
        }

        // paraname在formDatas中对应的是 [object] 的话: 覆盖原object对应的val
        if (typeof formItem === 'object') {
            const option = formItem.option;
            if (Array.isArray(option)) {
                /* eslint no-param-reassign: ["error", { "props": false }] */
                option.forEach((opt) => {
                    opt.selected = opt.value.toString() === value.toString();
                });
            }
        }
    });
}

export default fill;
