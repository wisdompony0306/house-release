/**
 * Created by luanchi on 17/8/30.
 */
import Vue from 'vue';
import hbcExt from '../../plugins/vue.ext';
import IndexView from './index.vue';

Vue.use(hbcExt);

new Vue({
    el: '#app',
    render: (h) => h(IndexView),
});
