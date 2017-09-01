var express = require('express');
var path = require('path');
var http = require('http');
var ejs = require('ejs');
var reload = require('reload');
var app = express();
var port = 8007;
var hostDomain = 'test.58.com';


process.env.NODE_ENV = 'devServer';

app.engine('.html', ejs.__express);
app.set('views', path.join(__dirname, '../build'));
app.set('view engine', 'html');

app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = false;

var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware');
var webpackDevConfig = require('./webpack.dev.config.js');

var compiler = webpack(webpackDevConfig);

app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackDevConfig.output.publicPath,
    noInfo: true,
    stats: {
        colors: true
    }
}));
app.use(webpackHotMiddleware(compiler));

require('./routes')(app);

/*var bs = require('browser-sync').create();
 app.listen(port, function () {
 bs.init({
 open: false,
 ui: false,
 notify: false,
 proxy: 'localhost:' + port,
 files: ['../!**'],
 port: 8080
 });
 });*/

var server = http.createServer(app);
reload(server, app);

server.listen(port, function () {
    let url = "http://houserent.m.58.com";
    console.log('本地模拟数据请求方式:' + port);
    console.log('1、配置host:127.0.0.1 ' + hostDomain);
    console.log('2、在config/routers.js 添加模板请求路径和数据,每次如果服务启动的时候加的数据需要从新npm run devServer');
    console.log('3、控制台:npm run devServer');
    console.log('4、浏览器打开 http://' + hostDomain + ':' + port + '/demo');
    console.log('5、点击对应的页面');
});
