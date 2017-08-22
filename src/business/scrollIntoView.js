/**
 * 让@el滚动到可视区域
 */

export default function (el) {
    if (el && typeof el.scrollIntoViewIfNeeded === 'function') {
        el.scrollIntoViewIfNeeded();
    }
}
