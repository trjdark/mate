/**
 * desc: 员工管理，事件触发
 * Date: 2018/8/25
 * Time: 上午9:54
 */

import {ServiceActionEnum} from "../serviceActionsEnum";
import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

/**
 * 获取员工列表
 * @param params
 * @returns {}
 */
export const getEmployeeList = (params:any) => {
    const param = {
        url: SetApi.获取员工列表,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 获取各个中心的员工岗位
 * @param params
 * @returns {type: any; params: any}
 */
export const getEmployeePostList = (params:any) => {
    return {
        type: ServiceActionEnum.获取中心员工岗位列表,
        params: params
    }
};


/**
 * 获取指定员工信息
 * @param params
 * @returns {type: any; params: any}
 */
export const getEmployeeInfo = (params:any) => {
    const param = {
        url: SetApi.获取员工信息,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 获取指定员工岗位
 * @param params
 * @returns {type: any; params: any}
 */
export const getEmployeePost = (params:any) => {
    const param = {
        url: SetApi.获取员工岗位信息,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 获取指定员工角色
 * @param params
 * @returns {type: any; params: any}
 */
export const getEmployeeRole = (params:any) => {
    const param = {
        url: SetApi.获取员工角色信息,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 新增员工
 * @param params
 * @returns {type: any; params: any}
 */
export const addEmployee = (params:any) => {
    const param = {
        url: SetApi.新增员工信息,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 编辑员工
 * @param params
 * @returns {type: any; params: any}
 */
export const editEmployee = (params:any) => {
    const param = {
        url: SetApi.修改员工信息,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 获取所有中心列表
 * @param params
 * @returns {{type: ServiceActionEnum}}
 */
export const getAllCenterList = (params) => {
    return {
        type: ServiceActionEnum.获取所有中心列表,
        params:params
    }
};
/**
 * 获取中心员工角色
 * @param params
 * @returns {type: any; params: any}
 */
export const getCenterEmployeeRole = (params:any) => {
    const param = {
        url: SetApi.获取中心角色列表,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 非总部编辑员工
 * @param params
 * @returns {type: any; params: any}
 */
export const editUnHQEmployee = (params:any) => {
    const param = {
        url: SetApi.非总部修改员工信息,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 绑定账号
 * @param params
 * @returns {Promise<any>}
 */
export const bindAccount = (params:any) => {
    const param = {
        url: SetApi.绑定账号,
        data: params,
        responseType: 'mapping'
    };
    return Fetch.post(param);
};

/**
 * 获取绑定信息
 * @param params
 * @returns {Promise<any>}
 */
export const queryBindAccount = (params:any) => {
    const param = {
        url: SetApi.获取绑定信息,
        data: params
    };
    return Fetch.post(param);
};


/**
 * 关闭绑定信息提示框
 * @param params
 * @returns {Promise<any>}
 */
export const closeAlert = () => {
    return {
        type: ServiceActionEnum.关闭绑定信息提示框,
    }
};
