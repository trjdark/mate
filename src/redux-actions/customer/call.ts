/**
 * desc: 云语音
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/18
 * Time: 下午2:35
 */


import {CustomerApi} from "@/api/customerApi";
import {Fetch} from "@/service/fetch";

/**
 * 云语音
 * @param {any} params
 * @returns {any}
 */
export const getCenterCallRecordsCounts = (params) => {
    const data = {
        url: CustomerApi.获取中心通话记录,
        data: params
    };
    return Fetch.post(data);
};
