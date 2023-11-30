/**
 * desc: 市场渠道业绩报表
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/17
 * Time: 上午10:38
 */

import {getMarketAchievement, downloadMarketAchievementExcel} from "@redux-actions/report/marketReport";
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
        name: '渠道业绩'
    }
];

// 使用高阶组建，把导航数据、获取数据和下载Excel的方法传入到模板中
export default GetDataAndDownload({
    getData: getMarketAchievement,
    download: downloadMarketAchievementExcel,
    breadCrumbRoutes: breadCrumbRoutes,
})(AchievementMarket);
