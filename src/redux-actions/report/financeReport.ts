/*
* desc: 财务类报表
* User: lyon.li@gymboglobal.com
* Date: 2019/1/23
* Time: 下午14:10
*/

import {Fetch} from "@/service/fetch";
import {reportApi} from "@/api/reportApi";
import {downloadExcel} from "./downloadExcel";

/*获取消耗负债报表*/
export const getConsumeAndDebtList = (data) => {
    const params = {
        url: reportApi.消耗负债报表,
        data: data
    };
    return Fetch.post(params);
};

/*查询消耗负债总计字段*/
export const getConsumeAndDebtTotal = data => {
    const params = {
        url: reportApi.消耗负债报表总计,
        data,
    };
    return Fetch.post(params).then(res => {
        res.id = Date.now();     // 生成表格时需要用唯一id做key，但是后台没有返回这个值，在这里生成一下

        // 后台给出的数据，总计显示在课包对应栏里，生成的列表离数据比较远，不美观，
        // 在这里调整到赠送课时相对应的字段里
        res.freeCourseNum = '总计';
        res.packageName = '';
        return res;
    });
};

// 下载消耗负债报表数据
export const downloadMarketDetail = data => {
    downloadExcel(data, reportApi.导出消耗负债报表, '消耗负债报表.xlsx');
};

/*获取中心收入统计数据*/
export const getIncomeCenterData = (data) => {
    const params = {
        url: reportApi.中心收入统计,
        data: data
    };
    return Fetch.post(params)
};

/*下载中心收入统计报表*/
export const downloadIncomeCenterData = data => {
    downloadExcel(data, reportApi.导出中心收入统计, '中心收入统计.xlsx');
};

/**
 * 获取未消耗负债
 * @param data
 * @returns {Promise<any>}
 */
export const getUnConsumeAndDebtList = (data) => {
    const params = {
        url: reportApi.未消耗负债报表,
        data: data
    };
    return Fetch.post(params);
}
/**
 * 下载未消耗负债
 * @param data
 */
export const downloadUnConsumeAndDebt = (data) => {
    downloadExcel(data, reportApi.导出未消耗负债报表, '未耗课金额统计(合营使用).xlsx');
};
/**
 * 获取期初数据修复表
 * @param data
 * @returns {Promise<any>}
 */
export const getRepairDataList = (data) => {
    const params = {
        url: reportApi.期初数据修复表,
        data: data
    };
    return Fetch.post(params);
};

/**
 * 获取期初数据修复表更新时间
 * @param data
 * @returns {Promise<any>}
 */
export const getRepairDataUpdateTime = (data) => {
    const params = {
        url: reportApi.期初数据修复表更新时间,
        data: data
    };
    return Fetch.post(params);
};

/**
 * 下载期初数据修复表
 * @param data
 */
export const downloadRepairData = (data) => {
    downloadExcel(data, reportApi.导出期初数据修复表, '期初数据修正表.xlsx');
};

/**
 * 收付款明细
 * @param data
 * @returns {Promise<any>}
 */
export const financialDetail = (data) => {
    const params = {
        url: reportApi.收付款明细,
        data: data
    };
    return Fetch.post(params);
};
/**
 * 下载期初数据修复表
 * @param data
 */
export const downloadFinancialDetail = (data) => {
    downloadExcel(data, reportApi.收付款明细导出, '收付款明细.xlsx');
};
