/* eslint-disable import/no-extraneous-dependencies */

/**
 * 将build得到的代码传到ftp
 */

const gulp = require('gulp');
const ftp = require('gulp-ftp');
const path = require('path');
const argv = require('yargs').argv;
const fs = require('fs');
require('colors');

// 将cateName传到ftp，如果文件不存在则报错提示
function deploy (cate) {
    let filePath = '';
    let cateName = '';
    if (cate) {
        cateName = cate.replace(/\.js$/, '');
    }

    // 传输vendor
    if (cateName === 'vendor') {
        filePath = path.resolve(__dirname, './build/pages/vendor.js');
    } else {
        // 传输业务文件
        filePath = path.resolve(__dirname, `./build/pages/fangchan/${cateName}.js`);
    }
    if (!fs.existsSync(filePath)) {
        console.log('>> error 以下文件不存在:'.red, cateName);
        return;
    }
    console.log('>> 正在上传:'.yellow, `${filePath}`);
    gulp.src(filePath)
        .pipe(ftp({
            host: '192.168.185.128',
            user: 'qatest',
            pass: '58ftp@fe',
            remotePath: '/pic2.58.com/m58/app58/m_static/js/fang_release',
        }));
}

gulp.task('deploy', (cb) => {
    const cateName = argv.cate;

    // vendor肯定要传
    deploy('vendor');

    // 传输所有业务
    if (cateName === 'all') {
        fs.readdir(path.resolve(__dirname, './build/pages/fangchan/'), (err, names) => {
            if (err) {
                return new Error(err);
            }
            return names.forEach((name) => {
                if (path.extname(name) === '.js') {
                    deploy(name);
                }
            });
        });
    } else { // 传输一个业务
        deploy(cateName);
    }
    cb();
});

gulp.task('default', () => {

});
