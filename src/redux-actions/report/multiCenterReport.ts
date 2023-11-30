/*
 * @Description: 单中心报表（多中心）报表导出  
 * @Author: luck
 * @Date: 2021-12-30 14:05:52
 */

import {Fetch} from "@/service/fetch";
import {reportApi} from "@/api/reportApi";
import { message } from "antd";

// 市场名单明细多中心导出任务提交
export const handleMarketDetailExport = (data) => {
    const params = {
        url: reportApi.市场名单明细多中心导出提交,
        data,
    };
    return Fetch.post(params).then((res:any)=>{
       message.success('多中心离线导出任务已提交，请稍后在报表导出查询页面查看。');
    }).catch((err:any)=>{
        message.error(err.msg)
    })
}

// 市场名单明细（销售向）多中心导出任务提交
export const handleMarketDetailSellExport = (data) => {
    const params = {
        url: reportApi.市场名单明细销售向多中心导出提交,
        data,
    };
    return Fetch.post(params).then((res:any)=>{
        message.success('多中心离线导出任务已提交，请稍后在报表导出查询页面查看。');
    }).catch((err:any)=>{
        message.error(err.msg)
    })
}

// 到访表多中心导出任务提交
export const handleVisitExport = (data) => {
    const params = {
        url: reportApi.到访表多中心导出提交,
        data,
    };
    return Fetch.post(params).then((res:any)=>{
        message.success('多中心离线导出任务已提交，请稍后在报表导出查询页面查看。');
    }).catch((err:any)=>{
        message.error(err.msg)
    });
}

// 多中心导出任务查询列表
export const getMultiCenterTaskList = (data) => {
    const params = {
        url: reportApi.多中心导出任务查询列表,
        data,
    };
    return Fetch.post(params)
}

// 多中心导出文件下载
export const downloadReportExcel = (data) => {
    const params = {
        url: reportApi.多中心导出文件下载,
        data,
    };
    return Fetch.post(params)
    .then((res:any)=>{
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = res.fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
    })
    .catch((err:any)=>{
        message.error(err.msg)
    })
}

// 接口数据校验
export const getDataAll = funcArr => {
    return new Promise(resolve => {
        let sttled = 0;
        let result = [];
        for (let index = 0; index < funcArr.length; index++) {
            const element = funcArr[index];
            element
                .then(res => {
                    result[index] = {
                        status: "ok",
                        value: res
                    };
                }).catch(err => {
                    result[index] = {
                        status: "fail",
                        reason: err
                    };
                })
                .finally(() => {
                    ++sttled === funcArr.length && resolve(result);
                });
        }
    });
};
