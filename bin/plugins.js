/**
 * desc: webpack插件配置文件
 * User: Renjian.Tang/trj8772@aliyun.com
 * Date: 2018/7/25
 * Time: 下午3:49
 */
const webpack = require('webpack');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const {assetsPath} = require('./untils');

const constants = require('./constants');
const env = require('./env.json');

// 需要清理的文件夹
let pathsToClean = [
    'dist',
];
// 环境变量
const oriEnv = env[constants.APP_ENV];

Object.assign(oriEnv, {
    APP_ENV: constants.APP_ENV
});

const defineEnv = {};

for (let key in oriEnv) {
    defineEnv[`process.env.${key}`] = JSON.stringify(oriEnv[key])
}
// 基本配置
const basePlugins = [
    new webpack.DefinePlugin(defineEnv),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

];
// 开发配置
const devPlugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'bin/tpl/index.html',
        title: 'Mate',
        inject: true
    }),
];
// 生产配置
const prodPlugins = [
    new CleanWebpackPlugin(pathsToClean),
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
    new HtmlWebpackPlugin({
        filename: config.index,
        template: 'bin/tpl/index.html',
        title: 'Mate',
        inject: true,
        favicon: 'bin/tpl/favicon.png',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
    }),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: assetsPath('css/[name].[hash].css'),
        chunkFilename: assetsPath('css/[name].[id].[hash].css')
    })
];

if (config.bundleAnalyzerReport) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
    prodPlugins.push(new BundleAnalyzerPlugin())
}

module.exports = basePlugins.concat(constants.APP_ENV === 'dev' ? devPlugins : prodPlugins);
