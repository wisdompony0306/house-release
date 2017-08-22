/**
 * 包装【模版里的数据】
 */

import Util from '../business/util';
import getUrlParams from '../business/getUrlParams';

const PAGE_DATA = window.pageData; // 模版里的全局变量

// 从cookie中获取PPU（包含了userid等信息）
function getPPUFromCookie () {
    let ppu = '';
    const reg = new RegExp('(^| )PPU=([^;]*)(;|$)');
    const arr = document.cookie.match(reg) || [];
    if (arr) {
        ppu = decodeURIComponent(arr[2]);
    }
    return ppu;
}

// 获取模板中的userId，没有时取cookie中的。
function getUserId () {
    let userId = PAGE_DATA.initData.userid || '';
    if (!userId) {
        const ppu = getPPUFromCookie();
        if (ppu) {
            userId = (ppu.match(/UID=(\d*)&/)) ? RegExp.$1 : '';
        }
    }
    return userId;
}

/**
 * 获取当前页面分类和区域信息 Object
 * 注: pc端和app端locallist不统一,pc端是对象,app端是数组
 */
function getJson4fe () {
    const json4fe = PAGE_DATA.json4fe;

    // 设置默认值：
    let [firstCate, secondCate, currentCity] = [{
        dispid: '1',
        name: '房产信息',
        listname: 'house',
    }, {
        dispid: '',
        name: '',
        listname: '',
    }, {
        dispid: '',
        name: '',
        listname: '',
    }];
    if (json4fe) {
        const catentry = json4fe.catentry;
        const locallist = json4fe.locallist;
        if (catentry && catentry.length) {
            firstCate = catentry[0];
            secondCate = catentry.length > 1 ? catentry[1] : firstCate;
        }
        if (locallist) {
            currentCity = Util.isArray(locallist) ? locallist[0] : locallist;
        }
    }
    return [firstCate, secondCate, currentCity];
}

const [firstCate, secondCate, currentCity] = getJson4fe();

function getCityIdFromCookie () {
    let cid = '';
    const reg = new RegExp('(^| )cid=([^;]*)(;|$)');
    const arr = document.cookie.match(reg);
    if (arr) {
        cid = decodeURIComponent(arr[2]);
    }
    return cid;
}

// 没有默认选中项时将首项选中
function getDatasrc () {
    const r = PAGE_DATA.dataSrc || {};
    Object.keys(r).forEach((dataSrcItemKey) => {
        const dataSrcItemOpt = r[dataSrcItemKey].option;
        const selectedItemAry = dataSrcItemOpt.filter(opt => opt.selected === true || opt.selected === 'true');
        if (!selectedItemAry.length) {
            dataSrcItemOpt[0].selected = true;
        }
    });
    return r;
}
const dataSrc = getDatasrc();

function getExtData () {
    const extData = Util.parse(PAGE_DATA.extData);
    const extDataDefault = {
        isBizDefault: 0, // isBiz字段默认值
        isBizDisable: 0, // isBiz字段是否禁用
        payType: '', // 支付类型
        userType: '', // 用户类型,需后端RD给出值的枚举情况
        wkLimitPost: true, // 是否有孙悟空发帖上限逻辑
        yinsiShowType: 0, // 当用户为个人时，iqas检查是否启用隐私保护
        isCatesToCheckBiz: false, // 整租改版时新增,用途需确认 todo
        isBiz: false, // 与isCatesToCheckBiz联合使用
        isVerifiedName: false,
        isVerifiedLicense: false,
        pageTips: '',
        localArea: {},
        localDiduan: {},
    };
    return Util.mixin(extDataDefault, extData);
}

// 页面类型为[修改]时，用于回填表单的信息 Array
function getInfoData () {
    let info = PAGE_DATA.infoParamJson || [];
    if (!Object.keys(info).length) {
        info = [];
    }
    return info;
}

// 所有可能的url参数
const {
    // 一级类别listname,默认house
    topcate = 'house',
    /**
     * 当前分类
     * 取值类型2种:
     *  1 `二级类id-三级类单元参数id`，如 15-0
     *  2 二级类id
     */
    currentcate = '',
    /**
     * 以逗号分隔的地域全路径id
     * 例: 北京市朝阳区大山子  对应值:1,1142,7551
     * 取值类型4种
     *  1、空  对应值: 空
     *  2、城市id  对应值: 1
     *  3、城市id,区域id  对应值: 1,1142
     *  4、城市id,区域id,商圈id  对应值:1,1142,7551
     */
    location = '',
    /**
     * 经纬度类型 如百度、谷歌,
     * 取值:
     *  1、空
     *  2、baidu
     *  ....
     */
    geotype = '',
    /**
     * 以逗号分隔的经纬度
     * 取值类型2种
     *  1、空
     *  2、以逗号分隔的经纬度 例:39.993680,116.511060
     */
    geoia = '',
    /**
     * 三级类单元参数（Type）,
     * 【添加】时取url中的gq，【修改】时取取infoParamJson的type值
     * 取值单元参数的value
     * 对应老模板中的gongqiu字段
     * 取值类型2种
     *  1、空
     *  2、三级类别单元参数id
     */
    gq: type = '',
    /**
     * 来源
     * 取值类型2种
     *  1、空
     *  2、来源标识 例:home（app主页）
     */
    formatsourse = '',
    /**
     * 从个人中心进入的时候,如果是草稿,url中会带isdraft=true的参数
     * 例:https://pwebapp.58.com/fang/1/8/s5?s5=&topcate=house&os=ios&isdraft=true&free=1
     */
    isdraft = false,
    /**
     * 系统平台,如:ios或android或空
     */
    os: platform = '',
    /**
     * 当前版本
     */
    cversion = '',
} = getUrlParams();

