/**
 * desc: view层发起的事件dispatch(action),角色相关的事件
 * Date: 2018/8/1
 * Time: 下午2:04
 */
/// <reference path="../../.h/role.d.ts" />
import {Fetch} from "@/service/fetch";
import {SetApi} from "@/api/settingApi";
/**
 * 获取默认角色列表
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getDefaultRoles = (params:any) => {

    const param = {
        url: SetApi.获取默认角色列表,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 添加默认角色
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const addDefaultRole = (params:any) => {
    const param = {
        url: SetApi.添加默认角色,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 获取默认角色
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getDefaultRole = (params:any) => {
    const param = {
        url: SetApi.获取默认角色,
        data: params
    };
    return Fetch.post(param);
};

export const updateDefaultRole = (params:any) => {
    const param = {
        url: SetApi.修改默认角色,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 获取角色列表
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getRoles = (params:any) => {
    const param = {
        url: SetApi.查询所有角色列表,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 添加角色
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const addRole = (params:any) => {
    const param = {
        url: SetApi.添加角色,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 获取角色信息
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getRole = (params:any) => {
    const param = {
        url: SetApi.获取角色,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 修改角色
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const updateRole = (params:any) => {
    const param = {
        url: SetApi.修改角色,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 获取自定义角色列表
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getCustomizeRoles = (params:any) => {
    const param = {
        url: SetApi.查询所有自定义角色列表,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 更新自定义角色列表
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const updateCustomizeRole = (params:any) => {
    const param = {
        url: SetApi.修改自定义角色,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 添加自定义角色
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const addCustomizeRole = (params:any) => {
    const param = {
        url: SetApi.添加自定义角色,
        data: params
    };
    return Fetch.post(param);
};
