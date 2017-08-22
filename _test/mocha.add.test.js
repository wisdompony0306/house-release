var add = require('./mocha.add.js');
var expect = require('chai').expect;

describe('加法函数的测试', function () {
    it('1 加 1 等于 2', function () {
        expect(add(1, 1)).to.be.equal(2);
    });
    it('1 加 -1 不等于 2', function () {
        expect(add(1, -1)).to.be.not.equal(2);
    });
});
