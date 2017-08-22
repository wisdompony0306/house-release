/**
 * 用于开发的服务器，包括：
 * > webpack热更新功能
 * > 用于测试各个接口（孙悟空、提交等）的伪接口
 */

// 依赖包：
const path = require('path');
const argv = require('yargs').argv; // 用于读入参数
const webpack = require('webpack');
const express = require('express');
const route = require('./devApi');
const webpackHotMiddleware = require('webpack-hot-middleware');
const ip = require('ip');
require('color');

// 默认的服务：
argv.cate = 'changfang';

// webpack的配置：
const webpackConfig = require('../webpack.config')(argv); // 以dev方式启动打包

// 启用hot
if (argv.hot) {
    // 添加hot-reload：
    Object.keys(webpackConfig.entry).forEach((name) => {
        webpackConfig.entry[name] = [path.resolve(__dirname, './hotClient.js')].concat(webpackConfig.entry[name]);
    });
}

const compiler = webpack(webpackConfig);
const app = express();
const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
});
const hotMiddleware = webpackHotMiddleware(compiler, {
    log () {},
});

// 用于调试的中间件
function debugMiddleWare (req, res, next) {
    // console.log('正在访问：');
    // console.log(req);
    next();
}

app.use(devMiddleware);
if (argv.hot) {
    console.log('using hot middleware... '.red);
    app.use(hotMiddleware);
}
app.use(debugMiddleWare);
const PORT = argv.port || 8080;

// 用于测试的接口：
route(app);

app.listen(PORT, () => {
    console.log('>> 访问以下地址查看页面:'.red);
    console.log(`http://${ip.address()}:${PORT}/fangchan/${argv.cate}.html`);
});
