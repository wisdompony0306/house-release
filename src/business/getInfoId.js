/**
 * 从url的path中获取infoid
 * @return:
 */

export default function () {
    const matchedInfoid = location.pathname.match(/\/update\/(\d+)/);
    let infoId = '';
    if (matchedInfoid) {
        infoId = matchedInfoid[1];
    }

    // 开发环境下模拟一个infoId出来
    if (process.env.NODE_ENV === 'dev') {
        if (!infoId) {
            infoId = 'fakeInfoId123456';
        }
    }
    return infoId;
}
