import fillForm from './fillForm';
import autoFillPhone from './autofillPhone';
import { setPicNum, draft, setLocalCachePublishInfo } from './appShim';
import { picNum, pageTypeConfig } from '../config/business';
import pageInitData from '../service/pageInitData';

function showPic (isedit) {
    if (!pageTypeConfig[pageInitData.currentType.value].showPic) {
        return;
    }
    const cateid = pageInitData.secondCate.dispid;
    setPicNum.action({
        num: picNum,
        cateid,
        isedit,
        picpath: pageInitData.infoParamObj.Pic || '',
    });
}

/**
 * 表单初始化
 * @params:
 * > formDatas: Object，vue-data中用于驱动表单的字段
 */
export default function () {
    switch (pageInitData.initData.operate) {
        case 'post':
            showPic(false); // 显示'拍个照呗'

            // 如果有xiaoqu字段,从cookie中取小区、区域信息 todo

            // 从native的getLocalCacheInfo取缓存信息回填表单
            setLocalCachePublishInfo();

            // 若已登录，自动填充手机号
            autoFillPhone();

            // 可以省去自己填写表单
            if (process.env.NODE_ENV === 'dev') {
                const autoFillForm = 1; // 开关
                if (autoFillForm) {
                    fillForm(pageInitData.infoData);
                }
            }
            break;
        case 'edit':
            showPic(true);

            // 用pageInitData.infoData回填表单
            fillForm(pageInitData.infoData);
            break;
        case 'refabu':
            showPic(false);

            // 表单回填infoParamJson数据
            fillForm(pageInitData.infoData);
            break;
        case 'draft':
            showPic(false);

            // 表单回填草稿箱数据
            draft.fillBack();
            break;
        default:
    }
}
