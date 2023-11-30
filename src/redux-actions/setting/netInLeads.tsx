/**
 * desc:
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import {Fetch} from "@/service/fetch";
import {SetApi} from "@/api/settingApi";

/**
 * 查询所有在职GA
 * @param params
 * @returns {Promise<any>}
 */
export const getNetInLeadsCenterManagerPhone = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取本中心Leads同通知手机号,
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
 * 查询所有在职GA
 * @param params
 * @returns {Promise<any>}
 */
export const saveNetInLeadsCenterManagerPhone = (params:any):Promise<any> => {
    const param = {
        url: SetApi.保存本中心Leads通知手机号,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
