/**
 * desc: 设置-审批管理
 * User: VIcky.yu
 * Date: 2020/12/9
 * Time: 10:50
 */

import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

/**
 * 获取审批
 * @param params
 * @returns {}
 */
export const getApproveList = (params:any) => {
    const param = {
        url: SetApi.审批列表,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 审批列表详情
 * @param params
 * @returns {type: any; params: any}
 */
export const getProveListDetail = (params:any) => {
    const param = {
        url: SetApi.审批列表详情,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 员工申请解锁
 * @param params
 * @returns {type: any; params: any}
 */
export const applyDeblock = (params:any) => {
    const param = {
        url: SetApi.员工申请解锁,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 员工管理解锁详细信息
 * @param params
 * @returns {type: any; params: any}
 */
export const applyDeblockDetail = (params: any) => {
    const param = {
        url: SetApi.员工管理解锁详细信息,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 账号变更明细
 * @param params
 * @returns {type: any; params: any}
 */
export const accountChangeDetail = (params:any) => {
    const param = {
        url: SetApi.账号变更明细,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 审批操作
 * @param params
 * @returns {type: any; params: any}
 */
export const operateApprove = (params:any) => {
    const param = {
        url: SetApi.审批操作,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 查询审批导出新客户中心
 * @param params
 * @returns {type: any; params: any}
 */
export const getApprovalList = (params:any) => {
    const param = {
        url: SetApi.获取审批客户中心导出,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 查询审批新客户中心导出申请详情
 * @param params
 * @returns {type: any; params: any}
 */
export const getApprovalDetail = (params:any) => {
    const param = {
        url: SetApi.获取客户中心导出申请详情,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 审批新客户中心导出申请
 * @param params
 * @returns {type: any; params: any}
 */
export const updateApprovalDetail = (params:any) => {
    const param = {
        url: SetApi.审批客户中心导出申请,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 查询申请导出新客户中心
 * @param params
 * @returns {type: any; params: any}
 */
export const getApplyList = (params:any) => {
    const param = {
        url: SetApi.获取申请客户中心导出,
        data: params
    };
    return Fetch.post(param);
};
