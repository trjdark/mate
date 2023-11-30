/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/2/26
 * Time: 上午9:42
 */
/*获取业绩目标列表*/
import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

/**
 * 获取中心业绩预定量列表
 * @param data
 * @returns {Promise<any>}
 */
export const getCenterPerformanceList = data=>{
    const params = {
        url: SetApi.预定量列表,
        data,
    };
    return Fetch.post(params);
};

/*新增业绩目标*/
export const addCenterPerformance = data=>{
    const params = {
        url: SetApi.预定量新增接口,
        data,
    };
    return Fetch.post(params);
};

/*更新增业绩目标*/
export const editCenterPerformance = data=>{
    const params = {
        url: SetApi.预定量编辑接口,
        data,
    };
    return Fetch.post(params);
};

/*更新增业绩目标*/
export const getCenterPerformanceDetail = data=>{
    const params = {
        url: SetApi.预定量详情,
        data,
    };
    return Fetch.post(params);
};
