/**
 * desc: 中心相关事件
 * Date: 2018/8/23
 * Time: 上午10:10
 */
import {ServiceActionEnum} from "../serviceActionsEnum";
import {Fetch} from "../../service/fetch";
import {SetApi} from "../../api/settingApi";
import {CustomerApi} from "@/api/customerApi";

/**
 * 获取中心列表
 */
export const getCenterList = (params:any) => {
    const param = {
        url: SetApi.获取中心列表,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 获取中心管理配置（城市等级，省份）
 */
export const getCenterBaseSettingInfo = () => {
    return {
        type: ServiceActionEnum.获取中心基本配置
    }
}
/**
 * 添加中心
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const addCenter =(params:any) => {
    const param = {
        url: SetApi.添加中心,
        data: params
    };
    return Fetch.post(param)
}
/**
 * 获取中心
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getCenter = (params:any) => {
    const param = {
        url: SetApi.获取中心,
        data: params
    };
    return Fetch.post(param)
}
/**
 * 更新中心信息
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const updateCenter = (params:any) => {
    const param = {
        url: SetApi.更新中心,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 获取中心配置信息
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getCenterConfig = (params:any) => {
    const param = {
        url: SetApi.获取中心配置信息,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 更新中心设置
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const updateCenterConfig = (params:any) => {
    return {
        type: ServiceActionEnum.更新中心配置信息,
        params: params
    }
}
/**
 * 更新中心相关审批权限列表
 * @param params
 */
export const updateApprovalList = (params:any) => {
    return {
        type:ServiceActionEnum.中心相关审批权限列表,
        params
    }
}
/**
 * 获取所有中心
 * @param params
 * @returns {Promise<any>}
 */
export const getAllCenter = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取所有中心列表,
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
 * 获取中心员工下的员工列表
 * @returns {Promise<any>}
 */
export const getCenterEmployeeList = (params:any):Promise<any> => {
    const param = {
        url: CustomerApi.员工列表,
        data: params
    };
    return Fetch.post(param)
}

/**
 *
 * @returns {Promise<any>}
 */
export const getPopList = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取总部pop员工列表,
        data: params
    };
    return Fetch.post(param)
}

