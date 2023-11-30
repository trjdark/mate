/**
 * desc: js文件处理
 * User: Renjian.Tang/trj8772@aliyun.com
 * Date: 2018/7/25
 * Time: 下午3:59
 */
const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const tsImportPluginFactory = require('ts-import-plugin')

const {resolve} = require('./../untils');

// module.exports = [
//     {
//         test: /\.(ts|tsx)$/,
//         include: [
//             resolveApp('src')
//         ],
//         loader: ['babel-loader', 'ts-loader'],
//         exclude: /node_modules/
//     },
//     {
//         test: /\.(js|jsx|es6)$/,
//         use: {
//             loader: 'url-loader',
//             options: {
//                 limit: 10000,
//                 name: 'static/js/[name].[hash:8].js',
//             },
//         }
//     }
// ];


module.exports = [
    {
        test: /\.(ts(x?)|js(x?))$/,
        use: [
            {
                loader: 'awesome-typescript-loader',
                options: {
                    transpileOnly: true,
                    useCache: true,
                    cacheDirectory: resolve('.cache-loader'),
                    useBabel: true,
                    babelOptions: {
                        babelrc: false,
                        plugins: ['transform-class-properties', 'syntax-dynamic-import', 'react-hot-loader/babel', "transform-decorators-legacy"]
                    },
                    getCustomTransformers: () => ({
                        before: [
                            tsImportPluginFactory({
                                libraryName: 'antd',
                                libraryDirectory: 'lib',
                                style: true
                            })
                        ]
                    })
                }
            }
        ],
        exclude: /node_modules/
    }
]