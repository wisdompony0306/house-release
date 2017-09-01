/**
 * 将在各处使用该事件中心
 * 组件通过它来通信
 */
exports.install = (Vue) => {
    /*单独的事件中心管理组件间的通信*/
    const eventHub = new Vue();
    Object.defineProperty(Vue.prototype, '$eventHub', {value: eventHub});
};