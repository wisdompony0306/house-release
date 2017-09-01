/**
 * Created by a58 on 2017/8/23.
 *
 * 指令入口文件
 */

import track from './track';

exports.install = (Vue) => {
    /*日志埋点*/
    Vue.directive('track', track);
};
