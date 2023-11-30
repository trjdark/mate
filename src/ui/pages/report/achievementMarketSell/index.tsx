/**
 * desc: 市场渠道业绩分析销售向
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/2/12
 * Time: 下午14：40
 */

import {getMarketAchievementSell, downloadMarketAchievementSellExcel,} from "@redux-actions/report/marketReport";
import {GetDataAndDownload} from '../components/getDataAndDownload';
import {AchievementMarket} from '../components/achievementMarket';

const breadCrumbRoutes = [
    {
        name: '报表'
    },
    {
        name: '市场类报表'
    },
    {
        name: '渠道业绩(销售向)'
    }
];

// 使用高阶组建，把获取数据和下载Excel的方法传入到模板中
export default GetDataAndDownload({
    getData: getMarketAchievementSell,
    download: downloadMarketAchievementSellExcel,
    breadCrumbRoutes: breadCrumbRoutes,
})(AchievementMarket);
