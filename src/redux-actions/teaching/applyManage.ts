/**
 * desc: 申请管理
 * User: colin.lu
 * Date: 2018/12/29
 * Time: 上午10:00
 */

import {Fetch} from "../../service/fetch";
import {SetApi} from '../../api/settingApi';
import {TeachingApi} from '../../api/teachingApi';
import {downloadExcel} from "@redux-actions/report/downloadExcel";

/**
 * Desc 查询中心员工列表
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getCenterStaffList = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取中心在岗员工列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * Desc 新建gym guard
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const addGymGuard = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.新增金宝检查,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * Desc 查询金宝列表
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getGymGuardList = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.查询金宝列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * Desc 删除金宝检查
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const deleteGymGuard = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.删除金宝检查,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * Desc 查询申请试听列表
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getMakeupList = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.查询申请试听列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * Desc 查询申请试听列表导出
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const exportMakeupList = (params:any) => {
    downloadExcel(params, TeachingApi.查询申请试听列表导出, '申请试听列表.xlsx');
};

/**
 * Desc 查询申请请假列表
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getLeaveList = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.查询申请请假列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * Desc 查询申请请假详情
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getLeaveDetail = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.查询申请请假详情,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 查询中心课程信息列表
 * @param action
 * @returns {any}
 */

export const  getSelectCourseList= (params:any):Promise<any> =>{
    const param = {
        url: TeachingApi.选课筛选课程,
        data: params
    };

    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 查看试听审批详情
 * @param action
 * @returns {any}
 */

export const  getPreviewDetail= (params:any):Promise<any> =>{
    const param = {
        url: TeachingApi.查看试听审批详情,
        data: params
    };

    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 同意试听审批
 * @param action
 * @returns {any}
 */

export const  approveMakeUp= (params:any):Promise<any> =>{
    const param = {
        url: TeachingApi.同意试听审批,
        data: params
    };

    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 拒绝试听审批
 * @param action
 * @returns {any}
 */

export const  refuseMakeUp= (params:any):Promise<any> =>{
    const param = {
        url: TeachingApi.拒绝试听审批,
        data: params
    };

    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};




