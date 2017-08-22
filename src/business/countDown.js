/**
 * 倒计时并更新文案
 * @param:
 * st: [Object], 倒计时控制的state的引用，结构按照要求固定
 * period: [Number] 时长（s），默认60
 * 返回promise，倒计时结束时执行
 * 说明：
 * 倒计时过程中的文案固定'xxs重发'形式
 */

/* eslint-disable no-param-reassign, no-plusplus */

export default function (st, period = 60) {
    const initHtml = st.btnHtml;
    const interval = 1000;
    return new Promise((resolve) => {
        st.counting = true;
        st.disable = true;
        setTimeout(function timer () {
            if (--period === 0) { // 倒计时结束
                st.counting = false;
                st.btnHtml = initHtml;
                resolve();
            } else {
                st.disable = true;
                st.btnHtml = `${period}s重发`;
                setTimeout(timer, interval);
            }
        }, interval);
    });
}
