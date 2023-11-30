/**
 * desc:
 * User: Vicky
 * Date: 2020/9/2
 * Time: 14:00
 */
import {Fetch} from "../../service/fetch";
import {CustomerApi} from "@/api/customerApi";

/**
 * tmk转中心leads
 * @param params
 * @returns {Promise<any>}
 */
export const getMarketListDetail = (params):Promise<any> => {
    const data = {
        url: CustomerApi.tmkleads市场名单明细,
        data: params
    };
    return Fetch.post(data);
}

/**
 * tmk导出市场明细
 * @param params
 * @returns {Promise<any>}
 */
export const exportMarket = (param: any) => {
    const params = {
        url: CustomerApi.云语音导出市场明细,
        data: param
    }
    Fetch.postBinary(params);
}
