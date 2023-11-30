/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/5
 * Time: 下午3:16
 */
import {Fetch} from "../../service/fetch";
import {TelephoneApi} from "@/api/telephoneApi";
import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";

/**
 * 查看消息通知设置
 * @param params
 * @returns {Promise<any>}
 */
export const getNoticeDetail = (params:any):Promise<any> => {
    const param = {
        url: TelephoneApi.查看消息详情,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 读取信息
 * @param params
 * @returns {{type: ServiceActionEnum; data: any}}
 */
export const readNotice = (params:any)  => {
    return {
        type: ServiceActionEnum.读取消息,
        data: params
    }
};

/**
 * 接受信息
 * @param params
 * @returns {{type: ServiceActionEnum; data: any}}
 */
export const acceptNotice = (params:any)  => {
    return {
        type: ServiceActionEnum.接受消息,
        data: params
    }
};
/**
 * 查询消息列表
 * @param params
 * @returns {Promise<any>}
 */
export const getMessageList = (params:any):Promise<any> => {
    const param = {
        url: TelephoneApi.获取消息通知列表,
        data: params
    };
    return Fetch.post(param)
};
