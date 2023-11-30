/**
 * desc: 代码压缩优化
 * User: Renjian.Tang/trj8772@aliyun.com
 * Date: 2018/7/26
 * Time: 下午3:04
 */

const constants = require('./constants');
const config = require('./config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports =
    constants.APP_ENV === 'dev'
        ? {}
        : {
            runtimeChunk: {
                name: 'manifest'
            },
            splitChunks: {
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    },
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                        minSize: 30000,  // 被拆分的最小大小（压缩前）
                        minChunks: 1,  // 被共享的最小次数
                        maxAsyncRequests: 5,  // 最大按需求并行请次数
                        maxInitialRequests: 3,  // 最大初始化并行请求数
                        automaticNameDelimiter: '~',  // 自动命名分隔符
                    }
                }
            },
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: config.sourceMap,
                    uglifyOptions: {
                        ie8: false,
                        mangle: true,
                        output: { comments: false },
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: true,
                            unused: false,
                        },
                    },
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessor: require('cssnano'),
                    cssProcessorOptions: {
                        reduceIdents: false,
                        autoprefixer: false
                    }
                }),
                new CompressionPlugin()
            ]
        };
