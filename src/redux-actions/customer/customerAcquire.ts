/**
 * Desc: 客户获取异步获取接口或dispatch event
 * User: Debby.Deng
 * Date: 2018/11/14,
 * Time: 上午11:22
 */

import {CustomerApi} from "@/api/customerApi";
import {Fetch} from "@/service/fetch";

/**
 * 客户360 查询leads信息
 * @param {any} params
 * @returns {any}
 */
export const getLeadsInfo = (params) => {
    const data = {
        url: CustomerApi.客户leads信息,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 更新leads信息
 * @param {any} params
 * @returns {any}
 */
export const updateLeadsInfo = (params) => {
    const data = {
        url: CustomerApi.更新leads信息,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 客户360 跟进信息
 * @param {any} params
 * @returns {any}
 */
export const getFollowInfo = (params) => {
    const data = {
        url: CustomerApi.获取跟进信息,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 更新leads信息
 * @param {any} params
 * @returns {any}
 */
export const updateFollowInfo = (params) => {
    const data = {
        url: CustomerApi.更新跟进信息,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 查询法定监护人标识
 * @param {any} params
 * @returns {any}
 */
export const hasLegalGuardian = (params) => {
    const data = {
        url: CustomerApi.查询法定监护人标识,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 获取合同信息
 * @param {any} params
 * @returns {any}
 */
export const getContractList = (params) => {
    const data = {
        url: CustomerApi.获取合同信息,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 状态变更
 * @param {any} params
 * @returns {any}
 */
export const getUpdateList = (params) => {
    const data = {
        url: CustomerApi.获取状态变更,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 获取promotor列表
 * @param {any} params
 * @returns {any}
 */
export const getPromotorList = (params) => {
    const data = {
        url: CustomerApi.客户promotor列表,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 获取市场活动列表
 * @param {any} params
 * @returns {any}
 */
export const getActivityList = (params) => {
    const data = {
        url: CustomerApi.获取活动列表,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 检测是否手动回收站阶段
 * @param {any} params
 * @returns {any}
 */
export const isRecycle = (params) => {
    const data = {
        url: CustomerApi.检测手动回收站状态,
        data: params,
    };
    return Fetch.post(data);
};

/**
 * 客户360 获取leads的通话记录
 * @param {any} params
 * @returns {any}
 */
export const queryLeadsCallRecords = (params) => {
    const data = {
        url: CustomerApi.获取leads通话记录,
        data: params,
    };
    return Fetch.post(data);
};

/**
 * 客户360 查询Leads最新获取信息
 * @param {any} params
 * @returns {any}
 */
export const queryLastLeadsInfo = (params) => {
    const data = {
        url: CustomerApi.查询Leads最新获取信息,
        data: params,
    };
    return Fetch.post(data);
};

/**
 * 客户360 渠道编辑记录
 * @param {any} params
 * @returns {any}
 */
export const getChannelEditReport = (params) => {
    const data = {
        url: CustomerApi.渠道编辑记录,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 获取重复leads详细情况
 * @param params
 * @returns {Promise<any>}
 */
export const getRepeatLeadsList = (params: any) => {
    const data = {
        url: CustomerApi.客户360重复leads详情列表,
        data: params,
    };
    return Fetch.post(data);
};
