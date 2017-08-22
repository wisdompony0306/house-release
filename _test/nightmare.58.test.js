/**
 * $ node _test/nightmare.58.test.js
 */
var Nightmare = require('nightmare');
var nightmare = Nightmare({show: true});

nightmare
    .goto('http://bj.58.com/')
    .type('input[id="keyword"]', '整租一居')
    .click('input[id="searchbtn"]')
    .then(function (result) {
        console.log(result);
    })
    .catch(function (error) {
        console.error('测试 failed:', error);
    });