/**
 * 有修改信息,取info中的type,没有取url中的
 */
function getType () {
    const infoData = getInfoData();
    let typeResult = type; // url中的gq
    if (Util.isArray(infoData)) {
        const len = infoData.length;
        for (let i = 0; i < len; ++i) {
            const data = infoData[i];
            if (data && data.paraname === 'type') {
                typeResult = data.value || 0;
                break;
            }
        }
    } else if (Util.isJSON(infoData) && typeof infoData.type !== 'undefined') {
        typeResult = infoData.type;
    }
    return typeResult;
}

/**
 * 获取当前type的单元参数
 * @return option内的【value === getType()】的item
 */
function getCurrentType () {
    const gettedType = getType();
    const datasrc = dataSrc;
    let currentType = null;
    if (typeof datasrc.type !== 'undefined' && datasrc.type.option && gettedType !== '') {
        const len = datasrc.type.option.length;
        for (let i = 0; i < len; ++i) {
            const item = datasrc.type.option[i];
            if (item && item.value === gettedType) {
                currentType = item;
                break;
            }
        }
    }
    return currentType;
}

/**
 * 老模板SelectType
 * <button type="submit" class="btn_submit" actiontype="$!go">发布</button>
 *
 * var selectType = "$!show";
 * var statisticsJson=...
 */
function getActionType () {
    const infoData = getInfoData();
    let show = 'show';// 对应老模板中的$!show后端变量
    let go = 'go';// 对应老模板中的$!go后端变量,

    if (infoData && infoData.length) {
        show = 'editshow';
        go = 'editgo';
    } else if (isdraft) {
        show = 'draftshow';
    }
    return {
        show,
        go,
    };
}

/**
 * 修改信息时,如果json4fe中的城市和手机定位的城市不一致,则修改信息是区域字段灰显不可编辑
 */
function getCanEditLocal () {
    const currentCityId = currentCity.dispid;
    const cookieCityId = getCityIdFromCookie();
    let canEditLocal = true;
    if (PAGE_DATA.initData.operate === 'edit' && currentCityId !== '' && currentCityId !== cookieCityId) {
        canEditLocal = false;
    }
    return canEditLocal;
}

/**
 * 用于选择区域（包含localArea、localDiduan）（select-localAddr）
 * 格式：
 localAddr: [{
            paramname: 'localArea',
            value    : '1142',
            text     : '朝阳',
        }, {
            paramname: 'localDiduan',
            value    : '7551',
            text     : '大山子',
        }]
 */
function getLocalAddr () {
    const extMap = getExtData();
    let { localArea, localDiduan } = extMap;
    localArea = Util.parse(localArea);
    localDiduan = Util.parse(localDiduan);

    return [{
        paramname: 'localArea',
        value: localArea.value || '',
        text: localArea.text || '',
    }, {
        paramname: 'localDiduan',
        value: localDiduan.value || '',
        text: localDiduan.text || '',
    }];
}

// 将 Array infoParamJson转换为 Object infoParamObj
function getInfoParamObj () {
    const r = {};
    getInfoData().forEach((item) => {
        r[item.paraname] = item.value;
    });
    return r;
}

/**
 * 页面参数按分类整理
 */
