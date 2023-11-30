/**
 * desc: 市场名单明细报表销售向
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/2/13
 * Time: 上午10:38
 */

import {
    getMarketDetailSellList,
    downloadMarketDetailSell,
} from "@redux-actions/report/marketReport";
import {GetDataAndDownload} from '../components/getDataAndDownload';
import {MarketDetail} from "../components/marketDetail";
import {User} from "@/common/beans/user";
import { FUNC } from "../../setting/enum/functions";
import { handleMarketDetailSellExport } from "@redux-actions/report/multiCenterReport";

const breadCrumbRoutes = [
    {
        name: '报表'
    },
    {
        name: '市场类报表'
    },
    {
        name: '市场名单明细(销售向)'
    }
];

/*生成查询参数*/
function createParams(hasPageParams) {
    const {
        appearanceType, channelComment, pageNo, pageSize,
        channelType, createDate, primaryStaffId, theme,
        reacquire, oppTime, signDate, previewDate
    } = this.state;

    let createDateBeg, createDateEnd, oppTimeBeg, oppTimeEnd, signDateBeg, signDateEnd,
        previewDateBeg, previewDateEnd;

    if (Array.isArray(createDate)) {
        createDateBeg = createDate[0] ? createDate[0].startOf('day').valueOf() : null;
        createDateEnd = createDate[1] ? createDate[1].endOf('day').valueOf() : null;
    }
    if (Array.isArray(oppTime)) {
        oppTimeBeg = oppTime[0] ? oppTime[0].startOf('day').valueOf() : null;
        oppTimeEnd = oppTime[1] ? oppTime[1].endOf('day').valueOf() : null;
    }
    if (Array.isArray(signDate)) {
        signDateBeg = signDate[0] ? signDate[0].startOf('day').valueOf() : null;
        signDateEnd = signDate[1] ? signDate[1].endOf('day').valueOf() : null;
    }
    if (Array.isArray(previewDate)) {
        previewDateBeg = previewDate[0] ? previewDate[0].startOf('day').valueOf() : null;
        previewDateEnd = previewDate[1] ? previewDate[1].endOf('day').valueOf() : null;
    }

    return {
        primaryStaffId,
        theme,
        appearanceType,
        channelComment,
        channelType,
        createDateBeg,
        createDateEnd,
        oppTimeBeg, oppTimeEnd,
        signDateBeg, signDateEnd,
        previewDateBeg, previewDateEnd,
        reacquire,
        pageNo: hasPageParams ? pageNo : undefined,
        pageSize: hasPageParams ? pageSize : undefined,
        currentCenterId: User.currentCenterId,
    };
}

// 使用高阶组建，把导航数据、获取数据, 生成参数方法, 和下载Excel的方法传入到模板中
export default GetDataAndDownload({
    getData: getMarketDetailSellList,
    download: downloadMarketDetailSell,
    export: handleMarketDetailSellExport,
    exportPermission: `${FUNC[`市场名单明细（销售向）多中心导出`]}`,
    breadCrumbRoutes,
    createParams,
    rangePickerLabel: '导入时间',
})(MarketDetail);
