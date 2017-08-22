// 移除@str里的html标签（来源于underscore.string https://github.com/epeli/underscore.string/blob/master/stripTags.js）
module.exports = function stripTags (str) {
    return str.replace(/<\/?[^>]+>/g, '');
};
