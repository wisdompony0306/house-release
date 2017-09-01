var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlwebpackPlugin = require('html-webpack-plugin');
var node_dir = path.resolve(__dirname, '../node_modules');

module.exports = {
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor']
        }),
        new ExtractTextPlugin('[name].css'),
        new HtmlwebpackPlugin({
            title: 'demo',
            filename: 'test/demo.html',
            hash: false,
            inject: true,
            template: path.resolve(__dirname, '../_test/demo.html'),
            chunks: ['vendor', 'test/demo']
        }),
        new HtmlwebpackPlugin({
            title: '租房订单房东详情',
            filename: 'html/detailOwner.html',
            hash: false,
            inject: true,
            template: path.resolve(__dirname, '../src/templates/detailOwner.html'),
            chunks: ['vendor', 'detailOwner']
        }),
        new HtmlwebpackPlugin({
            title: '租房订单租客详情',
            filename: 'html/detailRenter.html',
            hash: false,
            inject: true,
            template: path.resolve(__dirname, '../src/templates/detailRenter.html'),
            chunks: ['vendor', 'detailRenter']
        }),
        new HtmlwebpackPlugin({
            title: '租房订单列表',
            filename: 'html/list.html',
            hash: false,
            inject: true,
            template: path.resolve(__dirname, '../src/templates/list.html'),
            chunks: ['vendor', 'list']
        }),
        new HtmlwebpackPlugin({
            title: '租房订单发布',
            filename: 'html/post.html',
            hash: false,
            inject: true,
            template: path.resolve(__dirname, '../src/templates/post.html'),
            chunks: ['vendor', 'post']
        }),
        new HtmlwebpackPlugin({
            title: '租房订单协议',
            filename: 'html/agreement.html',
            hash: false,
            inject: true,
            template: path.resolve(__dirname, '../src/templates/agreement.html'),
            chunks: ['vendor', 'agreement']
        }),
        new HtmlwebpackPlugin({
            title: '结果等待中',
            filename: 'html/wait.html',
            hash: false,
            inject: true,
            template: path.resolve(__dirname, '../src/templates/wait.html'),
            chunks: ['vendor', 'wait']
        }),
        new webpack.ProvidePlugin({
            Vue: "Vue"
        }),
    ],
    entry: {
        'vendor': ['babel-polyfill', 'vue', path.resolve(__dirname, '../src/plugins/vue.ext.js')],
        'detailOwner': path.resolve(__dirname, '../src/views/detailOwner/index'),
        'detailRenter': path.resolve(__dirname, '../src/views/detailRenter/index'),
        'list': path.resolve(__dirname, '../src/views/list/index'),
        'post': path.resolve(__dirname, '../src/views/post/index'),
        'agreement': path.resolve(__dirname, '../src/views/agreement/index'),
        'wait': path.resolve(__dirname, '../src/views/wait/index'),
        'test/demo': path.resolve(__dirname, '../_test/demo/index'),
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        publicPath: '/build',
        filename: '[name].js',
        chunkFilename: "[name].chunk.js"
    },
    resolve: {
        root: [
            path.resolve('../src')
        ],
        alias: {
            'vue': node_dir + '/vue/dist/vue.runtime.js',
        },
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.less$/, loader: ExtractTextPlugin.extract("style", "css!less")},
            {test: /\.json$/, loader: 'json'},
            {test: /\.vue$/, loader: 'vue'},
            {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url?limit=5120&name=/img/[name].[ext]'
            }
        ]
    },
    vue: {
        loaders: {
            css: ExtractTextPlugin.extract("css"),
            less: ExtractTextPlugin.extract("css!less")
        }
    },
    babel: {
        presets: ['es2015','stage-0'],
        plugins: ['transform-runtime', 'transform-object-rest-spread','transform-object-assign']
    },
    lessLoader: {
        lessPlugins: [
            {
                install: function (less) {
                    less.functions.functionRegistry.add('px2rem', function (px, size) {
                        var size = (size && size.value || 750) / 10;
                        return new (less.tree.Anonymous)(px.value / size + 'rem');
                    });
                }
            }
        ]
    },
};
