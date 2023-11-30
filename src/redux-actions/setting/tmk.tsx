/**
 * desc: 获取tmk中心列表
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/13
 * Time: 下午2:26
 */

import {SetApi} from '@/api/settingApi';
import {Fetch} from "@/service/fetch";
import {ServiceActionEnum} from "../serviceActionsEnum";

/**
 * 获取GA列表
 * @param params
 * @returns {Promise<any>}
 */
export const getTmkOrganization = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取Tmk中心列表,
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
 * 获取GI列表
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getGIList = (params:any) => {
    return {
        type: ServiceActionEnum.获取GI员工列表,
        params: params
    }
};

/**
 * 获取所有HTMK人员列表
 * @param params
 * @returns {Promise<any>}
 */
export const queryHTmkMemberList = (params?:any):Promise<any> => {
    const param = {
        url: SetApi.获取HTMK人员列表,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 获取所有TMK人员列表
 * @param params
 * @returns {Promise<any>}
 */
export const queryTmkMemberList = (params?:any):Promise<any> => {
    const param = {
        url: SetApi.获取TMK人员列表,
        data: params
    };
    return Fetch.post(param)
};

/**
 * 添加Tmk中心
 * @param params
 * @returns {Promise<any>}
 */
export const addTmkCenter = (params:any):Promise<any> => {
    const param = {
        url: SetApi.添加Tmk中心,
        data: params
    };
    return Fetch.post(param)
}
/**
 * 更新TMK中心
 * @param params
 * @returns {Promise<any>}
 */
export const updateTmkCenter = (params:any):Promise<any> => {
    const param = {
        url: SetApi.更新Tmk中心,
        data: params
    };
    return Fetch.post(param)
}
/**
 * 获取Tmk中心信息
 * @param params
 * @returns {Promise<any>}
 */
export const getTmkCenterInfo = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取Tmk中心信息,
        data: params
    };
    return Fetch.post(param)
}
/**
 * 删除TMK中心
 * @param params
 * @returns {Promise<any>}
 */
export const deleteTmkCenter = (params:any):Promise<any> => {
    const param = {
        url: SetApi.删除Tmk中心,
        data: params
    };
    return Fetch.post(param)
}