const exportedData = {
    firstCate, // 一级分类
    secondCate, // 二级分类
    currentCity, // 当前城市

    // 当前type的单元参数
    currentType: getCurrentType(),

    // dataSrc: 单元参数json,所有跟页面渲染的参数,特殊处理,isBiz在cmcs系统中是input类型,但页面要显示成单选类型,需要后端RD按单元参数格式拼接
    dataSrc,

    // 页面类型为修改时，用于填充页面内容的信息
    infoData: getInfoData(),

    // iqas事前检测数据, Object
    iqasData: PAGE_DATA.iqasData || {},

    // 初始化页面数据json,基本都是跟url相关的参数,不与业务有关
    initData: {
        protocol: window.location.protocol,
        rootDomain: window.location.host,
        pathname: window.location.pathname,
        search: window.location.search,
        currentUrl: document.location.href,
        topcate,
        currentcate,
        location: location || currentCity.dispid,
        geotype,
        geoia,
        formatsourse,
        platform,
        isIos: platform.toLowerCase() === 'ios',
        isAndroid: platform.toLowerCase() === 'android',
        cversion,
        headerData: getPPUFromCookie(), // RD取的是naive的ppu
        shoujishipai: '617383', // 模板中写死为617383,取值:617383代表不是实拍，617382代表实拍
        hidPostParam: '0', // 模板中写死为0
        cateFullPath: [firstCate.dispid, secondCate.dispid].join(','), // 以逗号分隔的分类id
        userId: getUserId(), // 用户id
        type: getType(),
        isdraft,
        operate: PAGE_DATA.initData.operate,

        show: getActionType().show,
        /**
         * 表示描述是否为用户填写的，true表示描述为用户填写，false表示描述是自动生成的
         * 厂房类别没有用到,租房、合租、二手房会根据用户是否填写Content是否为空来拼接数据
         * 可由前端控制
         */
        hasDescription: true,
        /**
         * 仓房类别没有用到,
         * 后端RD helper方法,应放到extData中
         * {
         * "quyu":[
         * {"name":"", "value":"1142"},
         * {"name":"", "value":"7551"}
         * ],
         * "xiaoqu":[
         * {"name":"酒仙桥北路5号院", "id":"2075279", "address":"酒仙桥北路" },
         * {"name":"酒仙桥中路1号", "id":"1102652", "address":"酒仙桥中路1号" },
         * {"name":"酒仙桥北路1号院", "id":"2075278", "address":"酒仙桥北路" },
         * {"name":"银枫家园", "id":"1184", "address":"酒仙桥北路7号" },
         * {"name":"银湖别墅", "id":"13934", "address":"首都机场路" },
         * {"name":"金枫大厦", "id":"1102854", "address":"彩虹路甲6号" }
         * ]
         * };
         * todo 选择小区的组件会用到
         */
        nearxiaoqu: {},
        canEditLocal: getCanEditLocal(), // 修改时区域是否可编辑
    },

    // 所有跟业务有关的数据,后端RD给的值
    extData: getExtData(),

    // infoParamJson转为 Object，方便取值
    infoParamObj: getInfoParamObj(),

    // 用于选择区域的数据格式，包含localArea、localDiduan（select-localAddr）
    localAddr: getLocalAddr(),

    // 发布的类型
    isadd: PAGE_DATA.initData.operate === 'post',
    isDraft: PAGE_DATA.initData.operate === 'draft',
    isRefabu: PAGE_DATA.initData.operate === 'refabu',
    isEdit: PAGE_DATA.initData.operate === 'edit',
};

// 为开发环境加一些方便开发的数据
if (process.env.NODE_ENV === 'dev') {
    const useFakeInfojson = 1;     // 是否使用假的 infoParamJson 初始化表单填充
    if (useFakeInfojson) {
        exportedData.initData.operate = 'edit';
        exportedData.infoData = [
            { paraname: 'Phone', value: '18721784564' },
            { paraname: 'Title', value: '大山子 地段 厂房 9平米 ' },
            { paraname: 'diduan', value: '地段' },
            { paraname: 'minPrice', value: '80000' },
            { paraname: 'area', value: '9' },
            { paraname: 'goblianxiren', value: '测测' },

            {
                paraname: 'localArea',
                value: '1142',
                text: '朝阳',
                children: [{ paraname: 'localDiduan', value: '7551', text: '大山子' }],
            },
            { paraname: 'danwei', text: '元月', value: '3' },
            { paraname: 'ObjectType', text: '仓库', value: '1' },
            { paraname: 'isBiz', value: '1' },
            { paraname: 'Content', value: '<span>span标签内的content信息</span>' },

            { paraname: 'Pic', value: '' },
            {
                paraname: 'gobquzhi',
                value: 'objecttype=%E5%8E%82%E6%88%BF&amp;danwei=%E5%85%83%2F%E3%8E%A1%2F%E5%A4%A9&amp;type=%E5%87%BA%E7%A7%9F',
            },
            { paraname: 'postsourceid', value: '14000001' },
            { paraname: 'type', text: '出租', value: '0' },
            { paraname: 'gobsunwukong', value: '1' },
            { paraname: 'gobcookieid', value: 'c5/njFkK9J2PmbViAxxGAg' },
            { paraname: 'goblastEditClient', value: '14000001' },
            { paraname: 'gobindexeffectivedate', value: '2017-09-05 14:29:05' },
            { paraname: 'gobPostStatParam', value: '' },
            { paraname: 'category', value: '15' },
        ];
    }
}

export default exportedData;
