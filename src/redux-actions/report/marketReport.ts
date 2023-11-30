/*
* desc:报表模块市场相关
* User: lyon.li@gymboglobal.com
* Date: 2019/1/21
* Time: 上午10:10
* */

import {Fetch} from "@/service/fetch";
import {reportApi} from "@/api/reportApi";
import {CustomerApi} from "@/api/customerApi";
import {SetApi} from "@/api/settingApi";
import {downloadExcel} from "./downloadExcel";
import {User} from "@/common/beans/user";


// 获取市场名单明细报表数据
export const getMarketDetailList = (data) => {
    const params = {
        url: reportApi.市场名单明细,
        data,
    };
    return Fetch.post(params);
};

// 下载市场名单明细报表数据
export const downloadMarketDetail = data => {
    downloadExcel(data, reportApi.导出市场名单明细, '市场名单明细报表_市场向.xlsx');
};

// 获取市场名单明细报表销售向数据
export const getMarketDetailSellList = (data) => {
    const params = {
        url: reportApi.市场名单明细销售向,
        data,
    };
    return Fetch.post(params);
};

// 下载销售向市场名单明细报表数据
export const downloadMarketDetailSell = data => {
    downloadExcel(data, reportApi.导出销售向市场名单明细, '市场名单明细报表_销售向.xlsx');
};

// 获取在职的GB数据数据
export const getGbInJobSList = (data) => {
    const params = {
        url: CustomerApi.查询GBHGB在职,
        data,
    };
    return Fetch.post(params).then(res => {
        // 转换成所需的数据
        return res.map(item => {
            const {staffId, userName} = item;
            return {
                postCode: staffId,
                postName: userName,
            }
        });

    });
};

// 获取市场业绩报表数据
export const getMarketAchievement = (data) => {
    const params = {
        url: reportApi.市场向市场渠道业绩,
        data,
    };
    return Fetch.post(params,30000);
};

// 下载市场业绩报表数据
export const downloadMarketAchievementExcel = data => {
    downloadExcel(data, reportApi.导出市场向市场渠道业绩, '市场渠道业绩报表_市场向.xlsx');
};

// 获取市场业绩销售向报表数据
export const getMarketAchievementSell = (data) => {
    const params = {
        url: reportApi.销售向市场渠道业绩,
        data,
    };
    return Fetch.post(params,30000);
};

// 下载市场业绩销售向报表数据
export const downloadMarketAchievementSellExcel = data => {
    downloadExcel(data, reportApi.导出销售向市场渠道业绩, '市场渠道业绩报表_销售向.xlsx');
};

// 获取渠道出现方式业绩报表数据
export const getMarketStyleData = data => {
    const params = {
        url: reportApi.渠道出现方式业绩,
        data,
    };
    return Fetch.post(params,30000);
};

// 导出渠道出现方式业绩报表数据
export const downloadMarketStyleExcel = data => {
    downloadExcel(data, reportApi.导出渠道出现方式业绩, '渠道出现方式业绩报表_市场向.xlsx');
};

// 获取渠道出现方式销售向业绩报表数据
export const getMarketStyleSellData = data => {
    const params = {
        url: reportApi.渠道出现方式业绩销售向,
        data,
    };
    return Fetch.post(params,30000);
};

// 导出渠道出现方式销售向业绩报表数据
export const downloadMarketStyleSellExcel = data => {
    downloadExcel(data, reportApi.导出渠道出现方式业绩销售向, '渠道出现方式业绩报表_销售向.xlsx');
};

// 获取市场渠道类型数据
export const getChannelType = () => {
    const params = {
        url: SetApi.根据类型获取字典数据,
        data: {
            currentCenterId: User.currentCenterId,
            type: 'ChannelType'
        },
    };

    return Fetch.post(params).then(res=>{
        return res.map(item=>{
            const {code, codeValue} = item;
            return {
                value: code,
                label: codeValue,
            }
        })
    });
};

// 获取市场出现方式
export const getAppearanceType = () => {
    const params = {
        url: SetApi.根据类型获取字典数据,
        data: {
            currentCenterId: User.currentCenterId,
            type: 'appearnceType'
        },
    };

    return Fetch.post(params).then(res=>{
        return res.map(item=>{
            const {code, codeValue} = item;
            return {
                value: code,
                label: codeValue,
            }
        })
    });
};