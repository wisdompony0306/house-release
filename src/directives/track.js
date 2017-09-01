/**
 * Created by lunachi on 2017/8/23.
 */
const track = {
    bind: function (el, binding, vnode) {
        el.addEventListener('click', function (e) {
            //WBAPP.toastMsg("点击 " + (new Date()).getTime());
        }, false);
    },
    unbind: function (el, binding, vnode) {

    },
};
export default track;