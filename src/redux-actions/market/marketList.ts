/**
 * 市场渠道异步请求
 * user: Vicky.Yu
 * @param {any} params
 * @returns {any}
 */

import {ServiceActionEnum} from "../serviceActionsEnum";
import {CustomerApi} from "../../api/customerApi";
import {Fetch} from "../../service/fetch";



// 市场渠道列表数据
export const getMarketData=(params: any) => {
    return {
        type: ServiceActionEnum.获取市场列表,
        params
    }
}
export const getdeleteMarketPost = (params:any):Promise<any> => {
    const param = {
        url: CustomerApi.删除市场渠道活动,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
    })
};
