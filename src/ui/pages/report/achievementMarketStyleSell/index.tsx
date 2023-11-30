/**
 * desc: 渠道出现方式业绩统计
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/2/12
 * Time: 下午14：40
 */
import {downloadMarketStyleSellExcel, getMarketStyleSellData} from "@redux-actions/report/marketReport";
import {GetDataAndDownload} from "../components/getDataAndDownload";
import {AchievementChannelStyle} from "../components/achievementMarketStyle";

const breadCrumbRoutes = [
    {
        name: '报表'
    },
    {
        name: '市场类报表'
    },
    {
        name: '渠道+出现方式业绩(销售向)'
    }
];

// 使用高阶组建，把导航数据、获取数据, 和下载Excel的方法传入到模板中
export default GetDataAndDownload({
    getData: getMarketStyleSellData,
    download: downloadMarketStyleSellExcel,
    breadCrumbRoutes,
})(AchievementChannelStyle);
