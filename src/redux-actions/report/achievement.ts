/*
* desc:业绩类报表
* User: lyon.li@gymboglobal.com
* Date: 2019/1/14
* Time: 下午14:10
*/

import {Fetch} from "@/service/fetch";
import {reportApi} from "@/api/reportApi";
import {SetApi} from "@/api/settingApi";
import {downloadExcel} from "./downloadExcel";

// 获取城市数据
export const getCitiesList = (data) => {
    const params = {
        url: SetApi.查询城市列表,
        data
    };
    return Fetch.post(params).then(res => {
        const cityOptions = [], selectedCity = [];
        res.forEach(item => {
            const {code, codeValue} = item;
            cityOptions.push({
                label: codeValue,
                value: code
            });

            if (res.length === 1) {
                // 如果只有一个城市，默认选择该城市
                selectedCity.push(code);
            }
        });

        return Promise.resolve({
            cityOptions,
            selectedCity,
        });
    }).catch(err => {
        return Promise.reject('请求城市列表失败')
    })
};

// 获取中心数据
export const getCentersList = (data) => {
    const params = {
        url: SetApi.查询中心列表,
        data,
    };
    return Fetch.post(params).then(res => {
        const centerOptions = [];
        res.forEach(item => {
            const {centerName, cityId, centerCode, id} = item;
            centerOptions.push({
                label: `${centerCode}-${centerName}`,
                value: id,
                cityId,
            });
        });
        return Promise.resolve(centerOptions);
    }).catch(err => {
        return Promise.reject('请求中心列表失败');
    })
};

// 获取中心业绩报表数据
export const getCenterAchievementData = (data) => {
    const params = {
        url: reportApi.查询中心业绩,
        data: data
    };
    return Fetch.post(params);
};

// 下载中心业绩报表
export const downloadAchieveCenterExcel = data => {
    downloadExcel(data, reportApi.导出中心业绩, '中心业绩报表.xlsx');
};

// 合同到期提醒
export const getContractExpireData = data => {
    const params = {
        url: reportApi.合同到期提醒,
        data,
    };

    return Fetch.post(params);
};

// 下载合同到期提醒报表
export const downloadContractExpireExcel = data => {
    downloadExcel(data, reportApi.导出合同到期提醒, '合同到期提醒报表.xlsx');
};
