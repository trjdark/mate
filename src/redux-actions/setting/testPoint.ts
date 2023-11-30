/**
 * desc: 试点中心
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/5/18
 * Time: 下午3:36
 */
import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

/**
 * 获取试点中心列表
 * @param {User} params
 * @returns {{type: ServiceActionEnum; params: User}}
 */
export const getTestPointList = (params) => {
    const param = {
        url: SetApi.获取试点中心列表,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 根据默认角色ID查询角色对应的可添加试点中心权限
 * @param params
 * @returns {Promise<any>}
 */
export const getPermissionByRoleId = (params) => {
    const param = {
        url: SetApi.根据默认角色ID查询角色对应的可添加试点中心权限,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 添加试点中心
 * @param params
 * @returns {Promise<any>}
 */
export const addTestPoint = (params) => {
    const param = {
        url: SetApi.添加试点中心,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 删除试点中心
 * @param params
 * @returns {Promise<any>}
 */
export const deleteTestPoint = (params) => {
    const param = {
        url: SetApi.删除试点中心,
        data: params
    };
    return Fetch.post(param);
};
