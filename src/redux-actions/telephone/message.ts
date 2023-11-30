/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/4
 * Time: 下午4:57
 */
import {Fetch} from "../../service/fetch";
import {TelephoneApi} from "@/api/telephoneApi";

/**
 * 查看消息通知设置
 * @param params
 * @returns {Promise<any>}
 */
export const getNoticeSetting = (params:any):Promise<any> => {
    const param = {
        url: TelephoneApi.查看消息通知设置,
        data: params
    };
    return Fetch.post(param)
};

/**
 * 修改消息通知设置
 * @param params
 * @returns {Promise<any>}
 */
export const updateNoticeSetting = (params:any):Promise<any> => {
    const param = {
        url: TelephoneApi.修改消息通知设置,
        data: params
    };
    return Fetch.post(param)
};


/**
 * 修改消息通知设置
 * @param params
 * @returns {Promise<any>}
 */
export const getTemplate = (params:any):Promise<any> => {
    const param = {
        url: TelephoneApi.查看消息提醒模版,
        data: params
    };
    return Fetch.post(param)
};

/**
 * 更新消息通知设置
 * @param params
 * @returns {Promise<any>}
 */
export const updateTemplate = (params:any):Promise<any> => {
    const param = {
        url: TelephoneApi.更新消息提醒模版,
        data: params
    };
    return Fetch.post(param)
};

/**
 * 登陆获取未读系统通告
 * @param params
 * @returns {Promise<any>}
 */
export const getNoReadSysNotice = (params:any):Promise<any> => {
    const param = {
        url: TelephoneApi.获取系统通知消息,
        data: params
    };
    return Fetch.post(param)
};


/**
 * 修改系统通告已读状态
 * @param params
 * @returns {Promise<any>}
 */
export const changeReadStatus = (params:any):Promise<any> => {
    const param = {
        url: TelephoneApi.修改系统通知已读状态,
        data: params
    };
    return Fetch.post(param)
};
