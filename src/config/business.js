/**
 * 配置模块
 * 包含所有大类的配置和大类下面各个子类的个性化配置
 * 大类及其子类的配置由【factory】方法返回，factory外边面的变量作为默认值
 */

// 厂房3级类页面【默认】配置
const pageTypeConfigDefault = {
    showDiduan: true,
    showZhuangrangfei: true,
    priceLabel: '',
    priceDanwei: '|',
    showDanwei: true,
    showPic: true, // 显示图片上传
};

function assign (diffObj) {
    return Object.assign({}, pageTypeConfigDefault, diffObj);
}

// 厂房3级类页面配置
const pageTypeConfig = {

    // 出租
    0: assign({
        showZhuangrangfei: false,
        priceLabel: '租金',
    }),

    // 求租
    1: assign({
        showDiduan: false,
        showZhuangrangfei: false,
        priceLabel: '价格',
        showPic: false,
    }),

    // 转让
    2: assign({
        priceLabel: '租金',
    }),

    // 求购
    3: assign({
        showDiduan: false,
        showZhuangrangfei: false,
        priceLabel: '价格',
        priceDanwei: '万元',
        showDanwei: false,
        showPic: false,
    }),

    // 出售
    4: assign({
        showZhuangrangfei: false,
        priceLabel: '售价',
        priceDanwei: '万元',
        showDanwei: false,
    }),
};

/**
 * 标题自动填充的字段
 * 填充结果: for ( formDatas[key] + [append]? ).join(' ')
 * 填充结果举例： '大山子 xx地段 厂房 123平米'
 */
const titleAutoFillKeys = [
    {
        key: 'localAddr.1.text', // 区域的text字段
    }, {
        key: 'diduan', // 地段
    }, {
        key: 'ObjectType.selected.text', // 类型的text字段
    }, {
        key: 'area',    // 面积
        append: '平米',
    },
];

// 可以上传多少张图片
const picNum = 24;

// 哪个端（pc/m/app）
const client = 'app';

// 是否选择设置隐私保护，隐藏真实号码,通过设置selected为on或者off实现开关组件
const gobguanximihao = {
    on: '1',
    off: '0',
    selected: '0',
};
/**
 * 表单校验规则
 * 属性说明:
 *      required: 表单字段是否为必填项 取值 true|false
 *      reg:正则表达式, 多个正则以#分隔
 *      msg:验证提示信息,多个提示以#分隔,与reg一一对应,
 */
const formRules = {
    localAddr: [
        {
            required: true,
            reg: '^[\\s\\S]+$',
            msg: '请填写区域',
        },
        {
            required: true,
            reg: '^[\\s\\S]+$',
            msg: '请填写商圈',
        },
    ],
    diduan: {
        required: true,
        reg: '^[\\s\\S]+$#^(.){2,12}$#^([^\\s]\\s{0,6}(?!([0-9０１２３４５６７８９零一二三四五六七八九壹贰叁肆伍陆柒捌玖]{6}|\\s)))+$#^(?!.*([^0-9a-zA-Z\\u4e00-\\u9fa5]{2,})).*$',
        msg: '请填写地段#地段字数不足#地段不能填写电话号码#地段不能填写特殊字符',
    },
    area: {
        required: true,
        reg: '^[\\s\\S]+$#^[1-9]\\d{0,6}$',
        msg: '请填写面积#面积必须是大于0的整数',
    },
    zhuanrangfei: {
        required: true,
        reg: '^[\\s\\S]+$#^\\d{1,4}(\\.\\d{1,1})?$',
        msg: '请填写转让费#转让费4位数以内，可精确至小数点后1位',
    },
    minPrice: {
        required: true,
        reg: '^[\\s\\S]+$#^[1-9]\\d{0,7}(\\.\\d{1,2})?$',
        msg: '请填写租金#租金8位数以内，可精确至小数点后2位',
    },
    danwei: {
        required: true,
        reg: '^[\\s\\S]+$',
        msg: '请填写金额单位',
    },
    ObjectType: {
        required: true,
        reg: '^[\\s\\S]+$',
        msg: '请填写类型',
    },
    Title: {
        required: true,
        reg: '^[\\s\\S]+$#^(.){8,28}$#^((?!([0-9０１２３４５６７８９]{11}))\\S\\s*)+$',
        msg: '标题字数不足8字#标题字数不足8字#标题不能含有手机号',
    },
    Content: {
        required: true,
        reg: '^[\\s\\S]+$#^[\\s\\S]{10,2000}$',
        msg: '描述字数不足10字#描述字数不足10字',
    },
    goblianxiren: {
        required: true,
        reg: '^[\\s\\S]+$#^(\\S){2,6}$#^[\\w\\d\\s\\u4e00-\\u9fa5]*$',
        msg: '请填写联系人#联系人为2-6字#联系人不能含有特殊字符',
    },
    Phone: {
        required: true,
        reg: '^[\\s\\S]+$#^1(3[0-9]|4[57]|5[0-35-9]|7[0-36-8]|8[0-9])\\d{8}$',
        msg: '请填写手机号#请输入有效手机号',
    },
    isBiz: {
        required: true,
        reg: '^[\\s\\S]+$',
        msg: '请填写身份',
    },
};

// 与接口相关的静态错误信息配置（后端没有配置所有的错误提示信息，例如返回的errorCode：-2对应的errorMsg：'needVerify'）
const errorMsgConfig = {
    // 手机号
    phone: {
        '-1': '使用该联系电话的58账户过多，请填写其他电话',
        '-4': '该手机号已被其它账户绑定，请更改联系电话或直接用该手机号登录',
    },

    // 验证码
    yzm: {
        default: '获取短信验证码出错', // 获取短信验证码接口出错时的统一文案
        validateError: '校验出错，请重试',
        captchaError: '验证码错误',
        empty: '请输入验证码',
    },
};

export {
    picNum,
    client,
    titleAutoFillKeys,
    gobguanximihao,
    formRules,
    errorMsgConfig,
    pageTypeConfig,
};

// todo 每个子类走不同的配置，同时不要引入全部代码
