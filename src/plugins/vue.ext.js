/**
 * Created by luanchi on 17/6/12.
 */

import EventHub from './eventHub';
import EventHubAction from './eventHubAction';

import Request from '../service/request';

import * as AppShim from '../utils/appShim';
import * as Util from '../utils/util';

/*自定义全局过滤器 自动找目录下的index.js文件*/
import Filters from '../filters';
/*自定义全局指令 自动找目录下的index.js文件*/
import Directives from '../directives';

/*通用组件*/
import Loading from '../components/loading/main.vue';//加载中组件

exports.install = (Vue) => {

    /*app方法封装*/
    Object.defineProperty(Vue.prototype, '$app', {value: AppShim});
    /*帮助类*/
    Object.defineProperty(Vue.prototype, '$util', {value: Util});

    /*后端请求*/
    Object.defineProperty(Vue.prototype, '$request', {value: Request});

    /*事件中心*/
    Vue.use(EventHub);

    /*事件中心action*/
    Vue.use(EventHubAction);

    /*全局过滤器*/
    Vue.use(Filters);

    /*全局指令*/
    Vue.use(Directives);

    Vue.mixin({
        mounted() {
            let _this = this;
            _this.userIsLogin();
        },
        methods: {
            /*用户登录态判断*/
            userIsLogin(){
                let _this = this;
                _this.$app.isLogin(function (data) {
                    if (data && data.state == true) {
                        console.log("user is logged");
                    } else {
                        _this.userLogin();
                    }
                });
            },
            userLogin(){
                let _this = this;
                let _currentUrl = window.location.href;
                _this.$app.login(_currentUrl, '', 'link', !0, !0);
            },
        },
        components: {
            Loading
        }
    });
};
