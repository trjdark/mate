/**
*Desc: 总部课程包dispatch
*User: Debby.Deng
*Date: 2018/8/28,
*Time: 下午1:31
*/

import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

/**
 * 获取总部课程包列表
 * @param params
 */
export const getHqPackageList = (params:any) => {
    const param = {
        url: SetApi.获取总部课程包列表,
        data: params
    };
    return Fetch.post(param)
};


/**
 * 获取总部课程包信息
 * @param params
 */
export const getHqPackageListInfo = (params:any) => {
    const param = {
        url: SetApi.获取总部课程包信息,
        data: params
    };
    return Fetch.post(param)
};

/**
 * 新建总部课程包
 * @param params
 */
export const createHqPackageList = (params:any) => {
    const param = {
        url: SetApi.新建总部课程包,
        data: params
    };
    return Fetch.post(param)
};

/**
 * 更新总部课程包
 * @param params
 */
export const updateHqPackageList = (params:any) => {
    const param = {
        url: SetApi.更新总部课程包,
        data: params
    };
    return Fetch.post(param)
};

/**
 * 查询总部课程适用中心
 * @param params
 */
export const getHqPackageCenter = (params:any) => {
    const param = {
        url: SetApi.查询总部课程包适用中心,
        data: params
    };
    return Fetch.post(param)
};
