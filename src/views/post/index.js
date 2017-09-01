/**
 * Created by luanchi on 17/6/12.
 */
import Vue from 'vue';
import hbcExt from '../../plugins/vue.ext';
import IndexView from './index.vue';

Vue.use(hbcExt);

new Vue({
    el: '#app',
    render: (h) => h(IndexView),
    mounted(){
        window._vm = this;
        window.onunload = function (e) {
            window.scrollTo(0, 0);
        }
    },
});
