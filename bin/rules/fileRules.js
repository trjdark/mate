/**
 * desc: 文件(图片，字体，svg)
 * User: Renjian.Tang/trj8772@aliyun.com
 * Date: 2018/7/25
 * Time: 下午3:59
 */

const {assetsPath, resolve} = require ('./../untils');

module.exports = [
    {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        query: {
            limit: 10000,
            name: assetsPath('img/[name].[hash:7].[ext]')
        }
    },
    {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        query: {
            limit: 10000,
            name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
    },
    {
        test: /\.svg$/,
        loader: 'file-loader',
        include: [resolve('src')]
    }
];
