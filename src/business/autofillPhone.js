/**
 * 若已登录，自动填充手机号
 */

import apiRequest from '../service/apiRequest';
import getVueData from './getVueData';

const { formDatas } = getVueData();

export default function () {
    apiRequest.passportUserState((succUserState, res) => {
        // 已登录且获取到了电话号码(+isLogin === -1表示未登录)
        if (+res.isLogin === 0 && +res.isBind === 0) {
            console.log('>> 已登录且获取到了电话号码');
            apiRequest.repoAutofillphone((succFillPhone, phoneRes) => {
                if (+phoneRes.errorCode === 0) {
                    if (phoneRes.data.phone) {
                        formDatas.Phone = phoneRes.data.phone;
                    }
                }
                if (+phoneRes.errorCode === -1 || +phoneRes.errorCode === -2) {
                    console.log('未登录或者没有号码');
                }
            });
        }
    });
}
