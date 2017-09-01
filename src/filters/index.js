/**
 * Created by a58 on 2017/8/23.
 *
 * 过滤器入口文件
 */

import datetimeFormat from './datetimeFormat';

exports.install = (Vue) => {
    Vue.filter('datetimeFormat', datetimeFormat);
};