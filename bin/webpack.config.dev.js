const webpack = require('webpack')
const path = require('path')
const config = require('./config');
const constants = require('./constants');
const styleRules = require('./rules/styleRules');
const fileRules = require('./rules/fileRules');
const jsRules = require('./rules/jsRules');
const {resolve, assetsPath} = require('./untils');
const plugins = require('./plugins');
const optimization = require('./optimization');

module.exports = {
    // 设置 sourcemaps 为 cheap-module-source-map 模式
    devtool: 'cheap-module-source-map',
    // 入口文件，单页面入口
    entry: {
        app: ['babel-polyfill', './src/index.tsx'],
        // jquery: 'jquery'
    },
    // 输出文件
    output: {
        path: config.assetsRoot,
        filename: constants.APP_ENV === 'dev' ? '[name].js' : assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: constants.APP_ENV === 'dev' ? '[name].js' : assetsPath('js/[name].[id].[chunkhash].js'),
        publicPath: config.assetsPublicPath
    },
    // 启动端口
    devServer: {
        port: 7020,
        historyApiFallback: true
    },
    //
    // externals: {
    //     'react': 'React',
    //     'react-dom': 'ReactDOM',
    // },
    //
    resolve: {
        extensions: [' ', '.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.json', '.jsx', '.ts', '.tsx', '.es6'],
        alias: {
            axios: resolve('node_modules/axios/dist/axios.min.js'),
            "@redux-actions": resolve('src/redux-actions/'),
            "@":resolve('src'),
        }
    },
    // 编译
    module: {
        rules: [...styleRules, ...fileRules, ...jsRules]
    },
    // 插件
    plugins,
    // 优化
    optimization,
};
