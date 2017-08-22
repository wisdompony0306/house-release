/* eslint-disable import/no-extraneous-dependencies, no-mixed-operators */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
require('colors');

const nodeDir = path.resolve(__dirname, './node_modules/');
const srcPath = path.resolve(__dirname, './src/');

module.exports = function (envOrigin) {
    const env = envOrigin || {};
    console.log('>> webpacking... your env is: '.red);
    console.log(env);
    const entry = {
        vendor: [path.resolve(__dirname, 'src/libs/polyfills.js')],
    }; // 打包的入口

    // 插件：
    let plugins = [
        // 兼容webpack1的全局配置
        new webpack.LoaderOptionsPlugin({
            options: {
                lessLoader: {
                    lessPlugins: [
                        {
                            install (less) {
                                less.functions.functionRegistry.add('px2rem', (px, size) => {
                                    const newSize = (size && size.value || 750) / 10;
                                    return new (less.tree.Anonymous)(`${px.value / newSize}rem`);
                                });
                            },
                        },
                    ],
                },
            },
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
        }),
        new ExtractTextPlugin({
            filename: '[name].css',
            disable: process.env.NODE_ENV === 'development',
        }),
        new webpack.ProvidePlugin({
            Vue: 'Vue',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(env.NODE_ENV || 'dev'),
                cate: JSON.stringify(env.cate), // 哪个业务，例如 changfang
            },
        }),
    ];

    // 是否要打包demo (传 --env.demo )
    if (env.demo) {
        entry['demo/demo'] = path.resolve(__dirname, './src/views/demo/demo'); // 添加demo的entry
        plugins = plugins.concat([
            new HtmlwebpackPlugin({
                title: 'demo',
                filename: 'demo/demo.html',
                hash: false,
                inject: true,
                template: path.resolve(__dirname, './src/html/demo.html'),
                chunks: ['vendor', 'demo/demo'],
            }),
        ]);
    }

    // 打包哪个业务： (例如传 --env.cate=changfang )、
    if (env.cate) {
        env.cate.split(',').forEach((cate) => {
            const catePath = path.resolve(__dirname, `./src/views/fangchan/${cate}.js`);
            if (fs.existsSync(catePath)) {
                entry[`fangchan/${cate}`] = catePath; // 增加相应cate的打包入口
                plugins = plugins.concat([
                    new HtmlwebpackPlugin({
                        title: cate,
                        filename: `fangchan/${cate}.html`,
                        hash: false,
                        inject: true,
                        template: path.resolve(__dirname, './src/html/fangchan.html'),
                        chunks: ['vendor', `fangchan/${cate}`],
                    }),
                ]);
            }
        });
    }

    // 是否启用热更新
    if (env.hot) {
        console.log('webpacking hot...'.red);
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    // 生产环境下
    if (env.NODE_ENV === 'production') {
        plugins = plugins.concat([
            // 启用压缩
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true,
                },
            }),
        ]);
    }
    return {
        context: __dirname,
        entry,
        output: {
            path: path.resolve(__dirname, './build/pages/'),
            filename: '[name].js',
        },
        resolve: {
            alias: {
                vue: `${nodeDir}/vue/dist/vue.runtime.js`,
                '@form': path.resolve(__dirname, './src/components/form/'),
                '@common': path.resolve(__dirname, './src/components/common/'),
                '@actions$': path.resolve(__dirname, './src/config/fangActions.js'),
                '@business': path.resolve(__dirname, './src/business/'),
                '@eventHub$': path.resolve(__dirname, './src/components/form/eventHub.js'),
            },
        },
        module: {
            rules: [{
                test: /\.css$/,
                include: srcPath,
                use: ['style-loader', 'css-loader'],
            }, {
                test: /\.less$/,
                include: srcPath,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                    }, {
                        loader: 'less-loader',
                    }],
                }),
            }, {
                test: /\.vue$/,
                include: srcPath,
                use: {
                    loader: 'vue-loader',
                    options: {
                        extractCSS: env.css, // 是否单独提取css文件
                    },
                },
            }, {
                test: /\.(png|jpg|jpeg|gif)$/,
                include: srcPath,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5120,
                        name: '/img/[name].[ext]',
                    },
                }],
            }, {
                test: /\.js$/,
                include: srcPath,
                use: 'babel-loader',
            }],
        },
        plugins,
    };
};
