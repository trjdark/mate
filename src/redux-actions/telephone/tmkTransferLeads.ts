/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/13
 * Time: 下午1:55
 */
import {Fetch} from "../../service/fetch";
import {CustomerApi} from "@/api/customerApi";

/**
 * tmk转中心leads
 * @param params
 * @returns {Promise<any>}
 */
export const getTmkTransferLeadsList = (params):Promise<any> => {
    const data = {
        url: CustomerApi.tmk转中心leads,
        data: params
    };
    return Fetch.post(data);
}

/**
 * 获取手机号码
 * @param params
 * @returns {Promise<any>}
 */
export const getPhone = (params):Promise<any> => {
    const data = {
        url: CustomerApi.获取手机号码,
        data: params,
        slience: true
    };
    return Fetch.post(data);
}
