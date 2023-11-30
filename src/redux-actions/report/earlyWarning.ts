/**
 * desc: 预警信息事件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/10
 * Time: 下午2:15
 */
import {Fetch} from "@/service/fetch";
import {reportApi} from "@/api/reportApi";

/**
 * 预警日志列表
 * @param params
 * @returns {Promise<any>}
 */
export const queryEarlyWarningList = (params) => {
    const param = {
        url: reportApi.预警日志列表,
        data: params
    };
    return Fetch.post(param)
}
