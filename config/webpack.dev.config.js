var path = require('path');
var webpack = require('webpack');
var Merge = require('webpack-merge');
var BaseConfig = require('./webpack.base.config');

module.exports = function (env) {
    return Merge(BaseConfig, {
        //devtool: 'source-map',
        output: {
            publicPath: '/build',
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    //NODE_ENV: JSON.stringify('dev')
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'dev'),
                }
            })
        ],
        /*devServer: {
         colors: true,//终端中输出结果为彩色
         historyApiFallback: true,
         host: 'test.58.com',
         hot: true,
         inline: true,
         proxy: {
         '/order/api_*': {
         target: 'http://houserent.m.58.com:8007',
         changeOrigin: true
         }
         }
         },*/
    })
}();