import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";
/**
 * 获取教室列表
 * @param {User} params
 * @returns {{type: ServiceActionEnum; params: User}}
 */
export const getRoomList = (params:any) => {
    const param = {
        url: SetApi.获取教室列表,
        data: params
    };
    return Fetch.post(param);
};

/**
 * id 获取教室信息
 * @param {User} params
 * @returns {{type: ServiceActionEnum; params: User}}
 */
export const getRoomInfo = (params:any) => {
    const param = {
        url: SetApi.获取教室信息,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 创建教室
 * @param {User} params
 * @returns {{type: ServiceActionEnum; params: User}}
 */
export const createRoom = (params) => {
    const param = {
        url: SetApi.创建教室,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 编辑教室
 * @param {User} params
 * @returns {{type: ServiceActionEnum; params: User}}
 */
export const editRoom = (params) => {
    const param = {
        url: SetApi.更新教室,
        data: params
    };
    return Fetch.post(param);
};
