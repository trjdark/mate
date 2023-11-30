/**
 * desc: 市场渠道
 * User: Lyon.Li@gymboglobal.com
 * Date: 2018/11/30
 * Time: 下午3:08
 */

import {ServiceActionEnum} from "../serviceActionsEnum";

// 获取市场渠道来源字典
export const getChannelType = (params: any) => {
    return {
        type: ServiceActionEnum.获取市场市场渠道来源,
        params
    }
};

// 新增市场渠道
export const createMarketInfo = (params: any) => {
    return {
        type: ServiceActionEnum.新建市场渠道,
        params
    }
};

// 更新市场渠道
export const updateMarketInfo = (params: any) => {
    return {
        type: ServiceActionEnum.更新市场渠道,
        params
    }
};

// 获取市场渠道历史数据
export const getHistoryData = (params: any) => {
    return {
        type: ServiceActionEnum.获取市场渠道历史数据,
        params
    }
};

// 查询市场渠道信息
export const getMarketInfo = (params: any) => {
    return {
        type: ServiceActionEnum.查看市场渠道活动信息,
        params
    }
};

// 审批市场渠道
export const approveMarket = (params: any) => {
    return {
        type: ServiceActionEnum.审批市场渠道活动,
        params
    }
};

// 拒绝市场渠道
export const refuseMarket = (params: any) => {
    return {
        type: ServiceActionEnum.拒绝市场渠道活动,
        params
    }
};
