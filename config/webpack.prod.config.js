var webpack = require('webpack');
var Merge = require('webpack-merge');
var BaseConfig = require('./webpack.base.config');
var path = require('path');
var node_dir = path.resolve(__dirname, '../node_modules');

module.exports = function (env) {
    return Merge(BaseConfig, {
        output: {
            publicPath: '//j1.58cdn.com.cn/fangrs/fang-booking',
        },
        resolve: {
            alias: {
                "vue": node_dir + '/vue/dist/vue.min.js',
            },
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            /*new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new webpack.optimize.OccurenceOrderPlugin()*/
        ]
    })
}();

